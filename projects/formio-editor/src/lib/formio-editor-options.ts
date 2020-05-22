import { JsonEditorOptions } from './json-editor/json-editor-options';


// export * from 'ang-jsoneditor';
export type FormioEditorTab = 'builder' | 'json' | 'renderer';

export interface FormioEditorOptions {
  builder?: BuilderOptions;
  json?: JsonEditorOptions;
}

export interface BuilderOptions {
  hideDisplaySelect?: boolean;
}
