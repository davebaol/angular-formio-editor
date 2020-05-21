import { AfterViewInit, Component, OnInit, ViewChild, Input, TemplateRef, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormioEditorOptions, FormioEditorTab } from './formio-editor-options';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { loose as formioJsonSchema } from './formio-json-schema';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'formio-editor',
  templateUrl: './formio-editor.component.html',
  styleUrls: ['./formio-editor.component.css']
})
export class FormioEditorComponent implements OnInit, AfterViewInit, OnDestroy  {
  @Input() form: any;
  builderDisplayChanged = false;

  @Input() reset?: Observable<void>;
  private resetSubscription: Subscription;

  @Input() options: FormioEditorOptions = { builder: {} };

  jsonEditorChanged = false;
  @ViewChild('jsoneditor', {static: true}) jsonEditor: JsonEditorComponent;

  @Input() activeTab?: FormioEditorTab = 'builder';

  modalRef: BsModalRef;

  // tslint:disable-next-line:variable-name
  private _jsonEditorErrors = [];
  get jsonEditorErrors() {
    return this._jsonEditorErrors;
  }
  set jsonEditorErrors(errors) {
    this._jsonEditorErrors = errors;
    this.jsonEditorWarningCounter = 0;
    errors.forEach((error) => {
      if (error.type === 'validation') {
        this.jsonEditorWarningCounter++;
      }
    });
  }

  jsonEditorWarningCounter = 0;

  constructor(private modalService: BsModalService) {
  }

  ngOnInit(): void {
    if (!this.options) {
      this.options = {};
    }
    if (!this.options.json) {
      this.options.json = {};
    }

    if (!this.options.json.schema) {
      this.options.json.schema = formioJsonSchema.schema;
      this.options.json.schemaRefs = formioJsonSchema.schemaRefs;
    }

    if (this.reset) {
      this.resetSubscription = this.reset.subscribe(() => {
        this.resetFormBuilder();
      });
    }
  }

  ngAfterViewInit() {
    this.refreshJsonEditor();
  }

  ngOnDestroy() {
    if (this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }

  //
  // Form Builder
  //

  resetFormBuilder(fromJsonEditor: boolean = false) {
    console.log('resetFormBuilder');
    // Here we have to reset builder component through *ngIf="!builderDisplayChanged"
    // See https://github.com/formio/angular-formio/issues/172#issuecomment-401876490
    this.builderDisplayChanged = true;
    setTimeout(() => {
      this.builderDisplayChanged = false;
      if (!fromJsonEditor) {
        this.refreshJsonEditor(true);
      }
      this.resetFormRendererIfActive();
    });
  }

  onBuilderDiplayChange(event) {
    console.log('onBuilderDiplayChange');
    this.resetFormBuilder();
  }

  onBuilderChange(event) {
    console.log('onBuilderChange: event', event);
    this.refreshJsonEditor(true);
  }

  //
  // JSON Editor
  //

  onJsonEditorError(errors: any[]) {
    console.log('onJsonEditorError: found', errors.length, 'validation errors:');
    this.jsonEditorErrors = errors;
  }

  onJsonEditorChange(event) {
    console.log('onJsonEditorChange');
    this.jsonEditorChanged = true;
  }

  onJsonEditorApply(template: TemplateRef<any>) {
    console.log('Errors: ', this.jsonEditorErrors.length - this.jsonEditorWarningCounter, 'Warnings: ', this.jsonEditorWarningCounter);
    if (this.jsonEditorWarningCounter === 0) {
      this.jsonEditorApplyChanges();
    } else {
      this.modalRef = this.modalService.show(template);
    }
  }

  jsonEditorApplyChanges() {
    console.log('jsonEditorApplyChanges');
    this.jsonEditorChanged = false;
    // Remove all properties from this form
    // then copy the properties of the edited json to this form
    // and reset the builder
    Object.getOwnPropertyNames(this.form).forEach(p => delete this.form[p]);
    Object.assign(this.form, this.jsonEditor.get());
    this.resetFormBuilder(true);
  }

  jsonEditorDiscardChanges() {
    console.log('jsonEditorDiscardChanges');
    this.refreshJsonEditor();
  }

  refreshJsonEditor(resetMode: boolean = false) {
    console.log('refreshJsonEditor');
    // Here we use update instead of set to preserve the editor status
    this.jsonEditor.update(this.form);
    this.jsonEditorChanged = false;
    if (resetMode) {
      this.jsonEditor.resetMode();
    }
  }

  //
  // Form Renderer
  //

  resetFormRendererIfActive() {
    console.log('resetFormRenderer');
    // Here we recreate the renderer component through *ngIf="activeTab='renderer'"
    // by changing the active tab and then restoring it.
    // Although this is a rather dirty hack it is hardly noticeable to the eye :)
    if (this.activeTab === 'renderer') {
      this.activeTab = 'builder';
      setTimeout(() => { this.activeTab = 'renderer'; });
    }
  }

}
