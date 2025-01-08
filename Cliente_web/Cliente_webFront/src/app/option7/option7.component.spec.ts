import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Option7Component } from './option7.component';

describe('Option7Component', () => {
  let component: Option7Component;
  let fixture: ComponentFixture<Option7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Option7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Option7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
