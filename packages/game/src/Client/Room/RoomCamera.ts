import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomRenderer from "./RoomRenderer";

export default class RoomCamera {
    private moving: boolean = false;

    public dragging: boolean = false;

    private lastPosition: MousePosition | null = null;

    public mousePosition: MousePosition | null = null;

    public cameraPosition: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(private readonly renderer: RoomRenderer) {
        
    }

    public init() {
        this.renderer.application.canvas.addEventListener("touchstart", this.touchstart.bind(this));
        this.renderer.application.canvas.addEventListener("touchmove", this.touchmove.bind(this));
        this.renderer.application.canvas.addEventListener("touchend", this.touchend.bind(this));

        this.renderer.application.canvas.addEventListener("mousedown", this.mousedown.bind(this));
        this.renderer.application.canvas.addEventListener("mousemove", this.mousemove.bind(this));
        this.renderer.application.canvas.addEventListener("mouseup", this.mouseup.bind(this));
        this.renderer.application.canvas.addEventListener("mouseleave", this.mouseleave.bind(this));
        this.renderer.application.canvas.addEventListener("wheel", this.wheel.bind(this));
    }

    private wheel(event: WheelEvent) {
        if(this.renderer.furniturePlacer) {
            return;
        }
        
        if(event.deltaY < 0) {
            this.renderer.scale.value = (Math.min(5, this.renderer.scale.value + 0.1));
        }
        else {
            this.renderer.scale.value = (Math.max(1, this.renderer.scale.value - 0.1));
        }
    }

    private mousedown(event: MouseEvent) {
        if(event.ctrlKey || event.shiftKey || (event.altKey || event.metaKey)) {
            return;
        }

        this.moving = true;
        this.dragging = false;

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

        if(Math.abs(relativePosition.left) > 2 || Math.abs(relativePosition.top) > 2) {
            this.dragging = true;
        }

        this.lastPosition = {
            left: event.pageX,
            top: event.pageY
        };
    }

    private mouseup(event: MouseEvent) {
        this.mousemove(event);

        this.moving = false;
        this.lastPosition = null;
        this.dragging = false;
    }

    private mouseleave() {
        this.mousePosition = null;
    }

    private touchstart(event: TouchEvent) {
        if(event.ctrlKey || event.shiftKey || (event.altKey || event.metaKey)) {
            return;
        }

        this.moving = true;
        this.dragging = false;

        const touch = event.touches[0];

        this.lastPosition = {
            left: touch.pageX,
            top: touch.pageY
        };
    }

    private touchmove(event: TouchEvent) {
        const touch = event.touches[0];

        this.mousePosition = {
            left: touch.pageX,
            top: touch.pageY
        };

        if(!this.moving || !this.lastPosition) {
            return;
        }

        const relativePosition: MousePosition = {
            left: touch.pageX - this.lastPosition.left,
            top: touch.pageY - this.lastPosition.top,
        };

        this.cameraPosition.left += relativePosition.left;
        this.cameraPosition.top += relativePosition.top;

        if(Math.abs(relativePosition.left) > 2 || Math.abs(relativePosition.top) > 2) {
            this.dragging = true;
        }

        this.lastPosition = {
            left: touch.pageX,
            top: touch.pageY
        };
    }

    private touchend() {
        this.moving = false;
        this.lastPosition = null;
        this.dragging = false;
    }
}