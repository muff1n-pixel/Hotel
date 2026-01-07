export type FigureAssetss = FigureAssets[];

export type FigureAssets = {
    name: string;
    
    x: number;
    y: number;
    
    flipHorizontal?: boolean;
    //flipVertical?: boolean;

    source?: string;
};
