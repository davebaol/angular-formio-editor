import { JsonEditorOptions as OriginalJsonEditorOptions } from 'ang-jsoneditor';
import { loose as formioJsonSchema } from './formio-json-schema';


// export * from 'ang-jsoneditor';
export type FormioEditorTab = 'builder' | 'json' | 'renderer';

export interface FormioEditorOptions {
  builder?: BuilderOptions;
  json?: JsonEditorOptions;
}

export interface BuilderOptions {
  hideDisplaySelect?: boolean;
}

// Unfortunately JsonEditorOptions from package ang-jsoneditor 1.9.4 doesn't
// support options 'schemaRefs' and 'onValidationError' used by jsoneditor 8.6.7.
// See https://github.com/mariohmol/ang-jsoneditor/issues/66
export class JsonEditorOptions extends OriginalJsonEditorOptions {
  schemaRefs: object;
  onValidationError: (errors: any[]) => void;

  constructor() {
    super();
    this.modes = ['code', 'tree', 'view']; // set allowed modes
    this.mode = 'view'; // set default mode
    this.onError = (error) => console.log('jsonEditorOptions.onError: ', error);
    this.schema = formioJsonSchema.schema;
    this.schemaRefs = formioJsonSchema.schemaRefs;
  }
}
