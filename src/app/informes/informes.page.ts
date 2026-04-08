import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartOptions, Chart, registerables } from 'chart.js';
import { ImputacionService } from '../services/imputacion.service';

// 1. IMPORTAMOS LA LIBRERÍA DE EXCEL
import * as XLSX from 'xlsx';

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

  public pieChartOptions: ChartOptions<'pie'> = { /* ... tu config actual ... */ };
  public pieChartLabels: string[] = [];
  public pieChartDatasets = [{
    data: [] as number[],
    backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'], 
  }];

  // 2. VARIABLE PARA GUARDAR LOS DATOS "EN BRUTO"
  public imputacionesGuardadas: any[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarDatosReales();
  }

  cargarDatosReales() {
    this.imputacionService.obtenerTodas().subscribe({
      next: (imputaciones) => {
        
        // GUARDAMOS LOS DATOS ORIGINALES PARA EL EXCEL
        this.imputacionesGuardadas = imputaciones;

        const horasAgrupadas: { [nombreProyecto: string]: number } = {};

        imputaciones.forEach(imp => {
          const nombreProyecto = imp.proyecto && imp.proyecto.nombre ? imp.proyecto.nombre : 'Sin Proyecto';
          const horas = imp.horas || 0;
          
          if (horasAgrupadas[nombreProyecto]) {
            horasAgrupadas[nombreProyecto] += horas;
          } else {
            horasAgrupadas[nombreProyecto] = horas;
          }
        });

        this.pieChartLabels = Object.keys(horasAgrupadas);
        this.pieChartDatasets = [{
          ...this.pieChartDatasets[0],
          data: Object.values(horasAgrupadas)
        }];
      },
      error: (err) => { console.error("Error al obtener las imputaciones:", err); }
    });
  }

  // 3. LA FUNCIÓN MÁGICA QUE CREA EL EXCEL
  descargarExcel() {
    if (this.imputacionesGuardadas.length === 0) {
      alert('No hay datos para descargar');
      return;
    }

    // A. "Limpiamos" los datos para que queden bonitos en las columnas de Excel
    const datosParaExcel = this.imputacionesGuardadas.map(imp => ({
      'Fecha': imp.fecha || 'Sin fecha',
      'Usuario': imp.usuario ? imp.usuario.nombre : 'Desconocido',
      'Proyecto': imp.proyecto ? imp.proyecto.nombre : 'Sin proyecto',
      'Horas Dedicadas': imp.horas || 0,
      'Comentarios / Tareas': imp.anotaciones || 'Sin comentarios'
    }));

    // B. Creamos la hoja de cálculo y el libro
    const hojaDeCalculo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const libroDeTrabajo: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeCalculo, 'Reporte de Horas');

    // C. Forzamos la descarga del archivo en el navegador
    XLSX.writeFile(libroDeTrabajo, 'Informes_Krama.xlsx');
  }
}