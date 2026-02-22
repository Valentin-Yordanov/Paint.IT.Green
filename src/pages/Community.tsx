import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Heart,
  MessageCircle,
  School,
  Users,
  Send,
  Plus,
  Trash2,
  Image as ImageIcon,
  Globe,
  X,
  Paperclip,
  File,
  Edit,
  Share2,
  Shield,
  Activity,
  AlertTriangle,
  UserCog,
  Ban,
  CheckCircle,
  Search,
  MoreVertical,
  LogOut,
  FileText,
  BarChart3,
  Layers,
  Megaphone,
  Lock,
  Settings,
  Unlock,
  Camera,
  KeyRound,
  Book,
  GraduationCap,
  Music,
  Palette,
  Dna,
  Calculator,
  Trophy,
  Star,
  Smile,
  Zap,
  Anchor,
  Coffee,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  Briefcase,
  Code,
  Terminal,
  Cpu,
  Database,
  Server,
  Wifi,
} from "lucide-react";
import studentsImage from "@/assets/students-planting.jpg";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// --- TYPES ---
type Comment = { author: string; role: string; content: string; time: string };
type Attachment = {
  type: "image" | "file";
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
  images?: string[];
  attachments?: Attachment[];
  likes: number;
  comments: Comment[];
  visibility: "public" | "school" | "class";
  targetGroup?: string;
  status?: "active" | "flagged" | "deleted";
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin" | "moderator";
  status: "active" | "banned";
  school: string;
};
type Report = {
  id: string;
  postId: number;
  reporter: string;
  reason: string;
  timestamp: string;
  status: "pending" | "resolved";
};
type Log = {
  id: string;
  admin: string;
  action: string;
  target: string;
  time: string;
};
type Group = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  iconType?: "image" | "preset";
  members: number;
  type: "public" | "private";
  password?: string;
  school?: string;
  status: "active" | "frozen";
  lastActive: string;
};

// --- MOCK DATA ---
const MOCK_USER = {
  role: "student",
  school: "Lincoln Elementary",
  class: "Ms. Smith - 5th Grade",
  name: "Current User",
  email: "student@lincoln.edu",
};

const ALL_SCHOOLS = [
  "Lincoln Elementary",
  "Roosevelt High",
  "Jefferson Academy",
  "Washington Middle",
];

// --- PRESET ICONS MAPPING ---
const PRESET_ICONS = [
  { id: "book", icon: <Book className="h-6 w-6" />, label: "Study" },
  {
    id: "grad",
    icon: <GraduationCap className="h-6 w-6" />,
    label: "Academic",
  },
  { id: "music", icon: <Music className="h-6 w-6" />, label: "Arts" },
  { id: "art", icon: <Palette className="h-6 w-6" />, label: "Creative" },
  { id: "science", icon: <Dna className="h-6 w-6" />, label: "Science" },
  { id: "math", icon: <Calculator className="h-6 w-6" />, label: "Math" },
  { id: "sport", icon: <Trophy className="h-6 w-6" />, label: "Sports" },
  { id: "star", icon: <Star className="h-6 w-6" />, label: "General" },
  { id: "smile", icon: <Smile className="h-6 w-6" />, label: "Social" },
  { id: "zap", icon: <Zap className="h-6 w-6" />, label: "Energy" },
  { id: "anchor", icon: <Anchor className="h-6 w-6" />, label: "Navy" },
  { id: "coffee", icon: <Coffee className="h-6 w-6" />, label: "Break" },
  { id: "sun", icon: <Sun className="h-6 w-6" />, label: "Day" },
  { id: "moon", icon: <Moon className="h-6 w-6" />, label: "Night" },
  { id: "cloud", icon: <Cloud className="h-6 w-6" />, label: "Weather" },
  { id: "code", icon: <Code className="h-6 w-6" />, label: "Tech" },
];

// --- MOCK ADMIN DATA ---
const INITIAL_USERS: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@lincoln.edu",
    role: "student",
    status: "active",
    school: "Lincoln Elementary",
  },
  {
    id: "u2",
    name: "Sarah Connor",
    email: "sarah@roosevelt.edu",
    role: "teacher",
    status: "active",
    school: "Roosevelt High",
  },
  {
    id: "u3",
    name: "Bad Actor",
    email: "troll@school.edu",
    role: "student",
    status: "banned",
    school: "Jefferson Academy",
  },
  {
    id: "u4",
    name: "Principal Skinner",
    email: "prince@lincoln.edu",
    role: "admin",
    status: "active",
    school: "Lincoln Elementary",
  },
];

const INITIAL_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Ms. Smith - 5th Grade",
    description: "Official class group",
    members: 24,
    type: "private",
    status: "active",
    lastActive: "2 mins ago",
    icon: "book",
    iconType: "preset",
  },
  {
    id: "g2",
    name: "Chess Club",
    description: "Strategic thinking for everyone",
    members: 12,
    type: "public",
    status: "active",
    lastActive: "1 day ago",
    icon: "star",
    iconType: "preset",
  },
  {
    id: "g3",
    name: "Gaming Lounge",
    description: "After school gaming",
    members: 156,
    type: "public",
    status: "frozen",
    lastActive: "3 days ago",
    icon: undefined,
    iconType: undefined,
  },
];

const INITIAL_REPORTS: Report[] = [
  {
    id: "r1",
    postId: 1,
    reporter: "Karen M.",
    reason: "Inappropriate language",
    timestamp: "10 mins ago",
    status: "pending",
  },
  {
    id: "r2",
    postId: 0,
    reporter: "System Bot",
    reason: "Spam detection",
    timestamp: "1 hour ago",
    status: "pending",
  },
];

const INITIAL_LOGS: Log[] = [
  {
    id: "l1",
    admin: "System",
    action: "Server Restart",
    target: "Main Cluster",
    time: "02:00 AM",
  },
  {
    id: "l2",
    admin: "Principal Skinner",
    action: "Banned User",
    target: "Bad Actor",
    time: "Yesterday",
  },
];

// --- UTILS ---
const MOBILE_BREAKPOINT = 768;

function useIsMobile(customBreakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${customBreakpoint - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [customBreakpoint]);
  return isMobile;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  return (
    parseFloat(
      (bytes / Math.pow(k, Math.floor(Math.log(bytes) / Math.log(k)))).toFixed(
        2,
      ),
    ) + " MB"
  );
};

// --- SUB-COMPONENTS ---
const NavIcon = ({
  active,
  icon,
  label,
  onClick,
  mobileMode = false,
  alert = false,
  className = "",
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  mobileMode?: boolean;
  alert?: boolean;
  className?: string;
}) => (
  <div
    className={`group relative flex flex-col items-center justify-center cursor-pointer ${mobileMode ? "min-w-[70px] mx-1" : "w-full mb-3"} ${className}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
  >
    {!mobileMode && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap">
        {label}
        <div className="absolute top-1/2 -left-1.5 -mt-1.5 border-4 border-transparent border-r-gray-900" />
      </div>
    )}
    {active && !mobileMode && (
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-primary rounded-r-full transition-all duration-300" />
    )}

    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${mobileMode ? "h-14 w-14 rounded-full" : "h-12 w-12 rounded-2xl"} ${active ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30 scale-105" : "bg-white/80 dark:bg-card/80 text-muted-foreground hover:bg-white hover:text-primary hover:scale-110 hover:shadow-lg"} border border-white/40 dark:border-white/10 shadow-sm`}
    >
      {icon}
      {active && mobileMode && (
        <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
      )}
      {alert && (
        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
      )}
    </div>
    {mobileMode && (
      <span
        className={`text-[10px] mt-1 font-medium truncate max-w-[80px] ${active ? "text-primary" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    )}
  </div>
);

// --- MAIN COMPONENT ---
const Community = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // --- STATE ---
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 0,
      school: "Lincoln Elementary",
      author: "Principal Johnson",
      role: "Principal",
      time: "2 hours ago",
      content:
        "Incredible turnout for our tree planting event today! Our students planted 50 trees around the school campus. This helps reduce our carbon footprint and beautifies our daily environment. So proud of everyone's dedication to our environment! 🌳",
      images: [studentsImage],
      likes: 124,
      comments: [
        {
          author: "Ms. Smith",
          role: "Teacher",
          content: "Amazing work!",
          time: "1 hour ago",
        },
      ],
      visibility: "public",
      status: "active",
    },
    {
      id: 1,
      school: "Roosevelt High",
      author: "Ms. Anderson",
      role: "Teacher",
      time: "5 hours ago",
      content:
        "Our 10th grade class organized a beach cleanup this weekend. We collected over 200 pounds of trash! Small steps lead to big changes.",
      likes: 89,
      comments: [],
      visibility: "public",
      status: "active",
    },
  ]);
  const [activeFeed, setActiveFeed] = useState<string>("public");

  // --- ADMIN STATE ---
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<
    "overview" | "users" | "groups" | "moderation" | "settings"
  >("overview");
  const [adminUsers, setAdminUsers] = useState<User[]>(INITIAL_USERS);
  const [adminGroups, setAdminGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [adminReports, setAdminReports] = useState<Report[]>(INITIAL_REPORTS);
  const [adminLogs, setAdminLogs] = useState<Log[]>(INITIAL_LOGS);
  const [userSearch, setUserSearch] = useState("");
  const [announcementText, setAnnouncementText] = useState("");

  const [adminSettings, setAdminSettings] = useState({
    profanityFilter: true,
    imageUploads: true,
    linkPreviews: true,
  });

  // Create Group State
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupType, setNewGroupType] = useState<"public" | "private">(
    "public",
  );
  const [newGroupPassword, setNewGroupPassword] = useState("");
  const [newGroupSchool, setNewGroupSchool] = useState(MOCK_USER.school);
  const [organizationPassword, setOrganizationPassword] = useState("");
  const [newGroupIcon, setNewGroupIcon] = useState<string | null>(null);
  const [newGroupIconType, setNewGroupIconType] = useState<"image" | "preset">(
    "image",
  );

  // --- NORMAL STATE ---
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());

  const [editingComment, setEditingComment] = useState<{
    postId: number;
    commentIdx: number;
  } | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSchool, setNewPostSchool] = useState(MOCK_USER.school);
  const [newPostVisibility, setNewPostVisibility] = useState<
    "public" | "school" | "class"
  >("public");
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostAttachments, setNewPostAttachments] = useState<Attachment[]>(
    [],
  );

  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const createPostBtnRef = useRef<HTMLDivElement>(null);
  const [isCreatePostBtnVisible, setIsCreatePostBtnVisible] = useState(true);

  // --- ADMIN ACTIONS ---
  const handleBanUser = (userId: string) => {
    setAdminUsers((users) =>
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "banned" : "active" }
          : u,
      ),
    );
    const user = adminUsers.find((u) => u.id === userId);
    addLog(
      "Current Admin",
      user?.status === "active" ? "Banned User" : "Unbanned User",
      user?.name || "Unknown",
    );
    toast({
      title:
        user?.status === "active"
          ? t("admin.userBanned")
          : t("admin.userUnbanned"),
      variant: user?.status === "active" ? "destructive" : "default",
    });
  };

  const handleGroupAction = (groupId: string, action: "freeze" | "delete") => {
    if (action === "freeze") {
      setAdminGroups((groups) =>
        groups.map((g) =>
          g.id === groupId
            ? { ...g, status: g.status === "active" ? "frozen" : "active" }
            : g,
        ),
      );
      toast({ title: t("admin.groupStatusUpdated") });
    } else {
      setAdminGroups((groups) => groups.filter((g) => g.id !== groupId));
      toast({ title: t("admin.groupDeleted") });
    }
  };

  const handleGroupIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGroupIcon(reader.result as string);
        setNewGroupIconType("image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription,
      icon: newGroupIcon || undefined,
      iconType: newGroupIcon ? newGroupIconType : undefined,
      members: 1,
      type: newGroupType,
      password: newGroupType === "private" ? newGroupPassword : undefined,
      school: newGroupSchool === "None" ? undefined : newGroupSchool,
      status: "active",
      lastActive: "Just now",
    };
    setAdminGroups([newGroup, ...adminGroups]);
    addLog("Current Admin", "Created Group", newGroupName);
    setIsCreateGroupDialogOpen(false);
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupType("public");
    setNewGroupPassword("");
    setNewGroupIcon(null);
    setNewGroupIconType("image");
    setOrganizationPassword("");
    toast({
      title: t("group.created"),
      description: `${newGroupName} ${t("group.createdDesc")}`,
    });
  };

  const handleSendAnnouncement = () => {
    if (!announcementText) return;
    toast({
      title: t("admin.announcementSent"),
      description: t("admin.announcementSentDesc"),
    });
    setAnnouncementText("");
  };

  const handleResolveReport = (
    reportId: string,
    action: "delete_post" | "dismiss",
  ) => {
    const report = adminReports.find((r) => r.id === reportId);
    if (!report) return;
    if (action === "delete_post") {
      setPosts((currentPosts) =>
        currentPosts.filter((p) => p.id !== report.postId),
      );
      addLog(
        "Current Admin",
        "Deleted Post (Reported)",
        `Post #${report.postId}`,
      );
      toast({
        title: t("admin.contentRemoved"),
        description: t("admin.contentRemovedDesc"),
      });
    } else {
      addLog("Current Admin", "Dismissed Report", `Report #${reportId}`);
      toast({ title: t("admin.reportDismissed") });
    }
    setAdminReports((reports) => reports.filter((r) => r.id !== reportId));
  };

  const addLog = (admin: string, action: string, target: string) => {
    const newLog: Log = {
      id: Date.now().toString(),
      admin,
      action,
      target,
      time: new Date().toLocaleTimeString(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);
  };

  // --- RENDER HELPERS ---
  const getGroupIcon = (group: Group) => {
    if (group.iconType === "image" && group.icon)
      return (
        <img
          src={group.icon}
          alt={group.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    if (group.iconType === "preset" && group.icon) {
      const preset = PRESET_ICONS.find((p) => p.id === group.icon);
      if (preset)
        return (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {preset.icon}
          </div>
        );
    }
    return (
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Layers className="h-5 w-5 text-primary" />
      </div>
    );
  };

  // --- NORMAL ACTIONS ---
  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) newLiked.delete(postId);
    else newLiked.add(postId);
    setLikedPosts(newLiked);
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, likes: newLiked.has(postId) ? p.likes + 1 : p.likes - 1 }
          : p,
      ),
    );
  };

  const toggleComments = (postId: number) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) newShowComments.delete(postId);
    else newShowComments.add(postId);
    setShowComments(newShowComments);
  };

  const handleAddComment = (postId: number) => {
    const comment = newComment[postId]?.trim();
    if (!comment) return;
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  author: MOCK_USER.name,
                  role: MOCK_USER.role,
                  content: comment,
                  time: "Just now",
                },
              ],
            }
          : p,
      ),
    );
    setNewComment({ ...newComment, [postId]: "" });
    toast({
      title: t("community.commentAdded"),
      description: t("community.commentAddedDesc"),
    });
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && newPostImages.length === 0) return;
    const newPost: Post = {
      id: Date.now(),
      school: newPostSchool,
      author: MOCK_USER.name,
      role: MOCK_USER.role,
      time: "Just now",
      content: newPostContent,
      images: newPostImages,
      attachments: newPostAttachments,
      likes: 0,
      comments: [],
      visibility: newPostVisibility,
      status: "active",
    };
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostImages([]);
    setNewPostAttachments([]);
    setIsCreateDialogOpen(false);
    toast({
      title: t("community.postCreated"),
      description: t("community.postCreatedDesc"),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then((base64Images) => {
        setNewPostImages((prev) => [...prev, ...base64Images]);
      });
    }
    e.target.value = "";
  };

  const removeUploadedImage = (index: number) => {
    setNewPostImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewPostAttachments((prev) => [
            ...prev,
            {
              type: file.type.startsWith("image/") ? "image" : "file",
              url: reader.result as string,
              name: file.name,
              size: formatFileSize(file.size),
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setNewPostAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeletePost = (postId: number) =>
    setPosts(posts.filter((post) => post.id !== postId));

  const handleEditPost = (postId: number) => {
    if (!editPostText.trim()) return;
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, content: editPostText } : p)),
    );
    setEditingPost(null);
  };

  const handleDeleteComment = (postId: number, idx: number) =>
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((_, i) => i !== idx) }
          : p,
      ),
    );

  const handleEditComment = (postId: number, idx: number) => {
    if (!editCommentText.trim()) return;
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c, i) =>
                i === idx ? { ...c, content: editCommentText } : c,
              ),
            }
          : p,
      ),
    );
    setEditingComment(null);
  };

  const handleOpenCreateDialog = (isOpen: boolean) => {
    if (isOpen) {
      if (activeFeed === "mySchool" || ALL_SCHOOLS.includes(activeFeed))
        setNewPostVisibility("school");
      else if (activeFeed === "myClass") setNewPostVisibility("class");
      else setNewPostVisibility("public");
      if (ALL_SCHOOLS.includes(activeFeed)) setNewPostSchool(activeFeed);
      else setNewPostSchool(MOCK_USER.school);
    }
    setIsCreateDialogOpen(isOpen);
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFeed === "public") return post.visibility === "public";
    if (activeFeed === "mySchool")
      return (
        post.school === MOCK_USER.school &&
        (post.visibility === "school" || post.visibility === "public")
      );
    if (activeFeed === "myClass")
      return post.school === MOCK_USER.school && post.visibility === "class";
    return false;
  });

  const getFeedTitle = () => {
    if (activeFeed === "public") return t("community.public") || "Global Feed";
    if (activeFeed === "mySchool") return MOCK_USER.school;
    if (activeFeed === "myClass") return MOCK_USER.class;
    return activeFeed;
  };

  // --- RENDER HELPERS  ---
  const renderCreateDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={handleOpenCreateDialog}>
      <DialogContent className="sm:max-w-[525px] gap-0 p-0 overflow-hidden bg-white/95 dark:bg-card/95 backdrop-blur-2xl border-primary/10 shadow-2xl sm:rounded-2xl">
        <DialogHeader className="p-4 px-6 border-b border-border/40 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-semibold text-foreground">
            {t("community.createNewPost")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pb-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary font-bold">
                {MOCK_USER.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-none mb-1">
                {MOCK_USER.name}
              </p>
              <Badge
                variant="secondary"
                className="bg-primary/5 text-primary hover:bg-primary/10 border-transparent px-2 py-0.5 h-auto text-[10px] uppercase tracking-wider font-medium flex items-center gap-1 w-fit transition-colors"
              >
                {newPostVisibility === "public" && (
                  <Globe className="h-3 w-3" />
                )}
                {newPostVisibility === "school" && (
                  <School className="h-3 w-3" />
                )}
                {newPostVisibility === "class" && <Users className="h-3 w-3" />}
                {newPostVisibility}
              </Badge>
            </div>
          </div>

          <Textarea
            placeholder={`${t("community.sharePlaceholder")}...`}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[140px] text-base resize-none border-none focus-visible:ring-0 px-0 shadow-none bg-transparent placeholder:text-muted-foreground/50"
          />

          {newPostImages.length > 0 && (
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {newPostImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-border/50 shadow-sm group aspect-square"
                >
                  <img
                    src={imgSrc}
                    alt={`Preview ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-full shadow-lg"
                      onClick={() => removeUploadedImage(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {newPostAttachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {newPostAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-xs font-medium text-primary group"
                >
                  {attachment.type === "image" ? (
                    <ImageIcon className="h-3.5 w-3.5" />
                  ) : (
                    <File className="h-3.5 w-3.5" />
                  )}
                  <span className="max-w-[150px] truncate">
                    {attachment.name}
                  </span>
                  <button
                    className="ml-1 hover:text-destructive transition-colors"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 px-6 bg-muted/20 border-t border-border/40 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-full transition-colors h-9 w-9"
                onClick={() => document.getElementById("image-upload")?.click()}
                title={t("community.photo")}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-full transition-colors h-9 w-9"
                onClick={() => document.getElementById("file-upload")?.click()}
                title={t("File")}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <Button
            onClick={handleCreatePost}
            disabled={!newPostContent.trim() && newPostImages.length === 0}
            className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {t("community.post")} <Send className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderPost = (post: Post) => (
    <Card
      key={post.id}
      className="overflow-hidden bg-white/70 dark:bg-card/80 backdrop-blur-xl border-white/30 dark:border-border/60 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 group/card"
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4 md:p-6 pb-2 border-b border-white/10 dark:border-white/5">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary font-bold">
            {post.author.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <p className="font-semibold text-sm truncate">{post.author}</p>
              <Badge
                variant="secondary"
                className="w-fit text-[10px] h-5 px-1.5 font-normal"
              >
                {post.role}
              </Badge>
            </div>
            {post.author === MOCK_USER.name && (
              <div className="flex gap-1">
                {editingPost === post.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:bg-hover hover:text-hover-foreground"
                      onClick={() => handleEditPost(post.id)}
                      aria-label="Save Post"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-hover hover:text-hover-foreground"
                      onClick={() => setEditingPost(null)}
                      aria-label="Cancel Edit"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-hover"
                      onClick={() => {
                        setEditingPost(post.id);
                        setEditPostText(post.content);
                      }}
                      aria-label="Edit Post"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-hover"
                      onClick={() => handleDeletePost(post.id)}
                      aria-label="Delete Post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground">{post.time}</p>
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

      <CardContent className="p-4 md:p-6 pt-6">
        <div
          className={`${post.images && post.images.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start" : ""}`}
        >
          <div
            className={`flex flex-col ${post.images && post.images.length > 0 ? "h-full" : ""}`}
          >
            {editingPost === post.id ? (
              <Textarea
                value={editPostText}
                onChange={(e) => setEditPostText(e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {post.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    download={attachment.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-muted/30 border border-primary/10 dark:border-border/40 hover:bg-hover hover:text-hover-foreground transition-colors group/file"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20">
                      {attachment.type === "image" ? (
                        <ImageIcon className="h-5 w-5 text-primary" />
                      ) : (
                        <File className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover/file:text-primary transition-colors">
                        {attachment.name}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <div className="mt-auto pt-6 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(post.id)}
                className={`rounded-full transition-colors ${likedPosts.has(post.id) ? "text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-hover" : "text-muted-foreground hover:text-hover-foreground hover:bg-hover"}`}
              >
                <Heart
                  className={`mr-1.5 h-4 w-4 ${likedPosts.has(post.id) ? "fill-current scale-110" : ""}`}
                />{" "}
                {post.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComments(post.id)}
                className="rounded-full text-muted-foreground hover:text-hover-foreground hover:bg-hover"
              >
                <MessageCircle className="mr-1.5 h-4 w-4" />{" "}
                {post.comments.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto rounded-full text-muted-foreground hover:text-hover-foreground hover:bg-hover"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {post.images && post.images.length > 0 && (
            <div
              className={`rounded-xl overflow-hidden border border-white/30 dark:border-border/40 shadow-md ${post.images.length > 1 && post.images.length <= 4 ? "grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5" : "flex items-center bg-black/5 dark:bg-black/20 max-h-[500px]"}`}
            >
              {post.images.length > 4 ? (
                <div
                  className="relative w-full h-full cursor-pointer group aspect-square md:aspect-auto md:h-full"
                  onClick={() => setLightboxImages(post.images!)}
                >
                  <img
                    src={post.images[0]}
                    alt="Post attachment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/40">
                    <span className="text-white text-4xl font-bold">
                      +{post.images.length - 1}
                    </span>
                  </div>
                </div>
              ) : (
                post.images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className={`relative overflow-hidden w-full ${post.images!.length > 1 ? "aspect-square" : "h-full"}`}
                    onClick={() => setLightboxImages(post.images!)}
                  >
                    <img
                      src={imgSrc}
                      alt={`Post attachment ${idx}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {showComments.has(post.id) && (
          <div className="mt-6 space-y-4 pt-6 border-t border-primary/5 animate-in fade-in">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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
                            className="h-6 w-6 hover:bg-hover"
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
                            className="h-6 w-6 text-destructive hover:bg-hover"
                            onClick={() => handleDeleteComment(post.id, idx)}
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
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={() => handleEditComment(post.id, idx)}
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
                    setNewComment({ ...newComment, [post.id]: e.target.value })
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
                  className="absolute right-0 top-0 h-full text-muted-foreground hover:text-primary hover:bg-hover"
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
  );

  const renderAdminContent = () => {
    switch (activeAdminTab) {
      case "overview":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                    {t("admin.totalUsers")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{adminUsers.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("admin.fromLastWeek")}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                    {t("admin.activeGroups")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{adminGroups.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase">
                    {t("admin.pendingReports")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {adminReports.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {adminReports.length > 0
                      ? t("admin.actionRequired")
                      : t("admin.allClear")}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-100 dark:border-emerald-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                    {t("admin.systemStatus")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    99.9%{" "}
                    <Activity className="h-5 w-5 animate-pulse text-emerald-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("admin.serversOperational")}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />{" "}
                  {t("admin.globalAnnouncement")}
                </CardTitle>
                <CardDescription>{t("admin.announcementDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={t("admin.announcementPlaceholder")}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendAnnouncement}
                    disabled={!announcementText}
                    className="bg-gradient-to-r from-primary to-emerald-600 text-white"
                  >
                    <Send className="mr-2 h-4 w-4" /> {t("admin.broadcast")}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.recentActivityLog")}</CardTitle>
                <CardDescription>{t("admin.activityLogDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            by {log.admin} • Target: {log.target}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "users": {
        const filteredUsers = adminUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase()),
        );
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchUsers")}
                  className="pl-9"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="hover:bg-hover hover:text-hover-foreground"
              >
                <FileText className="mr-2 h-4 w-4" /> {t("admin.exportCsv")}
              </Button>
            </div>
            <div className="rounded-md border bg-card">
              <div className="grid grid-cols-12 gap-2 p-4 border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-4">{t("admin.user")}</div>
                <div className="col-span-3">{t("admin.role")}</div>
                <div className="col-span-3">{t("admin.status")}</div>
                <div className="col-span-2 text-right">
                  {t("admin.actions")}
                </div>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-2 p-4 items-center border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="col-span-3">
                      <Badge
                        className={`${user.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"} border-0`}
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-hover hover:text-hover-foreground"
                        onClick={() => handleBanUser(user.id)}
                        title={
                          user.status === "active" ? "Ban User" : "Unban User"
                        }
                      >
                        {user.status === "active" ? (
                          <Ban className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-hover hover:text-hover-foreground"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            {t("admin.manage")} {user.name}
                          </DropdownMenuLabel>
                          <DropdownMenuItem>
                            {t("admin.viewProfile")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {t("admin.resetPassword")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            {t("admin.deleteAccount")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case "groups":
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{t("admin.chatGroups")}</h3>
            </div>
            <div className="grid gap-4">
              {adminGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {getGroupIcon(group)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{group.name}</p>
                        {group.type === "private" && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                        {group.status === "frozen" && (
                          <Ban className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {group.members} {t("admin.members")} •{" "}
                        {group.description || t("admin.noDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-hover hover:text-hover-foreground"
                      onClick={() => handleGroupAction(group.id, "freeze")}
                    >
                      {group.status === "active"
                        ? t("admin.freeze")
                        : t("admin.unfreeze")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-hover hover:text-hover-foreground"
                      onClick={() => handleGroupAction(group.id, "delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "moderation":
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            {adminReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border rounded-xl bg-muted/10 border-dashed">
                <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
                <h3 className="text-lg font-medium">
                  {t("admin.allCaughtUp")}
                </h3>
                <p className="text-muted-foreground">
                  {t("admin.noPendingReports")}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {adminReports.map((report) => {
                  const post = posts.find((p) => p.id === report.postId);
                  return (
                    <Card
                      key={report.id}
                      className="border-l-4 border-l-orange-500"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="destructive"
                              className="uppercase text-[10px]"
                            >
                              {t("admin.reported")}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {t("admin.reportedBy")} <b>{report.reporter}</b> •{" "}
                              {report.timestamp}
                            </span>
                          </div>
                          <Badge variant="outline">{report.reason}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/40 p-3 rounded-md mb-4 border border-border">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {t("admin.postContent")}
                          </p>
                          {post ? (
                            <p className="text-sm">{post.content}</p>
                          ) : (
                            <p className="text-sm italic text-muted-foreground">
                              {t("admin.contentUnavailable")}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-hover hover:text-hover-foreground"
                            onClick={() =>
                              handleResolveReport(report.id, "dismiss")
                            }
                          >
                            {t("admin.dismissReport")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleResolveReport(report.id, "delete_post")
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />{" "}
                            {t("admin.deletePost")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.safetyFilters")}</CardTitle>
                <CardDescription>
                  {t("admin.safetyFiltersDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {t("admin.profanityFilter")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("admin.profanityFilterDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={adminSettings.profanityFilter}
                    onCheckedChange={(val) =>
                      setAdminSettings({
                        ...adminSettings,
                        profanityFilter: val,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {t("admin.imageUploads")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("admin.imageUploadsDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={adminSettings.imageUploads}
                    onCheckedChange={(val) =>
                      setAdminSettings({ ...adminSettings, imageUploads: val })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {t("admin.linkPreview")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("admin.linkPreviewDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={adminSettings.linkPreviews}
                    onCheckedChange={(val) =>
                      setAdminSettings({ ...adminSettings, linkPreviews: val })
                    }
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/10">
              <CardHeader>
                <CardTitle className="text-red-600">
                  {t("admin.dangerZone")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full">
                  {t("admin.maintenanceMode")}
                </Button>
                <p className="text-xs text-red-600/60 mt-2 text-center">
                  {t("admin.maintenanceModeDesc")}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 dark:from-background dark:via-green-950/20 dark:to-background flex flex-col md:flex-row overflow-hidden">
      <style>
        {`
          html, body, #root, #__next { margin: 0; padding: 0; height: 100%; overflow: hidden !important; overscroll-behavior: none !important; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* MOBILE NAV */}
      {isMobile && (
        <div className="fixed top-16 left-0 right-0 z-40 w-full bg-white/90 dark:bg-card/90 backdrop-blur-md border-b border-primary/10 dark:border-border">
          {" "}
          <div className="flex items-center px-4 py-2 overflow-x-auto no-scrollbar gap-2 snap-x">
            <NavIcon
              mobileMode
              active={activeFeed === "public" && !showAdminPanel}
              icon={<Globe size={20} />}
              label="Global"
              onClick={() => {
                setShowAdminPanel(false);
                setActiveFeed("public");
              }}
            />
            <div className="h-8 w-[1px] bg-primary/10 shrink-0 mx-1" />
            {MOCK_USER.role === "student" && (
              <>
                <NavIcon
                  mobileMode
                  active={activeFeed === "mySchool" && !showAdminPanel}
                  icon={<School size={20} />}
                  label="School"
                  onClick={() => {
                    setShowAdminPanel(false);
                    setActiveFeed("mySchool");
                  }}
                />
                <NavIcon
                  mobileMode
                  active={activeFeed === "myClass" && !showAdminPanel}
                  icon={<Users size={20} />}
                  label="Class"
                  onClick={() => {
                    setShowAdminPanel(false);
                    setActiveFeed("myClass");
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside className="h-full flex flex-col justify-start pt-6 w-[80px] ml-6 z-30 flex-shrink-0">
          <div className="flex flex-col items-center py-6 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/40 dark:border-border/40 rounded-3xl shadow-xl h-fit max-h-[90vh]">
            <NavIcon
              active={activeFeed === "public" && !showAdminPanel}
              icon={<Globe size={24} />}
              label="Global Feed"
              onClick={() => {
                setShowAdminPanel(false);
                setActiveFeed("public");
              }}
            />
            <div className="w-10 h-[2px] bg-primary/10 rounded-full my-2" />
            {MOCK_USER.role === "student" && (
              <>
                <NavIcon
                  active={activeFeed === "mySchool" && !showAdminPanel}
                  icon={<School size={24} />}
                  label={MOCK_USER.school}
                  onClick={() => {
                    setShowAdminPanel(false);
                    setActiveFeed("mySchool");
                  }}
                />
                <NavIcon
                  active={activeFeed === "myClass" && !showAdminPanel}
                  icon={<Users size={24} />}
                  label={MOCK_USER.class}
                  onClick={() => {
                    setShowAdminPanel(false);
                    setActiveFeed("myClass");
                  }}
                />
              </>
            )}

            {!isCreatePostBtnVisible && !showAdminPanel && (
              <>
                <div className="w-10 h-[2px] bg-primary/10 rounded-full my-2" />
                <div
                  className="group relative flex flex-col items-center justify-center cursor-pointer w-full mb-0 animate-fade-in transition-all duration-500 ease-out"
                  onClick={() => handleOpenCreateDialog(true)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap">
                    {t("community.createPost")}{" "}
                    <div className="absolute top-1/2 -left-1.5 -mt-1.5 border-4 border-transparent border-r-gray-900" />
                  </div>
                  <div className="relative flex items-center justify-center transition-all duration-300 h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30 hover:scale-110 hover:shadow-xl border border-white/40 dark:border-white/10">
                    <Plus size={24} />
                  </div>
                </div>
              </>
            )}

            {user?.isAdmin && (
              <>
              <div className="w-10 h-[2px] bg-primary/20 rounded-full my-2" />
                <NavIcon
                  active={showAdminPanel}
                  icon={<Shield size={24} />}
                  label={t("admin.adminConsole")}
                  alert={adminReports.length > 0}
                  onClick={() => setShowAdminPanel(true)}
                />
                <NavIcon
                  active={false}
                  icon={<Plus size={24} />}
                  label={t("admin.createGroup")}
                  onClick={() => setIsCreateGroupDialogOpen(true)}
                />
              </>
            )}
          </div>
        </aside>
      )}

      {/* ADMIN SUB-MENU */}
      {!isMobile && (
        <div
          className={`h-full flex flex-col justify-start pt-6 z-20 transition-all duration-300 ease-in-out ${showAdminPanel ? "w-[240px] ml-4 opacity-100 translate-x-0" : "w-0 ml-0 opacity-0 -translate-x-10 overflow-hidden"}`}
        >
          <div className="h-fit max-h-[90vh] bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-white/40 dark:border-border/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-primary/10 bg-white/30 dark:bg-black/10">
              <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5 fill-primary/20" />{" "}
                {t("admin.title")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t("admin.managementConsole")}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "overview" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("overview")}
              >
                <Activity className="mr-3 h-4 w-4" /> {t("admin.overview")}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "groups" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("groups")}
              >
                <Layers className="mr-3 h-4 w-4" /> {t("admin.groups")}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "users" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("users")}
              >
                <Users className="mr-3 h-4 w-4" /> {t("admin.users")}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "moderation" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("moderation")}
              >
                <AlertTriangle className="mr-3 h-4 w-4" /> {t("admin.reports")}{" "}
                {adminReports.length > 0 && (
                  <Badge className="ml-auto h-5 px-1.5 bg-red-500 text-white">
                    {adminReports.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "settings" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("settings")}
              >
                <Settings className="mr-3 h-4 w-4" /> {t("admin.settings")}
              </Button>
              <div className="my-2 border-t border-primary/10" />
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-hover "
                onClick={() => setShowAdminPanel(false)}
              >
                <LogOut className="mr-3 h-4 w-4" /> {t("admin.exitMode")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main
        className={`flex-1 h-full flex flex-col min-w-0 bg-transparent transition-all duration-300 overflow-hidden relative`}
      >
        <div
          className={`flex-shrink-0 max-w-6xl mx-auto w-full pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-10 ${isMobile ? "pt-24" : "pt-2"}`}
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {showAdminPanel
                ? activeAdminTab === "overview"
                  ? t("admin.systemOverview")
                  : activeAdminTab === "groups"
                    ? t("admin.groupManagement")
                    : activeAdminTab === "users"
                      ? t("admin.userManagement")
                      : activeAdminTab === "settings"
                        ? t("admin.globalSettings")
                        : t("admin.contentModeration")
                : getFeedTitle()}
            </h1>
            <p className="text-muted-foreground">
              {showAdminPanel
                ? t("admin.manageSubtitle")
                : t("admin.latestUpdates")}
            </p>
          </div>

          {!showAdminPanel && (
            <div className="hidden md:block" ref={createPostBtnRef}>
              <Button
                onClick={() => handleOpenCreateDialog(true)}
                className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" /> {t("community.createPost")}
              </Button>
            </div>
          )}
        </div>

        {renderCreateDialog()}

        {/* CREATE GROUP DIALOG */}
        <Dialog
          open={isCreateGroupDialogOpen}
          onOpenChange={setIsCreateGroupDialogOpen}
        >
          <DialogContent className="sm:max-w-[900px] sm:h-[600px] flex flex-col gap-0 p-0 bg-white/95 dark:bg-card/95 backdrop-blur-xl border-primary/20 overflow-hidden">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />{" "}
                {t("group.createTitle")}
              </DialogTitle>
              <DialogDescription>{t("group.createDesc")}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 overflow-hidden flex-1">
              <div className="space-y-4">
                <div className="flex justify-center mb-2">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() =>
                      document.getElementById("group-icon-upload")?.click()
                    }
                  >
                    <Avatar className="h-24 w-24 border-2 border-dashed border-primary/50 group-hover:border-primary transition-colors">
                      <AvatarImage
                        src={
                          newGroupIconType === "image" && newGroupIcon
                            ? newGroupIcon
                            : undefined
                        }
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-transparent text-muted-foreground group-hover:text-primary transition-colors">
                        {newGroupIconType === "preset" && newGroupIcon ? (
                          PRESET_ICONS.find((p) => p.id === newGroupIcon)?.icon
                        ) : (
                          <Camera className="h-10 w-10" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg">
                      <Plus className="h-4 w-4" />
                    </div>
                    <input
                      id="group-icon-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGroupIconUpload}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium">
                    {t("group.orSelectIcon")}
                  </Label>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    {PRESET_ICONS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setNewGroupIcon(preset.id);
                          setNewGroupIconType("preset");
                        }}
                        className={`p-2 rounded-lg border transition-all hover:scale-105 ${newGroupIconType === "preset" && newGroupIcon === preset.id ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/60"}`}
                        title={preset.label}
                      >
                        {preset.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="group-name">{t("group.name")}</Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder={t("group.namePlaceholder")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="group-desc">{t("group.description")}</Label>
                  <Textarea
                    id="group-desc"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder={t("group.descriptionPlaceholder")}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>{t("group.privacyType")}</Label>
                  <Select
                    value={newGroupType}
                    onValueChange={(v) =>
                      setNewGroupType(v as "public" | "private")
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Unlock className="h-4 w-4" /> {t("group.public")}
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> {t("group.private")}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newGroupType === "private" && (
                  <div>
                    <Label htmlFor="group-password">
                      {t("group.accessCode")}
                    </Label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="group-password"
                        type="password"
                        value={newGroupPassword}
                        onChange={(e) => setNewGroupPassword(e.target.value)}
                        placeholder={t("group.accessCodePlaceholder")}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <Label>{t("group.selectOrganization")}</Label>
                  <Select
                    value={newGroupSchool}
                    onValueChange={setNewGroupSchool}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">{t("group.none")}</SelectItem>
                      {ALL_SCHOOLS.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newGroupSchool !== "None" && (
                  <div>
                    <Label htmlFor="org-password">
                      {t("group.orgPassword")}
                    </Label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="org-password"
                        type="password"
                        value={organizationPassword}
                        onChange={(e) =>
                          setOrganizationPassword(e.target.value)
                        }
                        placeholder={t("group.orgPassword")}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("group.orgPasswordRequired")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="p-6 pt-0">
              <Button
                onClick={handleCreateGroup}
                disabled={
                  !newGroupName.trim() ||
                  (newGroupSchool !== "None" && !organizationPassword.trim()) ||
                  (newGroupType === "private" && !newGroupPassword.trim())
                }
                className="bg-gradient-to-r from-primary to-emerald-600 text-white"
              >
                {t("group.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex-1 w-full min-h-0 overflow-y-auto overscroll-none pb-6 px-4 md:px-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6">
            {showAdminPanel ? (
              renderAdminContent()
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t("community.noPostsYet")}
                </p>
              </div>
            ) : (
              filteredPosts.map(renderPost)
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FAB */}
      {isMobile && !showAdminPanel && (
        <Button
          onClick={() => handleOpenCreateDialog(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-emerald-600 text-white shadow-2xl shadow-emerald-600/40 z-50 flex items-center justify-center md:hidden transition-transform duration-300 active:scale-95"
        >
          <Plus size={28} />
        </Button>
      )}

      <Dialog
        open={!!lightboxImages}
        onOpenChange={(open) => !open && setLightboxImages(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-none p-0 flex flex-col overflow-hidden rounded-xl shadow-2xl">
          <DialogHeader className="absolute top-0 right-0 z-50 p-4">
            <DialogTitle className="sr-only">Image Gallery</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              onClick={() => setLightboxImages(null)}
            >
              <X className="h-6 w-6" />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {lightboxImages?.map((src, i) => (
              <div key={i} className="flex justify-center w-full">
                <img
                  src={src}
                  className="max-w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg"
                  alt={`Gallery item ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
