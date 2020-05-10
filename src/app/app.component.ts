import { Component } from '@angular/core';
import { JsonEditorOptions } from './formio-editor/formio-editor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularFormioEditor';
  form: any;
  jsonEditorOptions: JsonEditorOptions;

  constructor() {
    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.modes = ['code', 'tree', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log("jsonEditorOptions.onError: ", error);
    this.form = {
      "display": "wizard",
      "components": [
        {
          "type": "panel",
          "label": "Panel",
          "key": "panel",
          "theme": "default",
          "input": false,
          "placeholder": "",
          "prefix": "",
          "customClass": "",
          "suffix": "",
          "multiple": false,
          "defaultValue": null,
          "protected": false,
          "unique": false,
          "persistent": false,
          "hidden": false,
          "clearOnHide": false,
          "refreshOn": "",
          "redrawOn": "",
          "tableView": false,
          "modalEdit": false,
          "labelPosition": "top",
          "description": "",
          "errorLabel": "",
          "tooltip": "",
          "hideLabel": false,
          "tabindex": "",
          "disabled": false,
          "autofocus": false,
          "dbIndex": false,
          "customDefaultValue": "",
          "calculateValue": "",
          "widget": null,
          "attributes": {},
          "validateOn": "change",
          "validate": {
            "required": false,
            "custom": "",
            "customPrivate": false,
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "conditional": {
            "show": null,
            "when": null,
            "eq": "",
            "json": ""
          },
          "overlay": {
            "style": "",
            "left": "",
            "top": "",
            "width": "",
            "height": "",
            "page": ""
          },
          "allowCalculateOverride": false,
          "encrypted": false,
          "showCharCount": false,
          "showWordCount": false,
          "properties": {},
          "allowMultipleMasks": false,
          "tree": false,
          "title": "Page 1",
          "breadcrumb": "default",
          "components": [
            {
              "input": true,
              "key": "firstName",
              "placeholder": "",
              "prefix": "",
              "customClass": "",
              "suffix": "",
              "multiple": false,
              "defaultValue": "",
              "protected": false,
              "unique": false,
              "persistent": true,
              "hidden": false,
              "clearOnHide": true,
              "refreshOn": "",
              "redrawOn": "",
              "tableView": true,
              "modalEdit": false,
              "label": "First name",
              "labelPosition": "top",
              "description": "",
              "errorLabel": "",
              "tooltip": "",
              "hideLabel": false,
              "tabindex": "",
              "disabled": false,
              "autofocus": false,
              "dbIndex": false,
              "customDefaultValue": "",
              "calculateValue": "",
              "widget": {
                "type": "input"
              },
              "attributes": {},
              "validateOn": "change",
              "validate": {
                "required": false,
                "custom": "",
                "customPrivate": false,
                "strictDateValidation": false,
                "multiple": false,
                "unique": false,
                "minLength": "",
                "maxLength": "",
                "pattern": "",
                "customMessage": "",
                "json": ""
              },
              "conditional": {
                "show": null,
                "when": null,
                "eq": "",
                "json": ""
              },
              "overlay": {
                "style": "",
                "left": "",
                "top": "",
                "width": "",
                "height": "",
                "page": ""
              },
              "allowCalculateOverride": false,
              "encrypted": false,
              "showCharCount": false,
              "showWordCount": false,
              "properties": {},
              "allowMultipleMasks": false,
              "type": "textfield",
              "mask": false,
              "inputType": "text",
              "inputFormat": "plain",
              "inputMask": "",
              "id": "e1z95vn",
              "spellcheck": true,
              "case": "",
              "calculateServer": false,
              "tags": [],
              "customConditional": "",
              "logic": []
            }
          ],
          "id": "e8dmzgg",
          "collapsible": false,
          "tags": [],
          "customConditional": "",
          "logic": [],
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": true,
            "next": true
          },
          "nextPage": ""
        },
        {
          "type": "button",
          "label": "Submit",
          "key": "submit",
          "size": "md",
          "block": false,
          "action": "submit",
          "disableOnInvalid": true,
          "theme": "primary",
          "input": true,
          "placeholder": "",
          "prefix": "",
          "customClass": "",
          "suffix": "",
          "multiple": false,
          "defaultValue": null,
          "protected": false,
          "unique": false,
          "persistent": false,
          "hidden": false,
          "clearOnHide": true,
          "refreshOn": "",
          "redrawOn": "",
          "tableView": false,
          "modalEdit": false,
          "labelPosition": "top",
          "description": "",
          "errorLabel": "",
          "tooltip": "",
          "hideLabel": false,
          "tabindex": "",
          "disabled": false,
          "autofocus": false,
          "dbIndex": false,
          "customDefaultValue": "",
          "calculateValue": "",
          "widget": {
            "type": "input"
          },
          "attributes": {},
          "validateOn": "change",
          "validate": {
            "required": false,
            "custom": "",
            "customPrivate": false,
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "conditional": {
            "show": null,
            "when": null,
            "eq": ""
          },
          "overlay": {
            "style": "",
            "left": "",
            "top": "",
            "width": "",
            "height": ""
          },
          "allowCalculateOverride": false,
          "encrypted": false,
          "showCharCount": false,
          "showWordCount": false,
          "properties": {},
          "allowMultipleMasks": false,
          "leftIcon": "",
          "rightIcon": "",
          "dataGridLabel": true,
          "id": "eirhzrm"
        }
      ]
    };
  }

}
