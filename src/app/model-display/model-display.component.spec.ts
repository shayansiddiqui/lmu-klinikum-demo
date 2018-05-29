import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDisplayComponent } from './model-display.component';

describe('ModelDisplayComponent', () => {
  let component: ModelDisplayComponent;
  let fixture: ComponentFixture<ModelDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
