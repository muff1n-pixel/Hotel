import { UserFurnitureData } from "@pixel63/events";
import WiredSection from "./WiredSection";

export type WiredFurnitureProps = {
    furniture: UserFurnitureData;
}

export default function WiredFurniture({ furniture }: WiredFurnitureProps) {
    return (
        <WiredSection>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 6
            }}>
                {(furniture.furniture?.type.startsWith("wf_trg")) && (
                    <div className="sprite_dialog_wired_trigger"/>
                )}
                
                {(furniture.furniture?.type.startsWith("wf_act")) && (
                    <div className="sprite_dialog_wired_action"/>
                )}

                <div style={{
                    fontFamily: "Ubuntu Bold"
                }}>
                    {furniture.furniture?.name}
                </div>
            </div>

            {(furniture.furniture?.description) && (
                <div>{furniture.furniture.description}</div>
            )}
        </WiredSection>
    )
}