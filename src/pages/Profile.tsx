import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Leaf, Award, BookOpen } from "lucide-react";

const Profile = () => {
  const userStats = {
    name: "Alex Chen",
    role: "Student",
    school: "Lincoln Elementary",
    points: 1250,
    rank: "Gold Tier",
    treesPlanted: 15,
    challengesCompleted: 8,
    lessonsFinished: 23,
  };

  const recentAchievements = [
    { title: "Tree Planter", description: "Planted 10 trees", icon: Leaf, date: "2 days ago" },
    { title: "Quiz Master", description: "Completed 5 quizzes with 100%", icon: BookOpen, date: "1 week ago" },
    { title: "Community Champion", description: "Reached 1000 points", icon: Trophy, date: "2 weeks ago" },
  ];

  const activeGoals = [
    { title: "Plant 20 trees", progress: 75 },
    { title: "Complete 10 challenges", progress: 80 },
    { title: "Finish all lessons", progress: 45 },
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Profile</h1>
          <p className="text-lg text-muted-foreground">
            Track your environmental impact and achievements
          </p>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
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
        <div className="grid md:grid-cols-3 gap-4 mb-6">
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
        <Card className="mb-6">
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
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.map((goal, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-sm text-muted-foreground">{goal.progress}%</span>
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
            <Button className="w-full mt-6">Set New Goal</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
