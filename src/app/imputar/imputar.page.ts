import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { ImputacionService } from '../services/imputacion.service';
import { ProyectoService } from '../services/proyecto.service'; 
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
    // Inicializamos en null para que Ionic muestre el placeholder correctamente
    proyecto: { id: null as any }, 
    usuario: { id: 0 }, 
    fecha: new Date().toISOString().split('T')[0], 
    // También ponemos horas en null para que el campo empiece limpio
    horas: null as any, 
    anotaciones: ''
  };

  esEdicion: boolean = false; 
  proyectos: any[] = []; 

  constructor(
    private imputacionService: ImputacionService,
    private proyectoService: ProyectoService, 
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.comprobarSiEsEdicion();
    this.cargarProyectos(); 
    this.comprobarProyectoPreseleccionado(); 
  }

  cargarProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
      },
      error: (error) => console.error('Error al cargar proyectos para el desplegable:', error)
    });
  }

  comprobarProyectoPreseleccionado() {
    this.route.queryParams.subscribe(params => {
      if (params['proyectoId']) {
        this.nuevaImputacion.proyecto.id = Number(params['proyectoId']);
      }
    });
  }

  cargarUsuarioLogueado() {
    const usuarioObjetoGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioObjetoGuardado) {
      const usuarioParseado = JSON.parse(usuarioObjetoGuardado);
      this.nuevaImputacion.usuario.id = usuarioParseado.id;
    }
  }

  comprobarSiEsEdicion() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.nuevaImputacion.id = Number(idParam);
    }
  }

  guardarImputacion() {
    if (this.nuevaImputacion.usuario.id === 0) {
      alert('Error: No se ha detectado tu sesión de usuario.');
      return;
    }

    if (!this.nuevaImputacion.proyecto.id) {
      alert('Por favor, selecciona un proyecto de la lista.');
      return;
    }

    if (this.nuevaImputacion.horas === null || this.nuevaImputacion.horas < 0) {
      alert('No puedes imputar una cantidad negativa de horas.');
      return;
    }

    if (this.nuevaImputacion.horas === 0) {
      alert('Por favor, introduce el número de horas dedicadas.');
      return;
    }

    if (this.esEdicion && this.nuevaImputacion.id) {
      this.imputacionService.actualizarImputacion(this.nuevaImputacion.id, this.nuevaImputacion).subscribe({
        next: () => {
          alert('¡Horas actualizadas con éxito!');
          this.router.navigate(['/inicio']); 
        },
        error: () => alert('Hubo un error al actualizar.')
      });
    } else {
      this.imputacionService.crearImputacion(this.nuevaImputacion).subscribe({
        next: () => {
          alert('¡Horas registradas con éxito!');
          this.router.navigate(['/inicio']); 
        },
        error: (error) => {
          if (error.error && typeof error.error === 'string') {
            alert(error.error);
          } else {
            alert('Hubo un error al crear la imputación.');
          }
        }
      });
    }
  }

  compararProyectos(o1: any, o2: any) {
    return o1 == o2; // Usamos == en lugar de === para que ignore si es string o number
  }
}