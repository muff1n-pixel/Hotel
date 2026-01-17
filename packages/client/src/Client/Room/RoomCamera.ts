import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomRenderer from "./Renderer";

export default class RoomCamera {
    private moving: boolean = false;

    private lastPosition: MousePosition | null = null;

    public mousePosition: MousePosition | null = null;

    public cameraPosition: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(renderer: RoomRenderer) {
        if(renderer.roomInstance) {
            renderer.element.addEventListener("mousedown", this.mousedown.bind(this));
            renderer.element.addEventListener("mousemove", this.mousemove.bind(this));
            renderer.element.addEventListener("mouseup", this.mouseup.bind(this));
            renderer.element.addEventListener("mouseleave", this.mouseleave.bind(this));
        }
    }

    private mousedown(event: MouseEvent) {
        this.moving = true;

        this.lastPosition = {
            left: event.pageX,
            top: event.pageY
        };
    }

    private mousemove(event: MouseEvent) {
        this.mousePosition = {
            left: event.pageX,
            top: event.pageY
        };

        if(!this.moving || !this.lastPosition) {
            return;
        }

        const relativePosition: MousePosition = {
            left: event.pageX - this.lastPosition.left,
            top: event.pageY - this.lastPosition.top,
        };

        this.cameraPosition.left += relativePosition.left;
        this.cameraPosition.top += relativePosition.top;

        this.lastPosition = {
            left: event.pageX,
            top: event.pageY
        };
    }

    private mouseup(event: MouseEvent) {
        this.mousemove(event);

        this.moving = false;
        this.lastPosition = null;
    }

    private mouseleave() {
        this.mousePosition = null;
    }
}