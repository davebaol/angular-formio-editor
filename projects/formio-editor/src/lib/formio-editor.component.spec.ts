import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormioEditorComponent } from './formio-editor.component';

describe('FormioEditorComponent', () => {
  let component: FormioEditorComponent;
  let fixture: ComponentFixture<FormioEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormioEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormioEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
