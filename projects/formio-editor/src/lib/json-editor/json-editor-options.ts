
export type JsonEditorMode = 'tree' | 'view' | 'form' | 'code' | 'text';

export interface JsonEditorTreeNode {
  field: string;
  value: string;
  path: string[];
}

export interface IError {
  path: (string | number)[];
  message: string;
}

export interface JsonEditorOptions {

  ace?: any;
  ajv?: object;

  onValidationError?: (errors: any[]) => void;

  /**
   *  {function} onChange  Callback method, triggered on change of contents.
   *  Does not pass the contents itself. See also `onChangeJSON` and `onChangeText`.
   */
  onChange?: () => void;

  /**
   * {function} onChangeJSON  Callback method, triggered in modes on change of contents,
   * passing the changed contents as JSON. Only applicable for modes 'tree', 'view', and 'form'.
   */
  onChangeJSON?: () => void;

  onNodeName?: () => void;
  onCreateMenu?: () => void;
  onColorPicker?: () => void;

  /**
   *  {function} onChangeText  Callback method, triggered in modes on change of contents,
   *  passing the changed contents as stringified JSON.
   */
  onChangeText?: () => void;


  /**
   *  {function} onSelectionChange Callback method, triggered on node selection change.
   *  Only applicable for modes 'tree', 'view', and 'form'
   */
  onSelectionChange?: () => void;

  /**
   *  {function} onTextSelectionChange Callback method, triggered on text selection change
   *  Only applicable for modes 'text' and 'code'
   */
  onTextSelectionChange?: () => void;


  /**
   *  {function} onEvent Callback method, triggered when an event occurs in
   *  a JSON field or value. Only applicable for modes 'form', 'tree' and 'view'
   */
  onEvent?: () => void;

  /**
   *  {function} onFocus  Callback method, triggered when the editor comes into focus,
   *  passing an object {type, target}. Applicable for all modes
   */
  onFocus?: () => void;

  /**
   *  {function} onBlur  Callback method, triggered when the editor goes out of focus,
   *  passing an object {type, target}. Applicable for all modes
   */
  onBlur?: () => void;

  /**
   *  {function} onClassName  Callback method, triggered when a Node DOM is rendered.
   *  Function returns a css class name to be set on a node.
   *  Only applicable for modes 'form', 'tree' and 'view'
   */
  onClassName?: () => void;

  onEditable?: (node: JsonEditorTreeNode | {}) => boolean | { field: boolean, value: boolean };

  /**
   *   {function} onError   Callback method, triggered when an error occurs
   */
  onError?: (error: any) => void;

  onModeChange?: (newMode: JsonEditorMode, oldMode: JsonEditorMode) => void;
  onValidate?: (json: object) => IError[];
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
  template?: object;
  theme?: number;
  language?: string;
  languages?: object;

  /**
   * Adds main menu bar - Contains format, sort, transform, search etc. functionality. True
   * by default. Applicable in all types of mode.
   */
  mainMenuBar?: boolean;

  /**
   * Adds navigation bar to the menu - the navigation bar visualize the current position on
   * the tree structure as well as allows breadcrumbs navigation.
   * True by default.
   * Only applicable when mode is 'tree', 'form' or 'view'.
   */
  navigationBar?: boolean;

  /**
   * Adds status bar to the bottom of the editor - the status bar shows the cursor position
   * and a count of the selected characters.
   * True by default.
   * Only applicable when mode is 'code' or 'text'.
   */
  statusBar?: boolean;

}
