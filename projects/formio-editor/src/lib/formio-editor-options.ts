import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormioService, FormioOptions, FormioBaseComponent, FormioRefreshValue } from 'angular-formio';
import { JsonEditorOptions } from './json-editor/json-editor-shapes';

export type FormioEditorTab = 'builder' | 'json' | 'renderer';

interface FormioEditorTabOptions {
  hideTab?: boolean;
  defaultTab?: boolean;
}

export interface FormioEditorBuilderOptions extends FormioEditorTabOptions {
  hideDisplaySelect?: boolean;
  input?: {
    options?: FormioOptions;
    formbuilder?: any;
    noeval?: boolean;
    refresh?: Observable<void>;
  };
  output?: {
    change?: (event: object) => void;
  };
}

interface JsonEditorInputOutputArguments {
  input?: {
    options?: JsonEditorOptions;
  };
  output?: {
    dataChange?: (event: any) => void;
    dataError?: (event: any) => void;
  };
}

export interface FormioEditorJsonOptions extends FormioEditorTabOptions, JsonEditorInputOutputArguments {
  changePanelLocations?: ('top' | 'bottom')[];
}

export interface FormioEditorRendererOptions extends FormioEditorTabOptions {
  submissionPanel?: {
    disabled?: boolean;
    fullSubmission: boolean;
    resourceJsonEditor: JsonEditorInputOutputArguments;
    schemaJsonEditor: JsonEditorInputOutputArguments & { enabled?: boolean };
  };
  input?: {
    submission?: any;
    src?: string;
    url?: string;
    service?: FormioService;
    options?: FormioOptions;
    noeval?: boolean;
    formioOptions?: any;
    renderOptions?: any;
    readOnly?: boolean;
    viewOnly?: boolean;
    hideComponents?: string[];
    refresh?: EventEmitter<FormioRefreshValue>;
    error?: EventEmitter<any>;
    success?: EventEmitter<object>;
    language?: EventEmitter<string>;
    hooks?: any;
    renderer?: any;
  };
  output?: {
    render?: (event: object) => void;
    customEvent?: (event: object) => void;
    submit?: (event: object) => void;
    prevPage?: (event: object) => void;
    nextPage?: (event: object) => void;
    beforeSubmit?: (event: object) => void;
    change?: (event: object) => void;
    invalid?: (event: boolean) => void;
    errorChange?: (event: any) => void;
    formLoad?: (event: any) => void;
    submissionLoad?: (event: any) => void;
    ready?: (event: FormioBaseComponent) => void;
  };
}

export interface FormioEditorOptions {
  builder?: FormioEditorBuilderOptions;
  json?: FormioEditorJsonOptions;
  renderer?: FormioEditorRendererOptions;
}
