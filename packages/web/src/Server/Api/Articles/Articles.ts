import { Router } from "express";
import Sequelize, { and } from 'sequelize';
import { UserModel } from "../../Models/Users/UserModel";
import { WebArticleModel } from "../../Models/Web/Article/WebArticleModel";

const router = Router();

router.post("/", async (req, res) => {
    let limit = req.body.limit;

    if (limit) {
        if (isNaN(parseInt(limit)) || parseInt(limit) > 50)
            limit = 10;

        const lastArticles = await WebArticleModel.findAll({
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit)
        });

        const articles: Array<any> = [];
        for await (const article of lastArticles) {
            const authorData = await UserModel.findOne({
                where: {
                    id: article.authorId
                }
            });

            let author: any = null;
            if (authorData) {
                author = {
                    id: authorData.id,
                    name: authorData.name,
                    figureConfiguration: authorData.figureConfiguration
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

        return res.json(articles);
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
            }
        });

        if (!article)
            return res.json({
                error: "Article not found."
            });

        const authorData = await UserModel.findOne({
            where: {
                id: article.authorId
            }
        });

        let author: any = null;
        if (authorData) {
            author = {
                id: authorData.id,
                name: authorData.name,
                figureConfiguration: authorData.figureConfiguration
            }
        }

        return res.json({
            id: article.id,
            bannerUrl: article.bannerUrl,
            title: article.title,
            content: article.content,
            createdAt: article.createdAt,
            updateAt: article.updatedAt,
            author: author
        });
    }
});

export default router;