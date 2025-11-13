'use client';

import React, { useState } from 'react';
import { createComment } from '@/services/comment';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onSuccess: () => void;
  placeholder?: string;
}

// Form component for creating comments and replies
export default function CommentForm({
  postId,
  parentCommentId,
  onSuccess,
  placeholder = 'Write a comment...',
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.isVerified) {
      toast.error('Please verify your email to comment');
      return;
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await createComment(content, postId, parentCommentId);
      toast.success(parentCommentId ? 'Reply added' : 'Comment added');
      setContent('');
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">Please login to comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium flex-shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="input-field resize-none"
            rows={3}
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isLoading || !content.trim()} className="btn-primary">
          {isLoading ? 'Posting...' : parentCommentId ? 'Reply' : 'Comment'}
        </button>
      </div>
    </form>
  );
}
