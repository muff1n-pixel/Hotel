import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';

import "../UserInterface/styles/fonts.css";
import "./styles/spritesheet.css";
import "./styles/spritesheet.png";

export default class LoaderInstance {
  private readonly root: Root;

  constructor(private readonly element: HTMLElement) {
    this.root = createRoot(this.element);
  }

  render(text?: string) {
    const images = Array(30).fill(null).map((_, index) => `./assets/loader/image${index + 1}.png`);
    const randomImage = images[Math.floor(Math.random() * images.length)];

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
            <div style={{
                position: "relative"
            }}>
                <div className="sprite_splash-background"/>

                <img src={randomImage} style={{
                    position: "absolute",
                    
                    left: 95,
                    top: 51
                }}/>

                <div className="sprite_splash-overlay" style={{
                    position: "absolute",
                    
                    left: 0,
                    top: 0
                }}/>

            </div>

            <h1>{(text)?(text):("Loading...")}</h1>
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
