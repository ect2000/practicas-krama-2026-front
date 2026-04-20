import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts'; 
import { ChartOptions, Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import { ImputacionService } from '../services/imputacion.service';
import { UsuarioService } from '../services/usuario.service';
import { ProyectoService } from '../services/proyecto.service';
import { ClienteService } from '../services/cliente.service';

Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BaseChartDirective] 
})
export class InformesPage implements OnInit {

  private imputacionService = inject(ImputacionService);
  private usuarioService = inject(UsuarioService);
  private proyectoService = inject(ProyectoService);
  private clienteService = inject(ClienteService);

  // --- NUEVAS VARIABLES PARA EL INFORME 1 ---
  usuariosParaFiltro: any[] = [];
  proyectosParaFiltro: any[] = [];
  usuariosSeleccionados: number[] = [];
  proyectosSeleccionados: number[] = [];

  // --- VARIABLES PARA INFORME 2 ---
  usuarioSeleccionadoInf2: number | null = null;
  mesSeleccionadoInf2: string = '';

  // --- VARIABLES PARA INFORME 3 ---
  clientesParaFiltro: any[] = [];
  clienteSeleccionadoInf3: number | null = null;

  // --- GRÁFICO 1: HORAS POR PROYECTO (Pie Chart) ---
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };
  public pieChartLabels: string[] = [];
  public pieChartDatasets = [{
    data: [] as number[],
    backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'], 
  }];

  // --- GRÁFICO 2: HORAS POR CLIENTE (Bar Chart) ---
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Permite que se adapte a la altura de la tarjeta
    plugins: {
      legend: { display: false } // Quitamos la leyenda porque los nombres ya salen abajo
    }
  };
  public barChartLabels: string[] = [];
  public barChartDatasets = [{
    label: 'Horas Totales',
    data: [] as number[],
    backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'], // Colores sólidos
    borderRadius: 8 // Bordes redondeados de las barras
  }];

  public imputacionesGuardadas: any[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarDatosReales();
    this.cargarFiltros(); // Llamamos a cargar las listas para los desplegables
  }

  // ---> NUEVOS MÉTODOS PARA EL INFORME 1 <---

  cargarFiltros() {
    this.usuarioService.obtenerUsuarios().subscribe({ next: (data) => this.usuariosParaFiltro = data });
    this.proyectoService.obtenerProyectos().subscribe({ next: (data) => this.proyectosParaFiltro = data });
    // ---> AÑADE ESTA LÍNEA <---
    this.clienteService.obtenerClientes().subscribe({ next: (data) => this.clientesParaFiltro = data });
  }

  generarInforme1() {
    if (this.usuariosSeleccionados.length === 0 || this.proyectosSeleccionados.length === 0) {
      alert('Por favor, selecciona al menos un usuario y un proyecto.');
      return;
    }

    this.imputacionService.obtenerInforme1(this.usuariosSeleccionados, this.proyectosSeleccionados)
      .subscribe({
        next: (datosDelServidor) => {
          this.descargarExcelInforme1(datosDelServidor);
        },
        error: (err) => {
          console.error("Error al obtener Informe 1:", err);
          alert('Hubo un error al generar el informe.');
        }
      });
  }

  descargarExcelInforme1(imputaciones: any[]) {
    if (imputaciones.length === 0) {
      alert('No hay imputaciones que coincidan con estos filtros.');
      return;
    }

    // Aquí hacemos la magia matemática para calcular costes y porcentajes
    const datosParaExcel = imputaciones.map(imp => {
      const horasPresupuestadas = imp.proyecto?.horasPresupuestadas || 0;
      const costeTotal = imp.proyecto?.costeTotal || 0;
      const horasTrabajadas = imp.horas || 0;

      let porcentajeConsumido = 0;
      let presupuestoGastado = 0;

      // Evitamos dividir por cero si un proyecto no tiene horas presupuestadas configuradas
      if (horasPresupuestadas > 0) {
        porcentajeConsumido = (horasTrabajadas / horasPresupuestadas) * 100;
        presupuestoGastado = (horasTrabajadas / horasPresupuestadas) * costeTotal;
      }

      return {
        'Fecha': imp.fecha || 'Sin fecha',
        'Cliente': imp.proyecto?.cliente?.nombre || 'Sin cliente',
        'Proyecto': imp.proyecto?.nombre || 'Sin proyecto',
        'Usuario': imp.usuario?.nombre || 'Desconocido',
        'Horas Imputadas': horasTrabajadas,
        'Horas Totales Proyecto': horasPresupuestadas,
        '% Consumido sobre total': porcentajeConsumido.toFixed(2) + ' %',
        'Presupuesto Proporcional (€)': presupuestoGastado.toFixed(2),
        'Comentarios': imp.anotaciones || ''
      };
    });

    const hojaDeCalculo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const libroDeTrabajo: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeCalculo, 'Informe 1 Filtrado');
    XLSX.writeFile(libroDeTrabajo, 'Informe_Krama_Avanzado.xlsx');
  }

  // ---> MÉTODOS PARA EL INFORME 2 <---
  generarInforme2() {
    if (!this.usuarioSeleccionadoInf2 || !this.mesSeleccionadoInf2) {
      alert('Por favor, selecciona un usuario y un mes para el Informe 2.');
      return;
    }

    // El input 'month' devuelve formato "YYYY-MM" (ej. "2024-05")
    const [year, month] = this.mesSeleccionadoInf2.split('-');
    
    // Calculamos el primer y último día del mes para mandarlo al backend
    const fechaInicio = `${year}-${month}-01`;
    // Truco matemático en JS: Si pides el día 0 del mes siguiente, te da el último día del mes actual
    const ultimoDia = new Date(parseInt(year), parseInt(month), 0).getDate();
    const fechaFin = `${year}-${month}-${ultimoDia.toString().padStart(2, '0')}`;

    this.imputacionService.obtenerInforme2(this.usuarioSeleccionadoInf2, fechaInicio, fechaFin)
      .subscribe({
        next: (datos) => this.descargarExcelInforme2(datos),
        error: (err) => {
          console.error("Error al obtener Informe 2:", err);
          alert('Hubo un error al generar el informe mensual.');
        }
      });
  }

  descargarExcelInforme2(imputaciones: any[]) {
    if (imputaciones.length === 0) {
      alert('No hay imputaciones (ni de trabajo ni de baja) para este usuario en el mes seleccionado.');
      return;
    }

    const datosParaExcel = imputaciones.map(imp => {
      // Calculamos si es un proyecto normal o si es la "Baja" para destacarlo
      const nombreProyecto = imp.proyecto?.nombre || 'Sin proyecto';
      const esAbsentismo = nombreProyecto.toLowerCase().includes('baja') ? 'SÍ (Baja/Absentismo)' : 'NO';

      return {
        'Fecha': imp.fecha || 'Sin fecha',
        'Cliente': imp.proyecto?.cliente?.nombre || 'Sin cliente',
        'Proyecto': nombreProyecto,
        'Horas': imp.horas || 0,
        '¿Es Absentismo?': esAbsentismo,
        'Comentarios': imp.anotaciones || ''
      };
    });

    const hojaDeCalculo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const libroDeTrabajo: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeCalculo, 'Rendimiento Mensual');
    XLSX.writeFile(libroDeTrabajo, `Rendimiento_${this.mesSeleccionadoInf2}.xlsx`);
  }

  // ---> MÉTODOS PARA EL INFORME 3 <---
  generarInforme3() {
    if (!this.clienteSeleccionadoInf3) {
      alert('Por favor, selecciona un cliente para el Informe 3.');
      return;
    }

    this.imputacionService.obtenerInforme3(this.clienteSeleccionadoInf3)
      .subscribe({
        next: (datos) => this.descargarExcelInforme3(datos),
        error: (err) => {
          console.error("Error al obtener Informe 3:", err);
          alert('Hubo un error al generar el informe de rentabilidad.');
        }
      });
  }

  descargarExcelInforme3(imputaciones: any[]) {
    if (imputaciones.length === 0) {
      alert('No hay imputaciones registradas para los proyectos de este cliente.');
      return;
    }

    // Agrupamos las horas por proyecto para ver el total
    const resumenProyectos: { [key: number]: any } = {};

    imputaciones.forEach(imp => {
      const p = imp.proyecto;
      if (!p) return;

      if (!resumenProyectos[p.id]) {
        resumenProyectos[p.id] = {
          'Cliente': p.cliente?.nombre || 'Desconocido',
          'Proyecto': p.nombre,
          'Coste Total (€)': p.costeTotal || 0,
          'Horas Presupuestadas': p.horasPresupuestadas || 0,
          'Horas Trabajadas (Suma)': 0
        };
      }
      // Sumamos las horas de esta imputación al total del proyecto
      resumenProyectos[p.id]['Horas Trabajadas (Suma)'] += (imp.horas || 0);
    });

    // Convertimos el objeto agrupado en un Array y calculamos la rentabilidad
    const datosParaExcel = Object.values(resumenProyectos).map((proj: any) => {
      // Un proyecto es rentable si ha gastado menos horas de las presupuestadas
      const esRentable = proj['Horas Trabajadas (Suma)'] < proj['Horas Presupuestadas'];

      return {
        ...proj, // Copiamos los datos básicos
        'Estado (Rentabilidad)': esRentable ? '✅ RENTABLE' : '❌ NO RENTABLE (Excedido)'
      };
    });

    const hojaDeCalculo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const libroDeTrabajo: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeCalculo, 'Rentabilidad');
    XLSX.writeFile(libroDeTrabajo, 'Rentabilidad_Cliente.xlsx');
  }

  // ---> FIN DE NUEVOS MÉTODOS <---

  cargarDatosReales() {
    this.imputacionService.obtenerTodas().subscribe({
      next: (imputaciones) => {
        
        this.imputacionesGuardadas = imputaciones;

        // Dos "calculadoras" independientes
        const horasPorProyecto: { [key: string]: number } = {};
        const horasPorCliente: { [key: string]: number } = {};

        imputaciones.forEach(imp => {
          const horas = imp.horas || 0;
          
          // 1. Agrupar por Proyecto
          const nombreProyecto = imp.proyecto && imp.proyecto.nombre ? imp.proyecto.nombre : 'Sin Proyecto';
          horasPorProyecto[nombreProyecto] = (horasPorProyecto[nombreProyecto] || 0) + horas;

          // 2. Agrupar por Cliente (viajamos a través del proyecto)
          const nombreCliente = imp.proyecto && imp.proyecto.cliente && imp.proyecto.cliente.nombre ? imp.proyecto.cliente.nombre : 'Sin Cliente';
          horasPorCliente[nombreCliente] = (horasPorCliente[nombreCliente] || 0) + horas;
        });

        // Inyectar datos al Gráfico 1 (Proyectos)
        this.pieChartLabels = Object.keys(horasPorProyecto);
        this.pieChartDatasets = [{
          ...this.pieChartDatasets[0],
          data: Object.values(horasPorProyecto)
        }];

        // Inyectar datos al Gráfico 2 (Clientes)
        this.barChartLabels = Object.keys(horasPorCliente);
        this.barChartDatasets = [{
          ...this.barChartDatasets[0],
          data: Object.values(horasPorCliente)
        }];

      },
      error: (err) => { console.error("Error al obtener las imputaciones:", err); }
    });
  }

  descargarExcel() {
    if (this.imputacionesGuardadas.length === 0) {
      alert('No hay datos para descargar');
      return;
    }

    const datosParaExcel = this.imputacionesGuardadas.map(imp => ({
      'Fecha': imp.fecha || 'Sin fecha',
      'Usuario': imp.usuario ? imp.usuario.nombre : 'Desconocido',
      'Cliente': imp.proyecto && imp.proyecto.cliente ? imp.proyecto.cliente.nombre : 'Sin Cliente', // Añadimos Cliente al Excel
      'Proyecto': imp.proyecto ? imp.proyecto.nombre : 'Sin proyecto',
      'Horas Dedicadas': imp.horas || 0,
      'Comentarios': imp.anotaciones || 'Sin comentarios'
    }));

    const hojaDeCalculo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const libroDeTrabajo: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeCalculo, 'Reporte de Horas');
    XLSX.writeFile(libroDeTrabajo, 'Informes_Krama.xlsx');
  }
}