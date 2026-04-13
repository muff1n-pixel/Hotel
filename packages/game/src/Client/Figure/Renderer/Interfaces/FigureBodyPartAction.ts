export default interface FigureBodyPartAction {
    actionId: string;
    part?: string;
    geometry: {
        id: string;
        bodyparts: {
            id: string;
            parts: string[];
        }[];
    };
    bodyParts: string[];
    assetPartDefinition: string;
    
    destinationX?: number;
    destinationY?: number;
    directionOffset?: number;
    
    frame?: number;
};
