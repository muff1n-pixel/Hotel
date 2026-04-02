import { FigureConfigurationData, UserFigureData } from "@pixel63/events";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import useUserFigures from "@UserInterface/Components/Wardrobe/Hooks/useUserFigures";
import { useCallback } from "react";
import { webSocketClient } from "src";

export type WardrobeFiguresProps = {
    figureConfiguration: FigureConfigurationData;
    onFigureChange: (figureConfiguration: FigureConfigurationData) => void;
}

export default function WardrobeFigures({ figureConfiguration, onFigureChange }: WardrobeFiguresProps) {
    const figures = useUserFigures();

    const handleStore = useCallback((index: number) => {
        webSocketClient.sendProtobuff(UserFigureData, UserFigureData.create({
            index,
            figureConfiguration
        }));
    }, [ figureConfiguration ]);

    const handleEquip = useCallback((figureConfiguration?: FigureConfigurationData) => {
        if(!figureConfiguration) {
            return;
        }

        onFigureChange(figureConfiguration);
    }, [onFigureChange]);

    return (
        <FlexLayout align="center" justify="center" style={{
            width: 166 - 10,

            boxSizing: "border-box",
            borderLeft: "1px solid #CECECE"
        }}>
            <b style={{ color: "#878682" }}>My wardrobe</b>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",

                justifyItems: "center",

                gap: 9,

                padding: 7,

                border: "1px solid #000000",
                borderRadius: 6,

                background: "#CACACA"
            }}>
                {figures.map((figure, index) => (
                    <FlexLayout key={index} direction="row">
                        <FlexLayout direction="column" align="center" justify="space-evenly" gap={2}>
                            <div className="sprite_forms_arrow" style={{
                                transform: "rotateZ(-90deg)",

                                cursor: "pointer"
                            }} onClick={() => handleStore(index)}/>

                            <div className="sprite_forms_arrow" style={{
                                transform: "rotateZ(90deg)",

                                cursor: "pointer"
                            }} onClick={() => handleEquip(figure?.figureConfiguration)}/>
                        </FlexLayout>

                        <FlexLayout align="center" justify="center" style={{
                            width: 24,
                            height: 50,
                            
                            background: "#ABABAB",
                            borderRadius: 6
                        }}>
                            {(figure) && (
                                <FigureImage figureConfiguration={figure.figureConfiguration} direction={4} scale={0.5}/>
                            )}
                        </FlexLayout> 
                    </FlexLayout>
                ))}
            </div>
        </FlexLayout>
    );
}