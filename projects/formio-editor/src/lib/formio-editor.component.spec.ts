import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormioEditorComponent } from './formio-editor.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormioModule } from 'angular-formio';
import { FormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

describe('FormioEditorComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormioEditorComponent ],
      imports: [
        BrowserModule,
        FormioModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  @Component({
    selector: `davebaol-host-component`,
    template: `<formio-editor form='{display:"form",components:[]}'></formio-editor>`
  })
  class TestHostComponent {
    @ViewChild(FormioEditorComponent)
    public testComponent: FormioEditorComponent;
  }
});
