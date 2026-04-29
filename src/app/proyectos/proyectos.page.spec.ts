import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProyectosPage } from './proyectos.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProyectoService } from '../services/proyecto.service';
import { ClienteService } from '../services/cliente.service';
import { UsuarioService } from '../services/usuario.service';
import { of } from 'rxjs';

describe('ProyectosPage', () => {
  let component: ProyectosPage;
  let fixture: ComponentFixture<ProyectosPage>;

  // Variables para nuestros servicios "falsos"
  let mockProyectoService: any;
  let mockClienteService: any;
  let mockUsuarioService: any;
    
  beforeEach(async () => {
    // 1. Creamos los espías con los métodos que usa el componente
    mockProyectoService = jasmine.createSpyObj('ProyectoService', ['obtenerProyectos', 'crearProyecto', 'actualizarProyecto']);
    mockClienteService = jasmine.createSpyObj('ClienteService', ['obtenerClientes']);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarios']);

    // 2. Le decimos a los espías qué devolver por defecto al arrancar (arrays vacíos usando 'of')
    mockProyectoService.obtenerProyectos.and.returnValue(of([{ id: 1, nombre: 'Proyecto Prueba' }]));
    mockClienteService.obtenerClientes.and.returnValue(of([]));
    mockUsuarioService.obtenerUsuarios.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ProyectosPage, HttpClientTestingModule],
      providers: [
        // Sustituimos los servicios reales por nuestros espías
        { provide: ProyectoService, useValue: mockProyectoService },
        { provide: ClienteService, useValue: mockClienteService },
        { provide: UsuarioService, useValue: mockUsuarioService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectosPage);
    component = fixture.componentInstance;
    // Evitamos llamar a detectChanges() aquí arriba para poder controlarlo en cada test
  });

  it('debería crearse y cargar los datos iniciales al arrancar (ngOnInit)', () => {
    // Al hacer detectChanges se ejecuta el ngOnInit
    fixture.detectChanges(); 
    
    expect(component).toBeTruthy();
    expect(mockProyectoService.obtenerProyectos).toHaveBeenCalled();
    expect(mockClienteService.obtenerClientes).toHaveBeenCalled();
    expect(mockUsuarioService.obtenerUsuarios).toHaveBeenCalled();
    
    // Verificamos que la variable proyectos se llenó con los datos de nuestro espía
    expect(component.proyectos.length).toBe(1);
  });

  it('debería preparar el formulario para CREAR', () => {
    component.abrirFormularioCrear();
    
    expect(component.editando).toBeFalse();
    // CORREGIDO AQUÍ:
    expect(component.isModalOpen).toBeTrue();
    expect(component.proyectoForm.nombre).toBe(''); // Formulario limpio
  });

  it('debería preparar el formulario para EDITAR y mapear IDs de clientes/usuarios', () => {
    // Simulamos un proyecto tal y como vendría del Backend
    const proyectoDelBackend = {
      id: 5,
      nombre: 'Web Krama',
      cliente: { id: 10, nombre: 'Empresa S.A.' },
      usuarios: [{ id: 1 }, { id: 2 }]
    };

    component.abrirFormularioEditar(proyectoDelBackend);
    
    expect(component.editando).toBeTrue();
    // CORREGIDO AQUÍ:
    expect(component.isModalOpen).toBeTrue();
    
    // Comprobamos que ha sacado los IDs correctamente para los Selects del HTML
    expect(component.proyectoForm.nombre).toBe('Web Krama');
    expect(component.proyectoForm.clienteId).toBe(10);
    expect(component.proyectoForm.usuariosIds).toEqual([1, 2]);
  });

  it('debería guardar un proyecto NUEVO y cerrar el formulario', () => {
    component.editando = false;
    component.proyectoForm = { 
      nombre: 'Nuevo', codigo: 'NV', descripcion: '', clienteId: null, usuariosIds: [] 
    };
    
    // Le decimos que al "crear" devuelva un éxito inmediato
    mockProyectoService.crearProyecto.and.returnValue(of({})); 
    // Y reiniciamos el espía de obtenerProyectos para saber si se le llama después
    mockProyectoService.obtenerProyectos.calls.reset();

    component.guardarProyecto();

    expect(mockProyectoService.crearProyecto).toHaveBeenCalled(); // Se llamó al API POST
    expect(mockProyectoService.obtenerProyectos).toHaveBeenCalled(); // Volvió a pedir la lista para refrescar
    // CORREGIDO AQUÍ:
    expect(component.isModalOpen).toBeFalse(); // Se ocultó la pantalla
  });
});