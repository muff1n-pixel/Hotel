import WidgetNotification from "@UserInterface/Common/Widgets/WidgetNotification";
import Widget from "@UserInterface/Components/Widget/Widget";
import { useWidgetNotifications } from "@UserInterface/Hooks/useWidgetNotifications";
import { clientInstance } from "src";

export default function FlowInstance() {
    const widgetNotifications = useWidgetNotifications();

    return (
        <div style={{
            position: "absolute",
            top: 0,
            right: 14,

            pointerEvents: "auto",

            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: "flex-end"
        }}>
            <Widget/>

            {widgetNotifications?.map((widgetNotification) => (
                <WidgetNotification
                    key={widgetNotification.id}
                    text={widgetNotification.text}
                    badge={widgetNotification.badge}
                    duration={5000}
                    onFinish={() => {
                        const index = clientInstance.widgetNotifications.value!.indexOf(widgetNotification);
    
                        if(index !== -1) {
                            clientInstance.widgetNotifications.value!.splice(index, 1);
                            clientInstance.widgetNotifications.update();
                        }
                    }}/>
            ))}
        </div>
    );
}
