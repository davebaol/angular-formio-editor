
export type JsonEditorMode = 'tree' | 'view' | 'form' | 'code' | 'text';

export interface JsonEditorTreeNode {
  field: string;
  path: string[];
  value?: string;
}

export interface JsonEditorError {
  path: (string | number)[];
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

export interface JsonEditorSerializableNode {
  value: any;
  path: (string | number)[];
}

export interface JsonEditorEvent {
  type: string;
  target: HTMLElement;
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

/**
 * Interface for the options of jsoneditor. For the documentation see
 * https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options
 */
export interface JsonEditorOptions {

  ace?: object;
  ajv?: object;
  onChange?: () => void;
  onChangeJSON?: (json: JSON) => void;
  onChangeText?: (json: string) => void;
  onClassName?: (node: JsonEditorTreeNode) => string | undefined;
  onEditable?: (node: JsonEditorTreeNode) => boolean | { field: boolean, value: boolean };
  onError?: (error: Error) => void;
  onModeChange?: (newMode: JsonEditorMode, oldMode: JsonEditorMode) => void;
  onNodeName?: (node: { path: string[], type: 'object' | 'array', size: number}) => string | undefined;
  onValidate?: (json: object) => JsonEditorError[] | null | Promise<JsonEditorError[]>;
  onValidationError?: (errors: JsonEditorValidationError[]) => void;
  onCreateMenu?: (items: object[], ) => object[];
  onSelectionChange?: (start: JsonEditorSerializableNode, end: JsonEditorSerializableNode) => void;
  onTextSelectionChange?: (start: JsonEditorTextPosition, end: JsonEditorTextPosition, text: string) => void;
  onEvent?: (node: JsonEditorTreeNode, event: Event) => void;
  onFocus?: (event: JsonEditorEvent) => void;
  onBlur?: (event: JsonEditorEvent) => void;
  enableSort?: boolean;
  enableTransform?: boolean;
  escapeUnicode?: boolean;
  expandAll?: boolean;
  sortObjectKeys?: boolean;
  history?: boolean;
  mode?: JsonEditorMode;
  modes?: JsonEditorMode[];
  name?: string;
  schema?: object;
  schemaRefs?: object;
  search?: boolean;
  indentation?: number;
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
