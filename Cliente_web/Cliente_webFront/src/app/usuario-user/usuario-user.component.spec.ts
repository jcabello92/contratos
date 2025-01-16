import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioUserComponent } from './usuario-user.component';

describe('UsuarioUserComponent', () => {
  let component: UsuarioUserComponent;
  let fixture: ComponentFixture<UsuarioUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
