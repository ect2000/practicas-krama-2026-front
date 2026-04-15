import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarPasswordPage } from './cambiar-password.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CambiarPasswordPage', () => {
  let component: CambiarPasswordPage;
  let fixture: ComponentFixture<CambiarPasswordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarPasswordPage, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});