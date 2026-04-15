import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProyectoService, Proyecto } from './proyecto.service';
import { environment } from '../../environments/environment';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/api/proyectos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProyectoService]
    });
    service = TestBed.inject(ProyectoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones HTTP pendientes
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener la lista de proyectos (GET)', () => {
    const mockProyectos: Proyecto[] = [
      { id: 1, nombre: 'Proyecto Test', codigo: 'PT1' }
    ];

    service.obtenerProyectos().subscribe(proyectos => {
      expect(proyectos.length).toBe(1);
      expect(proyectos).toEqual(mockProyectos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProyectos); // Simulamos que el backend devuelve nuestros datos
  });

  it('debería crear un proyecto (POST)', () => {
    const nuevoProyecto = { nombre: 'Nuevo Proyecto' };

    service.crearProyecto(nuevoProyecto).subscribe(respuesta => {
      expect(respuesta).toBeTruthy();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoProyecto); // Comprobamos que envía lo correcto
    req.flush({ id: 2, ...nuevoProyecto });
  });

  it('debería actualizar un proyecto (PUT)', () => {
    const proyectoActualizado = { nombre: 'Proyecto Modificado' };
    const id = 1;

    service.actualizarProyecto(id, proyectoActualizado).subscribe(respuesta => {
      expect(respuesta).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(proyectoActualizado);
    req.flush({ id, ...proyectoActualizado });
  });
});