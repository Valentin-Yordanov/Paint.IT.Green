import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, School, Users, Send, Plus, Edit, Trash2, Image } from "lucide-react";
import studentsImage from "@/assets/students-planting.jpg";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Community = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [editingComment, setEditingComment] = useState<{ postId: number; commentIdx: number } | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSchool, setNewPostSchool] = useState("Lincoln Elementary");
  const [newPostVisibility, setNewPostVisibility] = useState<"public" | "school">("public");
  const [newPostImage, setNewPostImage] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<"public" | "myPosts" | "mySchool">("public");
  const [posts, setPosts] = useState([
    {
      id: 0,
      school: "Lincoln Elementary",
      author: "Principal Johnson",
      role: "Principal",
      time: "2 hours ago",
      content: "Incredible turnout for our tree planting event today! Our students planted 50 trees around the school campus. So proud of everyone's dedication to our environment! 🌳",
      image: studentsImage,
      likes: 124,
      comments: [
        { author: "Ms. Smith", role: "Teacher", content: "Amazing work! Our school should do something similar.", time: "1 hour ago" },
        { author: "Parent Davis", role: "Parent", content: "So proud of these kids! Great initiative.", time: "30 minutes ago" }
      ],
      isPublic: true,
    },
    {
      id: 1,
      school: "Roosevelt High",
      author: "Ms. Anderson",
      role: "Teacher",
      time: "5 hours ago",
      content: "Our 10th grade class organized a beach cleanup this weekend. We collected over 200 pounds of trash! The students showed amazing leadership and teamwork.",
      likes: 89,
      comments: [
        { author: "Mr. Johnson", role: "Teacher", content: "Fantastic effort by your students!", time: "3 hours ago" }
      ],
      isPublic: true,
    },
    {
      id: 2,
      school: "Washington Middle",
      author: "Mr. Chen",
      role: "Teacher",
      time: "1 day ago",
      content: "Week 3 of our recycling challenge! Students have collected and sorted over 500 plastic bottles. They're learning firsthand how much waste we can prevent from going to landfills.",
      likes: 67,
      comments: [],
      isPublic: false,
    },
    {
      id: 3,
      school: "Jefferson Academy",
      author: "Principal Martinez",
      role: "Principal",
      time: "2 days ago",
      content: "Excited to announce our new butterfly garden! Students designed and planted it themselves. Can't wait to see all the pollinators it attracts this spring! 🦋",
      likes: 95,
      comments: [
        { author: "Ms. Brown", role: "Teacher", content: "Beautiful! Can't wait to see it bloom.", time: "1 day ago" }
      ],
      isPublic: true,
    },
  ]);

  const toggleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      ));
    } else {
      newLikedPosts.add(postId);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    }
    setLikedPosts(newLikedPosts);
  };

  const toggleComments = (postId: number) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) {
      newShowComments.delete(postId);
    } else {
      newShowComments.add(postId);
    }
    setShowComments(newShowComments);
  };

  const handleAddComment = (postId: number) => {
    const comment = newComment[postId]?.trim();
    if (!comment) return;

    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [
              ...post.comments, 
              { author: "You", role: "User", content: comment, time: "Just now" }
            ] 
          } 
        : post
    ));
    
    setNewComment({ ...newComment, [postId]: "" });
    toast({
      title: "Comment added!",
      description: "Your comment has been posted successfully.",
    });
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: posts.length,
      school: newPostSchool,
      author: "You",
      role: "User",
      time: "Just now",
      content: newPostContent,
      image: newPostImage,
      likes: 0,
      comments: [],
      isPublic: newPostVisibility === "public",
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostImage(undefined);
    setNewPostVisibility("public");
    setIsCreateDialogOpen(false);
    toast({
      title: "Post created!",
      description: "Your post has been shared with the community.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been removed.",
    });
  };

  const handleEditPost = (postId: number) => {
    if (!editPostText.trim()) return;
    
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, content: editPostText } : post
    ));
    setEditingPost(null);
    toast({
      title: "Post updated",
      description: "Your post has been updated successfully.",
    });
  };

  const handleDeleteComment = (postId: number, commentIdx: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments.filter((_, idx) => idx !== commentIdx) }
        : post
    ));
    toast({
      title: "Comment deleted",
      description: "Your comment has been removed.",
    });
  };

  const handleEditComment = (postId: number, commentIdx: number) => {
    if (!editCommentText.trim()) return;

    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: post.comments.map((comment, idx) => 
              idx === commentIdx ? { ...comment, content: editCommentText } : comment
            )
          }
        : post
    ));
    setEditingComment(null);
    toast({
      title: "Comment updated",
      description: "Your comment has been updated successfully.",
    });
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "public") return post.isPublic;
    if (activeFilter === "myPosts") return post.author === "You";
    if (activeFilter === "mySchool") return post.school === "Lincoln Elementary"; // Replace with actual user school
    return true;
  });

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('community.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('community.subtitle')}
          </p>
        </div>

        {/* Filter badges */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <Badge 
            variant={activeFilter === "public" ? "default" : "outline"} 
            className="cursor-pointer gap-1"
            onClick={() => setActiveFilter("public")}
          >
            <Users className="h-3 w-3" />
            {t('community.public')}
          </Badge>
          <Badge 
            variant={activeFilter === "mySchool" ? "default" : "outline"} 
            className="cursor-pointer gap-1"
            onClick={() => setActiveFilter("mySchool")}
          >
            <School className="h-3 w-3" />
            {t('community.mySchool')}
          </Badge>
          <Badge 
            variant={activeFilter === "myPosts" ? "default" : "outline"} 
            className="cursor-pointer gap-1"
            onClick={() => setActiveFilter("myPosts")}
          >
            <Users className="h-3 w-3" />
            {t('community.myPosts')}
          </Badge>
        </div>

        {/* Create Post Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 px-8 py-6 text-lg">
                <Plus className="h-6 w-6" />
                {t('community.createPost')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">School</label>
                  <Input
                    value={newPostSchool}
                    onChange={(e) => setNewPostSchool(e.target.value)}
                    placeholder="Your school name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newPostVisibility === "public" ? "default" : "outline"}
                      onClick={() => setNewPostVisibility("public")}
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Public
                    </Button>
                    <Button
                      type="button"
                      variant={newPostVisibility === "school" ? "default" : "outline"}
                      onClick={() => setNewPostVisibility("school")}
                      className="flex-1"
                    >
                      <School className="h-4 w-4 mr-2" />
                      My School Only
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">What's happening?</label>
                  <Textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your environmental achievements..."
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Add Image (Optional)</label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {newPostImage && (
                      <div className="relative rounded-lg overflow-hidden">
                        <img src={newPostImage} alt="Preview" className="w-full h-auto" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setNewPostImage(undefined)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={handleCreatePost} 
                  disabled={!newPostContent.trim()}
                  className="w-full"
                >
                  Post to Community
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <School className="h-3 w-3" />
                        <span>{post.school}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={post.isPublic ? "default" : "outline"}>
                    {post.isPublic ? "Public" : "School Only"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingPost === post.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editPostText}
                      onChange={(e) => setEditPostText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditPost(post.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingPost(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-foreground leading-relaxed">{post.content}</p>
                    {post.author === "You" && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setEditingPost(post.id);
                            setEditPostText(post.content);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {post.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.likes}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments.length}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => {
                      toast({
                        title: "Shared!",
                        description: "Post link copied to clipboard.",
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Comments Section */}
                {showComments.has(post.id) && (
                  <div className="pt-4 border-t border-border space-y-4">
                    {post.comments.length > 0 ? (
                      <div className="space-y-3">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary text-xs">
                                {comment.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {editingComment?.postId === post.id && editingComment?.commentIdx === idx ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    className="min-h-[60px]"
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleEditComment(post.id, idx)}>
                                      Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingComment(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{comment.author}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {comment.role}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                                  </div>
                                  <p className="text-sm text-foreground mt-1">{comment.content}</p>
                                  {comment.author === "You" && (
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs gap-1"
                                        onClick={() => {
                                          setEditingComment({ postId: post.id, commentIdx: idx });
                                          setEditCommentText(comment.content);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteComment(post.id, idx)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                      </Button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment[post.id] || ""}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        className="min-h-[60px]"
                      />
                      <Button 
                        size="icon"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComment[post.id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
