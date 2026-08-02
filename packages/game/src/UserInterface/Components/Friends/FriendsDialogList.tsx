import { RemoveUserFriendData, UserFriendData } from "@pixel63/events";
import UserLink from "@UserInterface/Common/Users/UserLink";
import { Fragment, useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";
import TimeSinceDate from "@UserInterface/Common/Date/TimeSinceDate";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import FriendUser from "@UserInterface/Components/Friends/Component/FriendUser";
import useFriends from "@UserInterface/Hooks/useFriends";

export default function FriendsDialogList() {
    const { friends, offlineFriends, incomingRequests, outgoingRequests } = useFriends();

    const [activeFriend, setActiveFriend] = useState<UserFriendData | null>(null);

    const [tab, setTab] = useState<string | undefined>(undefined);

    const [offlineFriendsMinimized, setOfflineFriendsMinimized] = useState(true);
    const [friendRequestsMinimized, setFriendRequestsMinimized] = useState(true);
    const [outgoingRequestsMinimized, setOutgoingRequestsMinimized] = useState(true);

    useEffect(() => {
        if(activeFriend && !friends?.some((friend) => friend.id === activeFriend.id)) {
            setActiveFriend(null);
        }
    }, [activeFriend, friends]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",

                cursor: "pointer"
            }} onClick={() => setTab(undefined)}>
                <div>
                    All friends ({friends?.length})
                </div>
                
                <div className="sprite_forms_arrow" style={{
                    transform: (tab)?("rotateZ(-90deg)"):(undefined)
                }}/>
            </div>

            {(!tab) && (
                <div style={{
                    flex: 1,
                    padding: "6px 0"
                }}>
                    {(!friends?.length)?(
                        <div>
                            You have no friends online!
                        </div>
                    ):(
                        <DialogScrollArea style={{ gap: 10, margin: "-10px" }} hideInactive>
                            {friends?.filter((friend) => friend.online).map((friend) => (
                                <FriendUser key={friend.id} active={activeFriend?.id === friend.id} friend={friend} onClick={() => setActiveFriend((activeFriend?.id === friend.id)?(null):(friend))}/>
                            ))}
                        </DialogScrollArea>
                    )}
                </div>
            )}

            {(!tab && activeFriend) && (
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5
                }}>
                    <div style={{ flex: 1 }}/>

                    <DialogButton
                        style={{ flex: 1 }}
                        onClick={() => {
                            webSocketClient.sendProtobuff(RemoveUserFriendData, RemoveUserFriendData.create({
                                userId: activeFriend.id
                            }));
                        }}>
                        Remove friend
                    </DialogButton>
                </div>
            )}

            {(offlineFriends && offlineFriends?.length > 0) && (
                <Fragment>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",

                        cursor: "pointer"
                    }} onClick={() => setTab((tab === "offline")?(undefined):("offline"))}>
                        <div>
                            Offline friends ({offlineFriends.length})
                        </div>
                        
                        <div className="sprite_forms_arrow" style={{
                            transform: (tab !== "offline")?("rotateZ(-90deg)"):(undefined)
                        }}/>
                    </div>

                    {(tab === "offline") && (
                        <DialogScrollArea style={{ gap: 10, margin: "-10px" }} hideInactive>
                            {offlineFriends.map((friend) => (
                                <div key={friend.id} style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: 6
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: 40,
                                        height: 40
                                    }}>
                                        <FigureImage figureConfiguration={friend.figureConfiguration} headOnly cropped direction={2} style={{
                                            marginTop: 6
                                        }}/>
                                    </div>

                                    <div style={{
                                        flex: 1,

                                        display: "flex",
                                        flexDirection: "column"
                                    }}>
                                        <b><UserLink id={friend.id} name={friend.name}/></b>
                                        
                                        <div style={{ fontSize: 12 }}>Last seen {(friend.lastOnline)?(<TimeSinceDate date={new Date(friend.lastOnline)}/>):("never")}</div>
                                    </div>
                                </div>
                            ))}
                        </DialogScrollArea>
                    )}
                </Fragment>
            )}
            
            {(incomingRequests && incomingRequests.length > 0) && (
                <Fragment>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",

                        cursor: "pointer"
                    }} onClick={() => setTab((tab === "incoming")?(undefined):("incoming"))}>
                        <div>
                            Incoming friend requests ({incomingRequests.length})
                        </div>
                        
                        <div className="sprite_forms_arrow" style={{
                            transform: (tab !== "incoming")?("rotateZ(-90deg)"):(undefined)
                        }}/>
                    </div>

                    {(tab === "incoming") && (
                        <DialogScrollArea style={{ gap: 10, margin: "-10px" }} hideInactive>
                            {incomingRequests.map((friend) => (
                                <FriendUser key={friend.id} friend={friend}/>
                            ))}
                        </DialogScrollArea>
                    )}
                </Fragment>
            )}

            {(outgoingRequests && outgoingRequests.length > 0) && (
                <Fragment>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",

                        cursor: "pointer"
                    }} onClick={() => setTab((tab === "outgoing")?(undefined):("outgoing"))}>
                        <div>
                            Outgoing friend requests ({outgoingRequests.length})
                        </div>
                        
                        <div className="sprite_forms_arrow" style={{
                            transform: (tab !== "outgoing")?("rotateZ(-90deg)"):(undefined)
                        }}/>
                    </div>

                    {(tab === "outgoing") && (
                        <DialogScrollArea style={{ gap: 10, margin: "-10px" }} hideInactive>
                            {outgoingRequests.map((friend) => (
                                <FriendUser key={friend.id} friend={friend}/>
                            ))}
                        </DialogScrollArea>
                    )}
                </Fragment>
            )}
        </div>
    );
}
