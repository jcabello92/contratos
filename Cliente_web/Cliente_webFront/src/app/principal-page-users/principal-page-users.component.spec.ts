import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalPageUsersComponent } from './principal-page-users.component';

describe('PrincipalPageUsersComponent', () => {
  let component: PrincipalPageUsersComponent;
  let fixture: ComponentFixture<PrincipalPageUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalPageUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalPageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
