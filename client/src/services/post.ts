import api from '@/lib/axios';

export interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    role: string;
  };
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

// Get all posts with pagination
export const getPosts = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
};

// Get single post
export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// Create new post
export const createPost = async (title: string, content: string, image?: string) => {
  const response = await api.post('/posts', { title, content, image });
  return response.data;
};

// Update post
export const updatePost = async (id: string, title: string, content: string, image?: string) => {
  const response = await api.put(`/posts/${id}`, { title, content, image });
  return response.data;
};

// Delete post
export const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};
