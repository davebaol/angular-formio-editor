import { Component } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';
import form from './initial-form.json';
import schema from './schema-root.json';
import componentSchema from './schema-component.json';

class JsonEditorOptions2 extends JsonEditorOptions {
  schemaRefs = {};
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: any;
  jsonEditorOptions: JsonEditorOptions2;

  constructor() {
    this.jsonEditorOptions = new JsonEditorOptions2();
    this.jsonEditorOptions.modes = ['code', 'tree', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log('jsonEditorOptions.onError:', error);
    this.jsonEditorOptions.schema = schema;
    this.jsonEditorOptions.schemaRefs = {component: componentSchema};
    this.form = form;
  }

}
