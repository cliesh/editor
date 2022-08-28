import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { setDiagnosticsOptions } from 'monaco-yaml';

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

    const modelUri = monaco.Uri.parse('a://b/foo.yaml');

    setDiagnosticsOptions({
      enableSchemaRequest: true,
      hover: true,
      completion: true,
      validate: true,
      format: true,

      schemas: [
        {
          // Id of the first schema
          uri: 'http://myserver/foo-schema.json',
          // Associate with our model
          fileMatch: [String(modelUri)],
          schema: {
            type: 'object',
            properties: {
              p1: {
                enum: ['v1', 'v2'],
              },
              p2: {
                // Reference the second schema
                $ref: 'http://myserver/bar-schema.json',
              },
            },
          },
        },
        {
          // Id of the first schema
          uri: 'http://myserver/bar-schema.json',
          fileMatch: [String(modelUri)],
          schema: {
            type: 'object',
            properties: {
              q1: {
                enum: ['x1', 'x2'],
              },
            },
          },
        },
      ],
    });



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
      // theme: 'vs-dark',
      theme: 'vs',
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

  // ngOnInit() {


  //   const modelUri = monaco.Uri.parse('a://b/foo.yaml');

  //   setDiagnosticsOptions({
  //     enableSchemaRequest: true,
  //     hover: true,
  //     completion: true,
  //     validate: true,
  //     format: true,

  //     schemas: [
  //       {
  //         // Id of the first schema
  //         uri: 'http://myserver/foo-schema.json',
  //         // Associate with our model
  //         fileMatch: [String(modelUri)],
  //         schema: {
  //           type: 'object',
  //           properties: {
  //             p1: {
  //               enum: ['v1', 'v2'],
  //             },
  //             p2: {
  //               // Reference the second schema
  //               $ref: 'http://myserver/bar-schema.json',
  //             },
  //           },
  //         },
  //       },
  //       {
  //         // Id of the first schema
  //         uri: 'http://myserver/bar-schema.json',
  //         fileMatch: [String(modelUri)],
  //         schema: {
  //           type: 'object',
  //           properties: {
  //             q1: {
  //               enum: ['x1', 'x2'],
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   });


  //   this.editorInstance = monaco.editor.create(this.editor.nativeElement, {
  //     value: "p1: \n",
  //     language: 'yaml',
  //     wordWrap: 'off',
  //     automaticLayout: true,
  //     scrollbar: {
  //       useShadows: false,
  //       verticalHasArrows: true,
  //       horizontalHasArrows: true,
  //       vertical: 'visible',
  //       horizontal: 'visible',
  //       verticalScrollbarSize: 17,
  //       horizontalScrollbarSize: 17,
  //       arrowSize: 30
  //     },
  //     minimap: {
  //       enabled: true
  //     }
  //   });
  //   // this.editorInstance = monaco.editor.create(this.editor.nativeElement, {
  //   //   // Monaco-yaml features should just work if the editor language is set to 'yaml'.
  //   //   language: 'yaml',
  //   //   model: monaco.editor.createModel('p1: \n', 'yaml', modelUri),
  //   // });
  // }

  ngOnDestroy() {
    if (this.editorInstance) {
      this.editorInstance.dispose();
    }
  }

}
