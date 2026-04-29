import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService, Cliente } from './cliente.service';
import { environment } from '../../environments/environment';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  const mockApiUrl = `${environment.apiUrl}/api/clientes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificamos que no queden peticiones pendientes
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener la lista de clientes (GET)', () => {
    const mockClientes: Cliente[] = [
      { id: 1, codigo: 'C001', nombre: 'Cliente 1', descripcion: 'Descripción 1' },
      { id: 2, codigo: 'C002', nombre: 'Cliente 2' }
    ];

    service.obtenerClientes().subscribe((clientes) => {
      expect(clientes.length).toBe(2);
      expect(clientes).toEqual(mockClientes);
    });

    const req = httpMock.expectOne(mockApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockClientes); // Simulamos la respuesta
  });

  it('debería crear un nuevo cliente (POST)', () => {
    const nuevoCliente: Cliente = { nombre: 'Nuevo Cliente', descripcion: 'Nueva desc' };
    const respuestaMock: Cliente = { id: 3, ...nuevoCliente };

    service.crearCliente(nuevoCliente).subscribe((cliente) => {
      expect(cliente).toEqual(respuestaMock);
    });

    const req = httpMock.expectOne(mockApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoCliente);
    req.flush(respuestaMock);
  });

  it('debería actualizar un cliente existente (PUT)', () => {
    const idCliente = 1;
    const clienteEditado: Cliente = { id: 1, nombre: 'Cliente Editado' };

    service.actualizarCliente(idCliente, clienteEditado).subscribe((cliente) => {
      expect(cliente).toEqual(clienteEditado);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/${idCliente}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(clienteEditado);
    req.flush(clienteEditado);
  });
});