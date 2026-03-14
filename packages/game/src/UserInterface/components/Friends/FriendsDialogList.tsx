import { useState } from "react";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import { useUser } from "src/UserInterface/Hooks/useUser";

export default function FriendsDialogList() {
    const user = useUser();

    const [offlineFriendsMinimized, setOfflineFriendsMinimized] = useState(true);

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
                        <div className="sprite_friends_chats" style={{
                            cursor: "pointer"
                        }}/>
                    </div>
                </div>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",

                cursor: "pointer"
            }} onClick={() => setOfflineFriendsMinimized(!offlineFriendsMinimized)}>
                <div>
                    Offline friends (6)
                </div>
                
                <div className="sprite_forms_arrow" style={{
                    transform: (offlineFriendsMinimized)?("rotateZ(-90deg)"):(undefined)
                }}/>
            </div>

            {(!offlineFriendsMinimized) && (
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
                        
                        <div style={{ fontSize: 12 }}>Last seen 1 day ago</div>
                    </div>
                </div>
            )}
        </div>
    );
}
