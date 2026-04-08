import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { ProyectoService } from '../services/proyecto.service'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule] 
})
export class InicioPage implements OnInit {

  proyectos: any[] = [];
  vistaActual: string = 'dia'; 
  fechaActual: string = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short' 
  }); 

  constructor(private proyectoService: ProyectoService) { }

  ngOnInit() {
    this.cargarProyectos();
  }

  ionViewWillEnter() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
      }
    });
  }
}