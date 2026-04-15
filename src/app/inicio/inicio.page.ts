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
    
    // Clonamos la fecha para no mutar directamente la referencia original antes de tiempo
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
  }

  actualizarVista() {
    this.filtrarYCalcular();
    this.actualizarTextoFecha();
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
    this.totalHorasPeriodo = this.imputacionesFiltradas.reduce((sum, imp) => {
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

  // --- UTILIDADES PARA EVITAR ERRORES DE ZONA HORARIA ---

  private parsearFecha(fechaInput: any): Date {
    // Si es un string "YYYY-MM-DD", crearlo como fecha local para evitar desfase de 1 día
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