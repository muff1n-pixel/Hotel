import { Router } from "express";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import jsonWebToken from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        oldPassword = req.body.oldPassword,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm;

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

        if (!oldPassword) {
            return res.json({
                error: "Please enter your old password."
            });
        }

        if (!password) {
            return res.json({
                error: "Please enter a new password."
            });
        }

        if (password !== passwordConfirm) {
            return res.json({
                error: "Your password confirmation not match."
            });
        }

        if (!(await bcrypt.compare(oldPassword, user.password))) {
            return res.json({
                error: "Your current password does not match."
            });
        }

        if ((await bcrypt.compare(password, user.password))) {
            return res.json({
                error: "Your new password is the same as your current one."
            });
        }

        const newPassword = await bcrypt.hash(password, 10);
        await user.update({
            password: newPassword
        })

        return res.json({
            success: "Your password has been edited."
        });

    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;