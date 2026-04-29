import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { FigureConfigurationData } from "@pixel63/events";
import FigureConfigurationHelper from "@pixel63/shared/Figure/FigureConfigurationHelper";
import { Figure } from "@Game/library";

export default class FurnitureMannequinRenderer extends FurnitureDefaultRenderer {
    public placement?: "wall" | "floor" | undefined;

    public frame: number = 0;

    public shouldCacheResults: boolean = false;

    public shouldRender(options: FurnitureRenderOptions): boolean {
        if(options.figureConfiguration !== this.options?.figureConfiguration) {
            return true;
        }

        if(options.figureConfiguration && this.options?.figureConfiguration) {
            if(options.figureConfiguration?.gender !== this.options?.figureConfiguration?.gender) {
                return true;
            }

            if(options.figureConfiguration?.effect !== this.options?.figureConfiguration?.effect) {
                return true;
            }

            if(FigureConfigurationHelper.getStringFromConfiguration(options.figureConfiguration) !== FigureConfigurationHelper.getStringFromConfiguration(this.options.figureConfiguration)) {
                return true;
            }
        } 

        return super.shouldRender(options);
    }

    public async render(data: FurnitureData, options: FurnitureRenderOptions): Promise<FurnitureRendererSprite[]> {
        const result = await super.render(data, options);

        const avatarImageSprite = result.find((sprite) => sprite.tag === "avatar_image");

        if(avatarImageSprite) {
            const figureConfiguration = FigureConfigurationData.create({
                effect: options.figureConfiguration?.effect,
                gender: options.figureConfiguration?.gender ?? "male",
                parts: (options.figureConfiguration?.parts ?? []).concat([
                    {
                        "$type": "FigurePartData",
                        type: "hd",
                        setId: "180",
                        colors: []
                    }
                ])
            });

            const figure = new Figure(figureConfiguration, options.direction ?? 0, [], false);

            const figureImage = await figure.renderToCanvas(0, false, true, true, ["ey", "fc"]);

            avatarImageSprite.image = figureImage.figure.image;

            if(figureImage.figure.imageData) {
                avatarImageSprite.imageData = new ImageData(new Uint8ClampedArray(figureImage.figure.imageData), figureImage.figure.image.width, figureImage.figure.image.height);
                avatarImageSprite.ignoreMouse = false;
            }
            else {
                avatarImageSprite.ignoreMouse = true;
            }

            avatarImageSprite.x -= 112;
            avatarImageSprite.y = avatarImageSprite.y - 64 - 22;
        }

        return result;
    }
}