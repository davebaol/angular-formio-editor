import { JsonEditorOptions } from './json-editor/json-editor-shapes';

export type FormioEditorTab = 'builder' | 'json' | 'renderer';

export interface FormioEditorBuilderOptions {
  hideDisplaySelect?: boolean;
}

export interface FormioEditorJsonOptions extends JsonEditorOptions {
  changePanelLocations?: ('top' | 'bottom')[];
}

export interface FormioEditorOptions {
  tab?: FormioEditorTab;
  tabs?: FormioEditorTab[];
  builder?: FormioEditorBuilderOptions;
  json?: FormioEditorJsonOptions;
}
