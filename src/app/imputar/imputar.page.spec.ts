import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImputarPage } from './imputar.page';

describe('ImputarPage', () => {
  let component: ImputarPage;
  let fixture: ComponentFixture<ImputarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImputarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
