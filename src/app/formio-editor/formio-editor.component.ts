import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild, Input } from '@angular/core';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { Subject } from 'rxjs';
import { FormioComponent, FormioRefreshValue } from 'angular-formio';

export * from 'ang-jsoneditor';
export type FormioEditorTab = 'builder' | 'json' | 'renderer';

@Component({
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

  constructor() {
    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.modes = ['code', 'tree', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log("jsonEditorOptions.onError: ", error);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.refreshJsonEditor();
  }

  //
  // Form Builder
  //

  refreshFormBuilder() {
    console.log("refreshFormBuilder");
    this.refreshBuilder$.next();
  }

  onBuilderDiplayChange(event) {
    console.log("onBuilderDiplayChange");
    // Unfortunately calling this.refreshFormBuilder() doesn't work as expected here.
    // The workaround is to recreate the builder component through *ngIf="!builderDisplayChanged"
    // See https://github.com/formio/angular-formio/issues/172#issuecomment-401876490
    this.builderDisplayChanged = true;
    setTimeout(() => { this.builderDisplayChanged = false; });

    this.refreshJsonEditor();
  }

  onBuilderChange(event) {
    console.log("onBuilderChange");
    this.refreshJsonEditor();
  }

  //
  // JSON Editor
  //

  onJsonEditorChange(event) {
    console.log("onJsonEditorChange");
    this.jsonEditorChanged = true;
  }

  jsonEditorApplyChanges() {
    console.log("jsonEditorApplyChanges");
    this.jsonEditorChanged = false;
    // Remove all properties from this form
    // then copy the properties of the edited json to this form
    // and refresh the builder
    Object.getOwnPropertyNames(this.form).forEach(p => delete this.form[p]);
    Object.assign(this.form, this.jsonEditor.get());
    this.refreshFormBuilder();
  }

  jsonEditorDiscardChanges() {
    console.log("jsonEditorDiscardChanges");
    this.refreshJsonEditor();
  }

  refreshJsonEditor() {
    console.log("refreshJsonEditor");
    // Here we use update instead of set to preserve the editor status
    this.jsonEditor.update(this.form);
    this.jsonEditorChanged = false;
  }

}

