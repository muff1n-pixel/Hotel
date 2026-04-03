import { FigureConfigurationData } from "@pixel63/events";

export default class FigureConfigurationHelper {
    public static getConfigurationFromString(figureString: string): FigureConfigurationData {
        const parts = figureString.split('.');

        // TODO: guess gender from head part
        const configuration: FigureConfigurationData = {
            $type: "FigureConfigurationData",
            gender: "male",
            parts: []
        };

        for(let part of parts) {
            const sections = part.split('-');

            configuration.parts.push({
                $type: "FigurePartData",
                type: sections[0] as string,
                setId: sections[1] as string,
                colors: (sections[2])?([parseInt(sections[2])]):([])
            });
        }

        return configuration;
    }

    public static getStringFromConfiguration(figureConfiguration: FigureConfigurationData): string {
        return figureConfiguration.parts.map((part) => [part.type, part.setId].concat(part.colors.map((color) => color.toString()).join('-'))).join('-');
    }

    public static replacePartsFromConfiguration(originalFigureConfiguration: FigureConfigurationData, replacingFigureConfiguration: FigureConfigurationData) {
        return FigureConfigurationData.create({
            gender: originalFigureConfiguration.gender,
            effect: originalFigureConfiguration.effect,
            parts: originalFigureConfiguration.parts.filter((part) => !replacingFigureConfiguration.parts.some((_part) => _part.type === part.type)).concat(replacingFigureConfiguration.parts)
        });
    }
}