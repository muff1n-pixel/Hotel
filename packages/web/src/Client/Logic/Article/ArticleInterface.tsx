interface Author {
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
    updatedAt: Date,
    author: null | Author
}