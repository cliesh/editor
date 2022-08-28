import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('editor', { read: ElementRef, static: true })
  editor!: ElementRef<HTMLElement>;
  editorInstance!: monaco.editor.IStandaloneCodeEditor;

  constructor() { }

  ngOnInit() {
    this.editorInstance = monaco.editor.create(this.editor.nativeElement, {
      value: `
---  # yaml document beginning
# comment syntax

# basic syntax - key and value separated by colon and space before the value
key: value

# Scalar data types
integerValue: 1                     # integer value
floatingValue: 1                     # floating vale

stringValue: "456"                   # string with double quotes
stringValue: 'abc'                  # string with single quotes
stringValue: wer                   # string without quotes

booleanValue:true                   # boolean values - true or false


# Multiline string with literal block syntax -preserved new lines
string1: |
    Line1
    line2
    "line3"   
  line4

# Multiline strings with folded block syntax - new lines are not preserved, leading and trailing spaces are ignore
  string1: >
    Line1
    line2
    "line3"   
  line4
# Collection sequence data types
  # sequence arraylist example
  - One
  - two
  - Three

  # another way of sequence  syntax example
  [one, two , three]

### dictionary
  mysqldatabase:
    hostname: localhost
    port: 3012
    username: root
    password: root`,
      language: 'yaml',
      theme: 'vs-dark',
      wordWrap: 'off',
      automaticLayout: true,
      scrollbar: {
        useShadows: false,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 17,
        horizontalScrollbarSize: 17,
        arrowSize: 30
      },
      minimap: {
        enabled: true
      }
    });
  }
  
  ngOnDestroy() {
    this.editorInstance.dispose();
  }

}
