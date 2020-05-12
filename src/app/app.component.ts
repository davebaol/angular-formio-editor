import { Component } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';
import form from './initial-form.json';

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
    const schema = {
      "title": "Form",
      "description": "Object containing a form.io form",
      "type": "object",
      "required": ["components"],
      "properties": {
        "display": {
          "title": "Display mode",
          "description": "The given name.",
          "enum": ["form", "wizard"],
        },
        "components": {
          "title": "Component List",
          "description": "The list of all components",
          "type": "array",
          "items": {
            "$ref": "component"
          }
        }
      }
    };
    const componentSchema = {
      "title": "Component",
      "description": "Object containing a form.io component",
      "type": "object",
      "required": ["type", "key", "input"],
      "properties": {
        "type": {
          "title": "Component Type",
          "description": "The type of this component",
          "type": "string"
        },
        "key": {
          "title": "Component Key",
          "description": "The API key for this component",
          "type": "string"
        },
        "input": {
          "title": "User Input?",
          "description": "Determines if this is an input from the user",
          "type": "boolean"
        },
      }
    };
    

    this.jsonEditorOptions = new JsonEditorOptions2();
    this.jsonEditorOptions.modes = ['code', 'tree', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log('jsonEditorOptions.onError:', error);
    this.jsonEditorOptions.schema = schema;
    this.jsonEditorOptions.schemaRefs = {"component": componentSchema};
    this.form = form;
  }

}
