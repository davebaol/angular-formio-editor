import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { FormioEditorOptions } from '@davebaol/angular-formio-editor';
import { version as formioEditorVersion} from '@davebaol/angular-formio-editor/package.json';
import form from './initial-form.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formioEditorVersion = formioEditorVersion;
  form: any;
  options: FormioEditorOptions;
  resetFormioEditor$ = new Subject<void>();

  constructor() {
    this.form = form;

    this.options = {
      builder: {
        hideDisplaySelect: false,
        output: {
          change: (event) => console.log('Demo: builder change event:', event),
        }
      },
      json: {},
      renderer: {
        input: {
          src: 'http://localhost:8383/api/v1/documents',
          renderOptions: { breadcrumbSettings: { clickable: true } }
        },
        submissionPanel: {
          disabled: false,
          fullSubmission: true,
          resourceJsonEditor: {
            input: {
              options: {}
            }
          },
          schemaJsonEditor: {
            enabled: false,
            input: {
              options: {}
            }
          }
        }
      }
    };
  }
}
