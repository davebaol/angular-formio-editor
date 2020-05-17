import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild, Input } from '@angular/core';
import { JsonEditorOptions as OriginalJsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { Subject } from 'rxjs';
import { FormioComponent, FormioRefreshValue } from 'angular-formio';
import { loose as formioJsonSchema } from './formio-json-schema';

// export * from 'ang-jsoneditor';
export type FormioEditorTab = 'builder' | 'json' | 'renderer';

// Unfortunately JsonEditorOptions from package ang-jsoneditor 1.9.4 doesn't
// support options 'schemaRefs' and 'onValidationError' used by jsoneditor 8.6.7.
// See https://github.com/mariohmol/ang-jsoneditor/issues/66
export class JsonEditorOptions extends OriginalJsonEditorOptions {
  schemaRefs: object;
  onValidationError: (errors: any[]) => void;

  constructor() {
    super();
    this.modes = ['code', 'tree', 'view']; // set allowed modes
    this.mode = 'view'; // set default mode
    this.onError = (error) => console.log('jsonEditorOptions.onError: ', error);
    this.schema = formioJsonSchema.schema;
    this.schemaRefs = formioJsonSchema.schemaRefs;
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'formio-editor',
  templateUrl: './formio-editor.component.html',
  styleUrls: ['./formio-editor.component.css']
})
export class FormioEditorComponent implements OnInit, AfterViewInit  {
  @Input() form: any;
  refreshBuilder$ = new Subject();
  builderDisplayChanged = false;

  @Input() jsonEditorOptions: JsonEditorOptions;
  jsonEditorChanged = false;
  @ViewChild('jsoneditor', {static: true}) jsonEditor: JsonEditorComponent;

  @ViewChild('renderer', {static: true}) renderer: FormioComponent;
  @Input() refreshRenderer?: EventEmitter<FormioRefreshValue> = new EventEmitter();

  @Input() activeTab?: FormioEditorTab = 'builder';

  // tslint:disable-next-line:variable-name
  private _jsonEditorErrors = [];
  get jsonEditorErrors(){
    return this._jsonEditorErrors;
  }
  set jsonEditorErrors(errors){
    this._jsonEditorErrors = errors;
    this.jsonEditorWarningCounter = 0;
    errors.forEach((error) => {
      if (error.type === 'validation'){
        this.jsonEditorWarningCounter++;
      }
    });
    if (errors.length !== this.jsonEditorWarningCounter){
      $('.errorAlert').show();
    } else {
      $('.errorAlert').hide();
    }
  }

  jsonEditorWarningCounter = 0;
  constructor() {
    this.jsonEditorOptions = new JsonEditorOptions();
  }

  ngOnInit(): void {
    const origOnValidationError = this.jsonEditorOptions.onValidationError;
    this.jsonEditorOptions.onValidationError = (errors: any[]) => {
      console.log('Found', errors.length, 'validation errors:');
      this.jsonEditorErrors = errors;
      if (origOnValidationError){
        origOnValidationError(errors);
      }
    };
  }

  ngAfterViewInit() {
    this.refreshJsonEditor();
  }

  //
  // Form Builder
  //

  refreshFormBuilder() {
    console.log('refreshFormBuilder');
    this.refreshBuilder$.next();
  }

  onBuilderDiplayChange(event) {
    console.log('onBuilderDiplayChange');
    // Unfortunately calling this.refreshFormBuilder() doesn't work as expected here.
    // The workaround is to recreate the builder component through *ngIf="!builderDisplayChanged"
    // See https://github.com/formio/angular-formio/issues/172#issuecomment-401876490
    this.builderDisplayChanged = true;
    setTimeout(() => { this.builderDisplayChanged = false; });

    this.refreshJsonEditor();
  }

  onBuilderChange(event) {
    console.log('onBuilderChange');
    this.refreshJsonEditor();
  }

  //
  // JSON Editor
  //

  onJsonEditorChange(event) {
    console.log('onJsonEditorChange');
    this.jsonEditorChanged = true;
  }

  onJsonEditorApply(){
    console.log('Errors: ', this.jsonEditorErrors.length - this.jsonEditorWarningCounter, 'Warnings: ', this.jsonEditorWarningCounter);
    if (this.jsonEditorWarningCounter === 0) {
      this.jsonEditorApplyChanges();
    } else {
      $('#saveModal').modal();
    }
  }

  jsonEditorApplyChanges() {
    console.log('jsonEditorApplyChanges');
    this.jsonEditorChanged = false;
    // Remove all properties from this form
    // then copy the properties of the edited json to this form
    // and refresh the builder
    Object.getOwnPropertyNames(this.form).forEach(p => delete this.form[p]);
    Object.assign(this.form, this.jsonEditor.get());
    this.refreshFormBuilder();
  }

  jsonEditorDiscardChanges() {
    console.log('jsonEditorDiscardChanges');
    this.refreshJsonEditor();
  }

  refreshJsonEditor() {
    console.log('refreshJsonEditor');
    // Here we use update instead of set to preserve the editor status
    this.jsonEditor.update(this.form);
    this.jsonEditorChanged = false;
  }

}
