import { useState } from "react";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import Input from "src/UserInterface/Common/Form/Components/Input";
import { useUser } from "src/UserInterface/Hooks/useUser";

export default function FriendsDialogSearch() {
    const user = useUser();

    const [search, setSearch] = useState("");

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 5
        }}>
            <Input placeholder="Search users..." value={search} onChange={setSearch}>
                <div className="sprite_room_user_motto_pen"/>
            </Input>

            <div/>

            <div>Results:</div>

            <div style={{
                flex: 1
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>
                    <FigureImage figureConfiguration={user.figureConfiguration} headOnly cropped direction={2} style={{
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
                            <b>{user.name}</b>

                            <div className="sprite_users_profile-small" style={{
                                cursor: "pointer"
                            }}/>
                        </div>
                        
                        <div style={{ fontSize: 12 }}>Online right now</div>
                    </div>

                    <div>
                        <div className="sprite_friends_add" style={{
                            cursor: "pointer"
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
