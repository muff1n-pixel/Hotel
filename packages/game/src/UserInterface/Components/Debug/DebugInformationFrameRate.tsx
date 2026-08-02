import { useRoomFrameRate } from "@UserInterface/Hooks/useRoomFrameRate";

export default function DebugInformationFrameRate() {
    const roomFrameRate = useRoomFrameRate();

    return (
        <div>
            {roomFrameRate} frames per second
        </div>
    );
}