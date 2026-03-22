import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { RoomInterface } from "@client/Logic/Room/RoomInterface";
import './HotRooms.css';
import goIcon from '../../Images/icons/medium/go_arrow.gif'
import Box from "../Box/Box";

const HotRooms = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [rooms, setRooms] = useState<Array<RoomInterface>>([]);

    useEffect(() => {
        const fetchRooms = () => {
            fetch("/api/hotrooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((result) => {
                    setRooms(result);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log("(Error) Impossible to fetch hot rooms:", e)
                });
        };

        fetchRooms();

        const interval = setInterval(fetchRooms, 120000);

        return () => clearInterval(interval);

    }, []);

    return (
        <Box title={"Hot Rooms"} color="red">
            {loading ?
                <Loading />
                :
                <div className="hot_rooms">
                    {rooms.length === 0 ?
                        <div style={{ textAlign: "center", marginBottom: "10px", fontSize: "12px" }}>No rooms available at the moment.</div>
                        :
                        rooms.map((room) => {
                            let iconClass = "";

                            const ratio = room.currentUsers / room.maxUsers;

                            if (room.currentUsers === 0) {
                                iconClass = "";
                            } else if (ratio >= 0.8) {
                                iconClass = "red";
                            } else if (ratio >= 0.5) {
                                iconClass = "orange";
                            } else {
                                iconClass = "green";
                            }

                            return (
                                <div className='row' onClick={() => window.open(`/game?room=${room.id}`, "_blank", "noopener,noreferrer")} key={room.id}>
                                    <div className={`icon ${iconClass}`}></div>
                                    <div className="infos">
                                        <div className="name">{room.name}</div>
                                        <div className="owner">{room.owner ? room.owner.name : "Undefined"}</div>
                                    </div>

                                    <img src={goIcon} alt="goIcon" className="joinRoom" />
                                </div>
                            )
                        })
                    }
                </div>
            }
        </Box>
    )
}

export default HotRooms;