
export type JsonEditorMode = 'code' | 'form' | 'text' | 'tree' | 'view' | 'preview';

export type JsonEditorNodePath = (string | number)[];

export interface JsonEditorTreeNode {
  field: string;
  path: JsonEditorNodePath;
  value?: string;
}

export interface JsonEditorError {
  path: JsonEditorNodePath;
  message: string;
}

export type JsonEditorValidationError = JsonEditorSchemaValidationError | JsonEditorParseError | JsonEditorCustomValidationError;

export interface JsonEditorSchemaValidationError {
  type: 'validation';
  data: any;
  dataPath: string;
  keyword: string;
  message: string;
  params: object;
  parentSchema: object;
  schema: object;
  schemaPath: string;
}

export interface JsonEditorParseError {
  type: 'error';
  message: string;
  line: number;
}

export interface JsonEditorCustomValidationError {
  type: 'customValidation';
  message: string;
  dataPath: string;
}

export interface JsonEditorTextPosition {
  row: number;
  column: number;
}

export interface JsonEditorTextSelection {
  start: JsonEditorTextPosition;
  end: JsonEditorTextPosition;
  text: string;
}

export interface JsonEditorSerializableNode {
  value: any;
  path: JsonEditorNodePath;
}

export interface JsonEditorSelection {
  start: JsonEditorSerializableNode;
  end: JsonEditorSerializableNode;
}

export interface JsonEditorEvent {
  type: string;
  target: HTMLElement;
}

export interface JsonEditorMenuItem {
  text?: string;
  title?: string;
  className?: string;
  click?: () => void;
  submenu?: JsonEditorMenuItem[];
  submenuTitle?: string;
  type?: 'separator';
}

export interface JsonEditorMenuNode {
  type: 'single' | 'multiple' | 'append';
  path: JsonEditorNodePath;
  paths: JsonEditorNodePath[];
}

export interface JsonEditorQueryOptions {
  filter?: {
    field: string | '@'
    relation: '==' | '!=' | '<' | '<=' | '>' | '>='
    value: string
  };
  sort?: {
    field: string | '@'
    direction: 'asc' | 'desc'
  };
  projection?: {
    fields: string[]
  };
}

interface JsonEditorAdditionalOptions {
  expandAll?: boolean;
}

/**
 * Interface for the native options of jsoneditor. For the documentation see
 * https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options
 */
interface JsonEditorNativeOptions {
  ace?: object;
  ajv?: object;
  onChange?: () => void;
  onChangeJSON?: (json: JSON) => void;
  onChangeText?: (json: string) => void;
  onClassName?: (node: JsonEditorTreeNode) => string | undefined;
  onEditable?: (node: JsonEditorTreeNode) => boolean | { field: boolean, value: boolean };
  onError?: (error: Error) => void;
  onModeChange?: (newMode: JsonEditorMode, oldMode: JsonEditorMode) => void;
  onNodeName?: (node: { path: JsonEditorNodePath, type: 'object' | 'array', size: number }) => string | undefined;
  onValidate?: (json: object) => JsonEditorError[] | null | Promise<JsonEditorError[]>;
  onValidationError?: (errors: JsonEditorValidationError[]) => void;
  onCreateMenu?: (items: JsonEditorMenuItem[], node: JsonEditorMenuNode) => JsonEditorMenuItem[];
  onSelectionChange?: (start: JsonEditorSerializableNode, end: JsonEditorSerializableNode) => void;
  onTextSelectionChange?: (start: JsonEditorTextPosition, end: JsonEditorTextPosition, text: string) => void;
  onEvent?: (node: JsonEditorTreeNode, event: Event) => void;
  onFocus?: (event: JsonEditorEvent) => void;
  onBlur?: (event: JsonEditorEvent) => void;
  enableSort?: boolean;
  enableTransform?: boolean;
  escapeUnicode?: boolean;
  history?: boolean;
  indentation?: number;
  limitDragging?: boolean;
  mode?: JsonEditorMode;
  modes?: JsonEditorMode[];
  name?: string;
  schema?: object;
  schemaRefs?: object;
  search?: boolean;
  sortObjectKeys?: boolean;
  templates?: object[];
  theme?: string;
  language?: string;
  languages?: object;
  autocomplete?: object;
  mainMenuBar?: boolean;
  navigationBar?: boolean;
  statusBar?: boolean;
  colorPicker?: boolean;
  onColorPicker?: (parent: HTMLElement, color: any, onChange: (color: any) => void) => void;
  timestampTag?: boolean | ((node: JsonEditorTreeNode) => boolean);
  timestampFormat?: (node: JsonEditorTreeNode) => string | null;
  modalAnchor?: HTMLElement;
  popupAnchor?: HTMLElement;
  maxVisibleChilds?: number;
  createQuery?: (json: JSON, queryOptions: JsonEditorQueryOptions) => string;
  executeQuery?: (json: JSON, query: string) => JSON;
  queryDescription?: string;
}

export type JsonEditorOptions = JsonEditorNativeOptions & JsonEditorAdditionalOptions;

// See https://stackoverflow.com/a/54308812
type KeysEnum<T> = { [P in keyof Required<T>]: true };

export const jsonEditorAdditionalOptions: string[] = (() => {
  const kObj: KeysEnum<JsonEditorAdditionalOptions> = {
    expandAll: true,
  };
  return Object.keys(kObj);
})();

export const jsonEditorNativeOptions: string[] = (() => {
  const kObj: KeysEnum<JsonEditorNativeOptions> = {
    ace: true,
    ajv: true,
    onChange: true,
    onChangeJSON: true,
    onChangeText: true,
    onClassName: true,
    onEditable: true,
    onError: true,
    onModeChange: true,
    onNodeName: true,
    onValidate: true,
    onValidationError: true,
    onCreateMenu: true,
    onSelectionChange: true,
    onTextSelectionChange: true,
    onEvent: true,
    onFocus: true,
    onBlur: true,
    enableSort: true,
    enableTransform: true,
    escapeUnicode: true,
    history: true,
    indentation: true,
    limitDragging: true,
    mode: true,
    modes: true,
    name: true,
    schema: true,
    schemaRefs: true,
    search: true,
    sortObjectKeys: true,
    templates: true,
    theme: true,
    language: true,
    languages: true,
    autocomplete: true,
    mainMenuBar: true,
    navigationBar: true,
    statusBar: true,
    colorPicker: true,
    onColorPicker: true,
    timestampTag: true,
    timestampFormat: true,
    modalAnchor: true,
    popupAnchor: true,
    maxVisibleChilds: true,
    createQuery: true,
    executeQuery: true,
    queryDescription: true
  };
  return Object.keys(kObj);
})();
