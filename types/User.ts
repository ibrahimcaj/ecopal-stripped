export interface UserInterface {
  id: string;
  createdAt: number;

  following: string[];

  bio: string;

  displayName: string;
  username: string;

  city: string;
  country: string;

  xp: number;
  level: number;

  verified: boolean;

  photoURL: string | null;
}

export default class User implements UserInterface {
  id: string;
  createdAt: number;

  following: string[];

  bio: string;

  displayName: string;
  username: string;

  city: string;
  country: string;

  xp: number;
  level: number;

  verified: boolean;

  photoURL: string | null;

  constructor(
    id: string,
    { object, displayName, photoURL }: { object?: UserInterface; displayName?: string | null; photoURL?: string | null }
  ) {
    this.id = id;

    this.createdAt = object?.createdAt || Date.now();

    this.following = object?.following || [];

    this.bio = object?.bio || '';

    this.displayName = displayName || object?.displayName || 'User';
    this.username = object?.username || this.displayName.toLowerCase().replace(' ', '');

    this.city = object?.city || '';
    this.country = object?.country || '';

    this.xp = object?.xp || 0;
    this.level = object?.level || 1;

    this.verified = object?.verified || false;

    this.photoURL = photoURL || object?.photoURL || null;
  }
}
