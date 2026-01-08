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
  Leaf,
  Sparkles,
  TreePine,
  Flower2,
  Bird,
  Sun,
  Cloud,
  Star,
  FileText,
  Paperclip,
  File,
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

type Attachment = {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: string;
};

type Post = {
  id: number;
  school: string;
  author: string;
  role: string;
  time: string;
  content: string;
  image?: string;
  attachments?: Attachment[];
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
  const [newPostAttachments, setNewPostAttachments] = useState<Attachment[]>([]);
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
      attachments: newPostAttachments.length > 0 ? newPostAttachments : undefined,
      likes: 0,
      comments: [],
      visibility: newPostVisibility,
      targetGroup: newPostVisibility === "class" ? MOCK_USER.class : undefined,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostImage(undefined);
    setNewPostAttachments([]);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const attachment: Attachment = {
            type: file.type.startsWith('image/') ? 'image' : 'file',
            url: reader.result as string,
            name: file.name,
            size: formatFileSize(file.size),
          };
          setNewPostAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeAttachment = (index: number) => {
    setNewPostAttachments(prev => prev.filter((_, i) => i !== index));
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
      className={`w-full justify-start gap-3 h-11 px-3 relative transition-all duration-200 rounded-xl ${
        active
          ? "bg-gradient-to-r from-primary/15 to-emerald-500/10 text-primary font-semibold shadow-sm border border-primary/20"
          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground border border-transparent"
      }`}
      onClick={() => {
        onClick();
        setIsMobileMenuOpen(false);
      }}
    >
      {/* Active Indicator Line */}
      {active && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-primary to-emerald-600 rounded-r-full" />
      )}
      <span className={`transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Button>
  );

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 dark:from-background dark:via-green-950/20 dark:to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Decorative Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Leaf className="absolute top-[5%] left-[5%] h-6 w-6 text-primary/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <Sparkles className="absolute top-[10%] right-[15%] h-5 w-5 text-yellow-500/25 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <TreePine className="absolute top-[15%] left-[25%] h-7 w-7 text-emerald-600/15 animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }} />
        <Flower2 className="absolute top-[8%] right-[35%] h-5 w-5 text-pink-400/20 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <Bird className="absolute top-[20%] left-[45%] h-6 w-6 text-sky-500/20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4.5s' }} />
        <Sun className="absolute top-[5%] right-[5%] h-8 w-8 text-yellow-400/15 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <Cloud className="absolute top-[12%] left-[60%] h-7 w-7 text-blue-300/20 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '6s' }} />
        <Star className="absolute top-[25%] right-[25%] h-4 w-4 text-amber-400/25 animate-pulse" style={{ animationDelay: '0.8s' }} />
        
        <Leaf className="absolute top-[35%] left-[8%] h-5 w-5 text-green-500/20 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '4.2s' }} />
        <Sparkles className="absolute top-[40%] right-[8%] h-6 w-6 text-primary/15 animate-pulse" style={{ animationDelay: '1.8s' }} />
        <TreePine className="absolute top-[45%] left-[3%] h-8 w-8 text-emerald-700/12 animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '5.5s' }} />
        <Flower2 className="absolute top-[50%] right-[12%] h-6 w-6 text-rose-400/18 animate-pulse" style={{ animationDelay: '2.2s' }} />
        
        <Bird className="absolute top-[55%] left-[15%] h-5 w-5 text-indigo-400/20 animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '4.8s' }} />
        <Sun className="absolute top-[60%] right-[20%] h-6 w-6 text-orange-400/15 animate-pulse" style={{ animationDelay: '1.4s' }} />
        <Cloud className="absolute top-[65%] left-[20%] h-5 w-5 text-slate-400/20 animate-bounce" style={{ animationDelay: '2.8s', animationDuration: '5.2s' }} />
        <Star className="absolute top-[70%] right-[30%] h-5 w-5 text-yellow-500/20 animate-pulse" style={{ animationDelay: '0.4s' }} />
        
        <Leaf className="absolute top-[75%] left-[35%] h-7 w-7 text-teal-500/18 animate-bounce" style={{ animationDelay: '1.6s', animationDuration: '4.6s' }} />
        <Sparkles className="absolute top-[80%] right-[40%] h-4 w-4 text-cyan-400/22 animate-pulse" style={{ animationDelay: '2.4s' }} />
        <TreePine className="absolute top-[85%] left-[50%] h-6 w-6 text-green-600/15 animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '5.8s' }} />
        <Flower2 className="absolute top-[90%] right-[50%] h-5 w-5 text-purple-400/18 animate-pulse" style={{ animationDelay: '1.9s' }} />
        
        <Bird className="absolute bottom-[15%] left-[55%] h-6 w-6 text-teal-400/20 animate-bounce" style={{ animationDelay: '2.6s', animationDuration: '4.4s' }} />
        <Sun className="absolute bottom-[10%] right-[55%] h-5 w-5 text-amber-500/15 animate-pulse" style={{ animationDelay: '1.1s' }} />
        <Cloud className="absolute bottom-[5%] left-[65%] h-6 w-6 text-blue-400/18 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '6.2s' }} />
        <Star className="absolute bottom-[20%] right-[65%] h-4 w-4 text-primary/20 animate-pulse" style={{ animationDelay: '2.1s' }} />
        
        <Leaf className="absolute bottom-[25%] left-[75%] h-5 w-5 text-emerald-500/18 animate-bounce" style={{ animationDelay: '1.3s', animationDuration: '4.9s' }} />
        <Sparkles className="absolute bottom-[30%] right-[75%] h-6 w-6 text-yellow-400/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <TreePine className="absolute bottom-[35%] left-[85%] h-5 w-5 text-green-700/15 animate-bounce" style={{ animationDelay: '2.3s', animationDuration: '5.4s' }} />
        <Flower2 className="absolute bottom-[40%] right-[85%] h-4 w-4 text-pink-500/20 animate-pulse" style={{ animationDelay: '1.7s' }} />
      </div>

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
          bg-white/90 dark:bg-card/95 backdrop-blur-xl border-r border-primary/20 dark:border-border/40 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          flex flex-col
        `}
      >
        {/* FIXED HEADER SECTION */}
        <div className="p-5 shrink-0 border-b border-primary/15 dark:border-border/40 bg-gradient-to-r from-primary/10 via-emerald-500/5 to-teal-500/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300">
              {headerDetails.icon}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg leading-tight tracking-tight truncate bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                {headerDetails.title}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {headerDetails.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* SCROLLABLE NAVIGATION SECTION */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Main Feeds */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
              <Globe size={12} />
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
            <div className="space-y-1 pt-4 border-t border-primary/10 dark:border-border/30">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
                <Users size={12} />
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
            <div className="space-y-1 pt-4 border-t border-primary/10 dark:border-border/30">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
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
              <div className="my-2 border-t border-primary/10 dark:border-border/30" />
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
      <main className="flex-1 w-full min-w-0 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header Bar (Visible only on small screens) */}
        <div className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-background/90 backdrop-blur-xl border-b border-primary/10 dark:border-border px-4 h-16 flex items-center justify-between shrink-0">
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

        {/* Fixed Header for Desktop */}
        <div className="hidden md:block shrink-0 p-4 md:px-8 md:pt-8 md:pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 backdrop-blur-sm">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {getFeedTitle()}
                  </h1>
                  <p className="text-muted-foreground text-lg">{getFeedSubtitle()}</p>
                </div>
              </div>
              
              {/* Create Post Button */}
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={handleOpenCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("community.createPost")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-card/95 backdrop-blur-xl border-primary/20 dark:border-border">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-primary" />
                      {t("community.createNewPost")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary">
                          {MOCK_USER.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-2 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{MOCK_USER.name}</p>
                          <Badge variant="outline" className="capitalize bg-primary/5 border-primary/20">
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
                        {/* Image Preview */}
                        {newPostImage && (
                          <div className="relative mt-2 rounded-lg overflow-hidden border border-primary/20">
                            <img
                              src={newPostImage}
                              alt="Preview"
                              className="w-full h-auto max-h-[200px] object-cover"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 h-7 w-7 rounded-full"
                              onClick={() => setNewPostImage(undefined)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {/* File Attachments Preview */}
                        {newPostAttachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {newPostAttachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-primary/10">
                                {attachment.type === 'image' ? (
                                  <ImageIcon className="h-4 w-4 text-primary" />
                                ) : (
                                  <FileText className="h-4 w-4 text-primary" />
                                )}
                                <span className="text-sm flex-1 truncate">{attachment.name}</span>
                                <span className="text-xs text-muted-foreground">{attachment.size}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeAttachment(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-primary/10 pt-4">
                      <div className="flex gap-1">
                        {/* Photo Upload */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          {t("community.photo")}
                        </Button>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        
                        {/* File Upload */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          <Paperclip className="h-4 w-4 mr-1" />
                          {t("community.file") || "File"}
                        </Button>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                        className="rounded-full bg-gradient-to-r from-primary to-emerald-600"
                      >
                        {t("community.post")}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Mobile Create Button */}
        <div className="md:hidden shrink-0 px-4 py-3">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={handleOpenCreateDialog}
          >
            <DialogTrigger asChild>
              <Button className="w-full rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25">
                <Plus className="mr-2 h-4 w-4" />
                {t("community.createPost")}
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Scrollable Posts Feed */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-white/60 dark:bg-card/60 backdrop-blur-xl rounded-xl border border-white/30 dark:border-border border-dashed shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
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
                  className="overflow-hidden bg-white/70 dark:bg-card/80 backdrop-blur-xl border-white/30 dark:border-border/60 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10 group/card"
                >
                  <CardHeader className="flex flex-row items-start gap-4 p-4 md:p-6 pb-2">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary font-semibold">
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
                      <div className="rounded-xl overflow-hidden border border-white/30 dark:border-border/40 shadow-md group-hover/card:shadow-lg transition-shadow">
                        <img
                          src={post.image}
                          alt="Post attachment"
                          className="w-full h-auto max-h-[500px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Display file attachments */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="space-y-2">
                        {post.attachments.map((attachment, idx) => (
                          <a 
                            key={idx}
                            href={attachment.url}
                            download={attachment.name}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-muted/30 border border-primary/10 dark:border-border/40 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group/file"
                          >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20">
                              {attachment.type === 'image' ? (
                                <ImageIcon className="h-5 w-5 text-primary" />
                              ) : (
                                <File className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover/file:text-primary transition-colors">{attachment.name}</p>
                              {attachment.size && (
                                <p className="text-xs text-muted-foreground">{attachment.size}</p>
                              )}
                            </div>
                            <Paperclip className="h-4 w-4 text-muted-foreground group-hover/file:text-primary transition-colors" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-3 border-t border-white/30 dark:border-border/40 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-2 rounded-full transition-all ${
                          likedPosts.has(post.id)
                            ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50"
                            : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        }`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart
                          className={`h-4 w-4 transition-transform ${
                            likedPosts.has(post.id) ? "fill-current scale-110" : ""
                          }`}
                        />
                        <span>{post.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
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
                              <div className="flex-1 bg-white/50 dark:bg-muted/40 backdrop-blur-sm p-3 rounded-lg rounded-tl-none border border-white/30 dark:border-border/30">
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