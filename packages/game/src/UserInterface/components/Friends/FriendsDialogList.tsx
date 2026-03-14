import { Fragment, useState } from "react";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import useFriends from "src/UserInterface/Hooks/useFriends";
import getTimeSinceDate from "src/UserInterface/Utils/getTimeSinceDate";

export default function FriendsDialogList() {
    const { friends, offlineFriends, incomingRequests, outgoingRequests } = useFriends();

    const [offlineFriendsMinimized, setOfflineFriendsMinimized] = useState(true);
    const [friendRequestsMinimized, setFriendRequestsMinimized] = useState(true);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 5
        }}>
            <div style={{
                flex: 1
            }}>
                {friends?.filter((friend) => friend.online).map((friend) => (
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
                            
                            <div style={{ fontSize: 12 }}>Online right now</div>
                        </div>

                        <div>
                            <div className="sprite_friends_chats" style={{
                                cursor: "pointer"
                            }}/>
                        </div>
                    </div>
                ))}
            </div>

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
                                    
                                    <div style={{ fontSize: 12 }}>Last seen {(friend.lastOnline)?(getTimeSinceDate(friend.lastOnline)):("never")}</div>
                                </div>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 5
                                }}>
                                    <div className="sprite_friends_accept" style={{
                                        cursor: "pointer"
                                    }}/>
                                    
                                    <div className="sprite_friends_decline" style={{
                                        cursor: "pointer"
                                    }}/>
                                </div>
                            </div>
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
                                    
                                    <div style={{ fontSize: 12 }}>Last seen {(friend.lastOnline)?(getTimeSinceDate(friend.lastOnline)):("never")}</div>
                                </div>
                            </div>
                        ))
                    )}
                </Fragment>
            )}
        </div>
    );
}
