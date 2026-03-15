import { RemoveUserFriendData, UserFriendData } from "@pixel63/events";
import { Fragment, useEffect, useState } from "react";
import { webSocketClient } from "src";
import TimeSinceDate from "src/UserInterface/Common/Date/TimeSinceDate";
import DialogButton from "src/UserInterface/Common/Dialog/Components/Button/DialogButton";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import FriendUser from "src/UserInterface/Components/Friends/Component/FriendUser";
import useFriends from "src/UserInterface/Hooks/useFriends";

export default function FriendsDialogList() {
    const { friends, offlineFriends, incomingRequests, outgoingRequests } = useFriends();

    const [activeFriend, setActiveFriend] = useState<UserFriendData | null>(null);

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
                flex: 1
            }}>
                {(!friends?.length) && (
                    <div>
                        You have no friends online!
                    </div>
                )}

                {friends?.filter((friend) => friend.online).map((friend) => (
                    <FriendUser key={friend.id} active={activeFriend?.id === friend.id} friend={friend} onClick={() => setActiveFriend((activeFriend?.id === friend.id)?(null):(friend))}/>
                ))}
            </div>

            {(activeFriend) && (
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

            {(incomingRequests && incomingRequests.length > 0) && (
                <Fragment>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",

                        cursor: "pointer"
                    }} onClick={() => setFriendRequestsMinimized(!friendRequestsMinimized)}>
                        <div>
                            Incoming friend requests ({incomingRequests.length})
                        </div>
                        
                        <div className="sprite_forms_arrow" style={{
                            transform: (friendRequestsMinimized)?("rotateZ(-90deg)"):(undefined)
                        }}/>
                    </div>

                    {(!friendRequestsMinimized) && (
                        incomingRequests.map((friend) => (
                            <FriendUser key={friend.id} friend={friend}/>
                        ))
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
                    }} onClick={() => setOutgoingRequestsMinimized(!outgoingRequestsMinimized)}>
                        <div>
                            Outgoing friend requests ({outgoingRequests.length})
                        </div>
                        
                        <div className="sprite_forms_arrow" style={{
                            transform: (outgoingRequestsMinimized)?("rotateZ(-90deg)"):(undefined)
                        }}/>
                    </div>

                    {(!outgoingRequestsMinimized) && (
                        outgoingRequests.map((friend) => (
                            <FriendUser key={friend.id} friend={friend}/>
                        ))
                    )}
                </Fragment>
            )}

            {(offlineFriends && offlineFriends?.length > 0) && (
                <Fragment>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",

                        cursor: "pointer"
                    }} onClick={() => setOfflineFriendsMinimized(!offlineFriendsMinimized)}>
                        <div>
                            Offline friends ({offlineFriends.length})
                        </div>
                        
                        <div className="sprite_forms_arrow" style={{
                            transform: (offlineFriendsMinimized)?("rotateZ(-90deg)"):(undefined)
                        }}/>
                    </div>

                    {(!offlineFriendsMinimized) && (
                        offlineFriends.map((friend) => (
                            <div key={friend.id} style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10
                            }}>
                                <FigureImage figureConfiguration={friend.figureConfiguration} headOnly cropped direction={2} style={{
                                    marginTop: 6
                                }}/>

                                <div style={{
                                    flex: 1,

                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 5,
                                        alignItems: "center"
                                    }}>
                                        <b>{friend.name}</b>

                                        <div className="sprite_users_profile-small" style={{
                                            cursor: "pointer"
                                        }}/>
                                    </div>
                                    
                                    <div style={{ fontSize: 12 }}>Last seen {(friend.lastOnline)?(<TimeSinceDate date={new Date(friend.lastOnline)}/>):("never")}</div>
                                </div>
                            </div>
                        ))
                    )}
                </Fragment>
            )}
        </div>
    );
}
