import { Router } from "express";
import { UserModel } from "../../Models/Users/UserModel";
import { WebArticleModel } from "../../Models/Web/Article/WebArticleModel";
import { WebArticleLikeModel } from "../../Models/Web/Article/Like/WebArticleLikeModel";

const router = Router();

router.post("/", async (req, res) => {
    let limit = req.body.limit,
        skip = req.body.skip;

    if (limit) {
        if (isNaN(parseInt(limit)) || parseInt(limit) > 50)
            limit = 10;

        const totalArticles = await WebArticleModel.findAndCountAll();

        const lastArticles = await WebArticleModel.findAll({
            offset: (!isNaN(parseInt(skip)) && parseInt(skip) > 0) ? parseInt(skip) : 0,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            include: [{ model: UserModel, as: "author" }]
        });

        const articles: Array<any> = [];
        for await (const article of lastArticles) {
            let author: any = null;
            if (article.author) {
                author = {
                    id: article.author.id,
                    name: article.author.name,
                    figureConfiguration: article.author.figureConfiguration
                }
            }

            articles.push({
                id: article.id,
                bannerUrl: article.bannerUrl,
                title: article.title,
                content: article.content,
                createdAt: article.createdAt,
                updateAt: article.updatedAt,
                author: author
            })
        };

        return res.json({
            totalArticles: totalArticles.count,
            articles: articles
        });
    }
    else {
        const date = req.body.date,
            title = req.body.title;

        if (!date || isNaN(parseInt(date)) || !title)
            return res.json({
                error: "Invalid parameters set."
            });

        const article = await WebArticleModel.findOne({
            where: {
                title: decodeURI(title),
                createdAt: new Date(+parseInt(date))
            },
            include: [{ model: UserModel, as: "author" }]
        });

        if (!article)
            return res.json({
                error: "Article not found."
            });

        let author: any = null;
        if (article.author) {
            author = {
                id: article.author.id,
                name: article.author.name,
                figureConfiguration: article.author.figureConfiguration
            }
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

        return res.json({
            id: article.id,
            bannerUrl: article.bannerUrl,
            title: article.title,
            content: article.content,
            createdAt: article.createdAt,
            updateAt: article.updatedAt,
            author: author,
            likes: likes
        });
    }
});

export default router;