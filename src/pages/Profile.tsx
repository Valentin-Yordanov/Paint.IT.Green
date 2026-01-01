import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Leaf, Award, BookOpen, Settings, User, Plus, Target, Trash2, Languages, Moon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth(); 

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
    { id: 1, title: "Plant 20 trees", description: "Help reforest local areas", progress: 75, target: 20 },
    { id: 2, title: "Complete 10 challenges", description: "Finish environmental challenges", progress: 80, target: 10 },
    { id: 3, title: "Finish all lessons", description: "Complete the full curriculum", progress: 45, target: 100 },
  ]);

  const recentAchievements = [
    { title: t('achievement.treePlanter'), description: t('achievement.treePlanterDesc'), icon: Leaf, date: `2 ${t('time.daysAgo')}` },
    { title: t('achievement.quizMaster'), description: t('achievement.quizMasterDesc'), icon: BookOpen, date: `1 ${t('time.weekAgo')}` },
    { title: t('achievement.champion'), description: t('achievement.championDesc'), icon: Trophy, date: `2 ${t('time.weeksAgo')}` },
  ];

  // --- MOCK DATA FETCH ON LOAD ---
  useEffect(() => {
    const fetchProfile = async () => {
      // Simulate a loading delay
      setIsLoading(true);
      
      // We are ignoring the database for now and setting mock data directly
      // setTimeout simulates the network wait time
      setTimeout(() => {
        const mockData = {
          name: "Test Student",
          role: "Eco Warrior",
          schoolId: "Green Valley High", 
          email: user?.email || "student@example.com", // Uses your auth email if logged in
          points: 1250,
          rank: "Gold",
          treesPlanted: 15,
          challengesCompleted: 8,
          lessonsFinished: 12,
        };

        setUserStats({
          name: mockData.name,
          role: mockData.role,
          school: mockData.schoolId, 
          email: mockData.email,
          points: mockData.points,
          rank: mockData.rank,
          treesPlanted: mockData.treesPlanted,
          challengesCompleted: mockData.challengesCompleted,
          lessonsFinished: mockData.lessonsFinished,
        });
        
        // Initialize edit form with mock data
        setEditedName(mockData.name);
        setEditedSchool(mockData.schoolId);
        setEditedEmail(mockData.email);
        setEditedRole(mockData.role);
        
        setIsLoading(false);
      }, 800); // 800ms delay to make it feel realistic
    };

    fetchProfile();
  }, [user]);

  // --- HANDLE MOCK UPDATE PROFILE ---
  const handleSaveProfile = () => {
    // Instead of sending a PUT request, we just update the local state
    
    // Update the main display state
    setUserStats({
      ...userStats,
      name: editedName,
      school: editedSchool,
      email: editedEmail,
      role: editedRole,
    });

    setEditMode(false);
    
    toast({
      title: t('profile.updated'),
      description: t('profile.updatedDesc'),
    });
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
    toast({ title: t('profile.goalCreated'), description: t('profile.goalCreatedDesc') });
  };

  const handleDeleteGoal = (goalId: number) => {
    setActiveGoals(activeGoals.filter(goal => goal.id !== goalId));
    toast({ title: t('profile.goalDeleted'), description: t('profile.goalDeletedDesc') });
  };

  const handleUpdateGoalProgress = (goalId: number, change: number) => {
    setActiveGoals(activeGoals.map(goal => {
      if (goal.id === goalId) {
        const newProgress = Math.max(0, Math.min(100, goal.progress + change));
        return { ...goal, progress: newProgress };
      }
      return goal;
    }));
    toast({ title: t('profile.progressUpdated'), description: t('profile.progressUpdatedDesc') });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('profile.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('profile.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="gap-2">
              <User className="h-4 w-4" />
              {t('profile.overview')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              {t('profile.settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {userStats.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">{userStats.name}</h2>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary">{userStats.role}</Badge>
                      <Badge variant="outline">{userStats.school}</Badge>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600">{userStats.rank}</Badge>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{userStats.points}</div>
                    <div className="text-sm text-muted-foreground">{t('profile.points')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{userStats.treesPlanted}</div>
                      <div className="text-sm text-muted-foreground">{t('profile.trees')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{userStats.challengesCompleted}</div>
                      <div className="text-sm text-muted-foreground">{t('profile.challenges')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{userStats.lessonsFinished}</div>
                      <div className="text-sm text-muted-foreground">{t('profile.lessons')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {t('profile.achievements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <achievement.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{achievement.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('profile.goals')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeGoals.map((goal) => (
                    <div key={goal.id} className="space-y-3 p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <span className="font-medium">{goal.title}</span>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{goal.progress}% {t('profile.complete')}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateGoalProgress(goal.id, -5)}
                            >
                              <span className="text-lg">−</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateGoalProgress(goal.id, 5)}
                            >
                              <span className="text-lg">+</span>
                            </Button>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-6 gap-2">
                      <Plus className="h-4 w-4" />
                      {t('profile.newGoal')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{t('profile.createGoal')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('profile.goalTitle')}</label>
                        <Input
                          value={newGoalTitle}
                          onChange={(e) => setNewGoalTitle(e.target.value)}
                          placeholder={t('profile.goalPlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('profile.goalDesc')}</label>
                        <Textarea
                          value={newGoalDescription}
                          onChange={(e) => setNewGoalDescription(e.target.value)}
                          placeholder={t('profile.goalDescPlaceholder')}
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button 
                        onClick={handleAddGoal} 
                        disabled={!newGoalTitle.trim() || !newGoalDescription.trim()}
                        className="w-full"
                      >
                        {t('profile.createButton')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.settingsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('profile.name')}</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    </div>
                    {/* Email is typically read-only or requires re-auth to change */}
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedEmail}
                        disabled 
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">{t('profile.school')}</Label>
                      <Input
                        id="school"
                        value={editedSchool}
                        onChange={(e) => setEditedSchool(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">{t('profile.role')}</Label>
                      <Input
                        id="role"
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>{t('profile.save')}</Button>
                      <Button variant="outline" onClick={handleCancelEdit}>{t('profile.cancel')}</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">{t('profile.name')}</Label>
                        <p className="text-lg font-medium">{userStats.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{t('profile.email')}</Label>
                        <p className="text-lg font-medium">{userStats.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{t('profile.school')}</Label>
                        <p className="text-lg font-medium">{userStats.school}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{t('profile.role')}</Label>
                        <p className="text-lg font-medium">{userStats.role}</p>
                      </div>
                    </div>
                    <Button onClick={() => setEditMode(true)}>{t('profile.edit')}</Button>
                  </>
                )}
                
                {/* Dark Theme Toggle */}
                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Moon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label className="text-base font-medium">{t('profile.darkMode')}</Label>
                        <p className="text-sm text-muted-foreground">{t('profile.darkModeDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{theme === 'light' ? t('profile.light') : t('profile.dark')}</span>
                      <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      />
                    </div>
                  </div>
                </div>

                {/* Language Toggle */}
                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Languages className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label className="text-base font-medium">{t('profile.language')}</Label>
                        <p className="text-sm text-muted-foreground">{t('profile.languageDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'БГ'}</span>
                      <Switch
                        checked={language === 'bg'}
                        onCheckedChange={(checked) => setLanguage(checked ? 'bg' : 'en')}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      logout();
                      toast({ 
                        title: "Logged Out", 
                        description: "You have been successfully logged out." 
                      });
                    }}
                  >
                    {t('Log Out')}
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