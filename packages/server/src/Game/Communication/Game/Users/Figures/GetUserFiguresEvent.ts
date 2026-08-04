import { GetUserFiguresData, UserFigureData, UserFiguresData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserFigureModel } from "../../../../Database/Models/Users/Figures/UserFigureModel";

export default class GetUserFiguresEvent implements ProtobuffListener<GetUserFiguresData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User) {
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
