export default class ClientInstance {
    constructor(public readonly element: HTMLElement, public readonly internalEventTarget: EventTarget) {
        internalEventTarget.addEventListener("interface", (event) => {
            console.log("Received interface ping in client instance.", event);
        });

        internalEventTarget.dispatchEvent(new Event("client"));
    }
}
