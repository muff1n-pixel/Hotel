import { Router } from "express";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import jsonWebToken from "jsonwebtoken";
import { WebArticleModel } from "../../../Models/Web/Article/WebArticleModel";
import { WebArticleLikeModel } from "../../../Models/Web/Article/Like/WebArticleLikeModel";
import { randomUUID } from 'crypto';
import { WebArticleCommentModel } from "../../../Models/Web/Article/Comment/WebArticleCommentModel";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        articleId = req.body.articleId

    let comment = req.body.comment;

    if (!accessToken) {
        return res.json({
            error: "An error occured."
        })
    }

    if (!articleId)
        return res.json({
            error: "Invalid parameter."
        })

    if (!comment)
        return res.json({
            error: "Please enter a comment."
        })

    comment = comment.trim();

    if (comment.length < 5)
        return res.json({
            error: "Your comment must contain at least 5 characters."
        })

    if (comment.length > 1000)
        return res.json({
            error: "Your comment cannot exceed 1000 characters"
        })

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

        if (!articleId)
            return res.json({
                error: "An error occured"
            });

        const article = await WebArticleModel.findOne({
            where: {
                id: articleId
            }
        });

        if (!article)
            return res.json({
                error: "Impossible to find this article"
            });

        const lastComment = await WebArticleCommentModel.findOne({
            where: {
                userId: user.id
            },
            order: [['createdAt', 'DESC']],
        });

        if (lastComment) {
            const diff = Date.now() - new Date(lastComment.createdAt).getTime();

            if (diff < 60000) {
                const remaining = Math.ceil((60000 - diff) / 1000);

                return res.json({
                    error: `You must wait ${remaining} seconds before posting another comment.`
                });
            }
        }

        const newComment = await WebArticleCommentModel.create({
            id: randomUUID(),
            content: comment,
            articleId: article.id,
            userId: user.id
        })

        return res.json({
            success: {
                id: newComment.dataValues.id,
                content: newComment.dataValues.content,
                user: {
                    id: user.id,
                    name: user.name,
                    figureConfiguration: user.figureConfiguration
                },
                createdAt: newComment.dataValues.createdAt,
                likes: []
            }
        });

    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;