import api from './api';
import type{ AuthResponse, CreatePostResponse, DeletePostResponse, Post, PostsResponse, UpdatePostResponse } from '@/types/apiTypes';

/**
 * 创建新帖子 - 根据图片1的接口格式
 * 
 * @param {Object} data - 创建帖子所需的数据
 * @param {string} data.title - 帖子标题
 * @param {number} data.userId - 用户ID
 * @param {string} [data.body] - 帖子内容（可选）
 * @param {string[]} [data.tags] - 标签列表（可选）
 * 
 * @returns {Promise<CreatePostResponse>} - 包含新帖子ID的响应
 */
export const createPost = async (data: {
  title: string;
  userId: number;
  body?: string;
  tags?: string[];
}): Promise<CreatePostResponse> => {
  return api.post('/posts/add', {
    title: data.title,
    userId: data.userId,
    body: data.body || "",
    tags: data.tags || [],
    // 其他可选字段可以在这里添加
  });
};

/**
 * 更新帖子 - 根据图片2的接口格式
 * 
 * @param {number} id - 要更新的帖子ID
 * @param {Object} data - 更新的数据
 * @param {string} [data.title] - 新标题
 * @param {string} [data.body] - 新内容
 * @param {string[]} [data.tags] - 新标签
 * 
 * @returns {Promise<UpdatePostResponse>} - 更新后的完整帖子对象
 */
export const updatePost = async (
  id: number, 
  data: Partial<{
    title: string;
    body: string;
    tags: string[];
  }>
): Promise<UpdatePostResponse> => {
  return api.put(`/posts/${id}`, {
    ...data
  });
};

/**
 * 删除帖子 - 根据图片3的接口格式
 * 
 * @param {number} id - 要删除的帖子ID
 * @returns {Promise<DeletePostResponse>} - 包含删除标记的帖子对象
 */
export const deletePost = async (id: number): Promise<DeletePostResponse> => {
  return api.delete(`/posts/${id}`);
};

export const fetchPosts = async (limit: number = 10, skip: number = 0, searchTerm?: string): Promise<PostsResponse> => {
  // 如果有搜索词，使用搜索API
  if (searchTerm) {
    return api.get(`/posts/search?q=${encodeURIComponent(searchTerm)}`);
  }
  
  // 否则获取帖子列表
  return api.get(`/posts?limit=${limit}&skip=${skip}`);
};

// 添加搜索帖子的API
export const searchPosts = async (query: string): Promise<PostsResponse> => {
  return api.get(`/posts/search?q=${encodeURIComponent(query)}`);
};


export const fetchPostById = async (id: string): Promise<Post> => {
  return api.get(`/posts/${id}`);
};

export const login = async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
  return api.post('/auth/login', credentials);
};