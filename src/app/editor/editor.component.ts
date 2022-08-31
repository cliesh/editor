import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ipcRenderer } from "electron";
import * as fs from "fs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { SweetAlertResult } from "sweetalert2";
import { AlertService } from "../core/alert.service";
import { EventService } from "../core/event.service";
import { UtilsService } from "../core/utils.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements OnInit {
  @ViewChild("editor", { read: ElementRef, static: true })
  editorElement!: ElementRef<HTMLElement>;
  editorInstance!: monaco.editor.IStandaloneCodeEditor;
  filePath!: string;
  fileContentChanged = false;

  constructor(utilsService: UtilsService, private eventService: EventService, private alertService: AlertService) {
    this.filePath = utilsService.filePath;
    // observe tool bar events
    this.eventService.eventObservable.subscribe((event) => {
      switch (event) {
        case "RELOAD_FROM_DISK":
          this.reloadFileFromDisk();
          break;
        case "SAVE_TO_DISK":
          this.saveFileToDisk();
          break;
      }
    });
    // blocking window closing when unsaved changes
    window.onbeforeunload = (event) => {
      if (this.fileContentChanged) {
        this.alertService.saveChanges().then((result: SweetAlertResult) => {
          if (result.isConfirmed) this.saveFileToDisk();
          // if clicked is not cancel button,then close the window
          if (!result.isDismissed) {
            this.fileContentChanged = false;
            ipcRenderer.invoke("window", "close");
          }
        });
        event.returnValue = false;
      }
    };
  }

  ngOnInit() {
    this.editorInitialized();
    // editor content changed
    this.editorInstance.onDidChangeModelContent(() => {
      this.fileContentChanged = true;
    });
    this.editorInstance.addCommand(monaco.KeyCode.Ctrl | monaco.KeyCode.KeyS, this.saveFileToDisk);
    this.editorInstance.addCommand(monaco.KeyCode.Ctrl | monaco.KeyCode.Space, () => alert("Gotcha"));
  }

  editorInitialized() {
    this.editorInstance = monaco.editor.create(this.editorElement.nativeElement, {
      value: fs.readFileSync(this.filePath, "utf8"),
      language: "yaml",
      theme: "vs-dark",
      wordWrap: "off",
      automaticLayout: true,
      scrollbar: {
        useShadows: false,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        vertical: "visible",
        horizontal: "visible",
        verticalScrollbarSize: 17,
        horizontalScrollbarSize: 17,
        arrowSize: 30
      },
      minimap: {
        enabled: true
      }
    });
  }

  reloadFileFromDisk() {
    const fileContent = fs.readFileSync(this.filePath, "utf8");
    this.editorInstance.setValue(fileContent);
    this.fileContentChanged = false;
    this.alertService.info("File reloaded from disk");
  }

  saveFileToDisk() {
    const fileContent = this.editorInstance.getValue();
    fs.writeFileSync(this.filePath, fileContent);
    this.fileContentChanged = false;
    this.alertService.success("File saved successfully");
  }

  ngOnDestroy() {
    this.editorInstance.dispose();
  }
}
