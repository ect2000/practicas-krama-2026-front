import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartOptions, Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import { ImputacionService } from '../services/imputacion.service';

Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BaseChartDirective] 
})
export class InformesPage implements OnInit {

  private imputacionService = inject(ImputacionService);

  // --- GRÁFICO 1: HORAS POR PROYECTO (Pie Chart) ---
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };
  public pieChartLabels: string[] = [];
  public pieChartDatasets = [{
    data: [] as number[],
    backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'], 
  }];

  // --- GRÁFICO 2: HORAS POR CLIENTE (Bar Chart) ---
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Permite que se adapte a la altura de la tarjeta
    plugins: {
      legend: { display: false } // Quitamos la leyenda porque los nombres ya salen abajo
    }
  };
  public barChartLabels: string[] = [];
  public barChartDatasets = [{
    label: 'Horas Totales',
    data: [] as number[],
    backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'], // Colores sólidos
    borderRadius: 8 // Bordes redondeados de las barras
  }];

  public imputacionesGuardadas: any[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarDatosReales();
  }

  cargarDatosReales() {
    this.imputacionService.obtenerTodas().subscribe({
      next: (imputaciones) => {
        
        this.imputacionesGuardadas = imputaciones;

        // Dos "calculadoras" independientes
        const horasPorProyecto: { [key: string]: number } = {};
        const horasPorCliente: { [key: string]: number } = {};

        imputaciones.forEach(imp => {
          const horas = imp.horas || 0;
          
          // 1. Agrupar por Proyecto
          const nombreProyecto = imp.proyecto && imp.proyecto.nombre ? imp.proyecto.nombre : 'Sin Proyecto';
          horasPorProyecto[nombreProyecto] = (horasPorProyecto[nombreProyecto] || 0) + horas;

          // 2. Agrupar por Cliente (viajamos a través del proyecto)
          const nombreCliente = imp.proyecto && imp.proyecto.cliente && imp.proyecto.cliente.nombre ? imp.proyecto.cliente.nombre : 'Sin Cliente';
          horasPorCliente[nombreCliente] = (horasPorCliente[nombreCliente] || 0) + horas;
        });

        // Inyectar datos al Gráfico 1 (Proyectos)
        this.pieChartLabels = Object.keys(horasPorProyecto);
        this.pieChartDatasets = [{
          ...this.pieChartDatasets[0],
          data: Object.values(horasPorProyecto)
        }];

        // Inyectar datos al Gráfico 2 (Clientes)
        this.barChartLabels = Object.keys(horasPorCliente);
        this.barChartDatasets = [{
          ...this.barChartDatasets[0],
          data: Object.values(horasPorCliente)
        }];

      },
      error: (err) => { console.error("Error al obtener las imputaciones:", err); }
    });
  }

  descargarExcel() {
    if (this.imputacionesGuardadas.length === 0) {
      alert('No hay datos para descargar');
      return;
    }

    const datosParaExcel = this.imputacionesGuardadas.map(imp => ({
      'Fecha': imp.fecha || 'Sin fecha',
      'Usuario': imp.usuario ? imp.usuario.nombre : 'Desconocido',
      'Cliente': imp.proyecto && imp.proyecto.cliente ? imp.proyecto.cliente.nombre : 'Sin Cliente', // Añadimos Cliente al Excel
      'Proyecto': imp.proyecto ? imp.proyecto.nombre : 'Sin proyecto',
      'Horas Dedicadas': imp.horas || 0,
      'Comentarios': imp.anotaciones || 'Sin comentarios'
    }));

    const hojaDeCalculo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const libroDeTrabajo: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeCalculo, 'Reporte de Horas');
    XLSX.writeFile(libroDeTrabajo, 'Informes_Krama.xlsx');
  }
}