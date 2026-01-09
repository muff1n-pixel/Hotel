import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import ClientFigureDataRequest from "@shared/interfaces/requests/ClientFigureDataRequest";
import ClientFigureDataResponse from "@shared/interfaces/responses/ClientFigureDataResponse";
import OffscreenCanvasRender from "../OffscreenCanvasRender";
import WardrobeAvatar from "./WardrobeAvatar";

export default function WardrobeSelection() {
    const { internalEventTarget } = useContext(AppContext);
    
    const requestedData = useRef(false);

    const [figureDataResponse, setFigureDataResponse] = useState<ClientFigureDataResponse>();

    useEffect(() => {
        if(requestedData.current) {
            return;
        }

        requestedData.current = true;

        const requestEvent = new ClientFigureDataRequest("hr", "male");

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

    return (
        <div style={{
            display: "flex",
            flexDirection: "row"
        }}>
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
                        {figureDataResponse?.items?.map(({ image, setId }, index) => (
                            <div key={index} style={{
                                width: 50,
                                height: 50,

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <OffscreenCanvasRender offscreenCanvas={image}/>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    height: 94,

                    overflowY: "overlay"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 2,
                        rowGap: 4,
                    }}>
                        {figureDataResponse?.colors.map(({ id, color }) => (
                            <div key={id} style={{
                                backgroundColor: "#24221D",
                                borderRadius: 3,
                                paddingBottom: 2,
                            }}>
                                <div style={{
                                    border: "2px solid #736D67",
                                    borderRadius: 3,
                                    background: `#${color}`
                                }}>
                                    <div style={{
                                        width: 9,
                                        height: 13,

                                        borderBottom: "1px solid rgba(0, 0, 0, .1)",

                                        display: "flex"
                                    }}>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{
                flex: 1,
                width: 130,
                height: "100%"
            }}>
                <WardrobeAvatar/>
            </div>
        </div>
    );
}
