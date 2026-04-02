import { UserFigureData, UserFiguresData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserFigureModel } from "../../../../Database/Models/Users/Figures/UserFigureModel";

export default class UserFigureEvent implements ProtobuffListener<UserFigureData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: UserFigureData) {
        if(payload.index < 0 || payload.index > 9) {
            return;
        }

        await UserFigureModel.upsert({
            userId: user.model.id,
            index: payload.index,
            figureConfiguration: payload.figureConfiguration
        });

        const figures = await UserFigureModel.findAll({
            where: {
                userId: user.model.id
            },
            limit: 10
        });

        user.sendProtobuff(UserFiguresData, UserFiguresData.create({
            figures: figures.map((figure) => {
                return UserFigureData.create({
                    index: figure.index,
                    figureConfiguration: figure.figureConfiguration
                })
            })
        }));
    }
}
