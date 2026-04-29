import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesPage } from './clientes.page';
import { ClienteService, Cliente } from '../services/cliente.service';
import { of } from 'rxjs';

describe('ClientesPage', () => {
  let component: ClientesPage;
  let fixture: ComponentFixture<ClientesPage>;
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    // 1. Creamos un mock del servicio de clientes
    const spy = jasmine.createSpyObj('ClienteService', ['obtenerClientes', 'crearCliente', 'actualizarCliente']);

    await TestBed.configureTestingModule({
      imports: [ClientesPage], // Al ser standalone, se importa aquí
      providers: [
        { provide: ClienteService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesPage);
    component = fixture.componentInstance;
    clienteServiceSpy = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;

    // Simulamos que al arrancar, el servicio devuelve un array vacío
    clienteServiceSpy.obtenerClientes.and.returnValue(of([]));
  });

  it('debería crearse correctamente y cargar clientes al inicio', () => {
    fixture.detectChanges(); // Esto dispara el ngOnInit()
    
    expect(component).toBeTruthy();
    expect(clienteServiceSpy.obtenerClientes).toHaveBeenCalled();
  });

  it('debería abrir el formulario en modo CREACIÓN', () => {
    component.abrirFormularioCrear();
    
    expect(component.editando).toBeFalse();
    expect(component.isModalOpen).toBeTrue();
    expect(component.clienteForm).toEqual({ nombre: '', descripcion: '' });
  });

  it('debería abrir el formulario en modo EDICIÓN con los datos del cliente', () => {
    const mockCliente: Cliente = { id: 1, codigo: 'C1', nombre: 'Test', descripcion: 'Desc' };
    
    component.abrirFormularioEditar(mockCliente);
    
    expect(component.editando).toBeTrue();
    expect(component.isModalOpen).toBeTrue();
    expect(component.clienteForm).toEqual(mockCliente); // Comprueba que cargó los datos
  });

  it('debería guardar un cliente NUEVO y recargar la lista', () => {
    // Preparamos el componente
    component.editando = false;
    component.clienteForm = { nombre: 'Nuevo', descripcion: '...' };
    
    // Simulamos respuesta del servicio
    clienteServiceSpy.crearCliente.and.returnValue(of({ id: 1, nombre: 'Nuevo' }));
    
    // Ejecutamos
    component.guardarCliente();
    
    // Verificamos
    expect(clienteServiceSpy.crearCliente).toHaveBeenCalledWith(component.clienteForm);
    expect(clienteServiceSpy.obtenerClientes).toHaveBeenCalled(); // Se debe haber recargado la lista
    expect(component.isModalOpen).toBeFalse(); // El modal debe cerrarse
  });

  it('debería EDITAR un cliente existente y recargar la lista', () => {
    // Preparamos el componente
    component.editando = true;
    component.clienteForm = { id: 99, nombre: 'Editado' };
    
    // Simulamos respuesta del servicio
    clienteServiceSpy.actualizarCliente.and.returnValue(of({ id: 99, nombre: 'Editado' }));
    
    // Ejecutamos
    component.guardarCliente();
    
    // Verificamos
    expect(clienteServiceSpy.actualizarCliente).toHaveBeenCalledWith(99, component.clienteForm);
    expect(clienteServiceSpy.obtenerClientes).toHaveBeenCalled();
    expect(component.isModalOpen).toBeFalse();
  });
});