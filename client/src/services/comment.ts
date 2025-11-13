import api from '@/lib/axios';

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    role: string;
  };
  post: string;
  parentComment: string | null;
  likes: string[];
  likesCount: number;
  repliesCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create comment or reply
export const createComment = async (content: string, postId: string, parentCommentId?: string) => {
  const response = await api.post('/comments', { content, postId, parentCommentId });
  return response.data;
};

// Get comments for a post
export const getComments = async (postId: string, page = 1, limit = 10, sort = 'recent') => {
  const response = await api.get(`/comments/post/${postId}?page=${page}&limit=${limit}&sort=${sort}`);
  return response.data;
};

// Get replies for a comment
export const getReplies = async (commentId: string, page = 1, limit = 5, sort = 'recent') => {
  const response = await api.get(`/comments/${commentId}/replies?page=${page}&limit=${limit}&sort=${sort}`);
  return response.data;
};

// Update comment
export const updateComment = async (id: string, content: string) => {
  const response = await api.put(`/comments/${id}`, { content });
  return response.data;
};

// Delete comment
export const deleteComment = async (id: string) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

// Toggle like on comment
export const toggleLike = async (id: string) => {
  const response = await api.post(`/comments/${id}/like`);
  return response.data;
};

// Get users who liked
export const getLikes = async (id: string) => {
  const response = await api.get(`/comments/${id}/likes`);
  return response.data;
};
