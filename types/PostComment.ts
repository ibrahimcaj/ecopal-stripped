export type PostCommentInterface = {
  id: string;

  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  content: string;
  likes: string[];

  createdAt: number;
};

export class PostComment implements PostCommentInterface {
  id: string;

  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  content: string;
  likes: string[];

  createdAt: number;

  constructor(
    id: string,
    author: {
      id: string;
      name: string;
      photoURL: string;
    },
    content: string,
    likes: string[],
    createdAt: number = Date.now()
  ) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.likes = likes;
    this.createdAt = createdAt;
  }
}
