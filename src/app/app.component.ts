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
      display: 'wizard',
      components: [
        {
          label: 'Panel',
          title: 'Page 1',
          breadcrumbClickable: true,
          buttonSettings: {
            previous: true,
            cancel: true,
            next: true
          },
          collapsible: false,
          mask: false,
          tableView: false,
          alwaysEnabled: false,
          type: 'panel',
          input: false,
          key: 'panel2',
          conditional: {
            show: '',
            when: '',
            json: ''
          },
          components: [
            {
              type: 'textfield',
              label: 'FirstName',
              key: 'firstName',
              input: true,
              tableView: true
            },
            {
              type: 'textfield',
              label: 'LastName',
              key: 'lastName',
              input: true,
              tableView: true
            }
          ],
          collapsed: false,
          reorder: false,
          properties: {},
          customConditional: '',
          nextPage: '',
          logic: [],
          attributes: {}
        },
        {
          type: 'button',
          action: 'Submit',
          label: 'Submit',
          theme: 'primary',
          input: true,
          key: 'submit',
          tableView: true
        }
      ]
    };
  }

}
