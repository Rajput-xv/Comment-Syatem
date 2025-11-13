'use client';

import React, { useState, useEffect } from 'react';
import { getReplies, Comment } from '@/services/comment';
import CommentItem from './CommentItem';
import { ChevronDown } from 'lucide-react';

interface CommentRepliesProps {
  commentId: string;
  level: number;
  onUpdate: () => void;
}

// Component to display and paginate comment replies
export default function CommentReplies({ commentId, level, onUpdate }: CommentRepliesProps) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'liked'>('recent');

  const loadReplies = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await getReplies(commentId, pageNum, 5, sortBy);
      if (pageNum === 1) {
        setReplies(data.replies);
      } else {
        setReplies((prev) => [...prev, ...data.replies]);
      }
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReplies(1);
  }, [commentId, sortBy]);

  const handleLoadMore = () => {
    loadReplies(page + 1);
  };

  const handleUpdate = () => {
    loadReplies(1);
    onUpdate();
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center space-x-2 mb-3">
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

      {loading && page === 1 ? (
        <div className="text-center py-4">
          <div className="inline-block w-6 h-6 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} onUpdate={handleUpdate} level={level} />
          ))}

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium ml-12 mt-2"
            >
              <ChevronDown size={16} />
              <span>{loading ? 'Loading...' : 'Load more replies'}</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
