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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={`${level > 0 ? 'ml-8 border-l-2 border-gradient-to-b from-indigo-200 to-purple-200 pl-6' : ''}`}
    >
      <div className="glass-card p-5 mb-4 hover:shadow-xl transition-all group">
        <div className="flex items-start space-x-4">
          <motion.div 
            className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            {comment.author.username.charAt(0).toUpperCase()}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{comment.author.username}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && <span className="text-xs text-indigo-500 font-medium">(edited)</span>}
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
              <motion.div 
                className="mt-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                />
                <div className="flex space-x-2 mt-3">
                  <motion.button 
                    onClick={handleEdit} 
                    className="btn-primary text-sm px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="btn-secondary text-sm px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <p className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            )}

            <div className="flex items-center space-x-6 mt-4">
              <motion.button
                onClick={handleLike}
                className={`flex items-center space-x-2 text-sm font-medium transition-all ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                </motion.div>
                <span className="font-semibold">{likesCount}</span>
              </motion.button>

              <motion.button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={18} />
                <span>Reply</span>
              </motion.button>

              {comment.repliesCount > 0 && (
                <motion.button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showReplies ? 'Hide' : 'View'} {comment.repliesCount}{' '}
                  {comment.repliesCount === 1 ? 'reply' : 'replies'}
                </motion.button>
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
