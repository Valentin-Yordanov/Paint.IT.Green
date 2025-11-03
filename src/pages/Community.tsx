import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, School, Users, Send } from "lucide-react";
import studentsImage from "@/assets/students-planting.jpg";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const { toast } = useToast();
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
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

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Community Feed
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrate achievements and share environmental initiatives from schools around the world
          </p>
        </div>

        {/* Filter badges */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Badge variant="default" className="cursor-pointer">All Posts</Badge>
          <Badge variant="outline" className="cursor-pointer gap-1">
            <Users className="h-3 w-3" />
            Public Only
          </Badge>
          <Badge variant="outline" className="cursor-pointer gap-1">
            <School className="h-3 w-3" />
            My School
          </Badge>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
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
                <p className="text-foreground leading-relaxed">{post.content}</p>
                
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
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{comment.author}</span>
                                <Badge variant="outline" className="text-xs">
                                  {comment.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{comment.time}</span>
                              </div>
                              <p className="text-sm text-foreground mt-1">{comment.content}</p>
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

        {/* Info Card */}
        <Card className="mt-8 bg-primary text-primary-foreground border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Want to share your school's achievements?</h3>
            <p className="opacity-90 mb-4">
              Teachers and principals can post updates to celebrate student efforts and inspire other schools.
            </p>
            <Button variant="secondary">Learn More About Posting</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
