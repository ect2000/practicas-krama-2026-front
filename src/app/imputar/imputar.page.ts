import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { Router, ActivatedRoute } from '@angular/router'; 

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

  nuevaImputacion: Imputacion = {
    proyecto: { id: 0 },
    usuario: { id: 0 }, 
    fecha: new Date().toISOString().split('T')[0], 
    horas: 0,
    anotaciones: ''
  };

  esEdicion: boolean = false; 

  constructor(
    private imputacionService: ImputacionService,
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.comprobarSiEsEdicion();
  }

  cargarUsuarioLogueado() {
    const usuarioObjetoGuardado = localStorage.getItem('usuarioLogueado');
    
    if (usuarioObjetoGuardado) {
      const usuarioParseado = JSON.parse(usuarioObjetoGuardado);
      this.nuevaImputacion.usuario.id = usuarioParseado.id;
      console.log('¡Usuario detectado correctamente! ID:', this.nuevaImputacion.usuario.id);
    } else {
      console.warn('No se ha encontrado la sesión. Debes iniciar sesión primero.');
    }
  }

  comprobarSiEsEdicion() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.nuevaImputacion.id = Number(idParam);
      console.log('Modo EDICIÓN activado para la imputación ID:', this.nuevaImputacion.id);
    } else {
      console.log('Modo CREACIÓN activado');
    }
  }

  guardarImputacion() {
    if (this.nuevaImputacion.usuario.id === 0) {
      alert('Error: No se ha detectado tu sesión de usuario. Vuelve a iniciar sesión.');
      return;
    }

    if (this.nuevaImputacion.horas <= 0) {
      alert('Por favor, introduce un número de horas válido.');
      return;
    }

    if (this.esEdicion && this.nuevaImputacion.id) {
      this.imputacionService.actualizarImputacion(this.nuevaImputacion.id, this.nuevaImputacion).subscribe({
        next: (respuesta) => {
          console.log('Actualizado:', respuesta);
          alert('¡Horas actualizadas con éxito!');
          this.router.navigate(['/inicio']); 
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert('Hubo un error al intentar actualizar la imputación.');
        }
      });
    } else {
      this.imputacionService.crearImputacion(this.nuevaImputacion).subscribe({
        next: (respuesta) => {
          console.log('Guardado exitoso:', respuesta);
          alert('¡Horas registradas con éxito!');
          this.router.navigate(['/inicio']); 
        },
        error: (error) => {
          console.error('Error:', error);
          if (error.error && typeof error.error === 'string') {
            alert(error.error);
          } else {
            alert('Hubo un error al intentar guardar la imputación.');
          }
        }
      });
    }
  }
}