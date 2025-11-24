import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Trophy, Medal, Award, TrendingUp, CalendarDays, Pin, Clock, Star, Plus, Loader2, Trash2, Edit } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext"; // Ensure this path is correct

const IS_LOGGED_IN = true; 
const CURRENT_USER_ID = "user-123-mock"; 

interface CalendarEvent {
  id: string;
  dateString: string;
  title: string;
  time: string;
  location: string;
  createdBy: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2: return <Medal className="h-5 w-5 text-gray-400" />;
    case 3: return <Award className="h-5 w-5 text-amber-600" />;
    default: return <span className="text-muted-foreground">#{rank}</span>;
  }
};

// --- Calendar Component ---
const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", location: "" });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:7071/api/CalendarHandler');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if(!editingId) {
        setIsFormOpen(false);
        setNewEvent({ title: "", time: "", location: "" });
    }
  }, [editingId, selectedDate]);

  const handleSaveEvent = async () => {
    if (!selectedDate || !newEvent.title) return;
    setIsLoading(true);

    const payload = {
        dateString: selectedDate.toISOString(),
        title: newEvent.title,
        time: newEvent.time,
        location: newEvent.location,
        createdBy: CURRENT_USER_ID 
    };

    try {
        const url = editingId 
            ? `http://localhost:7071/api/CalendarHandler?id=${editingId}` 
            : 'http://localhost:7071/api/CalendarHandler';
        
        const method = editingId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setNewEvent({ title: "", time: "", location: "" }); 
            setEditingId(null);
            setIsFormOpen(false); 
            fetchEvents(); 
        } else {
            const err = await res.text();
            alert(`Error: ${err}`);
        }
    } catch (error) {
        console.error("Error saving event", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this event?")) return;
    setIsLoading(true);
    try {
        const res = await fetch(`http://localhost:7071/api/CalendarHandler?id=${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ createdBy: CURRENT_USER_ID }) 
        });

        if (res.ok) {
            fetchEvents();
        } else {
            alert("Failed to delete. You might not be the owner.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditClick = (event: CalendarEvent) => {
    setNewEvent({
        title: event.title,
        time: event.time,
        location: event.location
    });
    setEditingId(event.id);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setNewEvent({ title: "", time: "", location: "" });
  };

  const selectedEvents = events.filter(e => 
    selectedDate && new Date(e.dateString).toDateString() === selectedDate.toDateString()
  );

  // --- RETURN JSX ---
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex justify-center border-r-0 md:border-r border-border pr-0 md:pr-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow bg-card"
          modifiers={{ event: events.map(e => new Date(e.dateString)) }}
          modifiersStyles={{
            event: { fontWeight: 'bold', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', border: '2px solid hsl(var(--primary))' }
          }}
        />
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                {selectedDate ? selectedDate.toDateString() : "Select a date"}
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>}
            </h3>
            {IS_LOGGED_IN && <Badge variant="secondary">Admin Mode</Badge>}
        </div>

        <div className="space-y-3 min-h-[120px]">
           {selectedEvents.length === 0 ? (
               <p className="text-muted-foreground text-sm italic py-4">No events scheduled for this day.</p>
           ) : (
               selectedEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-primary shadow-sm bg-secondary/20">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold">{event.title}</h4>
                        {event.createdBy === CURRENT_USER_ID && (
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-blue-500" onClick={() => handleEditClick(event)}>
                                    <Edit className="h-3 w-3"/>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(event.id)}>
                                    <Trash2 className="h-3 w-3"/>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {event.time}</span>
                        <span className="flex items-center gap-1"><Pin className="w-3 h-3"/> {event.location}</span>
                    </div>
                  </CardContent>
                </Card>
               ))
           )}
        </div>

        {IS_LOGGED_IN && selectedDate ? (
            <div className="pt-6 border-t border-border">
                {!isFormOpen ? (
                     <Button variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-transparent hover:text-primary" onClick={() => setIsFormOpen(true)}>
                        <h4 className="font-medium text-sm flex items-center gap-2 text-primary">
                            <Plus className="w-4 h-4" /> Add New Event
                        </h4>
                    </Button>
                ) : (
                    <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 border p-4 rounded-md bg-secondary/10">
                        <h4 className="text-sm font-bold mb-2">{editingId ? "Edit Event" : "New Event"}</h4>
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-xs">Event Title</Label>
                            <Input id="title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}/>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="time" className="text-xs">Time</Label>
                                <Input id="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}/>
                            </div>
                            <div>
                                <Label htmlFor="loc" className="text-xs">Location</Label>
                                <Input id="loc" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}/>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button onClick={handleSaveEvent} className="flex-1" disabled={isLoading}>
                                {isLoading ? "Saving..." : (editingId ? "Update Event" : "Save Event")}
                            </Button>
                            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="pt-4 border-t text-center text-xs text-muted-foreground">
                <p>Login to add events to this calendar.</p>
            </div>
        )}
      </div>
    </div>
  );
};

// --- Main Compete Component ---
const Compete = () => {
  // Use the actual context if available, or fallback to mock
  // const { t } = useLanguage(); 
  const useLanguageMock = () => ({ t: (key: string, def: string) => def || key });
  const { t } = useLanguageMock();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // --- MOCK DATA ---
  const challenges = [
    { title: "Community Cleanup", period: "October 2024", description: "Organized local cleanups in parks and neighborhoods.", status: "Past", icon: "🧹" },
    { title: "Water Savers", period: "November 2024", description: "Tracked and reduced water usage at school and home.", status: "Past", icon: "💧" },
    { title: "Month of Recycling", period: "December 2024", description: "Collect and properly recycle the most waste", status: "Active", icon: "🔄" },
    { title: "Plant a Tree Week", period: "January 2025", description: "Plant trees and document your efforts", status: "Upcoming", icon: "🌳" },
    { title: "Energy Conservation", period: "February 2025", description: "Find ways to reduce energy consumption.", status: "Upcoming", icon: "💡" },
  ];
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
            <DialogContent className="sm:max-w-[800px]">
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

        {/* --- Leaderboards --- */}
        <h2 className="text-3xl font-bold mb-8 text-center">{t('compete.leaderboards', 'Leaderboards')}</h2>
        
        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary/50 p-1">
            <TabsTrigger value="current" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-2 h-full data-[state=active]:bg-background shadow-none">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">Current</span>
                <span className="hidden sm:inline">{t('compete.currentMonth', 'Current Month')}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="lastMonth" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-2 h-full data-[state=active]:bg-background shadow-none">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">Winners</span>
                <span className="hidden sm:inline">{t('compete.lastWinners', 'Last Month\'s Winners')}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-2 h-full data-[state=active]:bg-background shadow-none">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">All-Time</span>
                <span className="hidden sm:inline">{t('compete.allTime', 'All-Time Wins')}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Tabs defaultValue="cities" className="space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary p-1">
                <TabsTrigger value="cities" className="flex gap-2 p-2 text-xs sm:text-sm h-auto"><Trophy className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.cities', 'Cities')}</TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 p-2 text-xs sm:text-sm h-auto"><Medal className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.schools', 'Schools')}</TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 p-2 text-xs sm:text-sm h-auto"><Award className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.students', 'Students')}</TabsTrigger>
              </TabsList>
              <TabsContent value="cities">
                <Card className="border-border bg-card">
                  <CardHeader><CardTitle>{t('compete.cityRankings', 'City Rankings')} - {activeChallenge?.period}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cityLeaderboard.map((entry) => (
                        <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                            <div><div className="font-semibold text-sm sm:text-base">{entry.name}</div></div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4"><Badge variant="outline" className="gap-1 text-green-600 hidden sm:flex"><TrendingUp className="h-3 w-3" />{entry.change}</Badge><div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="schools">
                <Card className="border-border bg-card">
                  <CardHeader><CardTitle>{t('compete.schoolRankings', 'School Rankings')} - {activeChallenge?.period}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schoolLeaderboard.map((entry) => (
                        <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                            <div><div className="font-semibold text-sm sm:text-base">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.city}</div></div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students">
                <Card className="border-border bg-card">
                  <CardHeader><CardTitle>{t('compete.studentRankings', 'Student Rankings')} - {activeChallenge?.period}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentLeaderboard.map((entry) => (
                        <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                            <div><div className="font-semibold text-sm sm:text-base">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.school}</div></div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="lastMonth">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{t('compete.lastWinnersRanking', 'Top Schools in Last Challenge:')}</CardTitle>
                <p className="text-muted-foreground text-sm">{lastChallengeTitle}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lastMonthWinners.map((entry) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent transition-colors">
                      <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                        <div>
                          <div className="font-semibold text-base sm:text-lg text-foreground">{entry.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{entry.city}</div>
                          <Badge variant="secondary" className="mt-1 text-xs">{entry.achievement}</Badge>
                        </div>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-primary sm:self-center pl-12 sm:pl-0">{entry.score.toLocaleString()} points</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allTime">
            <Card className="border-border bg-card">
              <CardHeader><CardTitle>{t('compete.allTimeRankings', 'All-Time Win Rankings')}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allTimeWins.map((entry) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                        <div><div className="font-semibold text-sm sm:text-base">{entry.name}</div></div>
                      </div>
                      <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-primary">{entry.wins}<span className="text-xs sm:text-sm font-medium text-muted-foreground">wins</span></div>
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