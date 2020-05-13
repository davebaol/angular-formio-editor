import { Component } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';
import form from './initial-form.json';
import schema from './schema-root.json';
import componentSchema from './schema-component.json';
import logicSchema from './schema-logic.json';

class JsonEditorOptions2 extends JsonEditorOptions {
  schemaRefs = null;
  onValidationError = null;
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
    this.jsonEditorOptions.schemaRefs = {
      component: componentSchema,
      logic: logicSchema
    };
    this.jsonEditorOptions.onValidationError = (errors: any[]) => {
      console.log('Found', errors.length, 'validation errors:');
      errors.forEach((error) => console.log(error));
    };
    this.form = form;
  }

}
