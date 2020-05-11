import { Component } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';
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
    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.modes = ['code', 'tree', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log('jsonEditorOptions.onError:', error);
    this.form = form;
  }

}
