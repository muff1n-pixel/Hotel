import { DataTypes, Sequelize, UUIDV4 } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
});

import "./Models/Rooms/Room.js";
import { RoomFurniture } from "./Models/Rooms/RoomFurniture.js";
import { Room } from "./Models/Rooms/Room.js";
import { randomUUID } from "crypto";
import { ShopPage } from "./Models/Shop/ShopPage.js";
import { ShopPageFurniture } from "./Models/Shop/ShopPageFurniture.js";

ShopPage.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    category: {
      type: new DataTypes.STRING(32),
      allowNull: false
    },
    type: {
      type: new DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "default"
    },
    title: {
      type: new DataTypes.STRING(32),
      allowNull: false
    },
    icon: {
      type: new DataTypes.STRING(32),
      allowNull: true,
      defaultValue: null
    }
  },
  {
    tableName: "shop_pages",
    sequelize
  }
);

ShopPage.hasMany(ShopPage, {
    as: "children",
    foreignKey: "parentId"
});

ShopPageFurniture.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    type: {
      type: new DataTypes.STRING(32),
      allowNull: false
    }
  },
  {
    tableName: "shop_page_furnitures",
    sequelize
  }
);

ShopPage.hasMany(ShopPageFurniture, {
    as: "furniture",
    foreignKey: "shopPageId"
});

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(32),
      allowNull: false,
    },
    structure: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue("structure"));
        },
        set: function (value) {
            this.setDataValue("structure", JSON.stringify(value));
        },
        allowNull: false
    }
  },
  {
    tableName: 'rooms',
    sequelize,
  },
);

RoomFurniture.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    type: {
      type: new DataTypes.STRING(32),
      allowNull: false,
    },
    position: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue("position"));
        },
        set: function (value) {
            this.setDataValue("position", JSON.stringify(value));
        },
        allowNull: false
    },
    direction: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    animation: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    color: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'room_furnitures',
    sequelize
  },
);

Room.hasMany(RoomFurniture, {
    as: "roomFurnitures",
    foreignKey: "roomId"
});

await sequelize.sync();

const typeCategory = await ShopPage.create<ShopPage>({
  id: randomUUID(),
  category: "furniture",
  title: "By type",
  icon: "icon_72"
});

await ShopPageFurniture.bulkCreate<ShopPageFurniture>([
  {
    id: randomUUID(),
    type: "nft_rare_dragonlamp*1",
    shopPageId: typeCategory.id,
  },
  {
    id: randomUUID(),
    type: "nft_rare_dragonlamp*2",
    shopPageId: typeCategory.id
  },
  {
    id: randomUUID(),
    type: "nft_rare_dragonlamp*3",
    shopPageId: typeCategory.id
  },
  {
    id: randomUUID(),
    type: "bed_armas_two",
    shopPageId: typeCategory.id
  }
]);

await ShopPage.bulkCreate<ShopPage>([
  {
    id: randomUUID(),
    category: "furniture",
    title: "Rugs",
    parentId: typeCategory.id
  },
  {
    id: randomUUID(),
    category: "furniture",
    title: "Dimmers",
    parentId: typeCategory.id
  }
]);

const room = await Room.create<Room>({
  id: "room1",
  name: "My home room",
  structure: {
        door: {
            row: 6,
            column: 0
        },
        grid: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X22222222222222222222222XX22222222222222222222222X",
            "X22222222222222222222222XX22222222222222222222222X",
            "X22222222222222222222222XX22222222222222222222222X",
            "X22222222222222222222222XX22222222222222222222222X",
            "X22222222222222222222222XX22222222222222222222222X",
            "222222222222222222222222XX22222222222222222222222X",
            "X22222222222222222222222XX22222222222222222222222X",
            "X22222222222222222222222XX22222222222222222222222X",
            "X22222222222222222222222XX22222222222222222222222X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X11111111111111111111111XX11111111111111111111111X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "X00000000000000000000000XX00000000000000000000000X",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X00000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX0"
        ],
        floor: {
            id: "101",
            thickness: 8
        },
        wall: {
            id: "2301",
            thickness: 8
        }
    }
});

for(let color = 0; color < 4; color++)
for(let direction = 0; direction < 2; direction++)
for(let index = 0; index < 20; index++) {
  await RoomFurniture.create<RoomFurniture>({
      id: randomUUID(),
      roomId: room.id,
      type: "nft_rare_dragonlamp",
      position: {
          row: (11 + (color * 2)) + direction,
          column: 1 + index,
          depth: 1
      },
      direction: (direction === 0)?(2):(4),
      animation: 1,
      color
  });
}

for(let color = 4; color < 8; color++)
for(let direction = 0; direction < 2; direction++)
for(let index = 0; index < 20; index++) {
  await RoomFurniture.create<RoomFurniture>({
      id: randomUUID(),
      roomId: room.id,
      type: "nft_rare_dragonlamp",
      position: {
          row: (13 + (color * 2)) + direction,
          column: 1 + index,
          depth: 0
      },
      direction: (direction === 0)?(2):(4),
      animation: 1,
      color
  });
}
