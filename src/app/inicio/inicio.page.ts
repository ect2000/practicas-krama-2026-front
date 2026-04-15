import { Component, OnInit } from '@angular/core';
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
  totalHorasPeriodo: number = 0;

  constructor(
    private proyectoService: ProyectoService,
    private imputacionService: ImputacionService
  ) { }

  ngOnInit() {
    this.cargarUsuarioYDatos();
  }

  ionViewWillEnter() {
    this.cargarUsuarioYDatos();
  }

  cargarUsuarioYDatos() {
    const userStr = localStorage.getItem('usuarioLogueado');
    if (userStr) {
      this.usuarioLogueado = JSON.parse(userStr);
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
    const factor = direccion === 'anterior' ? -1 : 1;
    
    if (this.vistaActual === 'dia') {
      this.fechaBase.setDate(this.fechaBase.getDate() + factor);
    } else if (this.vistaActual === 'semana') {
      this.fechaBase.setDate(this.fechaBase.getDate() + (7 * factor));
    } else if (this.vistaActual === 'mes') {
      this.fechaBase.setMonth(this.fechaBase.getMonth() + factor);
    }
    
    // Forzamos la actualización de la referencia de la fecha
    this.fechaBase = new Date(this.fechaBase); 
    this.actualizarVista();
  }

  actualizarVista() {
    this.filtrarYCalcular();
    this.actualizarTextoFecha();
  }

  filtrarYCalcular() {
    // 1. Filtramos las horas que pertenecen al periodo visualizado
    this.imputacionesFiltradas = this.todasImputaciones.filter(imp => {
      const fechaImp = new Date(imp.fecha);
      if (this.vistaActual === 'dia') return this.esMismoDia(fechaImp, this.fechaBase);
      if (this.vistaActual === 'semana') return this.esMismaSemana(fechaImp, this.fechaBase);
      if (this.vistaActual === 'mes') return this.esMismoMes(fechaImp, this.fechaBase);
      return false;
    });

    // 2. Calculamos el total de horas asegurándonos de que se sumen como números
    this.totalHorasPeriodo = this.imputacionesFiltradas.reduce((sum, imp) => sum + (Number(imp.horas) || 0), 0);
  }

  actualizarTextoFecha() {
    if (this.vistaActual === 'dia') {
      this.textoFecha = this.fechaBase.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
    } else if (this.vistaActual === 'semana') {
      const inicio = this.getInicioSemana(this.fechaBase);
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + 6);
      this.textoFecha = `${inicio.getDate()} ${inicio.toLocaleDateString('es-ES',{month:'short'})} - ${fin.getDate()} ${fin.toLocaleDateString('es-ES',{month:'short'})}`;
    } else if (this.vistaActual === 'mes') {
      this.textoFecha = this.fechaBase.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
  }

  // --- MÉTODOS DE CÁLCULO DE FECHAS ---

  private esMismoDia(d1: Date, d2: Date) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  }

  private esMismoMes(d1: Date, d2: Date) {
    return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  }

  private esMismaSemana(d1: Date, d2: Date) {
    const inicio = this.getInicioSemana(d2);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6);
    fin.setHours(23, 59, 59, 999);
    return d1 >= inicio && d1 <= fin;
  }

  private getInicioSemana(fecha: Date) {
    const d = new Date(fecha);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}