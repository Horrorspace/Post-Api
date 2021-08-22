export interface IPostBody {
    title: string;
    body: string;
}

export interface IPostId {
    id: number;
}

export interface IPostUserId {
    userId: number;
}

export interface IPost extends IPostId, IPostBody {}
export interface IPostData extends IPost, IPostUserId {}
export interface INewPost extends IPostBody, IPostUserId {}