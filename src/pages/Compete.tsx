import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Compete = () => {
  const { t } = useLanguage();
  const cityLeaderboard = [
    { rank: 1, name: "Green Valley", points: 15420, change: "+240" },
    { rank: 2, name: "Riverside City", points: 14890, change: "+180" },
    { rank: 3, name: "Mountain View", points: 13750, change: "+320" },
    { rank: 4, name: "Oakwood", points: 12980, change: "+150" },
    { rank: 5, name: "Lakeside", points: 11540, change: "+200" },
  ];

  const schoolLeaderboard = [
    { rank: 1, name: "Lincoln Elementary", city: "Green Valley", points: 3240 },
    { rank: 2, name: "Roosevelt High", city: "Riverside City", points: 3120 },
    { rank: 3, name: "Washington Middle", city: "Mountain View", points: 2980 },
    { rank: 4, name: "Jefferson Academy", city: "Green Valley", points: 2840 },
    { rank: 5, name: "Kennedy School", city: "Oakwood", points: 2720 },
  ];

  const studentLeaderboard = [
    { rank: 1, name: "Emma S.", school: "Lincoln Elementary", points: 540 },
    { rank: 2, name: "Noah T.", school: "Roosevelt High", points: 520 },
    { rank: 3, name: "Olivia M.", school: "Washington Middle", points: 495 },
    { rank: 4, name: "Liam P.", school: "Lincoln Elementary", points: 480 },
    { rank: 5, name: "Ava K.", school: "Kennedy School", points: 465 },
  ];

  const competitions = [
    {
      title: "Month of Recycling",
      period: "December 2024",
      description: "Collect and properly recycle the most waste",
      status: "Active",
      icon: "🔄",
    },
    {
      title: "Plant a Tree Week",
      period: "January 5-12, 2025",
      description: "Plant trees and document your efforts",
      status: "Upcoming",
      icon: "🌳",
    },
    {
      title: "Clean Water Challenge",
      period: "February 2025",
      description: "Organize water conservation activities",
      status: "Upcoming",
      icon: "💧",
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('compete.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('compete.subtitle')}
          </p>
        </div>

        {/* Active Competitions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('compete.challenges')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {competitions.map((comp, index) => (
              <Card key={index} className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{comp.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{comp.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{comp.period}</p>
                      </div>
                    </div>
                    <Badge variant={comp.status === "Active" ? "default" : "secondary"}>
                      {comp.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{comp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboards */}
        <Tabs defaultValue="cities" className="space-y-8">
          <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary">
            <TabsTrigger value="cities" className="flex gap-2 p-3">
              <Trophy className="h-4 w-4" />
              {t('compete.cities')}
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex gap-2 p-3">
              <Medal className="h-4 w-4" />
              {t('compete.schools')}
            </TabsTrigger>
            <TabsTrigger value="students" className="flex gap-2 p-3">
              <Award className="h-4 w-4" />
              {t('compete.students')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cities">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>{t('compete.cityRankings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cityLeaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 flex justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <div className="font-semibold">{entry.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {entry.change}
                        </Badge>
                        <div className="text-lg font-bold text-primary">
                          {entry.points.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>{t('compete.schoolRankings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolLeaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 flex justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <div className="font-semibold">{entry.name}</div>
                          <div className="text-sm text-muted-foreground">{entry.city}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {entry.points.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>{t('compete.studentRankings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentLeaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 flex justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <div className="font-semibold">{entry.name}</div>
                          <div className="text-sm text-muted-foreground">{entry.school}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {entry.points.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Compete;
