import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import InterfaceInstance from './components/InterfaceInstance';

import "./styles/fonts.css";
import "./styles/index.css";
import { InternalEventTargetContext } from './app/InternalEventTargetContext';

(window as any).createInterfaceInstance = function createInterfaceInstance(element: HTMLElement, internalEventTarget: EventTarget) {
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
        <InternalEventTargetContext value={internalEventTarget}>
          <InterfaceInstance/>
        </InternalEventTargetContext>
      </div>
    </StrictMode>
  );
}
