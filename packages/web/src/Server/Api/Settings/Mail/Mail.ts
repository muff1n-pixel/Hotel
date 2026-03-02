import { Router } from "express";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import jsonWebToken from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        email = req.body.email;

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

        if (!email) {
            return res.json({
                error: "No mail provided."
            });
        }

        if (email.length > 254 || !email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            return res.json({
                error: "Mail provided is invalid."
            });
        }

        const existingMail = await UserModel.count({
            where: {
                email
            }
        });

        if (existingMail) {
            return res.json({
                error: "Mail provided is already in use."
            });
        }

        await user.update({
            email
        });

        return res.json({
            success: "The mail address has been successfully modified."
        });

    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;