import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesUserComponent } from './ajustes-user.component';

describe('AjustesUserComponent', () => {
  let component: AjustesUserComponent;
  let fixture: ComponentFixture<AjustesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustesUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjustesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
