import { clientInstance } from "../../../..";
import { useFlyingFurnitureIcons } from "../../../hooks/useFlyingFurnitureIcons";
import FlyingFurnitureIcon from "./FlyingFurnitureIcon";

export default function FlyingFurnitureInstances() {
    const flyingFurnitureIcons = useFlyingFurnitureIcons();

    return (
        <div style={{
            position: "absolute",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%"
        }}>
            {flyingFurnitureIcons?.map((icon) => (
                <FlyingFurnitureIcon key={icon.id} data={icon} onFinish={() => {
                    const index = clientInstance.flyingFurnitureIcons.value!.indexOf(icon);

                    if(index !== -1) {
                        clientInstance.flyingFurnitureIcons.value!.splice(index, 1);
                        clientInstance.flyingFurnitureIcons.update();
                    }
                }}/>
            ))}
        </div>
    );
}
