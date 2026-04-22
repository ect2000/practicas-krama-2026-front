import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { ProyectoService } from '../services/proyecto.service'; 
import { ImputacionService } from '../services/imputacion.service';
import { Imputacion } from '../models/imputacion.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule] 
})
export class InicioPage implements OnInit {

  // Variables de la vista y fechas
  vistaActual: string = 'dia'; 
  fechaBase: Date = new Date(); 
  textoFecha: string = '';

  // Datos
  usuarioLogueado: any = null;
  todasImputaciones: Imputacion[] = [];
  imputacionesFiltradas: Imputacion[] = [];
  totalHoras: number = 0;

  // NUEVAS VARIABLES PARA EL MODAL Y BÚSQUEDA
  isModalOpen: boolean = false;
  proyectos: any[] = [];
  proyectosFiltrados: any[] = [];
  textoBusqueda: string = '';
  
  nuevaImputacion: Imputacion = {
    proyecto: { id: 0 }, 
    usuario: { id: 0 }, 
    fecha: new Date().toISOString().split('T')[0], 
    horas: null as any, 
    anotaciones: ''
  };

  constructor(
    private proyectoService: ProyectoService,
    private imputacionService: ImputacionService,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit() {
    this.actualizarTextoFecha(); 
    this.cargarUsuarioYDatos();
  }

  ionViewWillEnter() {
    this.actualizarTextoFecha(); 
    this.cargarUsuarioYDatos();
  }

  cargarUsuarioYDatos() {
    const userStr = localStorage.getItem('usuarioLogueado');
    if (userStr) {
      this.usuarioLogueado = JSON.parse(userStr);
      this.nuevaImputacion.usuario.id = this.usuarioLogueado.id;
      this.cargarImputaciones();
    }
  }

  cargarImputaciones() {
    if (!this.usuarioLogueado || !this.usuarioLogueado.id) return;
    
    this.imputacionService.getImputacionesByUsuario(this.usuarioLogueado.id).subscribe({
      next: (data) => {
        this.todasImputaciones = data;
        this.actualizarVista();
      },
      error: (error) => {
        console.error('Error al cargar imputaciones:', error);
      }
    });
  }

  // --- LÓGICA DE NAVEGACIÓN Y VISTAS ---

  cambiarVista() {
    this.actualizarVista();
  }

  navegar(direccion: 'anterior' | 'siguiente') {
    console.log('>>> Clic detectado. Navegando hacia:', direccion);
    
    const factor = direccion === 'anterior' ? -1 : 1;
    const nuevaFecha = new Date(this.fechaBase);

    if (this.vistaActual === 'dia') {
      nuevaFecha.setDate(nuevaFecha.getDate() + factor);
    } else if (this.vistaActual === 'semana') {
      nuevaFecha.setDate(nuevaFecha.getDate() + (7 * factor));
    } else if (this.vistaActual === 'mes') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + factor);
    }
    
    this.fechaBase = nuevaFecha; 
    this.actualizarVista();

    console.log('>>> Nueva fecha calculada:', this.textoFecha);
  }

  actualizarVista() {
    this.filtrarYCalcular();
    this.actualizarTextoFecha();
    this.cdr.detectChanges(); 
  }

  filtrarYCalcular() {
    // 1. Filtrar imputaciones
    this.imputacionesFiltradas = this.todasImputaciones.filter(imp => {
      // Normalizamos la fecha de la imputación (quitamos horas/minutos)
      const fechaImp = this.parsearFecha(imp.fecha);
      
      if (this.vistaActual === 'dia') {
        return this.esMismoDia(fechaImp, this.fechaBase);
      } else if (this.vistaActual === 'semana') {
        return this.esMismaSemana(fechaImp, this.fechaBase);
      } else if (this.vistaActual === 'mes') {
        return this.esMismoMes(fechaImp, this.fechaBase);
      }
      return false;
    });

    // 2. Cálculo matemático exacto
    this.totalHoras = this.imputacionesFiltradas.reduce((sum, imp) => {
      const h = Number(imp.horas);
      return sum + (isNaN(h) ? 0 : h);
    }, 0);
  }

  actualizarTextoFecha() {
    const opciones: any = { weekday: 'long', day: 'numeric', month: 'short' };
    
    if (this.vistaActual === 'dia') {
      this.textoFecha = this.fechaBase.toLocaleDateString('es-ES', opciones);
    } else if (this.vistaActual === 'semana') {
      const inicio = this.getInicioSemana(this.fechaBase);
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + 6);
      this.textoFecha = `${inicio.getDate()} ${inicio.toLocaleDateString('es-ES',{month:'short'})} - ${fin.getDate()} ${fin.toLocaleDateString('es-ES',{month:'short'})}`;
    } else if (this.vistaActual === 'mes') {
      this.textoFecha = this.fechaBase.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
  }

  // --- NUEVA LÓGICA PARA EL MODAL Y VINCULACIÓN ---

  cargarProyectos() {
    this.proyectoService.obtenerProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.proyectosFiltrados = data;
      },
      error: (error) => console.error('Error al cargar proyectos:', error)
    });
  }

  buscarProyecto(event: any) {
    // 1. Obtenemos el texto, lo pasamos a minúsculas y quitamos espacios al principio/final
    const query = (event.detail.value || '').trim().toLowerCase();

    // 2. Si el buscador está vacío, mostramos todos los proyectos
    if (!query) {
      this.proyectosFiltrados = [...this.proyectos];
      return;
    }

    // 3. Filtramos previniendo errores si algún proyecto tiene el nombre o el ID nulo
    this.proyectosFiltrados = this.proyectos.filter(p => {
      const nombre = p.nombre ? p.nombre.toLowerCase() : '';
      const id = p.id ? p.id.toString() : '';
      
      return nombre.includes(query) || id.includes(query);
    });
  }

  abrirModal() {
    // Ajustar la fecha a la vista actual
    // Extraemos la parte de la fecha (YYYY-MM-DD) corrigiendo posibles temas de zona horaria
    const offset = this.fechaBase.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(this.fechaBase.getTime() - offset)).toISOString().split('T')[0];
    
    this.nuevaImputacion.fecha = localISOTime;
    this.isModalOpen = true;
    
    if (this.proyectos.length === 0) {
      this.cargarProyectos();
    }
  }

  cerrarModal() {
    this.isModalOpen = false;
    
    // Resetear formulario
    this.nuevaImputacion.horas = null as any;
    this.nuevaImputacion.anotaciones = '';
    this.nuevaImputacion.proyecto.id = 0;
    
    // AÑADIDO: Resetear el buscador para la próxima vez que se abra
    this.textoBusqueda = ''; 
    this.proyectosFiltrados = [...this.proyectos]; 
  }

  guardarImputacion() {
    if (!this.nuevaImputacion.proyecto.id || this.nuevaImputacion.proyecto.id === 0) {
      alert('Por favor, selecciona un proyecto.');
      return;
    }
    
    if (this.nuevaImputacion.horas === null || this.nuevaImputacion.horas <= 0) {
      alert('Por favor, introduce una cantidad válida de horas dedicadas.');
      return;
    }

    this.imputacionService.crearImputacion(this.nuevaImputacion).subscribe({
      next: () => {
        alert('¡Horas registradas con éxito!');
        this.cerrarModal();
        this.cargarImputaciones(); // Refrescar la tabla al instante
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
            alert(err.error);
        } else {
            alert('Hubo un error al crear la imputación.');
        }
      }
    });
  }

  // --- UTILIDADES PARA EVITAR ERRORES DE ZONA HORARIA ---

  private parsearFecha(fechaInput: any): Date {
    if (typeof fechaInput === 'string' && fechaInput.includes('-')) {
      const parts = fechaInput.split('T')[0].split('-').map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(fechaInput);
  }

  private esMismoDia(d1: Date, d2: Date) {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  }

  private esMismoMes(d1: Date, d2: Date) {
    return d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  }

  private esMismaSemana(d1: Date, d2: Date) {
    const inicio = this.getInicioSemana(d2);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6);
    fin.setHours(23, 59, 59, 999);
    return d1 >= inicio && d1 <= fin;
  }

  private getInicioSemana(fecha: Date) {
    const d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como inicio
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}