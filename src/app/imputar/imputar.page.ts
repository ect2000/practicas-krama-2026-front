import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { ImputacionService } from '../services/imputacion.service';
import { ProyectoService } from '../services/proyecto.service'; // ¡NUEVO! Importamos el servicio de proyectos
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
  proyectos: any[] = []; // ¡NUEVO! Aquí guardaremos los proyectos para el desplegable

  constructor(
    private imputacionService: ImputacionService,
    private proyectoService: ProyectoService, // ¡NUEVO! Inyectamos el servicio
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.comprobarSiEsEdicion();
    this.cargarProyectos(); // Cargamos la lista al abrir la página
    this.comprobarProyectoPreseleccionado(); // Miramos si venimos desde la pantalla de Inicio
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
        // Si en la URL viene el ID, lo seleccionamos automáticamente en el desplegable
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

    if (!this.nuevaImputacion.proyecto.id || this.nuevaImputacion.proyecto.id === 0) {
      alert('Por favor, selecciona un proyecto de la lista.');
      return;
    }

    if (this.nuevaImputacion.horas <= 0) {
      alert('Por favor, introduce un número de horas válido.');
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
}