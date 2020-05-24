import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as editor from 'jsoneditor';
import {
  JsonEditorOptions, JsonEditorMode, JsonEditorSelection, JsonEditorValidationError,
  JsonEditorTextPosition, JsonEditorTextSelection, JsonEditorSerializableNode
} from './json-editor-options';

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
  template: `<div [id]="id" #jsonEditorContainer></div>`
})
export class JsonEditorComponent implements OnInit, OnDestroy {
  private editor: any;
  public id = 'jsoneditor' + Math.floor(Math.random() * 1000000);

  @ViewChild('jsonEditorContainer', { static: true }) jsonEditorContainer: ElementRef;

  // tslint:disable-next-line:variable-name
  private _options: JsonEditorOptions;
  get options() { return this._options; }
  @Input() set options(options: JsonEditorOptions) { this.createEditor(options); }

  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataError: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    if (!this.editor) {
      this.createEditor({}); // creates the editor with default options
    }
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
      this.editor = undefined;
    }
  }

  private createEditor(options: JsonEditorOptions) {
    // Store original options passed in
    this._options = options;

    // Create actual options for the editor
    const patchedOptions: JsonEditorOptions = {
      onChange: this.onChangeData.bind(this),
      onValidationError: this.onValidationError.bind(this)
    };
    const editorOptions = Object.assign({}, defaultOptions, options, patchedOptions);

    // expandAll is an additional option not supported by the original jsoneditor
    const expandAll = editorOptions.expandAll;
    delete editorOptions.expandAll;

    // (Re)create the editor
    if (!this.jsonEditorContainer.nativeElement) {
      console.error(`Can't find the ElementRef reference for jsoneditor)`);
    }
    if (this.editor) {
      this.editor.destroy();
    }
    this.editor = new editor(this.jsonEditorContainer.nativeElement, editorOptions, {});

    if (expandAll) {
      this.editor.expandAll();
    }
  }

  public onChangeData(e: any) {
    if (this.editor) {
      this.dataChange.emit(this.editor.get());
      if (this.options.onChange) {
        this.options.onChange();
      }
    }
  }

  public onValidationError(errors: JsonEditorValidationError[]) {
    if (this.editor) {
      this.dataError.emit(errors);
      if (this.options.onValidationError) {
        this.options.onValidationError(errors);
      }
    }
  }

  public resetMode() {
    const mode = this.getMode();
    this.setMode(mode === 'view' ? 'text' : 'view');
    this.setMode(mode);
  }

  public isWellFormedJson() {
    try {
      JSON.parse(this.getText());
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * JSON EDITOR FUNCTIONS
   */

  public collapseAll() {
    this.editor.collapseAll();
  }

  public destroy() {
    this.editor.destroy();
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
    return this.editor.getMode();
  }

  public getName(): string {
    return this.editor.getName();
  }

  public getText(): string {
    return this.editor.getText();
  }

  public getSelection(): JsonEditorSelection {
    return this.editor.getSelection();
  }

  public getTextSelection(): JsonEditorTextSelection {
    return this.editor.getSelection();
  }

  public getValidateSchema(): any {
    return this.editor.validateSchema;
  }

  public refresh() {
    this.editor.refresh();
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

  public setSchema(schema: any, schemaRefs?: any) {
    this.editor.setSchema(schema, schemaRefs);
  }

  public setSelection(start: JsonEditorSerializableNode, end: JsonEditorSerializableNode) {
    this.editor.setSelection(start, end);
  }

  public setTextSelection(start: JsonEditorTextPosition, end: JsonEditorTextPosition) {
    this.editor.setSelection(start, end);
  }

  public search(query: string): any[] {
    return this.editor.search(query);
  }

  public update(json: JSON) {
    this.editor.update(json);
  }

}
