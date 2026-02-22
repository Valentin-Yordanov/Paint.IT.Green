import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trophy,
  Leaf,
  Award,
  BookOpen,
  Settings,
  User,
  Plus,
  Target,
  Trash2,
  Languages,
  Moon,
  Loader2,
  Sparkles,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { logout, user, updateUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    name: "Guest User",
    role: "Student",
    school: "Not Set",
    email: "",
    points: 0,
    rank: "Newcomer",
    treesPlanted: 0,
    challengesCompleted: 0,
    lessonsFinished: 0,
  });

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedSchool, setEditedSchool] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");

  // Goals State
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [activeGoals, setActiveGoals] = useState([
    {
      id: 1,
      title: "Plant 20 trees",
      description: "Help reforest local areas",
      progress: 75,
      target: 20,
    },
    {
      id: 2,
      title: "Complete 10 challenges",
      description: "Finish environmental challenges",
      progress: 80,
      target: 10,
    },
    {
      id: 3,
      title: "Finish all lessons",
      description: "Complete the full curriculum",
      progress: 45,
      target: 100,
    },
  ]);

  const recentAchievements = [
    {
      title: t("achievement.treePlanter"),
      description: t("achievement.treePlanterDesc"),
      icon: Leaf,
      date: `2 ${t("time.daysAgo")}`,
    },
    {
      title: t("achievement.quizMaster"),
      description: t("achievement.quizMasterDesc"),
      icon: BookOpen,
      date: `1 ${t("time.weekAgo")}`,
    },
    {
      title: t("achievement.champion"),
      description: t("achievement.championDesc"),
      icon: Trophy,
      date: `2 ${t("time.weeksAgo")}`,
    },
  ];

  // --- REAL DATA FETCH ON LOAD ---
  useEffect(() => {
    if (user) {
      setUserStats({
        name: user.name || "Unknown User",
        role: user.role || "Student",
        school: user.schoolName || "N/A",
        email: user.email,
        points: 0, // Тези статистики можем да ги направим реални по-късно
        rank: "Newcomer",
        treesPlanted: 0,
        challengesCompleted: 0,
        lessonsFinished: 0,
      });

      setEditedName(user.name || "");
      setEditedSchool(user.schoolName || "");
      setEditedEmail(user.email);
      setEditedRole(user.role || "");
    }

    setIsLoading(false);
  }, [user]);

  // --- HANDLE REAL UPDATE PROFILE ---
  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // 1. Изпращаме заявка към новия ни бекенд път
      const response = await fetch("/api/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: editedEmail,
          name: editedName,
          schoolName: editedSchool,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // 2. Обновяваме визуално страницата
        setUserStats((prev) => ({
          ...prev,
          name: updatedUser.name,
          school: updatedUser.schoolName,
          email: updatedUser.email,
        }));

        // 3. Обновяваме глобалния state (което запазва и в localStorage)
        updateUser(updatedUser);

        setEditMode(false);
        toast({
          title: t("profile.updated") || "Profile updated",
          description:
            t("profile.updatedDesc") ||
            "Your changes have been saved successfully.",
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to update profile:", errorText);
        toast({
          title: "Error",
          description: "Failed to update profile: " + errorText,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userStats.name);
    setEditedSchool(userStats.school);
    setEditedEmail(userStats.email);
    setEditedRole(userStats.role);
    setEditMode(false);
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDescription.trim()) return;
    const newGoal = {
      id: activeGoals.length + 1,
      title: newGoalTitle,
      description: newGoalDescription,
      progress: 0,
      target: 100,
    };
    setActiveGoals([...activeGoals, newGoal]);
    setNewGoalTitle("");
    setNewGoalDescription("");
    setIsGoalDialogOpen(false);
    toast({
      title: t("profile.goalCreated"),
      description: t("profile.goalCreatedDesc"),
    });
  };

  const handleDeleteGoal = (goalId: number) => {
    setActiveGoals(activeGoals.filter((goal) => goal.id !== goalId));
    toast({
      title: t("profile.goalDeleted"),
      description: t("profile.goalDeletedDesc"),
    });
  };

  const handleUpdateGoalProgress = (goalId: number, change: number) => {
    setActiveGoals(
      activeGoals.map((goal) => {
        if (goal.id === goalId) {
          const newProgress = Math.max(
            0,
            Math.min(100, goal.progress + change),
          );
          return { ...goal, progress: newProgress };
        }
        return goal;
      }),
    );
    toast({
      title: t("profile.progressUpdated"),
      description: t("profile.progressUpdatedDesc"),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
          </div>
          <p className="text-muted-foreground animate-pulse">
            {t("profile.loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-5xl relative z-10">
        {/* Header with animated accent */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
            {t("profile.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            {t("profile.subtitle")}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 p-1.5 bg-secondary/50 backdrop-blur-sm rounded-xl h-auto">
            <TabsTrigger
              value="overview"
              className="gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
            >
              <User className="h-4 w-4" />
              {t("profile.overview")}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              {t("profile.settings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="space-y-8 animate-in fade-in-50 duration-500"
          >
            {/* Profile Header Card */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
              <CardContent className="p-0">
                <div className="h-24 md:h-32 bg-gradient-to-r from-primary/40 via-primary/30 to-accent/40 relative">
                  {/* This adds a slight dark tint to help white text pop */}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 bg-[url(...)] opacity-10" />
                </div>
                <div className="px-6 pb-6 -mt-12 md:-mt-16 relative">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-background shadow-2xl">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl md:text-3xl font-bold">
                        {userStats.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left mt-2 md:mt-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        {userStats.name}
                      </h2>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 text-sm"
                        >
                          {userStats.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="px-3 py-1 text-sm border-primary/30"
                        >
                          {userStats.school}
                        </Badge>
                        <Badge className="px-3 py-1 text-sm bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg shadow-yellow-500/20">
                          <Trophy className="h-3 w-3 mr-1" />
                          {userStats.rank}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mt-2 md:mt-8">
                      <div className="flex items-center gap-2 justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="text-3xl md:text-4xl font-bold text-primary">
                          {userStats.points.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {t("profile.points")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: Leaf,
                  value: userStats.treesPlanted,
                  label: t("profile.trees"),
                  color: "from-emerald-500 to-green-600",
                },
                {
                  icon: Trophy,
                  value: userStats.challengesCompleted,
                  label: t("profile.challenges"),
                  color: "from-amber-500 to-orange-600",
                },
                {
                  icon: BookOpen,
                  value: userStats.lessonsFinished,
                  label: t("profile.lessons"),
                  color: "from-blue-500 to-indigo-600",
                },
              ].map((stat, idx) => (
                <Card
                  key={idx}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden"
                >
                  <CardContent className="p-6 relative">
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}
                    />
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Achievements */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  {t("profile.achievements")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-secondary/50 to-secondary/20 hover:from-secondary/70 hover:to-secondary/40 transition-all duration-300 group cursor-default"
                    >
                      <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <achievement.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {achievement.description}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {achievement.date}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Goals */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  {t("profile.goals")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-secondary/20 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg truncate">
                            {goal.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {goal.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {goal.progress}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {t("profile.complete")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                              onClick={() =>
                                handleUpdateGoalProgress(goal.id, -5)
                              }
                            >
                              <span className="text-lg font-medium">−</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                              onClick={() =>
                                handleUpdateGoalProgress(goal.id, 5)
                              }
                            >
                              <span className="text-lg font-medium">+</span>
                            </Button>
                          </div>
                        </div>
                        <Progress
                          value={goal.progress}
                          className="h-3 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Dialog
                  open={isGoalDialogOpen}
                  onOpenChange={setIsGoalDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full mt-6 gap-2 h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                      <Plus className="h-5 w-5" />
                      {t("profile.newGoal")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        {t("profile.createGoal")}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 pt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t("profile.goalTitle")}
                        </Label>
                        <Input
                          value={newGoalTitle}
                          onChange={(e) => setNewGoalTitle(e.target.value)}
                          placeholder={t("profile.goalPlaceholder")}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t("profile.goalDesc")}
                        </Label>
                        <Textarea
                          value={newGoalDescription}
                          onChange={(e) =>
                            setNewGoalDescription(e.target.value)
                          }
                          placeholder={t("profile.goalDescPlaceholder")}
                          className="min-h-[120px] rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={handleAddGoal}
                        disabled={
                          !newGoalTitle.trim() || !newGoalDescription.trim()
                        }
                        className="w-full h-12 rounded-xl"
                      >
                        {t("profile.createButton")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="settings"
            className="animate-in fade-in-50 duration-500"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">
                  {t("profile.settingsTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {editMode ? (
                  <div className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          {t("profile.name")}
                        </Label>
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          {t("profile.email")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school" className="text-sm font-medium">
                          {t("profile.school")}
                        </Label>
                        <Input
                          id="school"
                          value={editedSchool}
                          onChange={(e) => setEditedSchool(e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                          {t("profile.role")}
                        </Label>
                        <Input
                          id="role"
                          value={editedRole}
                          disabled
                          className="h-12 rounded-xl bg-muted/50"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleSaveProfile}
                        className="h-11 px-6 rounded-xl"
                      >
                        {t("profile.save")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="h-11 px-6 rounded-xl"
                      >
                        {t("profile.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {[
                        { label: t("profile.name"), value: userStats.name },
                        { label: t("profile.email"), value: userStats.email },
                        { label: t("profile.school"), value: userStats.school },
                        { label: t("profile.role"), value: userStats.role },
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-secondary/30"
                        >
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                            {field.label}
                          </Label>
                          <p className="text-lg font-medium mt-1">
                            {field.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setEditMode(true)}
                      className="h-11 px-6 rounded-xl"
                    >
                      {t("profile.edit")}
                    </Button>
                  </div>
                )}

                {/* Preferences Section */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("page preferences") || "Preferences"}
                  </h3>

                  {/* Dark Theme Toggle */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-secondary/50 to-secondary/20 hover:from-secondary/70 hover:to-secondary/40 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                          <Moon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Label className="text-base font-semibold">
                            {t("profile.darkMode")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.darkModeDesc")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-background">
                          {theme === "light"
                            ? t("profile.light")
                            : t("profile.dark")}
                        </span>
                        <Switch
                          checked={theme === "dark"}
                          onCheckedChange={(checked) =>
                            setTheme(checked ? "dark" : "light")
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Language Toggle */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-secondary/50 to-secondary/20 hover:from-secondary/70 hover:to-secondary/40 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                          <Languages className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Label className="text-base font-semibold">
                            {t("profile.language")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.languageDesc")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-background">
                          {language === "en" ? "EN" : "БГ"}
                        </span>
                        <Switch
                          checked={language === "bg"}
                          onCheckedChange={(checked) =>
                            setLanguage(checked ? "bg" : "en")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout Section */}
                <div className="pt-6 border-t border-border/50">
                  <Button
                    variant="destructive"
                    className="w-full h-12 rounded-xl gap-2 shadow-lg shadow-destructive/20"
                    onClick={() => {
                      logout();
                      toast({
                        title: t("profile.loggedOut") || "Logged Out",
                        description:
                          t("profile.loggedOutDesc") ||
                          "You have been successfully logged out.",
                      });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("profile.logout") || t("Log Out")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
