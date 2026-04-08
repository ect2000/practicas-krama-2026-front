import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartOptions, Chart, registerables } from 'chart.js';

// 1. Importamos el servicio
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

  // 2. Inyectamos el servicio
  private imputacionService = inject(ImputacionService);

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  
  // 3. Dejamos las etiquetas y los datos vacíos por defecto
  public pieChartLabels: string[] = [];
  public pieChartDatasets = [{
    data: [] as number[],
    // Usamos varios colores de base
    backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'], 
  }];

  constructor() { }

  ngOnInit() {
    // 4. Cargamos los datos reales al entrar a la página
    this.cargarDatosReales();
  }

  cargarDatosReales() {
    this.imputacionService.obtenerTodas().subscribe({
      next: (imputaciones) => {
        // Objeto para sumar horas. Ejemplo final: { "Krama App": 10, "Mercadona": 5 }
        const horasAgrupadas: { [nombreProyecto: string]: number } = {};

        // 5. Recorremos todas las imputaciones devueltas por tu backend
        imputaciones.forEach(imp => {
          // Buscamos el nombre del proyecto (si no existe, lo llamamos 'Sin Proyecto')
          const nombreProyecto = imp.proyecto && imp.proyecto.nombre ? imp.proyecto.nombre : 'Sin Proyecto';
          const horas = imp.horas || 0;
          
          // Sumamos las horas al proyecto correspondiente
          if (horasAgrupadas[nombreProyecto]) {
            horasAgrupadas[nombreProyecto] += horas;
          } else {
            horasAgrupadas[nombreProyecto] = horas;
          }
        });

        // 6. Actualizamos las variables del gráfico con los resultados calculados
        this.pieChartLabels = Object.keys(horasAgrupadas); // Los nombres
        this.pieChartDatasets = [{
          ...this.pieChartDatasets[0],
          data: Object.values(horasAgrupadas) // Los números
        }];

        console.log("Datos del gráfico procesados:", horasAgrupadas);
      },
      error: (err) => {
        console.error("Error al obtener las imputaciones:", err);
      }
    });
  }
}