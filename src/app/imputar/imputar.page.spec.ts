import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImputarPage } from './imputar.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // 1. Añadimos esta línea

describe('ImputarPage', () => {
  let component: ImputarPage;
  let fixture: ComponentFixture<ImputarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Añadimos RouterTestingModule a los imports
      imports: [ImputarPage, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ImputarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});