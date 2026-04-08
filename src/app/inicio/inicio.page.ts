import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, addOutline, saveOutline, calendarClearOutline, folderOpenOutline } from 'ionicons/icons';

// Importamos el servicio
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class InicioPage implements OnInit {

  vistaActual: string = 'dia'; 
  fechaActual: string = 'Jueves, 19 Mar 2026'; 

  proyectosVinculados: any[] = [];

  // Inyectamos el servicio en el constructor
  constructor(private usuarioService: UsuarioService) { 
    addIcons({ chevronBackOutline, chevronForwardOutline, addOutline, saveOutline, calendarClearOutline, folderOpenOutline });
  }

  ngOnInit() {
    this.cargarMisProyectos(); // Llamamos a la función al iniciar la página
  }

  cargarMisProyectos() {
    // CORRECCIÓN: Buscamos la clave exacta que guardaste en el login: 'usuarioLogueado'
    const usuarioString = localStorage.getItem('usuarioLogueado'); 
    
    if (usuarioString) {
      const usuarioLogueado = JSON.parse(usuarioString);

      // 2. Le pedimos a la Base de Datos toda la info de este usuario (incluidos sus proyectos)
      this.usuarioService.obtenerUsuarioPorId(usuarioLogueado.id).subscribe({
        next: (usuarioActualizado) => {
          console.log('Datos traídos de la BD:', usuarioActualizado);
          
          // 3. Asignamos los proyectos. Si no tiene, dejamos un arreglo vacío []
          this.proyectosVinculados = usuarioActualizado.proyectos || [];
        },
        error: (err) => {
          console.error("Error al cargar los proyectos desde el backend", err);
        }
      });
    } else {
      console.warn("No hay usuario logueado en localStorage");
    }
  }
}