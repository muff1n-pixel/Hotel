import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import InterfaceInstance from './components/InterfaceInstance';

import "./styles/fonts.css";
import "./styles/index.css";
import "./styles/spritesheet.css";
import "./styles/spritesheet.png";

export default class UserInterfaceInstance {
  constructor(private readonly element: HTMLElement) {

  }

  render() {
    const root = createRoot(this.element);

    root.render(
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
}
