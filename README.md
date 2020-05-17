# Angular Form.io Editor Component

[![npm version](https://badge.fury.io/js/%40davebaol%2Fangular-formio-editor.svg)](https://badge.fury.io/js/%40davebaol%2Fangular-formio-editor) [![Build Status](https://travis-ci.com/davebaol/angular-formio-editor.svg?branch=master)](https://travis-ci.com/davebaol/angular-formio-editor) [![dependencies Status](https://david-dm.org/davebaol/angular-formio-editor/status.svg)](https://david-dm.org/davebaol/angular-formio-editor) [![devDependencies Status](https://david-dm.org/davebaol/angular-formio-editor/dev-status.svg)](https://david-dm.org/davebaol/angular-formio-editor?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This Angular component provides [Form.io](https://www.form.io/) builder and renderer integrated with json editor. 

It works with latest Angular 9.

## Try the [Live Demo](https://davebaol.github.io/angular-formio-editor/)

In case the live demo goes down for whatever reason, the component is supposed to look somewhat like this (click any image to enlarge it):
<table>
<tr>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509000-d8d34500-9307-11ea-8d0d-a7cf2da5c7c0.png"><img src="https://user-images.githubusercontent.com/2366334/81509000-d8d34500-9307-11ea-8d0d-a7cf2da5c7c0.png" alt="formio-editor-builder"/></a></td>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509005-e5f03400-9307-11ea-9c26-61b027f4062d.png"><img src="https://user-images.githubusercontent.com/2366334/81509005-e5f03400-9307-11ea-9c26-61b027f4062d.png" alt="formio-editor-json-code"/></a></td>
</tr>
<tr>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509007-e983bb00-9307-11ea-864f-3a0cdbe8192c.png"><img src="https://user-images.githubusercontent.com/2366334/81509007-e983bb00-9307-11ea-864f-3a0cdbe8192c.png" alt="formio-editor-json-tree"/></a></td>
    <td><a target="_blank" href="https://user-images.githubusercontent.com/2366334/81509008-edafd880-9307-11ea-8485-ee82ac05e248.png"><img src="https://user-images.githubusercontent.com/2366334/81509008-edafd880-9307-11ea-8485-ee82ac05e248.png" alt="formio-editor-renderer"/></a></td>
</tr>
</table>

## Installation

To install this library with npm, run below command:
```
$ npm install --save ang-jsoneditor angular-formio bootstrap font-awesome jquery jsoneditor @angular/elements @davebaol/formio-editor
```

Example:

```html
<formio-editor [form]="form" [jsonEditorOptions]="jsonEditorOptions"></formio-editor>
```

## Usage

To use this component in your Angular application follow the steps below:

:one: Import Angular module `FormioEditorModule` as below:

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
:two: Setup your component models as below:

```ts
import { Component } from '@angular/core';
import { JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-root',
  template: `
    <div class="content" role="main">
      <div class="col-10 m-4">
        <formio-editor [form]="form" [jsonEditorOptions]="jsonEditorOptions"></formio-editor>
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
    this.form = {
      display: 'form',
      components: []
    };
  }
}
```
:three: Add scripts below to your angular.json
```json
 "scripts": [
              "./node_modules/jquery/dist/jquery.min.js",
              "./node_modules/bootstrap/dist/js/bootstrap.js"
            ] 
```
:four: For better styling, add the lines below to your main style.css file
```css
@import "~jsoneditor/dist/jsoneditor.min.css";
@import "~bootstrap/dist/css/bootstrap.css";
@import "~font-awesome/css/font-awesome.css";
```

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

