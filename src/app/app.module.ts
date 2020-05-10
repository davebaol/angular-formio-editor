import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FormioModule } from 'angular-formio';
import { FormioEditorModule } from '@davebaol/formio-editor';
import { NgJsonEditorModule } from 'ang-jsoneditor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormioModule,
    FormioEditorModule,
    FormsModule,
    NgJsonEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
