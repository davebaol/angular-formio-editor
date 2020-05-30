import { AfterViewInit, Component, OnInit, ViewChild, Input, TemplateRef, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormioEditorOptions, FormioEditorTab } from './formio-editor-options';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { JsonEditorValidationError } from './json-editor/json-editor-shapes';
import { merge, clone } from './clone-utils';
import { loose as formioJsonSchema } from './formio-json-schema';

const defaultOptions: FormioEditorOptions = {
  tabs: ['builder', 'json', 'renderer'],
  tab: 'builder',
  builder: {
    hideDisplaySelect: false
  },
  json: {
    changePanelLocations: ['top', 'bottom'],
    editor: {
      enableSort: true,
      enableTransform: true,
      escapeUnicode: false,
      expandAll: false,
      history: true,
      indentation: 2,
      limitDragging: false,
      mode: 'view', // set default mode
      modes: ['code', 'tree', 'view'], // set allowed modes
      schema: formioJsonSchema.schema,
      schemaRefs: formioJsonSchema.schemaRefs,
      search: true,
      sortObjectKeys: false
    }
  }
};

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

  // tslint:disable-next-line:variable-name
  private _options: FormioEditorOptions;
  get options() { return this._options; }
  @Input() set options(options: FormioEditorOptions) { this.setOptions(options); }

  jsonEditorChanged = false;
  @ViewChild('jsoneditor', {static: true}) jsonEditor: JsonEditorComponent;

  activeTab: FormioEditorTab;

  modalRef: BsModalRef;

  // tslint:disable-next-line:variable-name
  private _jsonEditorErrors: JsonEditorValidationError[] = [];
  get jsonEditorErrors() {
    return this._jsonEditorErrors;
  }
  set jsonEditorErrors(errors: JsonEditorValidationError[]) {
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
      this.setOptions(); // Set default options
    }

    this.activeTab = this.options.tab;

    if (this.reset) {
      this.resetSubscription = this.reset.subscribe(() => this.resetFormBuilder());
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

  private setOptions(options: FormioEditorOptions = {}) {
    const opts: FormioEditorOptions = merge(defaultOptions, options);

    // Check options consistency
    if (Array.isArray(opts.tabs)) {
      opts.tabs = opts.tabs.filter(t => {
        if (!defaultOptions.tabs.includes(t)) {
          console.log(`FormioEditorComponent: unknown tab '${t}' in 'options.tabs'`);
          return false;
        }
        return true;
      });
    } else {
      opts.tabs = [];
    }
    if (opts.tabs.length === 0) {
      console.log(`FormioEditorComponent: 'options.tabs' must be a non empty array`);
      opts.tabs = clone(defaultOptions.tabs);
    }
    opts.tab = !opts.tab || !opts.tabs.includes(opts.tab) ? opts.tabs[0] : opts.tab;
    const cpl = opts.json.changePanelLocations;
    if (!Array.isArray(cpl) || !cpl.some(p => defaultOptions.json.changePanelLocations.includes(p))) {
      opts.json.changePanelLocations = clone(defaultOptions.json.changePanelLocations);
    }

    this._options = opts;
  }

  //
  // Form Builder Tab
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
  // JSON Tab
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
  // Form Renderer Tab
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
