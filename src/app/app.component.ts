import { Component } from '@angular/core';
import { FormioEditorOptions } from '@davebaol/formio-editor';
import { Subject } from 'rxjs';
import form from './initial-form.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: any;
  options: FormioEditorOptions;
  resetFormioEditor$ = new Subject<void>();

  constructor() {
    this.form = form;

    this.options = {
      builder: {
        hideDisplaySelect: false
      },
      json: {}
    };
  }

}
