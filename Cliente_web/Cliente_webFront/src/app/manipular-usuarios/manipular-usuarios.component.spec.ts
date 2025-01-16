import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManipularUsuariosComponent } from './manipular-usuarios.component';

describe('ManipularUsuariosComponent', () => {
  let component: ManipularUsuariosComponent;
  let fixture: ComponentFixture<ManipularUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManipularUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManipularUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
