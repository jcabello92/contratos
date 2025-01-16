import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesUserComponent } from './notificaciones-user.component';

describe('NotificacionesUserComponent', () => {
  let component: NotificacionesUserComponent;
  let fixture: ComponentFixture<NotificacionesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
