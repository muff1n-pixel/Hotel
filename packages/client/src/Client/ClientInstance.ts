import registerFigureEvents from "@/Figure/Events/FigureEvents.js";
import { TypedEventTarget } from "./Interfaces/TypedEventTarget.js";

export default class ClientInstance {
    constructor(public readonly element: HTMLElement, public readonly internalEventTarget: TypedEventTarget) {
        internalEventTarget.addEventListener("interface", (event) => {
            //console.log("Received interface ping in client instance.", event);
        });

        internalEventTarget.dispatchEvent(new Event("client"));

        registerFigureEvents(internalEventTarget);
    }
}
