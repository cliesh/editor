import { Component, OnInit } from '@angular/core';
import { platform } from "os";
import { ipcRenderer } from "electron";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  platform: string = platform();
  isMaximize = false;
  isAlwaysOnTop = false;

  constructor() { }

  ngOnInit(): void {
    // there is a delay
    ipcRenderer.on("window", (event, message) => {
      switch (message) {
        case "maximize":
          this.isMaximize = true;
          break;
        case "unmaximize":
          this.isMaximize = false;
          break;
        // case "pin":
        //   this.isAlwaysOnTop = true;
        //   break;
        // case "unpin":
        //   this.isAlwaysOnTop = false;
        //   break;
      }
    });
   }

  /**
   * set window to always on top
   */
   alwaysOnTop(): void {
    ipcRenderer.invoke("window", "pin");
    this.isAlwaysOnTop = !this.isAlwaysOnTop;
  }

  minimize(): void {
    ipcRenderer.invoke("window", "minimize");
  }

  maximize(): void {
    ipcRenderer.invoke("window", "maximize");
  }

  unmaximize(): void {
    ipcRenderer.invoke("window", "unmaximize");
  }

  exit(): void {
    ipcRenderer.invoke("window", "close");
  }

}
