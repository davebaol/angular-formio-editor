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
  alive = true;

  constructor() {
    this.form = form;

    this.options = {
      builder: {
        hideDisplaySelect: false
      },
      json: {}
    };
  }

  recreateFormioEditor() {
    this.alive = false;
    setTimeout(() => this.alive = true);
  }
}
