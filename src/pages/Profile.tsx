import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Leaf, Award, BookOpen, Settings, User, Plus, Target, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [userStats, setUserStats] = useState({
    name: "Alex Chen",
    role: "Student",
    school: "Lincoln Elementary",
    email: "alex.chen@school.edu",
    points: 1250,
    rank: "Gold Tier",
    treesPlanted: 15,
    challengesCompleted: 8,
    lessonsFinished: 23,
  });

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(userStats.name);
  const [editedSchool, setEditedSchool] = useState(userStats.school);
  const [editedEmail, setEditedEmail] = useState(userStats.email);
  const [editedRole, setEditedRole] = useState(userStats.role);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");

  const recentAchievements = [
    { title: "Tree Planter", description: "Planted 10 trees", icon: Leaf, date: "2 days ago" },
    { title: "Quiz Master", description: "Completed 5 quizzes with 100%", icon: BookOpen, date: "1 week ago" },
    { title: "Community Champion", description: "Reached 1000 points", icon: Trophy, date: "2 weeks ago" },
  ];

  const [activeGoals, setActiveGoals] = useState([
    { id: 1, title: "Plant 20 trees", description: "Help reforest local areas", progress: 75, target: 20 },
    { id: 2, title: "Complete 10 challenges", description: "Finish environmental challenges", progress: 80, target: 10 },
    { id: 3, title: "Finish all lessons", description: "Complete the full curriculum", progress: 45, target: 100 },
  ]);

  const handleSaveProfile = () => {
    setUserStats({
      ...userStats,
      name: editedName,
      school: editedSchool,
      email: editedEmail,
      role: editedRole,
    });
    setEditMode(false);
    toast({
      title: "Profile updated!",
      description: "Your profile has been saved successfully.",
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
    toast({
      title: "Goal created!",
      description: "Your new goal has been added successfully.",
    });
  };

  const handleDeleteGoal = (goalId: number) => {
    setActiveGoals(activeGoals.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal deleted",
      description: "Your goal has been removed.",
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Profile</h1>
          <p className="text-lg text-muted-foreground">
            Track your environmental impact and achievements
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
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
                    <div className="text-sm text-muted-foreground">Total Points</div>
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
                  <div className="text-sm text-muted-foreground">Trees Planted</div>
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
                  <div className="text-sm text-muted-foreground">Challenges Done</div>
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
                  <div className="text-sm text-muted-foreground">Lessons Finished</div>
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
              Recent Achievements
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
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <span className="font-medium">{goal.title}</span>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
              ))}
            </div>
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-6 gap-2">
                    <Plus className="h-4 w-4" />
                    Set New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create a New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Goal Title</label>
                      <Input
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        placeholder="e.g., Plant 100 Trees"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={newGoalDescription}
                        onChange={(e) => setNewGoalDescription(e.target.value)}
                        placeholder="Describe your goal..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={handleAddGoal} 
                      disabled={!newGoalTitle.trim() || !newGoalDescription.trim()}
                      className="w-full"
                    >
                      Create Goal
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
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input
                        id="school"
                        value={editedSchool}
                        onChange={(e) => setEditedSchool(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Full Name</Label>
                        <p className="text-lg font-medium">{userStats.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="text-lg font-medium">{userStats.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">School</Label>
                        <p className="text-lg font-medium">{userStats.school}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Role</Label>
                        <p className="text-lg font-medium">{userStats.role}</p>
                      </div>
                    </div>
                    <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
