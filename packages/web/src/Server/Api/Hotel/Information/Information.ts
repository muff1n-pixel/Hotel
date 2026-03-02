
import { Router } from "express";
import { UserModel } from "../../../Models/Users/UserModel";
const router = Router();

router.post("/", async (req, res) => {
    const usersOnline = await UserModel.count({
        where: {
            online: true
        }
    });

    return res.json({
        usersOnline
    });

});

export default router;