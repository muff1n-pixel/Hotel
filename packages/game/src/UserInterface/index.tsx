import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';
import InterfaceInstance from './Components/InterfaceInstance';

import "./Styles/fonts.css";
import "./Styles/index.css";
import "./Styles/spritesheet.css";
import "./Styles/spritesheet.png";

export default class UserInterfaceInstance {
  private root: Root;

  constructor(private readonly element: HTMLElement) {
    this.root = createRoot(this.element);
  }

  render() {
    this.root.render(
      <StrictMode>
        <div style={{
          position: "fixed",
          
          left: 0,
          top: 0,

          width: "100%",
          height: "100%",

          pointerEvents: "none",

          color: "white"
        }}>
          <InterfaceInstance/>
        </div>
      </StrictMode>
    );
  }

  destroy() {
    this.root.unmount();
  }
}
