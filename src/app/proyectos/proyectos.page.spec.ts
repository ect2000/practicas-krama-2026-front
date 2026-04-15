import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProyectosPage } from './proyectos.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProyectosPage', () => {
  let component: ProyectosPage;
  let fixture: ComponentFixture<ProyectosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosPage, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});