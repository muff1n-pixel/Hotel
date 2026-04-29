import { SearchUserFriendsData, SendUserFriendRequestData, UserFriendData, UserFriendsSearchData } from "@pixel63/events";
import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";
import TimeSinceDate from "@UserInterface/Common/Date/TimeSinceDate";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import Input from "@UserInterface/Common/Form/Components/Input";
import FriendUser from "@UserInterface/Components2/Friends/Component/FriendUser";
import useFriends from "@UserInterface/Hooks/useFriends";

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
                <DialogScrollArea style={{ gap: 10, margin: "-10px" }} hideInactive>
                    {result.map((friend) => (
                        <FriendUser key={friend.id} friend={friend}/>
                    ))}
                </DialogScrollArea>
            )}
        </div>
    );
}
