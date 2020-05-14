import { Component } from '@angular/core';
import { JsonEditorOptions } from '@davebaol/formio-editor';
import form from './initial-form.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: any;
  jsonEditorOptions: JsonEditorOptions;

  constructor() {
    this.form = form;
    this.jsonEditorOptions = new JsonEditorOptions();
  }

}
