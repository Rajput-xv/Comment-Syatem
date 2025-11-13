'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, PlusCircle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Main navigation bar component
export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MessageCircle className="text-white" size={22} />
            </motion.div>
            <span className="text-xl font-bold gradient-text">CommentHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/posts/create" className="btn-primary flex items-center space-x-2 shine-effect">
                    <PlusCircle size={18} />
                    <span>Create Post</span>
                  </Link>
                </motion.div>
                <div className="flex items-center space-x-3 pl-4 border-l border-white/30">
                  <motion.div 
                    className="flex items-center space-x-2 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{user?.username}</span>
                      {isAdmin && (
                        <span className="text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login" className="btn-secondary">
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="btn-primary shine-effect">
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{user?.username}</p>
                        {isAdmin && (
                          <span className="text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/posts/create"
                    className="flex items-center space-x-2 w-full btn-primary justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PlusCircle size={18} />
                    <span>Create Post</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full btn-secondary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
