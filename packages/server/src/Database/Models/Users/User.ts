import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../Database.js";
import { FigureConfiguration } from "@shared/Interfaces/figure/FigureConfiguration.js";

export class User extends Model {
    declare id: string;
    declare name: string;
    declare figureConfiguration: FigureConfiguration;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(32),
      allowNull: false,
    },
    figureConfiguration: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue("figureConfiguration"));
        },
        set: function (value) {
            this.setDataValue("figureConfiguration", JSON.stringify(value));
        },
        allowNull: false
    }
  },
  {
    tableName: 'users',
    sequelize
  },
);

await User.sync();

await User.create({
  id: "user1",
  name: "Muff1n-Pixel",
  figureConfiguration: [{"type":"hd","setId":"180","colorIndex":2},{"type":"hr","setId":"828","colorIndex":31},{"type":"ea","setId":"3196","colorIndex":62},{"type":"ch","setId":"255","colorIndex":1415},{"type":"lg","setId":"3216","colorIndex":110},{"type":"sh","setId":"305","colorIndex":62}]
});

await User.create({
  id: "user2",
  name: "Cake",
  figureConfiguration: [{"type":"hd","setId":"180","colorIndex":2},{"type":"hr","setId":"828","colorIndex":31},{"type":"ch","setId":"255","colorIndex":1415},{"type":"lg","setId":"3216","colorIndex":110},{"type":"sh","setId":"305","colorIndex":62}]
});
