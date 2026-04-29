import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';

import "../UserInterface/Styles/fonts.css";
import "./styles/spritesheet.css";
import "./styles/spritesheet.png";
import Loader from './components2/Loader';

export default class LoaderInstance {
  private readonly root: Root;

  constructor(private readonly element: HTMLElement) {
    this.root = createRoot(this.element);
  }

  render(text?: string) {
    this.root.render(
      <StrictMode>
        <div style={{
            position: "fixed",
            
            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            zIndex: 1000,

            background: "#0E151C",
            color: "white",

            display: "flex",
            flexDirection: "column",

            justifyContent: "center",
            alignItems: "center"
        }}>
            <Loader text={text}/>
        </div>
      </StrictMode>
    );
  }

  public hide() {
    this.root.unmount();
  }

  public destroy() {
    this.root.unmount();
  }
}
