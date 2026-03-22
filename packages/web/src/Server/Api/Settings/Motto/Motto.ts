import { Router } from "express";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import jsonWebToken from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        newMotto = req.body.newMotto;

    if (!accessToken) {
        return res.json({
            error: "An error occured"
        })
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return res.json({
            error: "An error occured"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return res.json({
                error: "An error occured"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null)
            return res.json({
                error: "An error occured"
            });


        if (!newMotto.trim() || typeof newMotto !== "string" || newMotto.trim().length < 0 || newMotto.trim().length > 40) {
            return res.json({
                error: "Motto invalid."
            });
        }

        await user.update({
            motto: newMotto.trim()
        })

        return res.json({
            success: "Motto has been updated."
        });

    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;