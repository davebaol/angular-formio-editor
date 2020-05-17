import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormioEditorComponent } from './formio-editor.component';
import { FormioModule } from 'angular-formio';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [FormioEditorComponent],
    imports: [
        BrowserModule,
        FormioModule,
        FormsModule,
        NgJsonEditorModule,
        AlertModule.forRoot(),
        ModalModule.forRoot()
    ],
  exports: [FormioEditorComponent]
})
export class FormioEditorModule { }
