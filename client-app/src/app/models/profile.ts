import { User } from "./user";

export interface IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
  photos?: Photo[];
  following: boolean;
  followersCount: number;
  followingCount: number;
}

export class Profile implements IProfile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
    this.following = false;
    this.followersCount = 0;
    this.followingCount = 0;
  }
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
  photos?: Photo[];
  following: boolean;
  followersCount: number;
  followingCount: number;
}

export class ProfileFormValues {
  constructor(user: User) {
    this.displayName = user.displayName;
  }
  displayName: string;
  bio?: string;
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
