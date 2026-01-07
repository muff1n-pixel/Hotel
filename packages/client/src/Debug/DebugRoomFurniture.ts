import RoomFurnitureItem from "@/Room/Items/Furniture/RoomFurnitureItem";
import RoomRenderer from "@/Room/Renderer";

export default class DebugRoomFurniture {
    private readonly element: HTMLDivElement;
    
    constructor(private readonly roomRenderer: RoomRenderer, private readonly roomFurniture: RoomFurnitureItem) {
        this.element = document.createElement("div");
        this.element.classList.add("debug-room-furniture");
        this.element.innerHTML = `
            <p>${this.roomFurniture.furnitureRenderer.type}</p>
            <p><small>Sprites: <span class="sprites-count">${this.roomFurniture.sprites.length}</span></small></p>

            <small>Position</small>
            <section>
                <input class="position-x" type="number" value="${this.roomFurniture.position?.row}"/>
                <input class="position-y" type="number" value="${this.roomFurniture.position?.column}"/>
                <input class="position-z" type="number" value="${this.roomFurniture.position?.depth}"/>
            </section>

            <br/>
            
            <small>Animation</small>
            <section>
                <input class="animation" type="number" value="${this.roomFurniture.furnitureRenderer.animation}"/>
            </section>
        `;
        document.body.appendChild(this.element);

        this.registerPositionEvents();
        this.registerSpritesEvents();
        this.registerAnimationEvents();
    }

    private registerPositionEvents() {
        const positionXElement = this.element.querySelector<HTMLInputElement>(".position-x")!;

        positionXElement.onchange = () => {
            this.roomFurniture.setPosition({
                ...this.roomFurniture.position!,
                row: parseFloat(positionXElement.value)
            });
        };

        const positionYElement = this.element.querySelector<HTMLInputElement>(".position-y")!;

        positionYElement.onchange = () => {
            this.roomFurniture.setPosition({
                ...this.roomFurniture.position!,
                column: parseFloat(positionYElement.value)
            });
        };

        const positionZElement = this.element.querySelector<HTMLInputElement>(".position-z")!;

        positionZElement.onchange = () => {
            this.roomFurniture.setPosition({
                ...this.roomFurniture.position!,
                depth: parseFloat(positionZElement.value)
            });
        };
    }

    private registerSpritesEvents() {
        const spritesCountElement = this.element.querySelector(".sprites-count")!;

        this.roomRenderer.addEventListener("render", () => {
            spritesCountElement.innerHTML = this.roomFurniture.sprites.length.toString();
        });
    }

    private registerAnimationEvents() {
        const animationElement = this.element.querySelector<HTMLInputElement>(".animation")!;

        animationElement.onchange = () => {
            this.roomFurniture.furnitureRenderer.animation = parseInt(animationElement.value);
            this.roomFurniture.render();
        };
    }
}
