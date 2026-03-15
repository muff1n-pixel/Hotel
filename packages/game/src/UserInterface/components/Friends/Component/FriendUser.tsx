import { SendUserFriendRequestData, UpdateUserFriendRequestData, UserFriendData } from "@pixel63/events";
import { Fragment } from "react/jsx-runtime";
import { webSocketClient } from "src";
import TimeSinceDate from "src/UserInterface/Common/Date/TimeSinceDate";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import { useDialogs } from "src/UserInterface/Hooks/useDialogs";
import useFriends from "src/UserInterface/Hooks/useFriends";

export type FriendUserProps = {
    friend: UserFriendData;

    active?: boolean;
    onClick?: () => void;
}

export default function FriendUser({ active, onClick, friend }: FriendUserProps) {
    const dialogs = useDialogs();

    const { friends, offlineFriends, incomingRequests, outgoingRequests } = useFriends();

    return (
        <div key={friend.id} style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,

            cursor: "pointer",

            background: (active)?("rgba(0, 0, 0, .1)"):(undefined),

            marginLeft: -10,
            marginRight: -10,

            marginTop: -8,

            padding: "0 10px"
        }}>
            <div style={{
                flex: 1,

                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10
            }} onClick={onClick}>
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
                    
                    <div style={{ fontSize: 12 }}>
                        {(friend.online)?("Online right now"):(
                            <div>
                                Last seen {(friend.lastOnline)?(<TimeSinceDate date={new Date(friend.lastOnline)}/>):("never")}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{
                width: 30,

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5
            }}>
                {friends?.some((_friend) => _friend.id === friend.id) && (
                    <div className="sprite_friends_chats" style={{
                        cursor: "pointer"
                    }} onClick={() => dialogs.openUniqueDialog("messenger", {
                        friendId: friend.id
                    })}/>
                )}
                
                {incomingRequests?.some((_friend) => _friend.id === friend.id) && (
                    <Fragment>
                        <div className="sprite_friends_accept" style={{
                            cursor: "pointer"
                        }} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRequestData, UpdateUserFriendRequestData.create({
                                userId: friend.id,
                                accept: true
                            }));
                        }}/>
                        
                        <div className="sprite_friends_decline" style={{
                            cursor: "pointer"
                        }} onClick={() => {
                            webSocketClient.sendProtobuff(UpdateUserFriendRequestData, UpdateUserFriendRequestData.create({
                                userId: friend.id,
                                accept: false
                            }));
                        }}/>
                    </Fragment>
                )}
                
                {outgoingRequests?.some((_friend) => _friend.id === friend.id) && (
                    <div className="sprite_friends_decline" style={{
                        cursor: "pointer"
                    }} onClick={() => {
                        webSocketClient.sendProtobuff(UpdateUserFriendRequestData, UpdateUserFriendRequestData.create({
                            userId: friend.id,
                            accept: false
                        }));
                    }}/>
                )}
                
                {!friends?.some((request) => request.id === friend.id) && !offlineFriends?.some((request) => request.id === friend.id) && !outgoingRequests?.some((request) => request.id === friend.id) && !incomingRequests?.some((request) => request.id === friend.id) && (
                    <div className="sprite_friends_add" style={{
                        cursor: "pointer"
                    }} onClick={() => {
                        webSocketClient.sendProtobuff(SendUserFriendRequestData, SendUserFriendRequestData.create({
                            userId: friend.id
                        }));
                    }}/>
                )}
            </div>
        </div>
    );
}
