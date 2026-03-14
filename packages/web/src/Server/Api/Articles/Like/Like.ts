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
        articleId = req.body.articleId,
        commentId = req.body.commentId;

    if (!accessToken) {
        return res.json({
            error: "An error occured"
        })
    }

    if (!articleId && !commentId)
        return res.json({
            error: "Invalid parameter"
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

        if (articleId) {
            const article = await WebArticleModel.findOne({
                where: {
                    id: articleId
                }
            });

            if (!article)
                return res.json({
                    error: "Impossible to find this article"
                });

            const articleLike = await WebArticleLikeModel.findOne({
                where: {
                    articleId: article.id,
                    userId: user.id
                }
            });

            if (!articleLike) {
                await WebArticleLikeModel.create({
                    id: randomUUID(),
                    articleId: article.id,
                    userId: user.id
                })
            }
            else {
                await articleLike.destroy();
            }

            const articlesLikes = await WebArticleLikeModel.findAll({
                where: {
                    articleId: article.id
                }
            });

            const likes: Array<string> = [];
            articlesLikes.forEach((articleLike) => {
                likes.push(articleLike.userId);
            })

            return res.json(likes);
        }
        else if(commentId) {
            const comment = await WebArticleCommentModel.findOne({
                where: {
                    id: commentId
                }
            });

            if (!comment)
                return res.json({
                    error: "Impossible to find this article"
                });

            const commentLike = await WebArticleLikeModel.findOne({
                where: {
                    commentId: comment.id,
                    userId: user.id
                }
            });

            if (!commentLike) {
                await WebArticleLikeModel.create({
                    id: randomUUID(),
                    commentId: comment.id,
                    userId: user.id
                })
            }
            else {
                await commentLike.destroy();
            }

            const commentLikes = await WebArticleLikeModel.findAll({
                where: {
                    commentId: comment.id
                }
            });

            const likes: Array<string> = [];
            commentLikes.forEach((commentLike) => {
                likes.push(commentLike.userId);
            })

            return res.json(likes);
        }

    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;