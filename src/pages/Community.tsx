import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch"; 
import { 
  Heart, MessageCircle, School, Users, Send, Plus, Trash2, 
  Image as ImageIcon, Globe, X, Paperclip, File, Edit, Share2,
  Shield, Activity, AlertTriangle, UserCog, Ban, CheckCircle, 
  Search, MoreVertical, LogOut, FileText, BarChart3,
  Layers, Megaphone, Lock, Settings, Unlock, Camera, KeyRound,
  // EXTENDED ICON SET FOR PRESETS
  Book, GraduationCap, Music, Palette, Dna, Calculator, Trophy, Star,
  Smile, Zap, Anchor, Coffee, Sun, Moon, Cloud, Umbrella, 
  Briefcase, Code, Terminal, Cpu, Database, Server, Wifi
} from "lucide-react";
import studentsImage from "@/assets/students-planting.jpg";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label"; 

// --- TYPES ---
type Comment = { author: string; role: string; content: string; time: string; };
type Attachment = { type: 'image' | 'file'; url: string; name: string; size?: string; };
type Post = {
  id: number; school: string; author: string; role: string; time: string; content: string;
  image?: string; attachments?: Attachment[]; likes: number; comments: Comment[];
  visibility: "public" | "school" | "class"; targetGroup?: string; status?: "active" | "flagged" | "deleted";
};

type User = { id: string; name: string; email: string; role: "student" | "teacher" | "admin" | "moderator"; status: "active" | "banned"; school: string; };
type Report = { id: string; postId: number; reporter: string; reason: string; timestamp: string; status: "pending" | "resolved"; };
type Log = { id: string; admin: string; action: string; target: string; time: string; };
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
  email: "student@lincoln.edu"
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

// --- PRESET ICONS MAPPING (EXPANDED) ---
const PRESET_ICONS = [
  { id: 'book', icon: <Book className="h-6 w-6" />, label: 'Study' },
  { id: 'grad', icon: <GraduationCap className="h-6 w-6" />, label: 'Academic' },
  { id: 'music', icon: <Music className="h-6 w-6" />, label: 'Arts' },
  { id: 'art', icon: <Palette className="h-6 w-6" />, label: 'Creative' },
  { id: 'science', icon: <Dna className="h-6 w-6" />, label: 'Science' },
  { id: 'math', icon: <Calculator className="h-6 w-6" />, label: 'Math' },
  { id: 'sport', icon: <Trophy className="h-6 w-6" />, label: 'Sports' },
  { id: 'star', icon: <Star className="h-6 w-6" />, label: 'General' },
  { id: 'smile', icon: <Smile className="h-6 w-6" />, label: 'Social' },
  { id: 'zap', icon: <Zap className="h-6 w-6" />, label: 'Energy' },
  { id: 'anchor', icon: <Anchor className="h-6 w-6" />, label: 'Navy' },
  { id: 'coffee', icon: <Coffee className="h-6 w-6" />, label: 'Break' },
  { id: 'sun', icon: <Sun className="h-6 w-6" />, label: 'Day' },
  { id: 'moon', icon: <Moon className="h-6 w-6" />, label: 'Night' },
  { id: 'cloud', icon: <Cloud className="h-6 w-6" />, label: 'Weather' },
  { id: 'code', icon: <Code className="h-6 w-6" />, label: 'Tech' },
];

// --- MOCK ADMIN DATA ---
const INITIAL_USERS: User[] = [
  { id: "u1", name: "John Doe", email: "john@lincoln.edu", role: "student", status: "active", school: "Lincoln Elementary" },
  { id: "u2", name: "Sarah Connor", email: "sarah@roosevelt.edu", role: "teacher", status: "active", school: "Roosevelt High" },
  { id: "u3", name: "Bad Actor", email: "troll@school.edu", role: "student", status: "banned", school: "Jefferson Academy" },
  { id: "u4", name: "Principal Skinner", email: "prince@lincoln.edu", role: "admin", status: "active", school: "Lincoln Elementary" },
];

const INITIAL_GROUPS: Group[] = [
  { id: "g1", name: "Ms. Smith - 5th Grade", description: "Official class group", members: 24, type: "private", status: "active", lastActive: "2 mins ago", icon: "book", iconType: "preset" },
  { id: "g2", name: "Chess Club", description: "Strategic thinking for everyone", members: 12, type: "public", status: "active", lastActive: "1 day ago", icon: "star", iconType: "preset" },
  { id: "g3", name: "Gaming Lounge", description: "After school gaming", members: 156, type: "public", status: "frozen", lastActive: "3 days ago", icon: undefined, iconType: undefined },
];

const INITIAL_REPORTS: Report[] = [
  { id: "r1", postId: 1, reporter: "Karen M.", reason: "Inappropriate language", timestamp: "10 mins ago", status: "pending" },
  { id: "r2", postId: 0, reporter: "System Bot", reason: "Spam detection", timestamp: "1 hour ago", status: "pending" },
];

const INITIAL_LOGS: Log[] = [
  { id: "l1", admin: "System", action: "Server Restart", target: "Main Cluster", time: "02:00 AM" },
  { id: "l2", admin: "Principal Skinner", action: "Banned User", target: "Bad Actor", time: "Yesterday" },
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
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  return parseFloat((bytes / Math.pow(k, Math.floor(Math.log(bytes) / Math.log(k)))).toFixed(2)) + ' MB';
};

// --- SUB-COMPONENTS ---
const NavIcon = ({ 
  active, icon, label, onClick, mobileMode = false, alert = false, className = ""
}: { 
  active: boolean; icon: React.ReactNode; label: string; onClick: () => void; mobileMode?: boolean; alert?: boolean; className?: string;
}) => (
  <div 
    className={`group relative flex flex-col items-center justify-center cursor-pointer ${mobileMode ? "min-w-[70px] mx-1" : "w-full mb-6"} ${className}`} 
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
    {active && !mobileMode && <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-primary rounded-r-full transition-all duration-300" />}
    
    <div className={`
      relative flex items-center justify-center transition-all duration-300
      ${mobileMode ? "h-14 w-14 rounded-full" : "h-12 w-12 rounded-2xl"}
      ${active 
        ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30 scale-105" 
        : "bg-white/80 dark:bg-card/80 text-muted-foreground hover:bg-white hover:text-primary hover:scale-110 hover:shadow-lg"
      }
      border border-white/40 dark:border-white/10 shadow-sm
    `}>
      {icon}
      {active && mobileMode && <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />}
      {alert && <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>}
    </div>
    {mobileMode && <span className={`text-[10px] mt-1 font-medium truncate max-w-[80px] ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>}
  </div>
);

// --- MAIN COMPONENT ---
const Community = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // --- STATE ---
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 0,
      school: "Lincoln Elementary",
      author: "Principal Johnson",
      role: "Principal",
      time: "2 hours ago",
      content: "Incredible turnout for our tree planting event today! Our students planted 50 trees around the school campus. This helps reduce our carbon footprint and beautifies our daily environment. So proud of everyone's dedication to our environment! 🌳",
      image: studentsImage,
      likes: 124,
      comments: [
        { author: "Ms. Smith", role: "Teacher", content: "Amazing work!", time: "1 hour ago" }
      ],
      visibility: "public",
      status: "active"
    },
    {
      id: 1,
      school: "Roosevelt High",
      author: "Ms. Anderson",
      role: "Teacher",
      time: "5 hours ago",
      content: "Our 10th grade class organized a beach cleanup this weekend. We collected over 200 pounds of trash! Small steps lead to big changes.",
      likes: 89,
      comments: [],
      visibility: "public",
      status: "active"
    },
  ]);
  const [activeFeed, setActiveFeed] = useState<string>("public");
  
  // --- ADMIN STATE ---
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<"overview" | "users" | "groups" | "moderation" | "settings">("overview");
  const [adminUsers, setAdminUsers] = useState<User[]>(INITIAL_USERS);
  const [adminGroups, setAdminGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [adminReports, setAdminReports] = useState<Report[]>(INITIAL_REPORTS);
  const [adminLogs, setAdminLogs] = useState<Log[]>(INITIAL_LOGS);
  const [userSearch, setUserSearch] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  
  const [adminSettings, setAdminSettings] = useState({
      profanityFilter: true,
      imageUploads: true,
      linkPreviews: true
  });

  // Create Group State (Expanded)
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupType, setNewGroupType] = useState<"public" | "private">("public");
  const [newGroupPassword, setNewGroupPassword] = useState("");
  const [newGroupSchool, setNewGroupSchool] = useState(MOCK_USER.school);
  const [newGroupIcon, setNewGroupIcon] = useState<string | null>(null);
  const [newGroupIconType, setNewGroupIconType] = useState<"image" | "preset">("image");
  
  // Icon Picker State
  const [showIconPicker, setShowIconPicker] = useState(false);

  // --- NORMAL STATE ---
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());
  
  const [editingComment, setEditingComment] = useState<{ postId: number; commentIdx: number; } | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSchool, setNewPostSchool] = useState(MOCK_USER.school);
  const [newPostVisibility, setNewPostVisibility] = useState<"public" | "school" | "class">("public");
  const [newPostImage, setNewPostImage] = useState<string | undefined>(undefined);
  const [newPostAttachments, setNewPostAttachments] = useState<Attachment[]>([]);
  
  const [showMobileNav, setShowMobileNav] = useState(true);
  const lastScrollY = useRef(0);

  // --- EFFECTS ---
  useEffect(() => {
    if (!isMobile) return;
    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            setShowMobileNav(false);
            } else {
            setShowMobileNav(true);
            }
            lastScrollY.current = currentScrollY;
        }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [isMobile]);

  // --- ADMIN ACTIONS ---
  const handleBanUser = (userId: string) => {
    setAdminUsers(users => users.map(u => u.id === userId ? { ...u, status: u.status === "active" ? "banned" : "active" } : u));
    const user = adminUsers.find(u => u.id === userId);
    addLog("Current Admin", user?.status === "active" ? "Banned User" : "Unbanned User", user?.name || "Unknown");
    toast({ title: user?.status === "active" ? "User Banned" : "User Unbanned", variant: user?.status === "active" ? "destructive" : "default" });
  };

  const handleGroupAction = (groupId: string, action: "freeze" | "delete") => {
      if (action === "freeze") {
          setAdminGroups(groups => groups.map(g => g.id === groupId ? { ...g, status: g.status === "active" ? "frozen" : "active" } : g));
          toast({ title: "Group Status Updated" });
      } else {
          setAdminGroups(groups => groups.filter(g => g.id !== groupId));
          toast({ title: "Group Deleted" });
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
          school: newGroupSchool,
          status: "active",
          lastActive: "Just now"
      };
      setAdminGroups([newGroup, ...adminGroups]);
      addLog("Current Admin", "Created Group", newGroupName);
      setIsCreateGroupDialogOpen(false);
      
      // Reset form
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupType("public");
      setNewGroupPassword("");
      setNewGroupIcon(null);
      setNewGroupIconType("image");
      
      toast({ title: "Group Created", description: `${newGroupName} is now active.` });
  };

  const handleSendAnnouncement = () => {
      if (!announcementText) return;
      toast({ title: "Announcement Sent", description: "All users have been notified." });
      setAnnouncementText("");
  };

  const handleResolveReport = (reportId: string, action: "delete_post" | "dismiss") => {
    const report = adminReports.find(r => r.id === reportId);
    if (!report) return;

    if (action === "delete_post") {
        setPosts(currentPosts => currentPosts.filter(p => p.id !== report.postId));
        addLog("Current Admin", "Deleted Post (Reported)", `Post #${report.postId}`);
        toast({ title: "Content Removed", description: "The post has been deleted permanently." });
    } else {
        addLog("Current Admin", "Dismissed Report", `Report #${reportId}`);
        toast({ title: "Report Dismissed" });
    }
    setAdminReports(reports => reports.filter(r => r.id !== reportId));
  };

  const addLog = (admin: string, action: string, target: string) => {
    const newLog: Log = {
        id: Date.now().toString(),
        admin,
        action,
        target,
        time: new Date().toLocaleTimeString()
    };
    setAdminLogs(prev => [newLog, ...prev]);
  };

  // --- RENDER HELPERS ---
  const getGroupIcon = (group: Group) => {
      if (group.iconType === "image" && group.icon) {
          return <img src={group.icon} alt={group.name} className="h-10 w-10 rounded-full object-cover" />;
      }
      if (group.iconType === "preset" && group.icon) {
          const preset = PRESET_ICONS.find(p => p.id === group.icon);
          if (preset) return <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">{preset.icon}</div>;
      }
      return <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Layers className="h-5 w-5 text-primary" /></div>;
  };

  // --- NORMAL ACTIONS (Restored) ---
  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) newLiked.delete(postId); else newLiked.add(postId);
    setLikedPosts(newLiked);
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: newLiked.has(postId) ? p.likes + 1 : p.likes - 1 } : p));
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
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, { author: MOCK_USER.name, role: MOCK_USER.role, content: comment, time: "Just now" }] } : p));
    setNewComment({ ...newComment, [postId]: "" });
    toast({ title: t('community.commentAdded'), description: t('community.commentAddedDesc') });
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      school: newPostSchool,
      author: MOCK_USER.name,
      role: MOCK_USER.role,
      time: "Just now",
      content: newPostContent,
      image: newPostImage,
      attachments: newPostAttachments,
      likes: 0,
      comments: [],
      visibility: newPostVisibility,
      status: "active"
    };
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostImage(undefined);
    setNewPostAttachments([]);
    setIsCreateDialogOpen(false);
    toast({ title: t('community.postCreated'), description: t('community.postCreatedDesc') });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setNewPostImage(reader.result as string); };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewPostAttachments(prev => [...prev, {
            type: file.type.startsWith('image/') ? 'image' : 'file',
            url: reader.result as string,
            name: file.name,
            size: formatFileSize(file.size),
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const removeAttachment = (index: number) => { 
    setNewPostAttachments(prev => prev.filter((_, i) => i !== index)); 
  };

  const handleDeletePost = (postId: number) => { 
    setPosts(posts.filter((post) => post.id !== postId)); 
  };
  
  const handleEditPost = (postId: number) => { 
    if (!editPostText.trim()) return; 
    setPosts(posts.map(p => p.id === postId ? { ...p, content: editPostText } : p)); 
    setEditingPost(null); 
  };
  
  const handleDeleteComment = (postId: number, idx: number) => { 
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments.filter((_, i) => i !== idx) } : p)); 
  };
  
  const handleEditComment = (postId: number, idx: number) => { 
    if (!editCommentText.trim()) return; 
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments.map((c, i) => i === idx ? { ...c, content: editCommentText } : c) } : p)); 
    setEditingComment(null); 
  };

  const handleOpenCreateDialog = (isOpen: boolean) => {
    if (isOpen) {
      if (activeFeed === "mySchool" || ALL_SCHOOLS.includes(activeFeed)) setNewPostVisibility("school");
      else if (activeFeed === "myClass") setNewPostVisibility("class");
      else setNewPostVisibility("public");
      
      if (ALL_SCHOOLS.includes(activeFeed)) setNewPostSchool(activeFeed); else setNewPostSchool(MOCK_USER.school);
    }
    setIsCreateDialogOpen(isOpen);
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFeed === "public") return post.visibility === "public";
    if (activeFeed === "mySchool") return post.school === MOCK_USER.school && (post.visibility === "school" || post.visibility === "public");
    if (activeFeed === "myClass") return post.school === MOCK_USER.school && post.visibility === "class";
    return false;
  });

  const getFeedTitle = () => {
    if (activeFeed === "public") return t("community.public") || "Global Feed";
    if (activeFeed === "mySchool") return MOCK_USER.school;
    if (activeFeed === "myClass") return MOCK_USER.class;
    return activeFeed;
  };

  // --- RENDER HELPERS (Restored Original) ---
  const renderCreateDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={handleOpenCreateDialog}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" />{t("community.createNewPost")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4">
            <Avatar className="border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary">{MOCK_USER.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid gap-2 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{MOCK_USER.name}</p>
                <Badge variant="outline" className="capitalize bg-primary/5 border-primary/20">{newPostVisibility}</Badge>
              </div>
              <Textarea 
                placeholder={`${t("community.sharePlaceholder")}...`} 
                value={newPostContent} 
                onChange={(e) => setNewPostContent(e.target.value)} 
                className="min-h-[100px] resize-none border-none focus-visible:ring-0 px-0 shadow-none bg-transparent" 
              />
              {newPostImage && (
                <div className="relative mt-2 rounded-lg overflow-hidden border border-primary/20">
                  <img src={newPostImage} alt="Preview" className="w-full h-auto max-h-[200px] object-cover" />
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={() => setNewPostImage(undefined)}>
                    <X className="h-3 w-3"/>
                  </Button>
                </div>
              )}
              {newPostAttachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {newPostAttachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-primary/10">
                      {attachment.type === 'image' ? <ImageIcon className="h-4 w-4 text-primary" /> : <File className="h-4 w-4 text-primary" />}
                      <span className="text-sm flex-1 truncate">{attachment.name}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 hover:text-destructive hover:bg-hover" onClick={() => removeAttachment(index)}>
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
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-hover rounded-full" onClick={() => document.getElementById("image-upload")?.click()}>
                <ImageIcon className="h-4 w-4 mr-1" /> {t("community.photo")}
              </Button>
              <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-hover rounded-full" onClick={() => document.getElementById("file-upload")?.click()}>
                <Paperclip className="h-4 w-4 mr-1" /> {t("File")}
              </Button>
              <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
            </div>
            <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="bg-gradient-to-r from-primary to-emerald-600 text-white rounded-full">
              {t("community.post")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderPost = (post: Post) => (
    <Card key={post.id} className="overflow-hidden bg-white/70 dark:bg-card/80 backdrop-blur-xl border-white/30 dark:border-border/60 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 group/card">
      <CardHeader className="flex flex-row items-start gap-4 p-4 md:p-6 pb-2 border-b border-white/10 dark:border-white/5">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary font-bold">{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <p className="font-semibold text-sm truncate">{post.author}</p>
              <Badge variant="secondary" className="w-fit text-[10px] h-5 px-1.5 font-normal">{post.role}</Badge>
            </div>
            {post.author === MOCK_USER.name && (
              <div className="flex gap-1">
                {editingPost === post.id ? (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-hover hover:text-hover-foreground" onClick={() => handleEditPost(post.id)} aria-label="Save Post"><Send className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-hover hover:text-hover-foreground" onClick={() => setEditingPost(null)} aria-label="Cancel Edit"><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-hover" onClick={() => { setEditingPost(post.id); setEditPostText(post.content); }} aria-label="Edit Post"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-hover" onClick={() => handleDeletePost(post.id)} aria-label="Delete Post"><Trash2 className="h-4 w-4" /></Button>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground">{post.time}</p>
            <span className="text-xs text-muted-foreground">•</span>
            {post.visibility === "public" && <Globe className="h-3 w-3 text-muted-foreground" />}
            {post.visibility === "school" && <School className="h-3 w-3 text-muted-foreground" />}
            {post.visibility === "class" && <Users className="h-3 w-3 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6 pt-6">
        <div className={`${post.image ? "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start" : ""}`}>
          <div className={`flex flex-col ${post.image ? "h-full" : ""}`}>
            {editingPost === post.id ? (
              <Textarea value={editPostText} onChange={(e) => setEditPostText(e.target.value)} className="min-h-[100px]" />
            ) : (
              <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
            )}

            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {post.attachments.map((attachment, idx) => (
                  <a key={idx} href={attachment.url} download={attachment.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-muted/30 border border-primary/10 dark:border-border/40 hover:bg-hover hover:text-hover-foreground transition-colors group/file">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-500/20">
                      {attachment.type === 'image' ? <ImageIcon className="h-5 w-5 text-primary" /> : <File className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover/file:text-primary transition-colors">{attachment.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <div className="mt-auto pt-6 flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} className={`rounded-full transition-colors ${likedPosts.has(post.id) ? "text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-hover" : "text-muted-foreground hover:text-hover-foreground hover:bg-hover"}`}>
                <Heart className={`mr-1.5 h-4 w-4 ${likedPosts.has(post.id) ? "fill-current scale-110" : ""}`} /> {post.likes}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)} className="rounded-full text-muted-foreground hover:text-hover-foreground hover:bg-hover">
                <MessageCircle className="mr-1.5 h-4 w-4" /> {post.comments.length}
              </Button>
              <Button variant="ghost" size="sm" className="ml-auto rounded-full text-muted-foreground hover:text-hover-foreground hover:bg-hover">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {post.image && (
            <div className="rounded-xl overflow-hidden border border-white/30 dark:border-border/40 shadow-md h-full max-h-[500px] flex items-center bg-black/5 dark:bg-black/20">
              <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {showComments.has(post.id) && (
          <div className="mt-6 space-y-4 pt-6 border-t border-primary/5 animate-in fade-in">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-white/50 dark:bg-muted/40 backdrop-blur-sm p-3 rounded-lg rounded-tl-none border border-white/30 dark:border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      {comment.author === MOCK_USER.name && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-hover" onClick={() => { setEditingComment({ postId: post.id, commentIdx: idx }); setEditCommentText(comment.content); }}><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-hover" onClick={() => handleDeleteComment(post.id, idx)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      )}
                    </div>
                    {editingComment?.postId === post.id && editingComment.commentIdx === idx ? (
                      <div className="flex gap-2">
                        <Input value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} className="h-8 text-sm" />
                        <Button size="sm" className="h-8" onClick={() => handleEditComment(post.id, idx)}>{t("community.save")}</Button>
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
                <AvatarFallback className="text-xs bg-primary/10">{MOCK_USER.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input 
                  placeholder={t("community.writeComment")} 
                  value={newComment[post.id] || ""} 
                  onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })} 
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(post.id); } }} 
                  className="pr-10" 
                />
                <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full text-muted-foreground hover:text-primary hover:bg-hover" onClick={() => handleAddComment(post.id)} disabled={!newComment[post.id]?.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // --- RENDER ADMIN VIEWS ---
  const renderAdminContent = () => {
    switch(activeAdminTab) {
        case "overview":
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900">
                            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Total Users</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{adminUsers.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">+2% from last week</p>
                            </CardContent>
                        </Card>
                         <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Active Groups</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-bold">{adminGroups.length}</div></CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900">
                            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase">Pending Reports</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{adminReports.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">{adminReports.length > 0 ? "Action required" : "All clear"}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-100 dark:border-emerald-900">
                            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase">System Status</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold flex items-center gap-2">99.9% <Activity className="h-5 w-5 animate-pulse text-emerald-600" /></div>
                                <p className="text-xs text-muted-foreground mt-1">Servers operational</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> Global Announcement</CardTitle>
                            <CardDescription>Send a system-wide broadcast to all active chat rooms.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea 
                                placeholder="Type your message here (e.g., 'Server maintenance in 10 minutes')..." 
                                value={announcementText}
                                onChange={(e) => setAnnouncementText(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleSendAnnouncement} disabled={!announcementText} className="bg-gradient-to-r from-primary to-emerald-600 text-white">
                                    <Send className="mr-2 h-4 w-4" /> Broadcast
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity Log</CardTitle>
                            <CardDescription>Audit trail of administrative actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {adminLogs.slice(0, 5).map(log => (
                                    <div key={log.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Shield className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{log.action}</p>
                                                <p className="text-xs text-muted-foreground">by {log.admin} • Target: {log.target}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );

        case "users": {
            const filteredUsers = adminUsers.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
            return (
                <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search users by name or email..." 
                                className="pl-9" 
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="hover:bg-hover hover:text-hover-foreground"><FileText className="mr-2 h-4 w-4" /> Export CSV</Button>
                    </div>

                    <div className="rounded-md border bg-card">
                        <div className="grid grid-cols-12 gap-2 p-4 border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <div className="col-span-4">User</div>
                            <div className="col-span-3">Role</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="grid grid-cols-12 gap-2 p-4 items-center border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <div className="col-span-4 flex items-center gap-3">
                                        <Avatar className="h-8 w-8"><AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback></Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                    </div>
                                    <div className="col-span-3">
                                        <Badge className={`${user.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"} border-0`}>
                                            {user.status}
                                        </Badge>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-hover hover:text-hover-foreground" onClick={() => handleBanUser(user.id)} title={user.status === "active" ? "Ban User" : "Unban User"}>
                                            {user.status === "active" ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-hover hover:text-hover-foreground"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Manage {user.name}</DropdownMenuLabel>
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Delete Account</DropdownMenuItem>
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
                        <h3 className="text-lg font-medium">Chat Groups</h3>
                    </div>
                    <div className="grid gap-4">
                        {adminGroups.map(group => (
                            <div key={group.id} className="flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    {getGroupIcon(group)}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{group.name}</p>
                                            {group.type === "private" && <Lock className="h-3 w-3 text-muted-foreground" />}
                                            {group.status === 'frozen' && <Ban className="h-3 w-3 text-red-500" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {group.members} members • {group.description || "No description"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="hover:bg-hover hover:text-hover-foreground" onClick={() => handleGroupAction(group.id, "freeze")}>
                                        {group.status === "active" ? "Freeze" : "Unfreeze"}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-hover hover:text-hover-foreground" onClick={() => handleGroupAction(group.id, "delete")}>
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
                            <h3 className="text-lg font-medium">All Caught Up!</h3>
                            <p className="text-muted-foreground">No pending reports to review.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {adminReports.map(report => {
                                const post = posts.find(p => p.id === report.postId);
                                return (
                                    <Card key={report.id} className="border-l-4 border-l-orange-500">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="destructive" className="uppercase text-[10px]">Reported</Badge>
                                                    <span className="text-sm text-muted-foreground">Reported by <b>{report.reporter}</b> • {report.timestamp}</span>
                                                </div>
                                                <Badge variant="outline">{report.reason}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-muted/40 p-3 rounded-md mb-4 border border-border">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Post Content:</p>
                                                {post ? (
                                                    <p className="text-sm">{post.content}</p>
                                                ) : (
                                                    <p className="text-sm italic text-muted-foreground">Content unavailable (Deleted or Error)</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <Button variant="outline" size="sm" className="hover:bg-hover hover:text-hover-foreground" onClick={() => handleResolveReport(report.id, "dismiss")}>Dismiss Report</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleResolveReport(report.id, "delete_post")}><Trash2 className="mr-2 h-4 w-4" /> Delete Post</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
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
                            <CardTitle>Safety & Filters</CardTitle>
                            <CardDescription>Global settings for all chat rooms.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Profanity Filter</p>
                                    <p className="text-xs text-muted-foreground">Automatically hide offensive words.</p>
                                </div>
                                <Switch 
                                    checked={adminSettings.profanityFilter} 
                                    onCheckedChange={(val) => setAdminSettings({...adminSettings, profanityFilter: val})} 
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Image Uploads</p>
                                    <p className="text-xs text-muted-foreground">Allow users to send images in chats.</p>
                                </div>
                                <Switch 
                                    checked={adminSettings.imageUploads} 
                                    onCheckedChange={(val) => setAdminSettings({...adminSettings, imageUploads: val})} 
                                />
                            </div>
                             <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Link Preview</p>
                                    <p className="text-xs text-muted-foreground">Generate previews for shared URLs.</p>
                                </div>
                                <Switch 
                                    checked={adminSettings.linkPreviews} 
                                    onCheckedChange={(val) => setAdminSettings({...adminSettings, linkPreviews: val})} 
                                />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/10">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="w-full">Enable Maintenance Mode</Button>
                            <p className="text-xs text-red-600/60 mt-2 text-center">This will lock all chat rooms for everyone except admins.</p>
                        </CardContent>
                    </Card>
                </div>
            );
        default: return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 dark:from-background dark:via-green-950/20 dark:to-background pt-0 flex flex-col md:flex-row overflow-hidden no-scrollbar">
      
      {/* MOBILE NAV */}
      {isMobile && (
        <div className={`fixed top-16 left-0 right-0 z-40 w-full bg-white/90 dark:bg-card/90 backdrop-blur-md border-b border-primary/10 dark:border-border transition-all duration-500 ease-in-out ${showMobileNav ? "translate-y-0 opacity-100" : "-translate-y-[200%] opacity-0 pointer-events-none"}`}>
          <div className="flex items-center px-4 py-2 overflow-x-auto no-scrollbar gap-2 snap-x">
            <NavIcon mobileMode active={activeFeed === "public" && !showAdminPanel} icon={<Globe size={20} />} label="Global" onClick={() => { setShowAdminPanel(false); setActiveFeed("public"); }} />
            <div className="h-8 w-[1px] bg-primary/10 shrink-0 mx-1" />
            {MOCK_USER.role === "student" && (
              <>
                <NavIcon mobileMode active={activeFeed === "mySchool" && !showAdminPanel} icon={<School size={20} />} label="School" onClick={() => { setShowAdminPanel(false); setActiveFeed("mySchool"); }} />
                <NavIcon mobileMode active={activeFeed === "myClass" && !showAdminPanel} icon={<Users size={20} />} label="Class" onClick={() => { setShowAdminPanel(false); setActiveFeed("myClass"); }} />
              </>
            )}
            
            {/* NEW CREATE GROUP BUTTON (Mobile) */}
            <div className="h-8 w-[1px] bg-primary/10 shrink-0 mx-1" />
            <NavIcon 
              mobileMode 
              active={false} 
              icon={<Plus size={20} />} 
              label="New Group" 
              onClick={() => setIsCreateGroupDialogOpen(true)} 
            />
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside className="h-full flex flex-col justify-center w-[80px] ml-6 z-30 flex-shrink-0">
          <div className="flex flex-col items-center py-6 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/40 dark:border-border/40 rounded-3xl shadow-xl h-fit max-h-[90vh]">
            <NavIcon active={activeFeed === "public" && !showAdminPanel} icon={<Globe size={24} />} label="Global Feed" onClick={() => { setShowAdminPanel(false); setActiveFeed("public"); }} />
            
            <div className="w-10 h-[2px] bg-primary/10 rounded-full my-4" />
            
            {MOCK_USER.role === "student" && (
              <>
                <NavIcon active={activeFeed === "mySchool" && !showAdminPanel} icon={<School size={24} />} label={MOCK_USER.school} onClick={() => { setShowAdminPanel(false); setActiveFeed("mySchool"); }} />
                <NavIcon active={activeFeed === "myClass" && !showAdminPanel} icon={<Users size={24} />} label={MOCK_USER.class} onClick={() => { setShowAdminPanel(false); setActiveFeed("myClass"); }} />
              </>
            )}

            {/* --- SECURITY COMMENT: WRAP THIS IN PERMISSION CHECK (e.g. if(user.isAdmin)) --- */}
            <div className="w-10 h-[2px] bg-primary/10 rounded-full my-4" />
            <NavIcon 
              active={showAdminPanel} 
              icon={<Shield size={24} />} 
              label="Admin Console" 
              alert={adminReports.length > 0}
              onClick={() => setShowAdminPanel(true)} 
            />
            
            {/* NEW CREATE GROUP BUTTON (Desktop) */}
            <NavIcon 
              active={false} 
              icon={<Plus size={24} />} 
              label="Create Group" 
              onClick={() => setIsCreateGroupDialogOpen(true)} 
            />
            {/* --- END SECURITY COMMENT --- */}
          </div>
        </aside>
      )}

      {/* ADMIN SUB-MENU (SLIDES OUT) */}
      {!isMobile && (
        <div 
          className={`
            h-full flex flex-col justify-center z-20 transition-all duration-300 ease-in-out
            ${showAdminPanel ? "w-[240px] ml-4 opacity-100 translate-x-0" : "w-0 ml-0 opacity-0 -translate-x-10 overflow-hidden"}
          `}
        >
          <div className="h-[90vh] bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-white/40 dark:border-border/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-primary/10 bg-white/30 dark:bg-black/10">
              <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5 fill-primary/20" /> 
                Admin
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Management Console</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              <Button 
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "overview" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("overview")}
              >
                <Activity className="mr-3 h-4 w-4" /> Overview
              </Button>
              <Button 
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "groups" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("groups")}
              >
                <Layers className="mr-3 h-4 w-4" /> Groups
              </Button>
              <Button 
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "users" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("users")}
              >
                <Users className="mr-3 h-4 w-4" /> Users
              </Button>
              <Button 
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "moderation" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("moderation")}
              >
                <AlertTriangle className="mr-3 h-4 w-4" /> Reports
                {adminReports.length > 0 && <Badge className="ml-auto h-5 px-1.5 bg-red-500 text-white">{adminReports.length}</Badge>}
              </Button>
              <Button 
                variant="ghost"
                className={`w-full justify-start ${activeAdminTab === "settings" ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-md hover:from-primary/90 hover:to-emerald-600/90" : "hover:bg-hover hover:text-hover-foreground"}`}
                onClick={() => setActiveAdminTab("settings")}
              >
                <Settings className="mr-3 h-4 w-4" /> Settings
              </Button>
              <div className="my-2 border-t border-primary/10" />
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-hover " onClick={() => setShowAdminPanel(false)}>
                <LogOut className="mr-3 h-4 w-4" /> Exit Mode
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 h-full overflow-y-auto min-w-0 px-4 md:px-10 pb-32 transition-all duration-300 ${isMobile ? 'pt-24' : 'pt-6'}`}>
        <div className="max-w-6xl mx-auto pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {showAdminPanel ? (
                  activeAdminTab === "overview" ? "System Overview" : 
                  activeAdminTab === "groups" ? "Group Management" :
                  activeAdminTab === "users" ? "User Management" : 
                  activeAdminTab === "settings" ? "Global Settings" :
                  "Content Moderation"
              ) : getFeedTitle()}
            </h1>
            <p className="text-muted-foreground">
               {showAdminPanel ? "Manage, monitor, and maintain community standards." : "Latest updates from your community."}
            </p>
          </div>
          
          {!showAdminPanel && (
            <div className="hidden md:block">
                <Button onClick={() => handleOpenCreateDialog(true)} className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                <Plus className="mr-2 h-4 w-4" /> {t("community.createPost")}
                </Button>
            </div>
          )}
        </div>

        {renderCreateDialog()}

        {/* CREATE GROUP DIALOG (Updated) */}
        <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-card/95 backdrop-blur-xl border-primary/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary" />Create New Group</DialogTitle>
                    <DialogDescription>Create a space for students and teachers to collaborate.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* ICON UPLOAD */}
                    <div className="flex justify-center mb-2">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById("group-icon-upload")?.click()}>
                            <Avatar className="h-20 w-20 border-2 border-dashed border-primary/50 group-hover:border-primary transition-colors">
                                <AvatarImage src={newGroupIconType === "image" && newGroupIcon ? newGroupIcon : undefined} className="object-cover" />
                                <AvatarFallback className="bg-transparent text-muted-foreground group-hover:text-primary transition-colors">
                                    {newGroupIconType === "preset" && newGroupIcon ? (
                                        PRESET_ICONS.find(p => p.id === newGroupIcon)?.icon
                                    ) : (
                                        <Camera className="h-8 w-8" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full shadow-lg">
                                <Plus className="h-3 w-3" />
                            </div>
                            <input id="group-icon-upload" type="file" accept="image/*" className="hidden" onChange={handleGroupIconUpload} />
                        </div>
                    </div>

                    {/* --- REPLACED SECTION START --- */}
                    <div className="flex flex-col items-center gap-2 mb-4 relative">
                        <span className="text-xs text-muted-foreground">Or select a preset:</span>
                        
                        <Button 
                            type="button"
                            variant="outline" 
                            className={`w-full border-dashed border-2 flex items-center justify-center gap-2 transition-all ${newGroupIcon && newGroupIconType === "preset" ? "bg-gradient-to-r from-primary to-emerald-600 text-white border-transparent" : "text-muted-foreground hover:bg-hover hover:text-hover-foreground"}`}
                            onClick={() => setShowIconPicker(!showIconPicker)}
                        >
                            {newGroupIcon && newGroupIconType === "preset" ? (
                                <>
                                    {PRESET_ICONS.find(p => p.id === newGroupIcon)?.icon} 
                                    <span className="ml-2">Icon Selected</span>
                                </>
                            ) : (
                                <>
                                    <Layers className="h-4 w-4" /> Browse Icons
                                </>
                            )}
                        </Button>

                        {/* ICON PANEL POPUP */}
                        {showIconPicker && (
                            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-popover border rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {PRESET_ICONS.map(icon => (
                                        <button 
                                            key={icon.id}
                                            type="button"
                                            className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${newGroupIcon === icon.id && newGroupIconType === "preset" ? "border-transparent bg-gradient-to-r from-primary to-emerald-600 text-white ring-2 ring-primary/20" : "border-transparent hover:bg-hover hover:text-hover-foreground text-muted-foreground"}`}
                                            onClick={() => { 
                                                setNewGroupIcon(icon.id); 
                                                setNewGroupIconType("preset"); 
                                                setShowIconPicker(false); 
                                            }}
                                            title={icon.label}
                                        >
                                            {icon.icon}
                                            <span className="text-[10px] truncate w-full text-center">{icon.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* --- REPLACED SECTION END --- */}

                    <div className="grid gap-2">
                        <Label htmlFor="group-name">Group Name</Label>
                        <Input 
                            id="group-name" 
                            value={newGroupName} 
                            onChange={(e) => setNewGroupName(e.target.value)} 
                            placeholder="e.g. Science Fair 2024" 
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="group-desc">Description</Label>
                        <Textarea 
                            id="group-desc" 
                            value={newGroupDescription} 
                            onChange={(e) => setNewGroupDescription(e.target.value)} 
                            placeholder="What is this group about?" 
                            className="resize-none"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="group-school">Organization</Label>
                        <select 
                            id="group-school"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={newGroupSchool}
                            onChange={(e) => setNewGroupSchool(e.target.value)}
                        >
                            {ALL_SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Privacy Type</Label>
                        <div className="flex gap-4">
                            <Button 
                                type="button" 
                                variant={newGroupType === "public" ? "default" : "outline"} 
                                onClick={() => setNewGroupType("public")}
                                className={`w-full ${newGroupType === "public" ? "bg-gradient-to-r from-primary to-emerald-600 text-white" : "hover:bg-hover hover:text-hover-foreground"}`}
                            >
                                <Globe className="mr-2 h-4 w-4" /> Public
                            </Button>
                            <Button 
                                type="button" 
                                variant={newGroupType === "private" ? "default" : "outline"} 
                                onClick={() => setNewGroupType("private")}
                                className={`w-full ${newGroupType === "private" ? "bg-gradient-to-r from-primary to-emerald-600 text-white" : "hover:bg-hover hover:text-hover-foreground"}`}
                            >
                                <Lock className="mr-2 h-4 w-4" /> Private
                            </Button>
                        </div>
                    </div>

                    {newGroupType === "private" && (
                        <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="group-pass" className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> Access Code (Optional)</Label>
                            <Input 
                                id="group-pass" 
                                type="password"
                                value={newGroupPassword} 
                                onChange={(e) => setNewGroupPassword(e.target.value)} 
                                placeholder="Set a password for joining..." 
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsCreateGroupDialogOpen(false)} className="hover:bg-hover hover:text-hover-foreground">Cancel</Button>
                    <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()} className="bg-gradient-to-r from-primary to-emerald-600 text-white">Create Group</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* DYNAMIC CONTENT */}
        <div className="max-w-6xl mx-auto space-y-6">
            {showAdminPanel ? renderAdminContent() : (
               filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-muted-foreground">{t("community.noPostsYet")}</p>
                  </div>
               ) : (
                 filteredPosts.map(renderPost)
               )
            )}
        </div>
      </main>
      
      {/* MOBILE FAB */}
      {isMobile && !showAdminPanel && (
        <Button onClick={() => handleOpenCreateDialog(true)} className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-emerald-600 text-white shadow-2xl shadow-emerald-600/40 z-50 flex items-center justify-center md:hidden transition-transform duration-300 active:scale-95">
          <Plus size={28} />
        </Button>
      )}
    </div>
  );
};

export default Community;