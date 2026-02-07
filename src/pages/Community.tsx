import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageCircle, School, Users, Send, Plus, Trash2, Image as ImageIcon, Globe, X, Paperclip, File, Edit, Share2 } from "lucide-react";
import studentsImage from "@/assets/students-planting.jpg";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// --- TYPES ---
type Comment = { author: string; role: string; content: string; time: string; };
type Attachment = { type: 'image' | 'file'; url: string; name: string; size?: string; };
type Post = {
  id: number; school: string; author: string; role: string; time: string; content: string;
  image?: string; attachments?: Attachment[]; likes: number; comments: Comment[];
  visibility: "public" | "school" | "class"; targetGroup?: string;
};

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
  active, 
  icon, 
  label, 
  onClick, 
  mobileMode = false 
}: { 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  mobileMode?: boolean; 
}) => (
  <div 
    className={`group relative flex flex-col items-center justify-center cursor-pointer ${mobileMode ? "min-w-[70px] mx-1" : "w-full mb-6"}`} 
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
    },
    {
      id: 2,
      school: "Jefferson Academy",
      author: "Mr. Lee",
      role: "Teacher",
      time: "1 day ago",
      content: "Just a reminder that the recycling bins have been moved to the cafeteria entrance. Please separate plastic and paper! ♻️",
      likes: 45,
      comments: [],
      visibility: "school",
    }
  ]);
  const [activeFeed, setActiveFeed] = useState<string>("public");
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

  // --- HANDLERS ---
  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) newLiked.delete(postId);
    else newLiked.add(postId);
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
    if (MOCK_USER.role === "moderator" && ALL_SCHOOLS.includes(activeFeed)) return post.school === activeFeed;
    if (MOCK_USER.role === "moderator" && ALL_CLASSES.includes(activeFeed)) return post.targetGroup === activeFeed;
    return false;
  });

  const getFeedTitle = () => {
    if (activeFeed === "public") return t("community.public") || "Global Feed";
    if (activeFeed === "mySchool") return MOCK_USER.school;
    if (activeFeed === "myClass") return MOCK_USER.class;
    return activeFeed;
  };

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
                      <Button size="icon" variant="ghost" className="h-6 w-6 hover:text-destructive" onClick={() => removeAttachment(index)}>
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
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full" onClick={() => document.getElementById("image-upload")?.click()}>
                <ImageIcon className="h-4 w-4 mr-1" /> {t("community.photo")}
              </Button>
              <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full" onClick={() => document.getElementById("file-upload")?.click()}>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleEditPost(post.id)} aria-label="Save Post"><Send className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingPost(null)} aria-label="Cancel Edit"><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => { setEditingPost(post.id); setEditPostText(post.content); }} aria-label="Edit Post"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeletePost(post.id)} aria-label="Delete Post"><Trash2 className="h-4 w-4" /></Button>
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
                  <a key={idx} href={attachment.url} download={attachment.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-muted/30 border border-primary/10 dark:border-border/40 hover:bg-primary/5 transition-colors group/file">
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
              <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} className={`rounded-full transition-colors ${likedPosts.has(post.id) ? "text-red-500 bg-red-50 dark:bg-red-950/30" : "text-muted-foreground hover:text-hover-foreground hover:bg-hover"}`}>
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
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingComment({ postId: post.id, commentIdx: idx }); setEditCommentText(comment.content); }}><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteComment(post.id, idx)}><Trash2 className="h-3 w-3" /></Button>
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
                <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full text-muted-foreground hover:text-primary" onClick={() => handleAddComment(post.id)} disabled={!newComment[post.id]?.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    // ФИКС: 'h-screen' и 'overflow-hidden' тук ГАРАНТИРАТ, че скролбарът на "цялата страница" е забранен.
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50 dark:from-background dark:via-green-950/20 dark:to-background pt-16 flex flex-col md:flex-row overflow-hidden no-scrollbar">
      
      {/* MOBILE NAV */}
      {isMobile && (
        <div className={`fixed top-16 left-0 right-0 z-40 w-full bg-white/90 dark:bg-card/90 backdrop-blur-md border-b border-primary/10 dark:border-border transition-all duration-500 ease-in-out ${showMobileNav ? "translate-y-0 opacity-100" : "-translate-y-[200%] opacity-0 pointer-events-none"}`}>
          <div className="flex items-center px-4 py-2 overflow-x-auto no-scrollbar gap-2 snap-x">
            <NavIcon mobileMode active={activeFeed === "public"} icon={<Globe size={20} />} label="Global" onClick={() => setActiveFeed("public")} />
            <div className="h-8 w-[1px] bg-primary/10 shrink-0 mx-1" />
            {MOCK_USER.role === "student" && (
              <>
                <NavIcon mobileMode active={activeFeed === "mySchool"} icon={<School size={20} />} label="School" onClick={() => setActiveFeed("mySchool")} />
                <NavIcon mobileMode active={activeFeed === "myClass"} icon={<Users size={20} />} label="Class" onClick={() => setActiveFeed("myClass")} />
              </>
            )}
            {MOCK_USER.role === "moderator" && ALL_SCHOOLS.map(school => (
               <NavIcon key={school} mobileMode active={activeFeed === school} icon={<School size={20} />} label={school.split(" ")[0]} onClick={() => setActiveFeed(school)} />
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP NAV */}
      {!isMobile && (
        <aside className="h-full flex flex-col justify-center w-[80px] ml-6 z-30">
          <div className="flex flex-col items-center py-6 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/40 dark:border-border/40 rounded-3xl shadow-xl">
            <NavIcon active={activeFeed === "public"} icon={<Globe size={24} />} label="Global Feed" onClick={() => setActiveFeed("public")} />
            <div className="w-10 h-[2px] bg-primary/10 rounded-full my-4" />
            {MOCK_USER.role === "student" && (
              <>
                <NavIcon active={activeFeed === "mySchool"} icon={<School size={24} />} label={MOCK_USER.school} onClick={() => setActiveFeed("mySchool")} />
                <NavIcon active={activeFeed === "myClass"} icon={<Users size={24} />} label={MOCK_USER.class} onClick={() => setActiveFeed("myClass")} />
              </>
            )}
            {MOCK_USER.role === "moderator" && (
               <div className="flex flex-col w-full items-center overflow-y-auto no-scrollbar max-h-[300px]">
                 {ALL_SCHOOLS.map(school => (
                   <NavIcon key={school} active={activeFeed === school} icon={<School size={24} />} label={school} onClick={() => setActiveFeed(school)} />
                 ))}
               </div>
            )}
          </div>
        </aside>
      )}

      {/* MAIN FEED */}
      {/* Тук премахнах всички класове за скриване. Скролбарът ще се вижда, защото това е основният скрол на чата. */}
      <main className={`flex-1 h-full overflow-y-auto w-full min-w-0 px-4 md:px-10 pb-32 ${isMobile ? 'pt-24' : 'pt-0'}`}>
        <div className="max-w-6xl mx-auto pb-4 pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {getFeedTitle()}
            </h1>
            <p className="text-muted-foreground">
               {activeFeed === "public" ? "Latest updates from around the world" : "Updates from your community"}
            </p>
          </div>
          
          <div className="hidden md:block">
            <Button onClick={() => handleOpenCreateDialog(true)} className="rounded-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> {t("community.createPost")}
            </Button>
          </div>
        </div>

        {renderCreateDialog()}

        {/* POSTS LIST */}
        <div className="max-w-6xl mx-auto space-y-6">
          {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-white/60 dark:bg-card/60 backdrop-blur-xl rounded-xl border border-white/30 dark:border-border border-dashed shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">{t("community.noPostsYet")}</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  {t("community.beTheFirst")} {getFeedTitle()} {t("community.communityWord")}
                </p>
              </div>
          ) : (
            filteredPosts.map(renderPost)
          )}
        </div>
      </main>

      {/* MOBILE FAB */}
      {isMobile && (
        <Button onClick={() => handleOpenCreateDialog(true)} className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-emerald-600 text-white shadow-2xl shadow-emerald-600/40 z-50 flex items-center justify-center md:hidden transition-transform duration-300 active:scale-95">
          <Plus size={28} />
        </Button>
      )}
    </div>
  );
};

export default Community;