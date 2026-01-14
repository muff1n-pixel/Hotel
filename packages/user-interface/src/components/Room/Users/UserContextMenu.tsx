import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";
import StartedHoveringFigure from "@shared/Events/Room/StartedHoveringFigure";
import StoppedHoveringFigure from "@shared/Events/Room/StoppedHoveringFigure";
import StartedFollowingFigure from "@shared/Events/Room/StartedFollowingFigure";
import StoppedFollowingFigure from "@shared/Events/Room/StoppedFollowingFigure";
import FollowingFigure from "@shared/Events/Room/FollowingFigure";

import "./UserContextMenu.css";
import { RoomUserData } from "@shared/Interfaces/Room/RoomUserData";
import UserContextMenuList from "./UserContextMenuList";
import UserContextMenuButton from "./UserContextMenuButton";
import UserContextMenuElement from "./UserContextMenuElement";
import WardrobeDialog from "../../Wardrobe/WardrobeDialog";

export default function UserContextMenu() {
    const { internalEventTarget, user, addUniqueDialog, closeDialog } = useContext(AppContext);

    const elementRef = useRef<HTMLDivElement>(null);

    const [hoveringFigure, setHoveringFigure] = useState<RoomUserData>();
    const [focusedFigure, setFocusedFigure] = useState<RoomUserData>();

    const [folded, setFolded] = useState<boolean>(false);

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        // do nothing if we're following a user
        if(focusedFigure) {
            return;
        }

        const listener = (event: StartedHoveringFigure) => {
            setHoveringFigure(event.userData);

            elementRef.current!.style.left = `${event.position.left}px`;
            elementRef.current!.style.top = `${event.position.top}px`;
        };

        internalEventTarget.addEventListener<StartedHoveringFigure>("StartedHoveringFigure", listener);
  
        return () => {
            internalEventTarget.removeEventListener<StartedHoveringFigure>("StartedHoveringFigure", listener);
        };
    }, [hoveringFigure, focusedFigure, elementRef.current]);

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        const listener = (event: StartedFollowingFigure) => {
            setHoveringFigure(undefined);
            setFocusedFigure(event.userData);
            setFolded(false);

            elementRef.current!.style.left = `${event.position.left}px`;
            elementRef.current!.style.top = `${event.position.top}px`;
        };

        internalEventTarget.addEventListener<StartedFollowingFigure>("StartedFollowingFigure", listener);
  
        return () => {
            internalEventTarget.removeEventListener<StartedHoveringFigure>("StartedHoveringFigure", listener);
        };
    }, [focusedFigure, elementRef.current]);

    useEffect(() => {
        if(hoveringFigure || focusedFigure) {
            const listener = (event: FollowingFigure) => {
                if(event.userId === focusedFigure?.id || event.userId === hoveringFigure?.id) {
                    elementRef.current!.style.left = `${event.position.left}px`;
                    elementRef.current!.style.top = `${event.position.top}px`;
                }
            };

            internalEventTarget.addEventListener<FollowingFigure>("FollowingFigure", listener);
    
            return () => {
                internalEventTarget.removeEventListener<FollowingFigure>("FollowingFigure", listener);
            };
        }
    }, [hoveringFigure, focusedFigure]);

    useEffect(() => {
        const listener = () => {
            setHoveringFigure(undefined);
        };

        internalEventTarget.addEventListener<StoppedHoveringFigure>("StoppedHoveringFigure", listener);
  
        return () => {
            internalEventTarget.removeEventListener<StoppedHoveringFigure>("StoppedHoveringFigure", listener);
        };
    }, []);

    useEffect(() => {
        const listener = () => {
            setFocusedFigure(undefined);
        };

        internalEventTarget.addEventListener<StoppedFollowingFigure>("StoppedFollowingFigure", listener);
  
        return () => {
            internalEventTarget.removeEventListener<StoppedFollowingFigure>("StoppedFollowingFigure", listener);
        };
    }, []);

    const toggleFolded = useCallback(() => {
        setFolded(!folded);
    }, [folded]);

    return (
        <Fragment>
            <div ref={elementRef} style={{
                position: "absolute",
                whiteSpace: "nowrap"
            }}>
                {(focusedFigure) && (
                    <div className="arrow" style={{
                        display: "flex",

                        width: (!folded)?(100):("max-content"),

                        transform: "translate(64px, -70px) translate(-50%, -100%)",

                        background: "#2C2B2A",
                        border: "1px solid #000000",
                        borderBottomWidth: 2,
                        borderRadius: 5,

                        pointerEvents: "auto",
                    }}>
                        <div style={{
                            flex: 1,
                            border: "1px solid #3C3C3C",
                            borderRadius: 5,
                            boxSizing: "border-box",

                            fontSize: 12,

                            flexWrap: "wrap",

                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {(!folded) && (
                                <Fragment>
                                    <UserContextMenuElement position="top">
                                        {focusedFigure?.name}
                                    </UserContextMenuElement>

                                    <UserContextMenuList>
                                        {(user?.id === focusedFigure.id)?(
                                            <UserContextMenuButton text="Wardrobe" onClick={() => addUniqueDialog("wardrobe")}/>
                                        ):(
                                            <UserContextMenuButton text="123" onClick={() => {
                                                
                                            }}/>
                                        )}

                                    </UserContextMenuList>
                                </Fragment>
                            )}

                            <UserContextMenuElement position="bottom" hideBorder={folded} onClick={toggleFolded}>
                                <div className="sprite_context-menu_arrow-down" style={{
                                    transform: (folded)?("rotateZ(180deg)"):(undefined)
                                }}/>
                            </UserContextMenuElement>


                        </div>

                        <div className="arrow-outline"/>
                    </div>
                )}

                {(!focusedFigure && hoveringFigure) && (
                    <div className="arrow" style={{
                        display: "flex",

                        transform: "translate(64px, -70px) translate(-50%, -100%)",

                        background: "#2C2B2A",
                        border: "1px solid #000000",
                        borderBottomWidth: 2,
                        borderRadius: 5,
                    }}>
                        <div style={{
                            flex: 1,
                            border: "1px solid #3C3C3C",
                            borderRadius: 5,
                            boxSizing: "border-box",

                            fontSize: 12,

                            padding: "5px 12px",

                            flexWrap: "wrap",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            {hoveringFigure?.name}
                        </div>

                        <div className="arrow-outline"/>
                    </div>
                )}
            </div>
        </Fragment>
    );
}
