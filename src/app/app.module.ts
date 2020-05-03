import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormioModule} from 'angular-formio';
import { FormioEditorComponent } from './formio-editor/formio-editor.component';
import {FormsModule} from '@angular/forms';
import {PrismService} from './prism.service';

@NgModule({
  declarations: [
    AppComponent,
    FormioEditorComponent
  ],
  imports: [
    BrowserModule,
    FormioModule,
    FormsModule
  ],
  providers: [
    PrismService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
