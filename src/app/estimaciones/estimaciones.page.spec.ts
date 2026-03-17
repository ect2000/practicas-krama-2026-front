import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstimacionesPage } from './estimaciones.page';

describe('EstimacionesPage', () => {
  let component: EstimacionesPage;
  let fixture: ComponentFixture<EstimacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
