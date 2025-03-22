"use client"
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Search, Menu } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/auth';
import { signOut } from "next-auth/react";

interface Post {
  id: string;
  title: string;
  description: string;
  photo: string | null;
  secureUrl: string | null;
  markdownContent: string | null;
  visibility: 'public' | 'private';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface PostCardProps {
  post: Post;
  index: number;
}

function PostCard({ post, index }: PostCardProps) {
  const { id, title, description, photo, secureUrl, createdAt } = post;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const imageUrl = secureUrl || photo;
 
  return (
    <div 
      className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-up"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards'
      }}
    >
      <div className="group relative overflow-hidden">
        <img
          src={imageUrl || "/api/placeholder/400/250"}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="animate-fade-in">{timeAgo}</span>
          <Link
            href={`/posts/${id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[0px]"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

function PostCardSkeleton() {
  return (
    <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}


interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  location?: string;
  website?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  coverPhoto: string;
  profilePic: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}
export default function BlogPage() {
  const [posts, setPosts] = React.useState<Post[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  const user = useCurrentUser();
  
  
 React.useEffect(() => {
    const fetchProfile = async () => {
      try {
       
        // Fetch profile data
        const profileResponse = await fetch(`/api/users?id=${user?.id}`);
        const profileData = await profileResponse.json();
        setProfile(profileData[0]);
        console.log("user",profileData[0]);
       
        

        // Fetch user's posts
      
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
      
      }
    };

    fetchProfile();
  }, []);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Filter only public posts
        const publicPosts = data.filter((post: Post) => post.visibility === 'public');
        setPosts(publicPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
 const handleLogout = async () => {
    await signOut({ redirectTo: "/auth/login" });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pb-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section: Menu Icon and Blogify Logo */}
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-500 mr-4 md:hidden cursor-pointer" />
              <h1 className="font-bold text-2xl md:text-[45px] ml-1 cursor-pointer text-red-500">
                Blogify
              </h1>
            </div>

            {/* Right Section: Search, Add Blog Button, and Profile */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <Link href="/dashboard/user">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Add Blog
                </button>
              </Link>

              {/* Profile Section */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200">
                    <img
                       src={profile?.profilePic || "/profile.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {handleLogout()}}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar for Mobile */}
          <div className="relative block md:hidden mt-2">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="flex justify-center items-center min-h-[200px] text-red-500 animate-fade-in">
            Error: {error}
          </div>
        ) : !posts ? (
          <div className="flex flex-wrap gap-6">
            {[...Array(6)].map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredPosts?.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px] animate-fade-in">
            No public posts found.
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {filteredPosts?.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
 
    </div>
  );
}