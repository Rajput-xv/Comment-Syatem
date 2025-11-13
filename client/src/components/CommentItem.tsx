'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Comment } from '@/services/comment';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toggleLike, deleteComment, updateComment } from '@/services/comment';
import toast from 'react-hot-toast';
import CommentForm from './CommentForm';
import CommentReplies from './CommentReplies';

interface CommentItemProps {
  comment: Comment;
  onUpdate: () => void;
  level?: number;
}

// Single comment/reply item with actions
export default function CommentItem({ comment, onUpdate, level = 0 }: CommentItemProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(comment.likes.includes(user?.id || ''));
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = user?.id === comment.author._id;
  const isAdmin = user?.role === 'admin';

  const handleLike = async () => {
    if (!user?.isVerified) {
      toast.error('Please verify your email to like comments');
      return;
    }

    try {
      const result = await toggleLike(comment._id);
      setIsLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to like comment');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(comment._id);
      toast.success('Comment deleted');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await updateComment(comment._id, editContent);
      toast.success('Comment updated');
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}
    >
      <div className="bg-white rounded-lg p-4 mb-3 hover:shadow-sm transition-shadow">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium flex-shrink-0">
            {comment.author.username.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{comment.author.username}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && <span className="text-xs text-gray-400 ml-2">(edited)</span>}
              </div>

              {(isOwner || isAdmin) && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                      {isOwner && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                />
                <div className="flex space-x-2 mt-2">
                  <button onClick={handleEdit} className="btn-primary text-sm">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            )}

            <div className="flex items-center space-x-4 mt-3">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-sm transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <MessageCircle size={16} />
                <span>Reply</span>
              </button>

              {comment.repliesCount > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showReplies ? 'Hide' : 'View'} {comment.repliesCount}{' '}
                  {comment.repliesCount === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>

            {showReplyForm && (
              <div className="mt-3">
                <CommentForm
                  postId={comment.post}
                  parentCommentId={comment._id}
                  onSuccess={() => {
                    setShowReplyForm(false);
                    setShowReplies(true);
                    onUpdate();
                  }}
                  placeholder="Write a reply..."
                />
              </div>
            )}

            {showReplies && (
              <CommentReplies commentId={comment._id} level={level + 1} onUpdate={onUpdate} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
