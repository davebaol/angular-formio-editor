import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormioEditorComponent } from './formio-editor.component';
import { FormioModule } from 'angular-formio';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { JsonEditorComponent } from './json-editor/json-editor.component';


@NgModule({
  declarations: [FormioEditorComponent, JsonEditorComponent],
  imports: [
    BrowserModule,
    FormioModule,
    FormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [FormioEditorComponent]
})
export class FormioEditorModule { }
