import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Medal, Award, TrendingUp, CalendarDays, Pin, Clock, Star} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext";


// --- Mock Data ---

const challenges = [
  {
    title: "Community Cleanup",
    period: "October 2024",
    description: "Organized local cleanups in parks and neighborhoods.",
    status: "Past",
    icon: "🧹",
  },
  {
    title: "Water Savers",
    period: "November 2024",
    description: "Tracked and reduced water usage at school and home.",
    status: "Past",
    icon: "💧",
  },
  {
    title: "Month of Recycling",
    period: "December 2024",
    description: "Collect and properly recycle the most waste",
    status: "Active",
    icon: "🔄",
  },
  {
    title: "Plant a Tree Week",
    period: "January 2025",
    description: "Plant trees and document your efforts",
    status: "Upcoming",
    icon: "🌳",
  },
  {
    title: "Energy Conservation",
    period: "February 2025",
    description: "Find ways to reduce energy consumption.",
    status: "Upcoming",
    icon: "💡",
  },
];

// New data structure to hold the top 5 schools from the previous challenge
const lastMonthWinners = [
  { rank: 1, name: "Roosevelt High", city: "Riverside City", score: 850, achievement: "Saved 50,000+ gallons of water." },
  { rank: 2, name: "Lincoln Elementary", city: "Green Valley", score: 790, achievement: "38,000+ gallons saved." },
  { rank: 3, name: "Kennedy School", city: "Oakwood", score: 680, achievement: "Reduced water usage by 20%." },
  { rank: 4, name: "Washington Middle", city: "Mountain View", score: 640, achievement: "Best overall participation rate." },
  { rank: 5, name: "Jefferson Academy", city: "Green Valley", score: 550, achievement: "High educational outreach." },
];

const allTimeWins = [
  { rank: 1, name: "Lincoln Elementary", wins: 5 },
  { rank: 2, name: "Roosevelt High", wins: 3 },
  { rank: 3, name: "Washington Middle", wins: 2 },
  { rank: 4, name: "Jefferson Academy", wins: 1 },
  { rank: 5, name: "Kennedy School", wins: 1 },
];

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

const calendarEvents = [
  { day: 7, title: "Green Valley Park Cleanup", time: "10:00 AM", location: "Green Valley Park" },
  { day: 15, title: "Riverside Beach Sweep", time: "9:00 AM", location: "Riverside Beach" },
  { day: 21, title: "Recycling Drive", time: "12:00 PM - 4:00 PM", location: "Lincoln Elementary" },
];

// --- End Mock Data ---


// --- Helper Functions ---

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

const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

// --- Calendar Component ---
const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 11, 7));
  const currentMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  const currentYear = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            event: calendarEvents.map(e => new Date(currentYear, currentMonth, e.day))
          }}
          modifiersStyles={{
            event: { 
              fontWeight: 'bold',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              color: 'hsl(var(--primary))',
              border: '2px solid hsl(var(--primary))'
            }
          }}
        />
      </div>

      {/* Event List */}
      <div className="space-y-3 pt-6 border-t">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Upcoming Events</h3>
        <div className="space-y-2">
          {calendarEvents.map((event, idx) => (
            <Card key={idx} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center min-w-[50px]">
                    <span className="text-2xl font-bold text-primary">{event.day}</span>
                    <span className="text-xs text-muted-foreground uppercase">Dec</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-base">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Pin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- Main Compete Component ---

const Compete = () => {
  // Mocking hook for preview environment
  const useLanguage = () => ({ t: (key: string, def: string) => def || key });
  const { t } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const pastChallenges = challenges.filter(c => c.status === "Past").slice(-2);
  const activeChallenge = challenges.find(c => c.status === "Active");
  const upcomingChallenges = challenges.filter(c => c.status === "Upcoming").slice(0, 2);

  const lastChallenge = challenges.find(c => c.title === "Water Savers");
  const lastChallengeTitle = lastChallenge ? `${lastChallenge.title} (${lastChallenge.period})` : "Last Challenge";


  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('compete.title', 'Competitions & Leaderboards')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('compete.subtitle', 'See how cities, schools, and students are competing to make the biggest environmental impact')}
          </p>
        </div>

        {/* --- Event Calendar Button --- */}
        <div className="flex justify-center mb-12">
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 px-8 py-6 text-lg">
                <CalendarDays className="h-6 w-6" />
                {t('compete.viewEvents', 'View Local Events')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>{t('compete.eventCalendar', 'Event Calendar')}</DialogTitle>
              </DialogHeader>
              <EventCalendar />
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Challenges Timeline --- */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('compete.challenges', 'Challenges Timeline')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            
            {/* Past Challenges */}
            {pastChallenges.map((comp, index) => (
              <Card key={index} className="border-border bg-card opacity-70">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Past</Badge>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-3xl">{comp.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{comp.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{comp.period}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{comp.description}</p>
                </CardContent>
              </Card>
            ))}

            {/* Active Challenge */}
            {activeChallenge && (
              <Card className="border-primary border-2 bg-card shadow-lg shadow-primary/10 transform scale-105">
                <CardHeader>
                  <Badge variant="default" className="w-fit">Active</Badge>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-4xl">{activeChallenge.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{activeChallenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{activeChallenge.period}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{activeChallenge.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Challenges */}
            {upcomingChallenges.map((comp, index) => (
              <Card key={index} className="border-border bg-card border-dashed">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">Upcoming</Badge>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-3xl">{comp.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{comp.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{comp.period}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{comp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* --- Leaderboards Section --- */}
        <h2 className="text-3xl font-bold mb-8 text-center">{t('compete.leaderboards', 'Leaderboards')}</h2>
        
        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary/50">
            <TabsTrigger value="current" className="flex gap-2 p-3 text-base">
              <TrendingUp className="h-5 w-5" />
              {t('compete.currentMonth', 'Current Month')}
            </TabsTrigger>
            <TabsTrigger value="lastMonth" className="flex gap-2 p-3 text-base">
              <Trophy className="h-5 w-5" />
              {/* Updated Text */}
              {t('compete.lastWinners', 'Last Month\'s Winners')}
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex gap-2 p-3 text-base">
              <Star className="h-5 w-5" />
              {t('compete.allTime', 'All-Time Wins')}
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Current Month */}
          <TabsContent value="current">
            <Tabs defaultValue="cities" className="space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary">
                <TabsTrigger value="cities" className="flex gap-2 p-3">
                  <Trophy className="h-4 w-4" />
                  {t('compete.cities', 'Cities')}
                </TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 p-3">
                  <Medal className="h-4 w-4" />
                  {t('compete.schools', 'Schools')}
                </TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 p-3">
                  <Award className="h-4 w-4" />
                  {t('compete.students', 'Students')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cities">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>{t('compete.cityRankings', 'City Rankings')} - {activeChallenge?.period}</CardTitle>
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
                            <Badge variant="outline" className="gap-1 text-green-600">
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
                    <CardTitle>{t('compete.schoolRankings', 'School Rankings')} - {activeChallenge?.period}</CardTitle>
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
                    <CardTitle>{t('compete.studentRankings', 'Student Rankings')} - {activeChallenge?.period}</CardTitle>
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
          </TabsContent>

          {/* Tab 2: Last Month's Winners - Updated to show Top 5 */}
          <TabsContent value="lastMonth">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl">
                  {t('compete.lastWinnersRanking', 'Top Schools in Last Challenge:')}
                </CardTitle>
                <p className="text-muted-foreground text-sm">{lastChallengeTitle}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lastMonthWinners.map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <div className="w-12 flex justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-foreground">{entry.name}</div>
                          <div className="text-sm text-muted-foreground">{entry.city}</div>
                          <Badge variant="secondary" className="mt-1">{entry.achievement}</Badge>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary sm:self-center">
                        {entry.score.toLocaleString()} points
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: All-Time Wins */}
          <TabsContent value="allTime">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>{t('compete.allTimeRankings', 'All-Time Win Rankings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allTimeWins.map((entry) => (
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
                      <div className="flex items-center gap-2 text-lg font-bold text-primary">
                        {entry.wins}
                        <span className="text-sm font-medium text-muted-foreground">wins</span>
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

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
// import { useLanguage } from "@/contexts/LanguageContext";

// const Compete = () => {
//   const { t } = useLanguage();
//   const cityLeaderboard = [
//     { rank: 1, name: "Green Valley", points: 15420, change: "+240" },
//     { rank: 2, name: "Riverside City", points: 14890, change: "+180" },
//     { rank: 3, name: "Mountain View", points: 13750, change: "+320" },
//     { rank: 4, name: "Oakwood", points: 12980, change: "+150" },
//     { rank: 5, name: "Lakeside", points: 11540, change: "+200" },
//   ];

//   const schoolLeaderboard = [
//     { rank: 1, name: "Lincoln Elementary", city: "Green Valley", points: 3240 },
//     { rank: 2, name: "Roosevelt High", city: "Riverside City", points: 3120 },
//     { rank: 3, name: "Washington Middle", city: "Mountain View", points: 2980 },
//     { rank: 4, name: "Jefferson Academy", city: "Green Valley", points: 2840 },
//     { rank: 5, name: "Kennedy School", city: "Oakwood", points: 2720 },
//   ];

//   const studentLeaderboard = [
//     { rank: 1, name: "Emma S.", school: "Lincoln Elementary", points: 540 },
//     { rank: 2, name: "Noah T.", school: "Roosevelt High", points: 520 },
//     { rank: 3, name: "Olivia M.", school: "Washington Middle", points: 495 },
//     { rank: 4, name: "Liam P.", school: "Lincoln Elementary", points: 480 },
//     { rank: 5, name: "Ava K.", school: "Kennedy School", points: 465 },
//   ];

//   const competitions = [
//     {
//       title: "Month of Recycling",
//       period: "December 2024",
//       description: "Collect and properly recycle the most waste",
//       status: "Active",
//       icon: "🔄",
//     },
//     {
//       title: "Plant a Tree Week",
//       period: "January 5-12, 2025",
//       description: "Plant trees and document your efforts",
//       status: "Upcoming",
//       icon: "🌳",
//     },
//     {
//       title: "Clean Water Challenge",
//       period: "February 2025",
//       description: "Organize water conservation activities",
//       status: "Upcoming",
//       icon: "💧",
//     },
//   ];

//   const getRankIcon = (rank: number) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="h-5 w-5 text-yellow-500" />;
//       case 2:
//         return <Medal className="h-5 w-5 text-gray-400" />;
//       case 3:
//         return <Award className="h-5 w-5 text-amber-600" />;
//       default:
//         return <span className="text-muted-foreground">#{rank}</span>;
//     }
//   };

//   return (
//     <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
//       <div className="container">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             {t('compete.title')}
//           </h1>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             {t('compete.subtitle')}
//           </p>
//         </div>

//         {/* Active Competitions */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold mb-6">{t('compete.challenges')}</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {competitions.map((comp, index) => (
//               <Card key={index} className="border-border bg-card">
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                       <span className="text-3xl">{comp.icon}</span>
//                       <div>
//                         <CardTitle className="text-lg">{comp.title}</CardTitle>
//                         <p className="text-sm text-muted-foreground">{comp.period}</p>
//                       </div>
//                     </div>
//                     <Badge variant={comp.status === "Active" ? "default" : "secondary"}>
//                       {comp.status}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">{comp.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Leaderboards */}
//         <Tabs defaultValue="cities" className="space-y-8">
//           <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary">
//             <TabsTrigger value="cities" className="flex gap-2 p-3">
//               <Trophy className="h-4 w-4" />
//               {t('compete.cities')}
//             </TabsTrigger>
//             <TabsTrigger value="schools" className="flex gap-2 p-3">
//               <Medal className="h-4 w-4" />
//               {t('compete.schools')}
//             </TabsTrigger>
//             <TabsTrigger value="students" className="flex gap-2 p-3">
//               <Award className="h-4 w-4" />
//               {t('compete.students')}
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="cities">
//             <Card className="border-border bg-card">
//               <CardHeader>
//                 <CardTitle>{t('compete.cityRankings')}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {cityLeaderboard.map((entry) => (
//                     <div
//                       key={entry.rank}
//                       className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 flex justify-center">
//                           {getRankIcon(entry.rank)}
//                         </div>
//                         <div>
//                           <div className="font-semibold">{entry.name}</div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <Badge variant="outline" className="gap-1">
//                           <TrendingUp className="h-3 w-3" />
//                           {entry.change}
//                         </Badge>
//                         <div className="text-lg font-bold text-primary">
//                           {entry.points.toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="schools">
//             <Card className="border-border bg-card">
//               <CardHeader>
//                 <CardTitle>{t('compete.schoolRankings')}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {schoolLeaderboard.map((entry) => (
//                     <div
//                       key={entry.rank}
//                       className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 flex justify-center">
//                           {getRankIcon(entry.rank)}
//                         </div>
//                         <div>
//                           <div className="font-semibold">{entry.name}</div>
//                           <div className="text-sm text-muted-foreground">{entry.city}</div>
//                         </div>
//                       </div>
//                       <div className="text-lg font-bold text-primary">
//                         {entry.points.toLocaleString()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="students">
//             <Card className="border-border bg-card">
//               <CardHeader>
//                 <CardTitle>{t('compete.studentRankings')}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {studentLeaderboard.map((entry) => (
//                     <div
//                       key={entry.rank}
//                       className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 flex justify-center">
//                           {getRankIcon(entry.rank)}
//                         </div>
//                         <div>
//                           <div className="font-semibold">{entry.name}</div>
//                           <div className="text-sm text-muted-foreground">{entry.school}</div>
//                         </div>
//                       </div>
//                       <div className="text-lg font-bold text-primary">
//                         {entry.points.toLocaleString()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Compete;
