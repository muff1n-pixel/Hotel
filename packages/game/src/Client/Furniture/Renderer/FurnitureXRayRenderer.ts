import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { FurnitureVisualization } from "@Client/Interfaces/Furniture/FurnitureVisualization";

export default class FurnitureXRayRenderer extends FurnitureDefaultRenderer {
    public placement?: "wall" | "floor" | undefined;

    public frame: number = 0;

    public render(data: FurnitureData, direction: number | undefined, size: number, animation: number, color: number, frame: number, grayscaled: boolean): Promise<FurnitureRendererSprite[]> {
        for(const visualization of data.visualization.visualizations) {
            if(!visualization.layers.length) {
                continue;
            }

            if(visualization.layerCount === 12) {
                continue;
            }

            visualization.layerCount = 12;

            console.log(visualization.layers);

            visualization.layers.find((layer) => layer.id === 1)!.ink = "difference";
            visualization.layers.find((layer) => layer.id === 2)!.ink = "subtract";
            visualization.layers.find((layer) => layer.id === 4)!.ink = "difference";
            visualization.layers.find((layer) => layer.id === 5)!.ink = "subtract";
            visualization.layers.find((layer) => layer.id === 6)!.ink = "lighter";
            visualization.layers.find((layer) => layer.id === 7)!.ink = "lighter";

            visualization.layers.push({
                id: 8,
                ink: "overlay",
                zIndex: 4
            });

            this.addAsset(data, visualization, 'i', 'b');

            visualization.layers.push({
                id: 9,
                ink: "overlay",
                zIndex: 1004
            });

            this.addAsset(data, visualization, 'j', 'e');
            
            visualization.layers.push({
                id: 10,
                ink: "saturation",
                zIndex: -1
            });

            this.addAsset(data, visualization, 'k', 'b');
            
            visualization.layers.push({
                id: 11,
                ink: "saturation",
                zIndex: 999
            });

            this.addAsset(data, visualization, 'l', 'e');
        }

        return super.render(data, direction, size, animation, color, frame, grayscaled);
    }

    private addAsset(data: FurnitureData, visualization: FurnitureVisualization["visualizations"][0], newLayerId: string, sourceLayerId: string) {
        for(const { id: direction } of visualization.directions) {
            const sourceAsset = data.assets.find((asset) => asset.name === `${this.type}_${visualization.size}_${sourceLayerId}_${direction}_0`);

            if(sourceAsset) {
                const rootSourceAsset = (sourceAsset.source)?(data.assets.find((asset) => asset.name === sourceAsset.source)):(sourceAsset);

                if(rootSourceAsset) {
                    data.assets.push({
                        name: `${this.type}_${visualization.size}_${newLayerId}_${direction}_0`,
                        
                        x: sourceAsset.x,
                        y: sourceAsset.y,

                        flipHorizontal: sourceAsset.flipHorizontal,

                        source: rootSourceAsset.name,
                    });
                }
            }
        }
    }
}