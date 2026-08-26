import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomCamera from "../RoomCamera";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomCursor from "../Cursor/RoomCursor";
import RoomItem from "../Items/RoomItem";
import ClientInstance from "@Client/ClientInstance";
import RoomInstance from "../RoomInstance";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomFurniturePlacer from "../RoomFurniturePlacer";
import RoomLighting from "@Client/Room/RoomLightning";
import { RoomStructureData } from "@pixel63/events";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import RoomFurnitureSprite from "@Client/Room/Items/Furniture/RoomFurnitureSprite";
import { Application, Container, Rectangle } from "pixi.js";
import RoomFurnitureOffsets from "@Client/Room/Items/Furniture/RoomFurnitureOffsets";
import ObservableRequiredProperty from "@Client/Utilities/ObservableRequiredProperty";
import RoomStructure from "@Client/Room/Structure/RoomStructure";
import RoomLandscape from "@Client/Room/Landscape/RoomLandscape";
import RoomRendererCounter from "./RoomRendererCounter";
import RoomEntityManager from "./Entities/RoomEntityManager";
import RoomHitTester from "./RoomHitTester";
import RoomCoordinateMapper from "./RoomCoordinateMapper";
import RoomPriorityMapper from "./RoomPriorityMapper";

export default class RoomRenderer extends EventTarget {
    public readonly application = new Application();
    public readonly container = new Container();

    public readonly counter = new RoomRendererCounter(this);
    public readonly entityManager = new RoomEntityManager(this);
    public readonly hitTester = new RoomHitTester(this);
    public readonly coordinateMapper = new RoomCoordinateMapper(this);
    public readonly priorityMapper = new RoomPriorityMapper(this);

    public readonly camera: RoomCamera;
    public cursor?: RoomCursor;

    public lighting: RoomLighting;
    public structure: RoomStructure;
    public landscape: RoomLandscape;

    public furniturePlacer?: RoomFurniturePlacer;

    public scale = new ObservableRequiredProperty<number>(1);
    private scaleSubscription: () => void;
    private subscriptions: ((() => void) | undefined)[] = [];

    public size: number = 64;
    
    public focusedItem = new ObservableProperty<RoomItem | null>(null);
    public hoveredItem = new ObservableProperty<RoomItem | null>(null);

    constructor(public readonly parent: HTMLElement, public readonly clientInstance: ClientInstance | undefined, public readonly roomInstance: RoomInstance | undefined, structure?: RoomStructureData) {
        super();

        if(!structure) {
            throw new Error();
        }

        this.structure = new RoomStructure(this, structure);
        this.landscape = new RoomLandscape(this);

        this.camera = new RoomCamera(this);
        this.lighting = new RoomLighting(this);

        this.scaleSubscription = this.scale.subscribe((value) => {
            this.container.scale = value;

            if(value <= 0.75) {
                this.size = 32;
            }
            else {
                this.size = 64;
            }
        });
    }

    public terminated: boolean = false;

    public terminate() {
        if(this.terminated) {
            return;
        }

        this.terminated = true;

        this.cursor?.destroy();
        this.landscape.destroy();

        this.scaleSubscription();

        for(const subscription of this.subscriptions) {
            subscription?.();
        }

        this.application.renderer.destroy({
            removeView: true
        });
    }

    public async init() {
        const resolution = Math.min(2, Math.max(1, Math.floor(window.devicePixelRatio)));

        await this.application.init({
            antialias: false,
            background: "#000000",
            resizeTo: this.parent,
            roundPixels: resolution !== 1,

            useBackBuffer: true,

            resolution: resolution,
            autoDensity: resolution !== 1,
        });

        this.counter.initialize();

        this.camera.init();

        if(resolution !== 1) {
            this.application.canvas.style.imageRendering = "pixelated";
        }

        this.subscriptions.push(this.clientInstance?.settings.subscribe((value) => {
            if(value.limitRoomFrames) {
                this.application.ticker.maxFPS = 60;
            }
            else {
                this.application.ticker.maxFPS = 0;
            }
        }));

        if(window.screen.width > 1920) {
            if(this.clientInstance?.settings.value.autoScaleRooms) {
                this.scale.value = 2;
            }
        }

        if(this.roomInstance) {
            this.cursor = new RoomCursor(this);
        }

        this.camera.cameraPosition.left = Math.round(this.application.screen.width / 2);
        this.camera.cameraPosition.left -= (this.structure.data.grid[0].length * 8) - (this.structure.data.grid.length * 8);
        
        this.camera.cameraPosition.top = Math.round(this.application.screen.height / 2);
        this.camera.cameraPosition.top -= (this.structure.data.grid.length + this.structure.data.grid[0]?.length) * 8;

        this.lighting.init();

        this.application.stage.addChild(this.container);

        this.application.canvas.classList.add("renderer");

        this.parent.appendChild(this.application.canvas);

        await this.structure.setStructure(this.structure.data);
    }
}
