import { JsonEditorOptions } from './json-editor/json-editor-shapes';

export type FormioEditorTab = 'builder' | 'json' | 'renderer';

export interface BuilderOptions {
  hideDisplaySelect?: boolean;
}

export interface FormioEditorOptions {
  tab?: FormioEditorTab;
  tabs?: FormioEditorTab[];
  builder?: BuilderOptions;
  json?: JsonEditorOptions;
}
