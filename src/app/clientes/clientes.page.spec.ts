import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesPage } from './clientes.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClientesPage', () => {
  let component: ClientesPage;
  let fixture: ComponentFixture<ClientesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesPage, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});