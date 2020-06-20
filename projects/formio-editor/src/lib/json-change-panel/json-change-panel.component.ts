import { Component, Input, Output, EventEmitter} from '@angular/core';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'json-change-panel',
  templateUrl: './json-change-panel.component.html'
})
export class JsonChangePanelComponent  {
  @Input() applyDisabled: boolean;
  @Input() alertOpen: boolean;
  @Output() apply = new EventEmitter<any>();
  @Output() discard = new EventEmitter<any>();

  constructor() {
  }
}
