import { useEffect, useRef, useState } from "react";
import Skeleton from '../../Images/community/habbo_skeleton.gif';

// TODO: add type declarations
//@ts-expect-error
import { FigureAssets, Figure } from "@pixel63/game";

type UserProps = {
    name?: string | null;
    motto?: string | null;
    figureConfiguration?: string | null;
}

const CommunityUser = ({ name = null, motto = null, figureConfiguration = null }: UserProps) => {
    const figureCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (figureConfiguration && figureCanvasRef.current) {
            FigureAssets.loadAssets().then(() => {
                const figure = new Figure(figureConfiguration, 4);

                figure.renderToCanvas(new Figure(), 0, false).then(({ figure }: any) => {
                    const context = figureCanvasRef.current?.getContext("2d");

                    if(!context) {
                        throw new Error();
                    }

                    context.canvas.width = figure.image.width;
                    context.canvas.height = figure.image.height;

                    context.drawImage(figure.image, 0, 0);
                });
            });
        }
    }, [figureConfiguration, figureCanvasRef]);

    return (
        <div className='row' style={(figureConfiguration)?({ position: "relative", background: "none" }):(undefined)}>
            <canvas ref={figureCanvasRef} style={{
                position: "absolute",

                left: -90,
                top: -60
            }}/>

            {name &&
                <div className='info'>
                    <div className='username'>{name}</div>
                    <div className='motto'>{motto}</div>
                </div>
            }
        </div>
    )
}

export default CommunityUser;