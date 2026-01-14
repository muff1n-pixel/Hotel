import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";
import ClientFigureDataRequest from "@shared/events/requests/ClientFigureDataRequest";
import ClientFigureDataResponse from "@shared/events/responses/ClientFigureDataResponse";
import OffscreenCanvasRender from "../../OffscreenCanvasRender";
import WardrobeAvatar from "../WardrobeAvatar";

import WardrobeSelectionItem from "./WardrobeSelectionItem";
import WardrobeSelectionColors from "./WardrobeSelectionColors";
import { FigureConfiguration, FigurePartKeyAbbreviation } from "@shared/Interfaces/figure/FigureConfiguration";

export type WardrobeSelectionProps = {
    part: FigurePartKeyAbbreviation;
    figureConfiguration: FigureConfiguration;

    onFigureConfigurationChange: (figureConfiguration: FigureConfiguration) => void;
};

export default function WardrobeSelection({ part, figureConfiguration, onFigureConfigurationChange }: WardrobeSelectionProps) {
    const { internalEventTarget } = useContext(AppContext);
    
    const requestedData = useRef(false);

    const [figureDataResponse, setFigureDataResponse] = useState<ClientFigureDataResponse>();

    useEffect(() => {
        if(requestedData.current) {
            return;
        }

        requestedData.current = true;

        const requestEvent = new ClientFigureDataRequest(part, "male", undefined);

        const listener = (event: ClientFigureDataResponse) => {
            if(event.id !== requestEvent.id) {
                return;
            }

            internalEventTarget.removeEventListener("ClientFigureDataResponse", listener);

            setFigureDataResponse(event);
        };

        internalEventTarget.addEventListener("ClientFigureDataResponse", listener);

        internalEventTarget.dispatchEvent(requestEvent);
    }, []);

    const activeConfiguration = figureConfiguration.find((configuration) => configuration.type === part);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,

            width: 6 * 50,
        }}>
            <div style={{
                height: 4 * 50,

                overflowY: "overlay"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                    {(!figureDataResponse?.mandatory) && (
                        <WardrobeSelectionItem active={!activeConfiguration} onClick={() => {
                            onFigureConfigurationChange(figureConfiguration.filter((configuration) => configuration.type !== part));
                        }}>
                            <div className="sprite_dialog_remove_selection"/>
                        </WardrobeSelectionItem>
                    )}

                    {figureDataResponse?.items?.map(({ image, setId, colorable }) => (
                        <WardrobeSelectionItem key={setId} active={Boolean(activeConfiguration) && (activeConfiguration?.setId === setId)} onClick={() => {
                            onFigureConfigurationChange(
                                figureConfiguration
                                    .filter((configuration) => configuration.type !== part)
                                    .concat([
                                        {
                                            type: part,
                                            setId,
                                            colorIndex: (colorable) ? (activeConfiguration?.colorIndex ?? figureDataResponse.colors[0].id) : (undefined)
                                        }
                                    ])
                            );
                        }}>
                            <OffscreenCanvasRender offscreenCanvas={image}/>
                        </WardrobeSelectionItem>
                    ))}
                </div>
            </div>

            <WardrobeSelectionColors
                disabled={!activeConfiguration || !figureDataResponse?.items.find((item) => item.setId === activeConfiguration.setId)?.colorable}
                colors={figureDataResponse?.colors}
                activeColor={activeConfiguration?.colorIndex}
                onColorChange={(color) => {
                    if(!activeConfiguration) {
                        return;
                    }

                    onFigureConfigurationChange(
                        figureConfiguration
                            .filter((configuration) => configuration.type !== part)
                            .concat([
                                {
                                    type: part,
                                    setId: activeConfiguration.setId,
                                    colorIndex: color
                                }
                            ])
                    );
                }}/>
        </div>
    );
}
