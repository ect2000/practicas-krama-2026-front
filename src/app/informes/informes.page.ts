import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// 1. Nuevas importaciones para las versiones más recientes
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartOptions, Chart, registerables } from 'chart.js';

// 2. Le decimos a Chart.js que active todas sus herramientas visuales
Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
  standalone: true,
  // 3. Usamos BaseChartDirective en los imports en lugar del módulo antiguo
  imports: [IonicModule, CommonModule, FormsModule, BaseChartDirective] 
})
export class InformesPage implements OnInit {

  // --- CONFIGURACIÓN DEL GRÁFICO CIRCULAR ---
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', 
      }
    }
  };
  
  // Nombres de los proyectos (Eje X)
  public pieChartLabels = ['Krama App', 'Web Mercadona', 'App Nike', 'Consultoría Accenture'];
  
  // Datos de horas y colores
  public pieChartDatasets = [{
    data: [120, 45, 80, 200], 
    backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'], 
  }];

  constructor() { }

  ngOnInit() {
  }

}