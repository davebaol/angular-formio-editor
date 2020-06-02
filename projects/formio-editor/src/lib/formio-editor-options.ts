import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormioService, FormioOptions, FormioBaseComponent, FormioRefreshValue } from 'angular-formio';
import { JsonEditorOptions } from './json-editor/json-editor-shapes';

export type FormioEditorTab = 'builder' | 'json' | 'renderer';

export interface FormioEditorBuilderOptions {
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

export interface FormioEditorJsonOptions {
  changePanelLocations?: ('top' | 'bottom')[];
  input?: {
    options?: JsonEditorOptions;
  };
  output?: {
    dataChange?: (event: any) => void;
    dataError?: (event: any) => void;
  };
}

export interface FormioEditorRendererOptions {
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
  tab?: FormioEditorTab;
  tabs?: FormioEditorTab[];
  builder?: FormioEditorBuilderOptions;
  json?: FormioEditorJsonOptions;
  renderer?: FormioEditorRendererOptions;
}
