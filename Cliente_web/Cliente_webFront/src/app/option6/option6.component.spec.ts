import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Option6Component } from './option6.component';

describe('Option6Component', () => {
  let component: Option6Component;
  let fixture: ComponentFixture<Option6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Option6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Option6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
