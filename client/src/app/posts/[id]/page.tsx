'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost, Post } from '@/services/post';
import CommentList from '@/components/CommentList';
import { ArrowLeft, Calendar, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { deletePost } from '@/services/post';
import toast from 'react-hot-toast';

// Individual post detail page with comments
export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [params.id]);

  const loadPost = async () => {
    try {
      const data = await getPost(params.id as string);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post:', error);
      toast.error('Post not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(post!._id);
      toast.success('Post deleted');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && post && String(user.id) === String(post.author._id);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>

      <div className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
              {post.author.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{post.author.username}</p>
                {post.author.role === 'admin' && (
                  <span className="text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
              </div>
            </div>
          </div>

          {(isOwner || isAdmin) && (
            <div className="flex space-x-2">
              {isOwner && (
                <Link
                  href={`/posts/${post._id}/edit`}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                </Link>
              )}
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-700 text-lg whitespace-pre-wrap mb-6">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto rounded-lg"
          />
        )}
      </div>

      <CommentList postId={post._id} />
    </div>
  );
}
