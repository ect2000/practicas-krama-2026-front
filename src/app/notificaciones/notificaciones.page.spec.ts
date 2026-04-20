import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesPage } from './notificaciones.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // 1. Añadimos esta línea

describe('NotificacionesPage', () => {
  let component: NotificacionesPage;
  let fixture: ComponentFixture<NotificacionesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Añadimos RouterTestingModule a los imports
      imports: [NotificacionesPage, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});