import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Share2,
  School,
  Users,
  Send,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Globe,
  Shield,
  Menu,
  X,
  LayoutGrid,
} from "lucide-react";
import studentsImage from "@/assets/students-planting.jpg";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// --- MOCK DATA ---
const MOCK_USER = {
  role: "student",
  school: "Lincoln Elementary",
  class: "Ms. Smith - 5th Grade",
  name: "Current User",
};
const ALL_SCHOOLS = [
  "Lincoln Elementary",
  "Roosevelt High",
  "Jefferson Academy",
  "Washington Middle",
];
const ALL_CLASSES = [
  "Ms. Smith - 5th Grade",
  "Mr. Chen - 6th Grade",
  "Ms. Anderson - 10th Grade",
];
// --- END MOCK DATA ---

// --- EXPLICIT TYPES ---
type Comment = {
  author: string;
  role: string;
  content: string;
  time: string;
};

type Post = {
  id: number;
  school: string;
  author: string;
  role: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  visibility: "public" | "school" | "class";
  targetGroup?: string;
};
// --- END TYPES ---

const Community = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [editingComment, setEditingComment] = useState<{
    postId: number;
    commentIdx: number;
  } | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSchool, setNewPostSchool] = useState(MOCK_USER.school);
  const [newPostVisibility, setNewPostVisibility] = useState<
    "public" | "school" | "class"
  >("public");
  const [newPostImage, setNewPostImage] = useState<string | undefined>(
    undefined
  );
  const [activeFeed, setActiveFeed] = useState<string>("public");

  // Mobile Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial post data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 0,
      school: "Lincoln Elementary",
      author: "Principal Johnson",
      role: "Principal",
      time: "2 hours ago",
      content:
        "Incredible turnout for our tree planting event today! Our students planted 50 trees around the school campus. So proud of everyone's dedication to our environment! 🌳",
      image: studentsImage,
      likes: 124,
      comments: [
        {
          author: "Ms. Smith",
          role: "Teacher",
          content: "Amazing work! Our school should do something similar.",
          time: "1 hour ago",
        },
        {
          author: "Parent Davis",
          role: "Parent",
          content: "So proud of these kids! Great initiative.",
          time: "30 minutes ago",
        },
      ],
      visibility: "public",
    },
    {
      id: 1,
      school: "Roosevelt High",
      author: "Ms. Anderson",
      role: "Teacher",
      time: "5 hours ago",
      content:
        "Our 10th grade class organized a beach cleanup this weekend. We collected over 200 pounds of trash! The students showed amazing leadership and teamwork.",
      likes: 89,
      comments: [
        {
          author: "Mr. Johnson",
          role: "Teacher",
          content: "Fantastic effort by your students!",
          time: "3 hours ago",
        },
      ],
      visibility: "public",
    },
    {
      id: 2,
      school: "Lincoln Elementary",
      author: "Mr. Chen",
      role: "Teacher",
      time: "1 day ago",
      content:
        "Week 3 of our recycling challenge! Students have collected and sorted over 500 plastic bottles. They're learning firsthand how much waste we can prevent from going to landfills.",
      likes: 67,
      comments: [],
      visibility: "school",
    },
    {
      id: 3,
      school: "Jefferson Academy",
      author: "Principal Martinez",
      role: "Principal",
      time: "2 days ago",
      content:
        "Excited to announce our new butterfly garden! Students designed and planted it themselves. Can't wait to see all the pollinators it attracts this spring! 🦋",
      likes: 95,
      comments: [
        {
          author: "Ms. Brown",
          role: "Teacher",
          content: "Beautiful! Can't wait to see it bloom.",
          time: "1 day ago",
        },
      ],
      visibility: "public",
    },
    {
      id: 4,
      school: "Lincoln Elementary",
      author: "Ms. Smith",
      role: "Teacher",
      time: "30 minutes ago",
      content:
        "Reminder: Field trip permission slips for the class garden visit are due tomorrow!",
      likes: 5,
      comments: [],
      visibility: "class",
      targetGroup: "Ms. Smith - 5th Grade",
    },
  ]);

  const toggleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    } else {
      newLikedPosts.add(postId);
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
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
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  author: MOCK_USER.name,
                  role: MOCK_USER.role,
                  content: comment,
                  time: "Just now",
                },
              ],
            }
          : post
      )
    );
    setNewComment({ ...newComment, [postId]: "" });
    toast({
      title: t('community.commentAdded'),
      description: t('community.commentAddedDesc'),
    });
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: posts.length,
      school: newPostSchool,
      author: MOCK_USER.name,
      role: MOCK_USER.role,
      time: "Just now",
      content: newPostContent,
      image: newPostImage,
      likes: 0,
      comments: [],
      visibility: newPostVisibility,
      targetGroup: newPostVisibility === "class" ? MOCK_USER.class : undefined,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostImage(undefined);
    setIsCreateDialogOpen(false);
    toast({
      title: t('community.postCreated'),
      description: t('community.postCreatedDesc'),
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
    setPosts(posts.filter((post) => post.id !== postId));
    toast({
      title: t('community.postDeleted'),
      description: t('community.postDeletedDesc'),
    });
  };

  const handleEditPost = (postId: number) => {
    if (!editPostText.trim()) return;
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, content: editPostText } : post
      )
    );
    setEditingPost(null);
    toast({
      title: t('community.postUpdated'),
      description: t('community.postUpdatedDesc'),
    });
  };

  const handleDeleteComment = (postId: number, commentIdx: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((_, idx) => idx !== commentIdx),
            }
          : post
      )
    );
    toast({
      title: t('community.commentDeleted'),
      description: t('community.commentDeletedDesc'),
    });
  };

  const handleEditComment = (postId: number, commentIdx: number) => {
    if (!editCommentText.trim()) return;
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment, idx) =>
                idx === commentIdx
                  ? { ...comment, content: editCommentText }
                  : comment
              ),
            }
          : post
      )
    );
    setEditingComment(null);
    toast({
      title: t('community.commentUpdated'),
      description: t('community.commentUpdatedDesc'),
    });
  };

  const handleOpenCreateDialog = (isOpen: boolean) => {
    if (isOpen) {
      if (activeFeed === "mySchool" || ALL_SCHOOLS.includes(activeFeed)) {
        setNewPostVisibility("school");
      } else if (activeFeed === "myClass") {
        setNewPostVisibility("class");
      } else {
        setNewPostVisibility("public");
      }

      if (ALL_SCHOOLS.includes(activeFeed)) {
        setNewPostSchool(activeFeed);
      } else {
        setNewPostSchool(MOCK_USER.school);
      }
    }
    setIsCreateDialogOpen(isOpen);
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFeed === "public") {
      return post.visibility === "public";
    }
    if (activeFeed === "mySchool") {
      return (
        post.school === MOCK_USER.school &&
        (post.visibility === "school" || post.visibility === "public")
      );
    }
    if (activeFeed === "myClass") {
      return (
        post.school === MOCK_USER.school &&
        post.visibility === "class" &&
        post.targetGroup === MOCK_USER.class
      );
    }
    if (MOCK_USER.role === "moderator" && ALL_SCHOOLS.includes(activeFeed)) {
      return post.school === activeFeed;
    }
    if (MOCK_USER.role === "moderator" && ALL_CLASSES.includes(activeFeed)) {
      return post.targetGroup === activeFeed;
    }
    return false;
  });

  const getFeedTitle = () => {
    if (activeFeed === "public") return t("community.public");
    if (activeFeed === "mySchool") return MOCK_USER.school;
    if (activeFeed === "myClass") return MOCK_USER.class;
    if (ALL_SCHOOLS.includes(activeFeed)) return activeFeed;
    if (ALL_CLASSES.includes(activeFeed)) return activeFeed;
    return t("community.title");
  };

  const getFeedSubtitle = () => {
    if (activeFeed === "public")
      return t("community.publicSubtitle");
    if (activeFeed === "mySchool") return t("community.schoolSubtitle");
    if (activeFeed === "myClass") return t("community.classSubtitle");
    return t("community.groupUpdates");
  };

  // --- DYNAMIC HEADER INFO ---
  const getHeaderDetails = () => {
    if (activeFeed === "public") {
      return {
        title: t("community.public"),
        subtitle: t("community.globalCommunity"),
        icon: <Globe size={20} />,
      };
    }
    if (activeFeed === "mySchool") {
      return {
        title: MOCK_USER.school,
        subtitle: t("community.mySchool"),
        icon: <School size={20} />,
      };
    }
    if (activeFeed === "myClass") {
      return {
        title: MOCK_USER.class,
        subtitle: t("community.myClass"),
        icon: <Users size={20} />,
      };
    }
    // Moderator views specific school
    if (ALL_SCHOOLS.includes(activeFeed)) {
      return {
        title: activeFeed,
        subtitle: t("community.schoolGroup"),
        icon: <School size={20} />,
      };
    }
    // Moderator views specific class
    if (ALL_CLASSES.includes(activeFeed)) {
      return {
        title: activeFeed,
        subtitle: t("community.classGroup"),
        icon: <Users size={20} />,
      };
    }
    // Fallback
    return {
      title: t("community.title"),
      subtitle: "Paint IT Green",
      icon: <LayoutGrid size={20} />,
    };
  };

  const headerDetails = getHeaderDetails();

  // --- REUSABLE SIDEBAR BUTTON COMPONENT ---
  const SidebarButton = ({
    active,
    icon,
    label,
    onClick,
  }: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full justify-start gap-3 h-12 px-4 mb-1 relative transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      onClick={() => {
        onClick();
        setIsMobileMenuOpen(false); // Close sidebar on mobile when clicked
      }}
    >
      {/* Active Indicator Line */}
      {active && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
      )}
      <span className={active ? "text-primary" : "text-muted-foreground"}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Button>
  );

  return (
    <div className="flex w-full min-h-screen bg-background relative">
      {/* --- MOBILE OVERLAY (Darkens background when sidebar is open) --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR NAVIGATION (LEFT) --- */}
      <aside
        className={`
          fixed md:sticky top-0 h-screen w-[280px] z-50 
          bg-card border-r shadow-lg md:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          flex flex-col
        `}
      >
        {/* FIXED HEADER SECTION - NOW DYNAMIC */}
        <div className="p-6 shrink-0 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transition-all duration-300">
              {headerDetails.icon}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg leading-tight tracking-tight truncate">
                {headerDetails.title}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {headerDetails.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* SCROLLABLE NAVIGATION SECTION */}
        <nav className="flex-1 overflow-y-auto p-6">
          {/* Main Feeds */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-4">
              {t("community.feeds")}
            </h3>
            <SidebarButton
              active={activeFeed === "public"}
              icon={<Globe size={18} />}
              label={t("community.public")}
              onClick={() => setActiveFeed("public")}
            />
          </div>

          {/* Groups */}
          {MOCK_USER.role === "student" && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-4 mt-6">
                {t("community.myGroups")}
              </h3>
              <SidebarButton
                active={activeFeed === "mySchool"}
                icon={<School size={18} />}
                label={MOCK_USER.school}
                onClick={() => setActiveFeed("mySchool")}
              />
              <SidebarButton
                active={activeFeed === "myClass"}
                icon={<Users size={18} />}
                label={MOCK_USER.class}
                onClick={() => setActiveFeed("myClass")}
              />
            </div>
          )}

          {/* Moderator Tools */}
          {MOCK_USER.role === "moderator" && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-4 mt-6 flex items-center gap-2">
                <Shield size={12} /> {t("community.moderation")}
              </h3>
              {ALL_SCHOOLS.map((school) => (
                <SidebarButton
                  key={school}
                  active={activeFeed === school}
                  icon={<School size={18} />}
                  label={school}
                  onClick={() => setActiveFeed(school)}
                />
              ))}
              <div className="my-2 border-t border-border/50" />
              {ALL_CLASSES.map((cls) => (
                <SidebarButton
                  key={cls}
                  active={activeFeed === cls}
                  icon={<Users size={18} />}
                  label={cls}
                  onClick={() => setActiveFeed(cls)}
                />
              ))}
            </div>
          )}
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full min-w-0 bg-secondary/5 dark:bg-background">
        {/* Mobile Header Bar (Visible only on small screens) */}
        <div className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            {activeFeed === "public" && (
              <Globe className="w-5 h-5 text-primary" />
            )}
            {activeFeed === "mySchool" && (
              <School className="w-5 h-5 text-primary" />
            )}
            {activeFeed === "myClass" && (
              <Users className="w-5 h-5 text-primary" />
            )}
            <span className="truncate max-w-[200px]">{getFeedTitle()}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu />
          </Button>
        </div>

        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
          {/* Page Header (Desktop) */}
          <div className="hidden md:block mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {getFeedTitle()}
            </h1>
            <p className="text-muted-foreground text-lg">{getFeedSubtitle()}</p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={handleOpenCreateDialog}
            >
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("community.createPost")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t("community.createNewPost")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {MOCK_USER.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{MOCK_USER.name}</p>
                        <Badge variant="outline" className="capitalize">
                          {newPostVisibility}
                        </Badge>
                      </div>
                      <Textarea
                        placeholder={`${t("community.sharePlaceholder")} ${
                          newPostVisibility === "public"
                            ? t("community.everyone")
                            : t("community.yourGroup")
                        }...`}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[100px] resize-none border-none focus-visible:ring-0 px-0 shadow-none"
                      />
                      {newPostImage && (
                        <div className="relative mt-2 rounded-lg overflow-hidden border">
                          <img
                            src={newPostImage}
                            alt="Preview"
                            className="w-full h-auto max-h-[300px] object-cover"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => setNewPostImage(undefined)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex gap-2">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {t("community.photo")}
                        </Button>
                      </label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                    >
                      {t("community.post")}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">{t("community.noPostsYet")}</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  {t("community.beTheFirst")} {getFeedTitle()}{" "}
                  {t("community.communityWord")}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden border-border/60 hover:border-border transition-colors"
                >
                  <CardHeader className="flex flex-row items-start gap-4 p-4 md:p-6 pb-2">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {post.author.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <p className="font-semibold text-sm truncate">
                            {post.author}
                          </p>
                          <Badge
                            variant="secondary"
                            className="w-fit text-[10px] h-5 px-1.5 font-normal"
                          >
                            {post.role}
                          </Badge>
                          {post.school !== MOCK_USER.school && (
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              • {post.school}
                            </span>
                          )}
                        </div>
                        {post.author === MOCK_USER.name && (
                          <div className="flex gap-1">
                            {editingPost === post.id ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => handleEditPost(post.id)}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setEditingPost(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={() => {
                                    setEditingPost(post.id);
                                    setEditPostText(post.content);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {post.time}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        {post.visibility === "public" && (
                          <Globe className="h-3 w-3 text-muted-foreground" />
                        )}
                        {post.visibility === "school" && (
                          <School className="h-3 w-3 text-muted-foreground" />
                        )}
                        {post.visibility === "class" && (
                          <Users className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 md:p-6 pt-2 space-y-4">
                    {editingPost === post.id ? (
                      <Textarea
                        value={editPostText}
                        onChange={(e) => setEditPostText(e.target.value)}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    )}

                    {post.image && (
                      <div className="rounded-xl overflow-hidden border bg-muted/30">
                        <img
                          src={post.image}
                          alt="Post attachment"
                          className="w-full h-auto max-h-[500px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-2 ${
                          likedPosts.has(post.id)
                            ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedPosts.has(post.id) ? "fill-current" : ""
                          }`}
                        />
                        <span>{post.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-primary"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto gap-2 text-muted-foreground"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {showComments.has(post.id) && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {post.comments.map((comment, idx) => (
                            <div key={idx} className="flex gap-3 group">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {comment.author.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-muted/40 p-3 rounded-lg rounded-tl-none">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">
                                      {comment.author}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {comment.time}
                                    </span>
                                  </div>
                                  {comment.author === MOCK_USER.name && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => {
                                          setEditingComment({
                                            postId: post.id,
                                            commentIdx: idx,
                                          });
                                          setEditCommentText(comment.content);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() =>
                                          handleDeleteComment(post.id, idx)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                {editingComment?.postId === post.id &&
                                editingComment.commentIdx === idx ? (
                                  <div className="flex gap-2">
                                    <Input
                                      value={editCommentText}
                                      onChange={(e) =>
                                        setEditCommentText(e.target.value)
                                      }
                                      className="h-8 text-sm"
                                    />
                                    <Button
                                      size="sm"
                                      className="h-8"
                                      onClick={() =>
                                        handleEditComment(post.id, idx)
                                      }
                                    >
                                      {t("community.save")}
                                    </Button>
                                  </div>
                                ) : (
                                  <p className="text-sm">{comment.content}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10">
                              {MOCK_USER.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 relative">
                            <Input
                              placeholder={t("community.writeComment")}
                              value={newComment[post.id] || ""}
                              onChange={(e) =>
                                setNewComment({
                                  ...newComment,
                                  [post.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(post.id);
                                }
                              }}
                              className="pr-10"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute right-0 top-0 h-full text-muted-foreground hover:text-primary"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment[post.id]?.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;