"use client"
import React from 'react';

import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Calendar, User, Eye, Edit2, Trash2, X, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MarkdownRenderer from '@/components/shared/Markdown';

interface Post {
  id: string;
  title: string;
  description: string;
  photo: string | null;
  secureUrl: string | null;
  markdownContent: string | null;
  visibility: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

function PostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-96 bg-gray-200 rounded-lg mb-8" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function PostPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [post, setPost] = React.useState<Post | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState("");
  const [editedTitle, setEditedTitle] = React.useState("");
  const [editedDescription, setEditedDescription] = React.useState("");
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  // Fetch current user ID on component mount
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setCurrentUserId(data.id);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  React.useEffect(() => {
    const postId = pathname?.split('/').pop();
    
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPost(data);
        setEditedContent(data.markdownContent || '');
        setEditedTitle(data.title);
        setEditedDescription(data.description);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [pathname]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!post) return;
    
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          markdownContent: editedContent
        }),
      });

      if (!response.ok) throw new Error('Failed to update post');
      
      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      router.push('/');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const isAuthor = currentUserId === post?.createdBy;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to posts
          </Link>
          <div className="flex justify-center items-center min-h-[400px] text-red-500">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <PostSkeleton />;
  if (!post) return <div>Post not found.</div>;

  const imageUrl = post.secureUrl || post.photo;
  const formattedDate = format(new Date(post.createdAt), 'MMMM dd, yyyy');
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to posts
          </Link>
          
          {isAuthor && !isEditing && (
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}
          
          {isEditing && (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                variant="default"
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-2 py-8">
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src={imageUrl || "/api/placeholder/800/400"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full text-4xl font-bold mb-4 p-2 border rounded"
              />
            ) : (
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            )}
            
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.createdAt} title={formattedDate}>{timeAgo}</time>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Author ID: {post.createdBy.slice(0, 8)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="capitalize">{post.visibility}</span>
              </div>
            </div>
          </header>

          <div className="prose max-w-none">
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full text-xl mb-8 p-2 border rounded"
                rows={3}
              />
            ) : (
              <div className="text-xl text-gray-600 mb-8">
                {post.description}
              </div>
            )}

            <div className="mb-8">
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[400px] p-4 border rounded font-mono"
                />
              ) : (
                post.markdownContent ? (
                  <div className="markdown-content">
                  
                 <MarkdownRenderer content={post.markdownContent} />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No additional content available.</p>
                )
              )}
            </div>
          </div>

          <footer className="mt-8 pt-8 border-t text-sm text-gray-500">
            Last updated: {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
          </footer>
        </article>
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}