import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormioModule } from 'angular-formio';
import { FormioEditorModule } from '@davebaol/formio-editor';
import { FormsModule } from '@angular/forms';
import { NgJsonEditorModule } from 'ang-jsoneditor';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        FormioModule,
        FormioEditorModule,
        FormsModule,
        NgJsonEditorModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should use component formio-editor', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('formio-editor')).toBeTruthy();
  });
});
