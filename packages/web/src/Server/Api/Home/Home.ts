import { Router } from "express";
import { Op } from 'sequelize';
import { UserModel } from "../../Models/Users/UserModel";
import { WebHomeUserItemModel } from "../../Models/Web/Home/UserItem/WebHomeUserItemModel";
import { WebHomeItemModel } from "../../Models/Web/Home/Item/WebHomeItemModel";
import { UserBadgeModel } from "../../Models/Users/Badges/UserBadgeModel";
import { BadgeModel } from "../../Models/Badges/BadgeModel";
import { RoomModel } from "../../Models/Rooms/RoomModel";
import { UserFriendModel } from "../../Models/Users/Friends/UserFriendModel";
import { randomUUID } from 'crypto';
import { WebHomeGuestBookMessage } from "../../Models/Web/Home/Guestbook/WebHomeGuestBookMessage";

const router = Router();

router.post("/", async (req, res) => {
    const name = req.body.name;

    if (!name || typeof name !== "string")
        return res.json({
            error: "Invalid paramaters."
        });

    const user = await UserModel.findOne({
        where: {
            name: name
        }
    });

    if (!user)
        return res.json({
            error: "Invalid user."
        });

    const userItems = await WebHomeUserItemModel.findAll({
        where: {
            userId: user.id,
            positionX: {
                [Op.not]: null,
            },
            positionY: {
                [Op.not]: null,
            }
        },
        order: [['updatedAt', 'ASC']],
        include: [
            {
                model: WebHomeItemModel,
                as: "item"
            }
        ]
    });

    let items: Array<any> = [];

    const widgets = await WebHomeItemModel.findAll({
        where: {
            type: 'widgets'
        }
    })

    if (userItems.length === 0) {
        // INIT HOME PAGE

        for await (const widget of widgets) {
            let positionX: number | null = null,
                positionY: number | null = null;

            if (widget.id === 'widgets_profile') {
                positionX = 75;
                positionY = 75;
            }
            else if (widget.id === 'widgets_guestbook') {
                positionX = 475;
                positionY = 75;
            }

            const userWidget = await WebHomeUserItemModel.create({
                id: randomUUID(),
                positionX,
                positionY,
                borderSkin: 'default',
                itemId: widget.id,
                userId: user.id
            })

            if (widget.id === 'widgets_profile' || widget.id === 'widgets_guestbook') {
                items.push({
                    id: userWidget.id,
                    positionX: userWidget.positionX,
                    positionY: userWidget.positionY,
                    borderSkin: userWidget.borderSkin,
                    itemId: widget.id,
                    itemDescription: widget.description,
                    itemType: widget.type,
                    itemImage: widget.image,
                    itemWidth: widget.width,
                    itemHeight: widget.height
                })
            }
        }
    } else {
        // CHECK IF USER HAVE ALL NEW WIDGETS
        for await (const widget of widgets) {
            const userWidget = await WebHomeUserItemModel.findOne({
                include: [{ model: WebHomeItemModel, as: "item" }],
                where: {
                    itemId: widget.id
                }
            })

            if (!userWidget) {
                const createWidget = await WebHomeUserItemModel.create({
                    id: randomUUID(),
                    borderSkin: 'default',
                    itemId: widget.id,
                    userId: user.id
                })
            }
        }

        for await (const userItem of userItems) {
            items.push({
                id: userItem.id,
                positionX: userItem.positionX,
                positionY: userItem.positionY,
                data: userItem.data,
                borderSkin: userItem.borderSkin,
                itemId: userItem.item.id,
                itemDescription: userItem.item.description,
                itemType: userItem.item.type,
                itemImage: userItem.item.image,
                itemWidth: userItem.item.width,
                itemHeight: userItem.item.height
            })
        }
    }

    let userRooms: Array<any> = [];
    const userRoomsData = await RoomModel.findAll({
        where: {
            ownerId: user.id
        },
        order: [['currentUsers', 'DESC']]
    });

    for await (const room of userRoomsData) {
        userRooms.push({
            id: room.id,
            type: room.type,
            name: room.name,
            description: room.description,
            thumbnail: room.thumbnail,
            currentUsers: room.currentUsers,
            maxUsers: room.maxUsers,
            lock: room.lock
        })
    }

    let usersBadges: Array<string> = [],
        currentBadges: Array<string> = [];

    const userBadgesData = await UserBadgeModel.findAll({
        where: {
            userId: user.id
        },
        include: {
            model: BadgeModel,
            as: "badge"
        },
        order: [['createdAt', 'DESC']]
    });

    for await (const badgeData of userBadgesData) {
        if(!badgeData.badge)
            continue;
        
        if (badgeData.equipped)
            currentBadges.push(badgeData.badge.image);

        usersBadges.push(badgeData.badge.image)
    }

    const friendsData = await UserFriendModel.findAll({
        include: [
            {
                model: UserModel,
                as: "friend"
            }
        ],
        where: {
            userId: user.id
        }
    });

    const friends: Array<any> = [];

    for await (const userFriend of friendsData) {
        if(!userFriend.friend) {
            // error with friend
            continue;
        }
        
        friends.push({
            id: userFriend.friend.id,
            name: userFriend.friend.name,
            motto: userFriend.friend.motto,
            figureConfiguration: userFriend.friend.figureConfiguration,
            online: userFriend.friend.online
        })
    }

    const guestbookMessagesData = await WebHomeGuestBookMessage.findAll({
        include: [
            {
                model: UserModel,
                as: "user"
            }
        ],
        where: {
            homeId: user.id
        },
        order: [['createdAt', 'DESC']]
    });

    const guestbookMessages: Array<any> = [];
    for await (const guestbookMessage of guestbookMessagesData) {
        if(!guestbookMessage.user) {
            // user not found -----> delete message
            guestbookMessage.destroy();
            continue;
        }

        guestbookMessages.push({
            id: guestbookMessage.id,
            message: guestbookMessage.message,
            date: guestbookMessage.createdAt,
            user: {
                id: guestbookMessage.user.id,
                name: guestbookMessage.user.name,
                motto: guestbookMessage.user.motto,
                figureConfiguration: guestbookMessage.user.figureConfiguration,
                online: guestbookMessage.user.online
            }
        })
    }

    return res.json({
        user: {
            id: user.id,
            name: user.name,
            motto: user.motto,
            registered: user.createdAt,
            lastLogin: user.lastLogin,
            online: user.online,
            figureConfiguration: user.figureConfiguration,
            badges: usersBadges,
            currentBadges: currentBadges,
            rooms: userRooms,
            friends,
            guestbookMessages
        },
        items
    });
});

export default router;