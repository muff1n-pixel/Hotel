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
}