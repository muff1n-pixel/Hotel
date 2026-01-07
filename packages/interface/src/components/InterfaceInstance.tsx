import { useContext, useEffect, useState } from "react";
import { InternalEventTargetContext } from "../app/InternalEventTargetContext";

export default function InterfaceInstance() {
    const internalEventTarget = useContext(InternalEventTargetContext);

    useEffect(() => {
        const listener = (event: Event) => {
            console.log("Received client ping in interface instance.", event);
        };

        internalEventTarget.addEventListener("client", listener);

        internalEventTarget.dispatchEvent(new Event("interface"));

        return () => internalEventTarget.removeEventListener("client", listener);
    }, []);

    return (
      <h1>Parcel React App</h1>
    );
}