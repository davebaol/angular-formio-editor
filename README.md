# Angular Form.io Editor Component

This Angular component provides [Form.io](https://www.form.io/) builder and renderer integrated with json editor. 

It works with latest Angular 9.

The component is supposed to look somewhat like this (click any image to enlarge it):
<table>
<tr>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509000-d8d34500-9307-11ea-8d0d-a7cf2da5c7c0.png"><img src="https://user-images.githubusercontent.com/2366334/81509000-d8d34500-9307-11ea-8d0d-a7cf2da5c7c0.png" alt="formio-editor-builder"></img></a></td>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509005-e5f03400-9307-11ea-9c26-61b027f4062d.png"><img src="https://user-images.githubusercontent.com/2366334/81509005-e5f03400-9307-11ea-9c26-61b027f4062d.png" alt="formio-editor-json-code"></img></a></td>
</tr>
<tr>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509007-e983bb00-9307-11ea-864f-3a0cdbe8192c.png"><img src="https://user-images.githubusercontent.com/2366334/81509007-e983bb00-9307-11ea-864f-3a0cdbe8192c.png" alt="formio-editor-json-tree"></img></a></td>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509008-edafd880-9307-11ea-8485-ee82ac05e248.png"><img src="https://user-images.githubusercontent.com/2366334/81509008-edafd880-9307-11ea-8485-ee82ac05e248.png" alt="formio-editor-renderer"></img></a></td>
</tr>
</table>

## Installation

To install this library with npm, run below command:
```
$ npm install --save jsoneditor ang-jsoneditor @davebaol/formio-editor
```

Example:

```html
<davebaol-formio-editor [form]="form" [jsonEditorOptions]="jsonEditorOptions"></davebaol-formio-editor>
```

## Usage

### Configuration

First, import Angular module `FormioEditorModule` as below:

```ts
import { FormioEditorModule } from '@davebaol/formio-editor'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ....,
    FormioEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
Then setup your component models as below:

```ts
import { Component } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';
import form from './my-form.json';

@Component({
  selector: 'app-root',
  template: `
    <div class="content" role="main">
      <div class="col-10 m-4">
        <davebaol-formio-editor [form]="form" [jsonEditorOptions]="jsonEditorOptions"></davebaol-formio-editor>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: any;
  jsonEditorOptions: JsonEditorOptions;

  constructor() {
    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.modes = ['code', 'tree', 'view']; // set allowed modes
    this.jsonEditorOptions.mode = 'view'; // set default mode
    this.jsonEditorOptions.onError = (error) => console.log('jsonEditorOptions.onError:', error);
    this.form = form;
  }
}
```
Note: For better styling, add the line below to your main style.css file

```js
@import "~jsoneditor/dist/jsoneditor.min.css";
```

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

