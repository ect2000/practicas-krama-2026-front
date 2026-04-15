import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  // Variables para nuestros servicios simulados (mocks)
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    // 1. Creamos "espías" (spies) para los servicios. 
    // Esto crea funciones falsas que podemos controlar durante las pruebas.
    mockAuthService = jasmine.createSpyObj('AuthService', ['iniciarSesion']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      // Al ser un componente Standalone, lo ponemos en imports
      imports: [LoginPage], 
      providers: [
        // Le decimos a Angular que cuando el componente pida estos servicios, 
        // le entregue nuestras versiones simuladas
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar error si los campos están vacíos', () => {
    // Configuramos los campos vacíos
    component.correo = '';
    component.contrasena = '';
    
    // Ejecutamos el método
    component.hacerLogin();

    // Verificamos que el mensaje de error se haya establecido correctamente
    expect(component.mensajeError).toBe('Por favor, rellena todos los campos antes de continuar.');
    // Verificamos que NO se haya llamado al servicio (porque se detuvo antes)
    expect(mockAuthService.iniciarSesion).not.toHaveBeenCalled();
  });

  it('debería hacer login correctamente, guardar en localStorage y navegar a /inicio', () => {
    // 1. Preparamos el escenario de éxito
    component.correo = 'test@correo.com';
    component.contrasena = '12345';
    const mockUsuario = { nombre: 'Test', email: 'test@correo.com' };

    // Simulamos que el localStorage funciona
    spyOn(localStorage, 'setItem'); 
    
    // Le decimos a nuestro servicio falso que devuelva éxito (usando 'of' de rxjs)
    mockAuthService.iniciarSesion.and.returnValue(of(mockUsuario));

    // 2. Ejecutamos el login
    component.hacerLogin();

    // 3. Verificamos los resultados
    // Comprobamos que el mensaje de error esté limpio
    expect(component.mensajeError).toBe('');
    
    // Comprobamos que se haya guardado el usuario en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('usuarioLogueado', JSON.stringify(mockUsuario));
    
    // Comprobamos que el router nos haya redirigido a la página de inicio
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('debería mostrar error si las credenciales son incorrectas (error del backend)', () => {
    // 1. Preparamos el escenario de error
    component.correo = 'test@correo.com';
    component.contrasena = 'mala_contrasena';

    // Le decimos a nuestro servicio falso que devuelva un error (usando throwError)
    mockAuthService.iniciarSesion.and.returnValue(throwError(() => new Error('No autorizado')));

    // 2. Ejecutamos el login
    component.hacerLogin();

    // 3. Verificamos que se haya capturado el error y mostrado el mensaje adecuado
    expect(component.mensajeError).toBe('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
    // Verificamos que NO haya navegado a otra pantalla
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});