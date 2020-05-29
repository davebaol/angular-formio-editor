import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormioModule, FormioAppConfig } from 'angular-formio';
import { FormioEditorModule } from '@davebaol/angular-formio-editor';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
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
    BrowserAnimationsModule,
    ButtonsModule.forRoot()
  ],
  providers: [
    { provide: FormioAppConfig, useValue: AppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
