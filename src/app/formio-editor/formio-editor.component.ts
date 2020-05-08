import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild, Input, Output} from '@angular/core';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

export * from 'ang-jsoneditor';

@Component({
  selector: 'formio-editor',
  templateUrl: './formio-editor.component.html',
  styleUrls: ['./formio-editor.component.css']
})
export class FormioEditorComponent implements OnInit, AfterViewInit  {
  formValue: any;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();

  get form() {
    return this.formValue;
  }
  @Input()
  set form(val) {
    console.log("set form(val)");
    this.formValue = val;
    this.formChange.emit(this.formValue);
  }

  @Input() jsonEditorOptions: JsonEditorOptions;
  jsonEditorChanged = false;
  rendererTriggerRefresh = new EventEmitter();

  @ViewChild('jsoneditor', {static: true}) editor: JsonEditorComponent;

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
  // Form.io Builder
  //

  onBuilderDiplayChange(event) {
    console.log("onBuilderDiplayChange");
    this.form = Object.assign({}, this.form);
    this.refreshJsonEditor();
    this.refreshRenderer();
  }

  onBuilderChange(event) {
    console.log("onBuilderChange");
    this.refreshJsonEditor();
    this.refreshRenderer();
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
    this.form = this.editor.get();
    this.refreshRenderer();
  }

  jsonEditorDiscardChanges() {
    console.log("jsonEditorDiscardChanges");
    this.refreshJsonEditor();
    this.refreshRenderer();
  }

  refreshJsonEditor() {
    console.log("refreshJsonEditor");
    // Here we use update instead of set to preserve the editor status
    this.editor.update(this.form);
    this.jsonEditorChanged = false;
  }

  //
  // Form.io Renderer
  //

  refreshRenderer() {
    this.rendererTriggerRefresh.emit({
      property: 'form',
      value: this.form
    });
  }
}

