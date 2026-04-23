export interface User {
  id: string;
  name: string;
  username: string;
  imageUrl?: string;
  followers?: any[];
  following?: any[];
  createdAt: string;
  updatedAt?: string;
}

export interface Like {
  author: User;
  createdAt?: string;
}

export interface Tweet {
  id: string;
  content: string;
  authorId: string;
  tweetId?: string;
  type: 'NORMAL' | 'REPLY';
  createdAt: string;
  updatedAt?: string;
  author?: User;
  likes?: Like[];
  replies?: Tweet[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface FollowersResponse {
  followers: User[];
  following: User[];
}
