import { ArticleCommentInterface } from "./Comment/ArticleCommentInterface";

export interface ArticleAuthor {
    id: string,
    name: string,
    figureConfiguration: any;
}

export interface ArticleInterface {
    id: string,
    bannerUrl: string,
    title: string,
    content: string,
    createdAt: Date,
    author: null | ArticleAuthor,
    likes: Array<string>,
    totalComments: number,
    comments: Array<ArticleCommentInterface>
}