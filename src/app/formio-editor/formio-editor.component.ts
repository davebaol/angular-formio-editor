import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {PrismService} from '../prism.service';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

@Component({
  selector: 'app-formio-editor',
  templateUrl: './formio-editor.component.html',
  styleUrls: ['./formio-editor.component.css']
})
export class FormioEditorComponent implements AfterViewInit, OnInit {
  public form: any;
  public jsonEditorOptions: JsonEditorOptions;
  rendererTriggerRefresh: any;

  @ViewChild('jsoneditor', {static: true}) editor: JsonEditorComponent;

  constructor(public prism: PrismService) {
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
    this.jsonEditorOptions.modes = ['code', 'text', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log(error);
  }

  onChangeType(event) {
    console.log('onchange type', event);
    this.form = Object.assign({}, this.form);
    this.refreshJsonEditor();
    this.refreshRenderer();
  }

  onChangeBuilder(event) {
    console.log('onchange builder', event);
    if (event.type === 'saveComponent' || event.type === 'deleteComponent') {
      this.form = event.form;
      this.refreshJsonEditor();
      this.refreshRenderer();
    }
  }

  onChangeJsonEditor(event) {
    console.log('onchange editor', event, this.editor.get(), this.form);
    if (event instanceof  Event) {
      this.form = this.editor.get();
      this.refreshRenderer();
    }
  }

  ngAfterViewInit() {
    this.prism.init();
    this.refreshJsonEditor();
  }

  ngOnInit(): void {
    this.rendererTriggerRefresh = new EventEmitter();
  }

  refreshJsonEditor() {
    this.editor.set(this.form);
  }

  refreshRenderer() {
    this.rendererTriggerRefresh.emit({
      property: 'form',
      value: this.form
    });
  }
}

