import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, CredencialesLogin } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  // Esta variable nos permitirá simular y controlar las peticiones HTTP
  let httpMock: HttpTestingController;

  // beforeEach se ejecuta ANTES de cada prueba (bloque 'it')
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Importamos este módulo especial de Angular para pruebas HTTP
      imports: [HttpClientTestingModule], 
      providers: [AuthService]
    });
    
    // Inyectamos el servicio y el controlador de pruebas HTTP
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // afterEach se ejecuta DESPUÉS de cada prueba para asegurar que no queden peticiones pendientes
  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer un POST a la API al iniciar sesión', () => {
    // 1. Preparamos los datos de prueba
    const mockCredenciales: CredencialesLogin = { email: 'test@correo.com', password: '123' };
    const mockRespuestaBackend = { id: 1, nombre: 'Juan', token: 'abc123token' };

    // 2. Llamamos al método de nuestro servicio
    service.iniciarSesion(mockCredenciales).subscribe(respuesta => {
      // Verificamos que la respuesta del servicio coincida con lo que el backend simulado devolverá
      expect(respuesta).toEqual(mockRespuestaBackend);
    });

    // 3. Le decimos al controlador simulado qué petición debe esperar
    const urlEsperada = environment.apiUrl + '/api/usuarios/login';
    const req = httpMock.expectOne(urlEsperada);

    // Comprobamos que el método usado fue POST
    expect(req.request.method).toBe('POST');
    // Comprobamos que el cuerpo de la petición lleve las credenciales
    expect(req.request.body).toEqual(mockCredenciales);

    // 4. Simulamos que el servidor responde con nuestros datos de prueba
    req.flush(mockRespuestaBackend);
  });
});