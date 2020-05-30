import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import JsonEditor from 'jsoneditor';
import {
  JsonEditorOptions, JsonEditorMode, JsonEditorSelection, JsonEditorValidationError,
  JsonEditorTextPosition, JsonEditorTextSelection, JsonEditorSerializableNode, jsonEditorNativeOptions, jsonEditorAdditionalOptions
} from './json-editor-shapes';

// Check unsupported options
let unsupportedOptions = JsonEditor.VALID_OPTIONS.filter(p => !jsonEditorNativeOptions.includes(p));
if (unsupportedOptions.length > 0) {
  console.log('You\'re probably using a recent version of jsoneditor and the following options are not yet defined in JsonEditorNativeOptions', unsupportedOptions);
  console.log('However, you can still pass these options using TypeScript type assertion \'as JsonEditorOptions\'');
}
unsupportedOptions = jsonEditorNativeOptions.filter(p => !JsonEditor.VALID_OPTIONS.includes(p));
if (unsupportedOptions.length > 0) {
  console.log('You\'re probably using an old version of jsoneditor that doesn\'t support the following options', unsupportedOptions);
}

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

  private createEditor(options: JsonEditorOptions, mode?: JsonEditorMode) {
    // Store original options passed in
    this._options = options;

    // Create actual options for the editor
    const patchedOptions: JsonEditorOptions = {
      onChange: this.onChangeData.bind(this),
      onValidationError: this.onValidationError.bind(this)
    };
    const editorOptions = Object.assign({}, options, patchedOptions);

    // Extract additional options not supported by the original jsoneditor
    const additionalOptions: JsonEditorOptions = jsonEditorAdditionalOptions.reduce((opts, k) => {
      opts[k] = editorOptions[k];
      delete editorOptions[k];
      return opts;
    }, {});

    // (Re)create the editor
    if (!this.jsonEditorContainer.nativeElement) {
      console.error(`Can't find the ElementRef reference for jsoneditor)`);
    }
    if (this.editor) {
      this.editor.destroy();
    }
    this.editor = new JsonEditor(this.jsonEditorContainer.nativeElement, editorOptions, {});

    if (mode) {
      this.setMode(mode);
    }

    if (additionalOptions.expandAll && ['form', 'tree', 'view'].includes(this.getMode())) {
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

  public reset(preserveMode = false) {
    const mode = preserveMode ? this.getMode() : undefined;
    this.createEditor(this.options, mode);
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
