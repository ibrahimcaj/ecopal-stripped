export type PostInterface = {
  id: string;

  title: string;

  author: MiniAuthorInterface;

  media: string[];
  likes: string[];

  createdAt: number;
};

interface MiniAuthorInterface {
  id: string;
  name: string;
  photoURL: string;
}

export class Post implements PostInterface {
  id: string;

  title: string;

  author: MiniAuthorInterface;

  media: string[];
  likes: string[];

  createdAt: number;

  constructor(
    id: string,
    title: string,

    author: MiniAuthorInterface,

    media: string[] = [],
    likes: string[] = [],

    createdAt: number = Date.now()
  ) {
    this.id = id;
    this.title = title;

    this.author = author;

    this.media = media;
    this.likes = likes;

    this.createdAt = createdAt;
  }
}
