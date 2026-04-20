import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjustesPage } from './ajustes.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('AjustesPage', () => {
  let component: AjustesPage;
  let fixture: ComponentFixture<AjustesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustesPage, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
