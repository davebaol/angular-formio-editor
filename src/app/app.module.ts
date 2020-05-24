import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormioModule, FormioAppConfig } from 'angular-formio';
import { FormioEditorModule } from '@davebaol/formio-editor';
import { AppComponent } from './app.component';
import { AppConfig } from '../formio-config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormioModule,
    FormioEditorModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: FormioAppConfig, useValue: AppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
