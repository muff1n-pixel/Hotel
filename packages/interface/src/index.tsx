import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import InterfaceInstance from './components/InterfaceInstance';
import { TypedEventTarget } from './contexts/AppContext';

import "./styles/fonts.css";
import "./styles/index.css";
import "./styles/spritesheet.css";
import "./styles/spritesheet.png";

(window as any).createInterfaceInstance = function createInterfaceInstance(element: HTMLElement, internalEventTarget: TypedEventTarget) {
  const root = createRoot(element);

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
        <InterfaceInstance internalEventTarget={internalEventTarget}/>
      </div>
    </StrictMode>
  );
}
