'use client';

import React, { useState, useEffect } from 'react';
import { getComments, Comment } from '@/services/comment';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { ChevronDown } from 'lucide-react';

interface CommentListProps {
  postId: string;
}

// Component to display and paginate post comments
export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'liked'>('recent');
  const [total, setTotal] = useState(0);

  const loadComments = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await getComments(postId, pageNum, 10, sortBy);
      if (pageNum === 1) {
        setComments(data.comments);
      } else {
        setComments((prev) => [...prev, ...data.comments]);
      }
      setHasMore(pageNum < data.totalPages);
      setTotal(data.total);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments(1);
  }, [postId, sortBy]);

  const handleLoadMore = () => {
    loadComments(page + 1);
  };

  const handleUpdate = () => {
    loadComments(1);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
        <CommentForm postId={postId} onSuccess={handleUpdate} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {total} {total === 1 ? 'Comment' : 'Comments'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <button
              onClick={() => setSortBy('recent')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sortBy === 'recent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('liked')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                sortBy === 'liked'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Most Liked
            </button>
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} onUpdate={handleUpdate} />
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-secondary flex items-center space-x-2 mx-auto"
                >
                  <ChevronDown size={18} />
                  <span>{loading ? 'Loading...' : 'Load More Comments'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
