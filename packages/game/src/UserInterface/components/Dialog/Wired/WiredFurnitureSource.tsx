import WiredSection from "./WiredSection";

export type WiredFurnitureSourceProps = {
    value: "list" | "selector";
    furnitureIds: string[];
    maxFurniture: number;
    onChange: (value: "list" | "selector") => void;
};

export default function WiredFurnitureSource({ value, furnitureIds, maxFurniture, onChange }: WiredFurnitureSourceProps) {
    return (
        <WiredSection style={{
            background: "rgba(0, 0, 0, .15)",

            marginTop: -5,
            marginBottom: -5,

            paddingTop: 10,
            paddingBottom: 10
        }}>
            <b>Select furni source:</b>

            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",

                padding: 5
            }}>
                <div className="sprite_dialog_wired_arrow-right" style={{
                    transform: "rotateZ(180deg)",
                    cursor: "pointer"
                }} onClick={() => onChange((value === "list")?("selector"):("list"))}/>

                <div>
                    {(value === "list")?(
                        `Use picked furnis [${furnitureIds.length}/${maxFurniture}]`
                    ):(
                        "Use furni from Selector"
                    )}
                </div>

                <div className="sprite_dialog_wired_arrow-right" style={{
                    cursor: "pointer"
                }} onClick={() => onChange((value === "list")?("selector"):("list"))}/>
            </div>
        </WiredSection>
    );
}
