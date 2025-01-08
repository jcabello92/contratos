import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OITsComponent } from './oits.component';

describe('OITsComponent', () => {
  let component: OITsComponent;
  let fixture: ComponentFixture<OITsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OITsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OITsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
