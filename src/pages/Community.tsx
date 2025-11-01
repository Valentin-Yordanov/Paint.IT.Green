import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, School, Users } from "lucide-react";
import studentsImage from "@/assets/students-planting.jpg";

const Community = () => {
  const posts = [
    {
      school: "Lincoln Elementary",
      author: "Principal Johnson",
      role: "Principal",
      time: "2 hours ago",
      content: "Incredible turnout for our tree planting event today! Our students planted 50 trees around the school campus. So proud of everyone's dedication to our environment! 🌳",
      image: studentsImage,
      likes: 124,
      comments: 18,
      isPublic: true,
    },
    {
      school: "Roosevelt High",
      author: "Ms. Anderson",
      role: "Teacher",
      time: "5 hours ago",
      content: "Our 10th grade class organized a beach cleanup this weekend. We collected over 200 pounds of trash! The students showed amazing leadership and teamwork.",
      likes: 89,
      comments: 12,
      isPublic: true,
    },
    {
      school: "Washington Middle",
      author: "Mr. Chen",
      role: "Teacher",
      time: "1 day ago",
      content: "Week 3 of our recycling challenge! Students have collected and sorted over 500 plastic bottles. They're learning firsthand how much waste we can prevent from going to landfills.",
      likes: 67,
      comments: 8,
      isPublic: false,
    },
    {
      school: "Jefferson Academy",
      author: "Principal Martinez",
      role: "Principal",
      time: "2 days ago",
      content: "Excited to announce our new butterfly garden! Students designed and planted it themselves. Can't wait to see all the pollinators it attracts this spring! 🦋",
      likes: 95,
      comments: 15,
      isPublic: true,
    },
  ];

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
          {posts.map((post, index) => (
            <Card key={index} className="border-border bg-card">
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
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
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
