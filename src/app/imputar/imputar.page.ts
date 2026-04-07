import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { Router } from '@angular/router'; // ¡NUEVO! Importamos el Router

import { ImputacionService } from '../services/imputacion.service';
import { Imputacion } from '../models/imputacion.model';

@Component({
  selector: 'app-imputar',
  templateUrl: './imputar.page.html',
  styleUrls: ['./imputar.page.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class ImputarPage implements OnInit {

  // Inicializamos la variable (ahora el usuario.id puede empezar en 0 o nulo)
  nuevaImputacion: Imputacion = {
    proyecto: { id: 0 },
    usuario: { id: 0 },  // Lo cambiamos de 1 a 0 temporalmente
    fecha: new Date().toISOString().split('T')[0], 
    horas: 0,
    anotaciones: ''
  };

  constructor(
    private imputacionService: ImputacionService,
    private router: Router
  ) { }

  // Esta función se ejecuta automáticamente en cuanto se abre la pantalla
  ngOnInit() {
    this.cargarUsuarioLogueado();
  }

  cargarUsuarioLogueado() {
    // Buscamos exactamente el nombre que usaste en tu login.page.ts
    const usuarioObjetoGuardado = localStorage.getItem('usuarioLogueado');
    
    if (usuarioObjetoGuardado) {
      // Como lo guardamos con JSON.stringify, tenemos que "desempaquetarlo" con JSON.parse
      const usuarioParseado = JSON.parse(usuarioObjetoGuardado);
      
      // Asignamos el ID a nuestra nueva imputación
      this.nuevaImputacion.usuario.id = usuarioParseado.id;
      
      console.log('¡Usuario detectado correctamente! ID:', this.nuevaImputacion.usuario.id);
    } else {
      console.warn('No se ha encontrado la sesión. Debes iniciar sesión primero.');
    }
  }

  guardarImputacion() {
    // Añadimos una validación de seguridad extra antes de enviar al Backend
    if (this.nuevaImputacion.usuario.id === 0) {
      alert('Error: No se ha detectado tu sesión de usuario. Vuelve a iniciar sesión.');
      return;
    }

    if (this.nuevaImputacion.horas <= 0) {
      alert('Por favor, introduce un número de horas válido.');
      return;
    }

    this.imputacionService.crearImputacion(this.nuevaImputacion).subscribe({
      next: (respuesta) => {
        console.log('¡Guardado exitoso en la base de datos!', respuesta);
        alert('¡Horas registradas con éxito!');
        
        // ¡NUEVO! Redirigimos al usuario a la página de inicio
        this.router.navigate(['/inicio']); 
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
        if (error.error && typeof error.error === 'string') {
          alert(error.error);
        } else {
          alert('Hubo un error al intentar guardar la imputación.');
        }
      }
    });
  }
}