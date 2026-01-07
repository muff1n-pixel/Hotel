export type FurnitureAssets = FurnitureAsset[];

export type FurnitureAsset = {
    name: string;
    
    x: number;
    y: number;

    flipHorizontal?: boolean;

    source?: string;
};
