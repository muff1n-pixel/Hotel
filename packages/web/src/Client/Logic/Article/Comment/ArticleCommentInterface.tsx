import { ArticleAuthor } from "../ArticleInterface";

export interface ArticleCommentInterface {
    id: string,
    content: string,
    user: null | ArticleAuthor,
    createdAt: Date,
    likes: Array<string>
}