'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPosts, Post } from '@/services/post';
import { MessageCircle, Calendar, PlusCircle } from 'lucide-react';
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
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold gradient-text mb-4 floating">
          Welcome to CommentHub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your thoughts and engage with a vibrant community ✨
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i} 
              className="glass-card animate-pulse"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-3/4 mb-4"></div>
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full mb-2"></div>
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
            </motion.div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div 
          className="glass-card text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
            <MessageCircle size={40} className="text-white" />
          </div>
          <p className="text-gray-600 text-lg mb-6">No posts yet. Be the first to create one!</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/posts/create" className="btn-primary inline-flex items-center space-x-2 shine-effect">
              <PlusCircle size={20} />
              <span>Create Post</span>
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <>
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link href={`/posts/${post._id}`}>
                  <div className="glass-card hover:shadow-2xl transition-all cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-4">
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {post.author.username.charAt(0).toUpperCase()}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{post.author.username}</p>
                          {post.author.role === 'admin' && (
                            <span className="text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 group-hover:gradient-text transition-all">{post.title}</h2>
                    <p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">{post.content}</p>

                    {post.image && (
                      <motion.img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-72 object-cover rounded-2xl mb-4 shadow-md"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="flex items-center space-x-2 text-indigo-600 font-medium">
                      <MessageCircle size={20} />
                      <span>
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
