import { JsonEditorOptions } from './json-editor/json-editor-shapes';

export type FormioEditorTab = 'builder' | 'json' | 'renderer';

export interface FormioEditorBuilderOptions {
  hideDisplaySelect?: boolean;
}

export interface FormioEditorJsonOptions {
  changePanelLocations?: ('top' | 'bottom')[];
  editor?: JsonEditorOptions;
}

export interface FormioEditorOptions {
  tab?: FormioEditorTab;
  tabs?: FormioEditorTab[];
  builder?: FormioEditorBuilderOptions;
  json?: FormioEditorJsonOptions;
}
