import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {PrismService} from '../prism.service';

@Component({
  selector: 'app-formio-editor',
  templateUrl: './formio-editor.component.html',
  styleUrls: ['./formio-editor.component.css']
})
export class FormioEditorComponent implements AfterViewInit, OnInit {
  @ViewChild('json', {static: true}) jsonElement?: ElementRef;
  @ViewChild('code', {static: true}) codeElement?: ElementRef;
  public form: any;
  public formJson: string;
  triggerRefresh: any;
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
  }

  onChangeType(event){
    this.form = Object.assign({}, this.form);
    this.refreshJson();
    this.refreshRender();
  }
  onChange(event) {
    this.form  = event.form;
    this.refreshJson();
    this.refreshRender();
  }

  ngAfterViewInit() {
    this.prism.init();
  }

  ngOnInit(): void {
    this.triggerRefresh = new EventEmitter();
    this.refreshJson();
  }

  refreshJson() {
    this.formJson = JSON.stringify(this.form, null, 4);
    this.jsonElement.nativeElement.innerHTML = '';
    this.jsonElement.nativeElement.appendChild(document.createTextNode(this.formJson));
  }

  refreshRender() {
    this.triggerRefresh.emit({
      property: 'form',
      value: this.form
    });
  }
}

