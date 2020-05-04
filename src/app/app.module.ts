import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormioModule } from 'angular-formio';
import { FormioEditorComponent } from './formio-editor/formio-editor.component';
import { FormsModule } from '@angular/forms';
import { NgJsonEditorModule } from 'ang-jsoneditor';

@NgModule({
  declarations: [
    AppComponent,
    FormioEditorComponent
  ],
  imports: [
    BrowserModule,
    FormioModule,
    FormsModule,
    NgJsonEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
