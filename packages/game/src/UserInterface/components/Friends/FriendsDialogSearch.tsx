import { SearchUserFriendsData, SendUserFriendRequestData, UserFriendData, UserFriendsSearchData } from "@pixel63/events";
import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "src";
import TimeSinceDate from "src/UserInterface/Common/Date/TimeSinceDate";
import DialogScrollArea from "src/UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import Input from "src/UserInterface/Common/Form/Components/Input";
import FriendUser from "src/UserInterface/Components/Friends/Component/FriendUser";
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
                        <FriendUser key={friend.id} friend={friend}/>
                    ))}
                </DialogScrollArea>
            )}
        </div>
    );
}
