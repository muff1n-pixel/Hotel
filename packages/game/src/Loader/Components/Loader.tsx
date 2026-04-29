import { Fragment } from "react/jsx-runtime";

export type LoaderProps = {
    text?: string;
};

export default function Loader({ text }: LoaderProps) {
    const images = Array(30).fill(null).map((_, index) => `./assets/loader/image${index + 1}.png`);
    const randomImage = images[Math.floor(Math.random() * images.length)];

    return (
        <Fragment>
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
        </Fragment>
    );
}
