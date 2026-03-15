import { SearchUserFriendsData, SendUserFriendRequestData, UserFriendData, UserFriendsSearchData } from "@pixel63/events";
import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "src";
import TimeSinceDate from "src/UserInterface/Common/Date/TimeSinceDate";
import DialogScrollArea from "src/UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import Input from "src/UserInterface/Common/Form/Components/Input";
import useFriends from "src/UserInterface/Hooks/useFriends";

export default function FriendsDialogSearch() {
    const { incomingRequests, outgoingRequests } = useFriends();

    const [search, setSearch] = useState("");
    const [result, setResult] = useState<UserFriendData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserFriendsSearchData, {
            async handle(payload: UserFriendsSearchData) {
                setResult(payload.users);
            }
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserFriendsSearchData, listener);
        };
    }, []);

    const handleSubmit = useCallback((value: string) => {
        webSocketClient.sendProtobuff(SearchUserFriendsData, SearchUserFriendsData.create({
            name: value
        }));
    }, []);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 5
        }}>
            <Input placeholder="Search users..." value={search} onChange={setSearch} onSubmit={handleSubmit}>
                <div className="sprite_room_user_motto_pen"/>
            </Input>

            <div/>

            {(!result.length)?(
                <div>No users found.</div>
            ):(
                <DialogScrollArea style={{ gap: 10 }} hideInactive>
                    {result.map((friend) => (
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

                            <div>
                                {!outgoingRequests?.some((request) => request.id === friend.id) && !incomingRequests?.some((request) => request.id === friend.id) && (
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
                    ))}
                </DialogScrollArea>
            )}
        </div>
    );
}
