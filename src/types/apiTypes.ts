// ======================== 认证相关类型 ========================
export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  image: string;
  token: string; // JWT token
 accessToken: string 
}

// ======================== 帖子相关类型 ========================
export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReactions;
  views: number;
  userId: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}


// 创建帖子请求 
export interface CreatePostRequest {
  title: string;
  userId: number;
  body?: string;
  tags?: string[];
}

// 创建帖子响应
export interface CreatePostResponse {
  id: number;
  title: string;
  userId: number;
  body?: string;
  tags?: string[];
  reactions?: PostReactions;
  views?: number;
}

// 更新帖子请求
export interface UpdatePostRequest {
  title?: string;
  body?: string;
  tags?: string[];
  [key: string]: any;
}

// 更新帖子响应 
export interface UpdatePostResponse extends Post {}

// 删除帖子响应 
export interface DeletePostResponse extends Post {
  isDeleted: boolean;
  deletedOn: string; // ISO 8601格式时间
}