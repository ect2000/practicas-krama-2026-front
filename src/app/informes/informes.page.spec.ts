import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformesPage } from './informes.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InformesPage', () => {
  let component: InformesPage;
  let fixture: ComponentFixture<InformesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformesPage, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InformesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});