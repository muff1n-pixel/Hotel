import { FigureConfigurationData } from "@pixel63/events";
import { useState } from "react";
import DialogPanel from "src/UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import "./FriendsPanel.css";

export type FriendsPanelProps = {
    figureConfiguration?: FigureConfigurationData;
    name?: string;
    roomId?: string;
};

export default function FriendsPanel({ figureConfiguration, name, roomId }: FriendsPanelProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{
            position: "relative",

            width: 126,
            
            transform: "translateY(18px)"
        }}>
            <DialogPanel color={(figureConfiguration)?("green"):("light-blue")} style={{
                fontSize: 13,

                width: 126,

                fontFamily: "Ubuntu Bold",
                
                position: "absolute",
                bottom: 0
            }} onClick={(expanded)?(undefined):(() => {})}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,

                    height: 30,

                    paddingLeft: 2
                }} onClick={(figureConfiguration)?(() => setExpanded(!expanded)):(undefined)}>
                    <div>
                        {(figureConfiguration)?(
                            <FigureImage figureConfiguration={figureConfiguration} headOnly cropped direction={2} style={{ marginTop: 5 }}/>
                        ):(
                            <div className="sprite_friends_new-friend" style={{ marginTop: -5 }}/>
                        )}
                    </div>

                    <div>
                        {(name)?(
                            name
                        ):(
                            "Find new friends"
                        )}
                    </div>
                </div>

                {(expanded) && (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",

                        padding: 2,
                    }}>
                        <div className="friends-panel-button">
                            <div className="sprite_friends_friend-chat"/>
                        </div>

                        <div className="friends-panel-button">
                            {(roomId) && (
                                <div className="sprite_friends_friend-follow"/>
                            )}
                        </div>

                        <div className="friends-panel-button">
                            <div className="sprite_friends_friend-profile"/>
                        </div>                        
                    </div>
                )}
            </DialogPanel>
        </div>
    );
}