import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormBuilderComponent } from './admin-form-builder.component';

describe('AdminFormBuilderComponent', () => {
  let component: AdminFormBuilderComponent;
  let fixture: ComponentFixture<AdminFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFormBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFormBuilderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
