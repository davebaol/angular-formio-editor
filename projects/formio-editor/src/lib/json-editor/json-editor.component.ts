import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import * as editor from 'jsoneditor';
import { JsonEditorOptions, JsonEditorMode } from './json-editor-options';

const defaultOptions: JsonEditorOptions = {
  modes: ['code', 'tree', 'view'], // set allowed modes
  mode: 'view', // set default mode
  enableSort: true,
  enableTransform: true,
  escapeUnicode: false,
  expandAll: false,
  sortObjectKeys: false,
  history: true,
  search: true,
  indentation: 2
};
Object.freeze(defaultOptions);


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'json-editor',
  template: `<div [id]="id" #jsonEditorContainer></div>`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonEditorComponent implements OnInit {
  private editor: any;
  public id = 'angjsoneditor' + Math.floor(Math.random() * 1000000);

  public optionsChanged = false;

  @ViewChild('jsonEditorContainer', { static: true }) jsonEditorContainer: ElementRef;

  @Input() options: JsonEditorOptions;

  @Input() debug = false;

  @Output('change') changeEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output('error') errorEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log('>>>>>>>>>>>>init options in JsonEditorComponent.ngOnInit');
    console.log('this.options.onValidationError:', this.options.onValidationError);
    let optionsBefore = this.options;
    if (!this.optionsChanged && this.editor) {
      optionsBefore = this.editor.options;
    }

    if (!this.options.onChange && this.changeEmitter) {
      this.options.onChange = this.onChangeData.bind(this);
    }

    if (!this.options.onValidationError && this.errorEmitter) {
      this.options.onValidationError = this.onValidationError.bind(this);
    }
    const optionsCopy = Object.assign({}, defaultOptions, optionsBefore);

    // expandAll is an option only supported by ang-jsoneditor and not by the the original jsoneditor.
    delete optionsCopy.expandAll;
    if (this.debug) {
      console.log(optionsCopy);
    }
    if (!this.jsonEditorContainer.nativeElement) {
      console.error(`Can't find the ElementRef reference for jsoneditor)`);
    }
    this.editor = new editor(this.jsonEditorContainer.nativeElement, optionsCopy, {});

    if (this.options.expandAll) {
      this.editor.expandAll();
    }
  }

  public onChangeData(e) {
    if (this.editor) {
      this.changeEmitter.emit(this.editor.get());
    }
  }

  public onValidationError(e) {
    if (this.editor) {
      this.errorEmitter.emit(e);
    }
  }

  /**
   * JSON EDITOR FUNCTIONS
   */

  public collapseAll() {
    this.editor.collapseAll();
  }

  public expandAll() {
    this.editor.expandAll();
  }

  public focus() {
    this.editor.focus();
  }

  public get(): JSON {
    return this.editor.get();
  }

  public getMode(): JsonEditorMode {
    return this.editor.getMode() as JsonEditorMode;
  }

  public getName(): string {
    return this.editor.getName();
  }

  public getText(): string {
    return this.editor.getText();
  }

  public set(json: JSON) {
    this.editor.set(json);
  }

  public setMode(mode: JsonEditorMode) {
    this.editor.setMode(mode);
  }

  public setName(name: string) {
    this.editor.setName(name);
  }

  public setSelection(start, end) {
    this.editor.setSelection(start, end);
  }

  public getSelection(): any {
    return this.editor.getSelection();
  }

  public getValidateSchema(): any {
    return this.editor.validateSchema;
  }

  public setSchema(schema: any, schemaRefs: any) {
    this.editor.setSchema(schema, schemaRefs);
  }

  public search(query: string) {
    this.editor.search(query);
  }

  public setOptions(newOptions: JsonEditorOptions) {
    if (this.editor) {
      this.editor.destroy();
    }
    this.optionsChanged = true;
    this.options = newOptions;
    this.ngOnInit();
  }

  public update(json: JSON) {
    this.editor.update(json);
  }

  public destroy() {
    this.editor.destroy();
  }

  public isValidJson() {
    try {
      JSON.parse(this.getText());
      return true;
    } catch (e) {
      return false;
    }
  }
}
