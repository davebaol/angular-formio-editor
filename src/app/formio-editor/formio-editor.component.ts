import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

@Component({
  selector: 'formio-editor',
  templateUrl: './formio-editor.component.html',
  styleUrls: ['./formio-editor.component.css']
})
export class FormioEditorComponent implements AfterViewInit, OnInit {
  public form: any;
  public jsonEditorOptions: JsonEditorOptions;
  jsonEditorChanged = false;
  rendererTriggerRefresh: any;

  @ViewChild('jsoneditor', {static: true}) editor: JsonEditorComponent;

  constructor() {
    this.form = {
      display: 'wizard',
      components: [
        {
          label: 'Panel',
          title: 'Page 1',
          breadcrumbClickable: true,
          buttonSettings: {
            previous: true,
            cancel: true,
            next: true
          },
          collapsible: false,
          mask: false,
          tableView: false,
          alwaysEnabled: false,
          type: 'panel',
          input: false,
          key: 'panel2',
          conditional: {
            show: '',
            when: '',
            json: ''
          },
          components: [
            {
              type: 'textfield',
              label: 'FirstName',
              key: 'firstName',
              input: true,
              tableView: true
            },
            {
              type: 'textfield',
              label: 'LastName',
              key: 'lastName',
              input: true,
              tableView: true
            }
          ],
          collapsed: false,
          reorder: false,
          properties: {},
          customConditional: '',
          nextPage: '',
          logic: [],
          attributes: {}
        },
        {
          type: 'button',
          action: 'Submit',
          label: 'Submit',
          theme: 'primary',
          input: true,
          key: 'submit',
          tableView: true
        }
      ]
    };

    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.modes = ['code', 'tree', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log("jsonEditorOptions.onError: ", error);
  }

  ngOnInit(): void {
    this.rendererTriggerRefresh = new EventEmitter();
  }

  ngAfterViewInit() {
    this.refreshJsonEditor();
  }

  //
  // Form.io Builder
  //

  onBuilderDiplayChange(event) {
    this.form = Object.assign({}, this.form);
    this.refreshJsonEditor();
    this.refreshRenderer();
  }

  onBuilderChange(event) {
    this.refreshJsonEditor();
    this.refreshRenderer();
  }

  //
  // JSON Editor
  //

  onJsonEditorChange(event) {
    this.jsonEditorChanged = true;
  }

  jsonEditorApplyChanges() {
    this.jsonEditorChanged = false;
    this.form = this.editor.get();
    this.refreshRenderer();
  }

  jsonEditorDiscardChanges() {
    this.refreshJsonEditor();
    this.refreshRenderer();
  }

  refreshJsonEditor() {
    // Here we use update instead of set to preserve the editor status
    this.editor.update(this.form);
    this.jsonEditorChanged = false;
  }

  //
  // Form.io Renderer
  //

  refreshRenderer() {
    this.rendererTriggerRefresh.emit({
      property: 'form',
      value: this.form
    });
  }
}

