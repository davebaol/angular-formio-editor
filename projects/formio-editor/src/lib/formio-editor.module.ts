import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormioEditorComponent } from './formio-editor.component';
import { FormioModule } from 'angular-formio';
import { NgJsonEditorModule } from 'ang-jsoneditor';



@NgModule({
  declarations: [FormioEditorComponent],
  imports: [
    BrowserModule,
    FormioModule,
    FormsModule,
    NgJsonEditorModule
  ],
  exports: [FormioEditorComponent]
})
export class FormioEditorModule { }
