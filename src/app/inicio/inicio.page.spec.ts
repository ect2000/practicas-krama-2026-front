
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPage } from './inicio.page';

// 1. Importamos las herramientas modernas de Angular (Providers)
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // El componente va en imports porque es Standalone
      imports: [ InicioPage ], 
      // Las herramientas de red y rutas van en providers
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});