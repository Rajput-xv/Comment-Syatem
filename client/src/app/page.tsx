'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPosts, Post } from '@/services/post';
import { MessageCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Home page displaying all posts
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts(page, 10);
      setPosts(data.posts);
      setHasMore(page < data.totalPages);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const data = await getPosts(page + 1, 10);
      setPosts((prev) => [...prev, ...data.posts]);
      setPage(page + 1);
      setHasMore(page + 1 < data.totalPages);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to CommentHub</h1>
        <p className="text-gray-600">Share your thoughts and engage with the community</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No posts yet. Be the first to create one!</p>
          <Link href="/posts/create" className="btn-primary inline-block">
            Create Post
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/posts/${post._id}`}>
                  <div className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
                        {post.author.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.author.username}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
                    <p className="text-gray-700 line-clamp-3 mb-4">{post.content}</p>

                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}

                    <div className="flex items-center text-gray-500">
                      <MessageCircle size={18} className="mr-1" />
                      <span className="text-sm">
                        {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button onClick={loadMore} className="btn-primary">
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
