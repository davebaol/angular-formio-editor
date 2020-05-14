import { Component } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';
import form from './initial-form.json';
import formioJsonSchema from './formio-json-schema';

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
    this.jsonEditorOptions.schema = formioJsonSchema.schema;
    this.jsonEditorOptions.schemaRefs = formioJsonSchema.schemaRefs;
    this.jsonEditorOptions.onValidationError = (errors: any[]) => {
      console.log('Found', errors.length, 'validation errors:');
      errors.forEach((error) => console.log(error));
    };
    this.form = form;
  }

}
