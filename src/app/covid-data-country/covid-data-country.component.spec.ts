import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidDataCountryComponent } from './covid-data-country.component';

describe('CovidDataCountryComponent', () => {
  let component: CovidDataCountryComponent;
  let fixture: ComponentFixture<CovidDataCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidDataCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidDataCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
