import { Router } from "express";
import { WebArticleModel } from "../../../Models/Web/Article/WebArticleModel";
import { WebArticleCommentModel } from "../../../Models/Web/Article/Comment/WebArticleCommentModel";
import { UserModel } from "../../../Models/Users/UserModel";
import { WebArticleLikeModel } from "../../../Models/Web/Article/Like/WebArticleLikeModel";

const router = Router();

router.post("/", async (req, res) => {
    let articleId = req.body.articleId,
        limit = req.body.limit,
        skip = req.body.skip;

    if (!limit || isNaN(parseInt(limit)) || parseInt(limit) > 20)
        limit = 20;

    if (!articleId)
        return res.json({
            error: "Invalid params"
        });

    const article = await WebArticleModel.findOne({
        where: {
            id: articleId
        }
    });

    if (!article)
        return res.json({
            error: "Invalid article"
        });

    const lastComments = await WebArticleCommentModel.findAll({
        offset: (!isNaN(parseInt(skip)) && parseInt(skip) > 0) ? parseInt(skip) : 0,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        include: [{ model: UserModel, as: "user" }]
    });

    const comments: Array<any> = [];
    for await (const comment of lastComments) {
        const commentLikes = await WebArticleLikeModel.findAll({
            where: {
                commentId: comment.id
            }
        });

        const likes: Array<string> = [];
        commentLikes.forEach((commentLike) => {
            likes.push(commentLike.userId);
        })

        let userData: any = null;
        if (comment.user) {
            userData = {
                id: comment.user.id,
                name: comment.user.name,
                figureConfiguration: comment.user.figureConfiguration
            }
        }

        comments.push({
            id: comment.id,
            content: comment.content,
            user: userData,
            createdAt: comment.createdAt,
            likes: likes
        });
    };

    return res.json(comments);
});

export default router;