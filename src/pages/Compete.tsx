import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Trophy, Medal, Award, TrendingUp, CalendarDays, Pin, Clock, Star, Plus, Loader2, Trash2, Edit } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (!IS_LOGGED_IN) return;
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// --- Calendar Component ---
const EventCalendar = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", location: "" });

  const mapCenter: LatLngExpression = useMemo(() => [42.6977, 23.3219], []);

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
    if(!confirm(t('compete.confirmDelete'))) return;
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
            alert(t('compete.deleteError'));
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

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEAFLET MAP */}
        <div className="rounded-lg border overflow-hidden h-[350px] z-0 relative">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onLocationSelect={(lat, lng) => {
              setNewEvent(prev => ({ ...prev, location: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
              setIsFormOpen(true);
            }} />
            {events.map((event) => {
              const parts = event.location.split(',').map(p => parseFloat(p.trim()));
              if (parts.length === 2 && !isNaN(parts[0])) {
                return (
                  <Marker key={event.id} position={[parts[0], parts[1]] as LatLngExpression}>
                    <Popup>
                      <div className="text-xs">
                        <p className="font-bold">{event.title}</p>
                        <p>{event.time}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>

        <div className="flex justify-center border rounded-lg bg-card p-2 h-[350px]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full h-full"
            modifiers={{ event: events.map(e => new Date(e.dateString)) }}
            modifiersStyles={{
              event: { fontWeight: 'bold', backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', border: '2px solid hsl(var(--primary))' }
            }}
          />
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                {selectedDate ? selectedDate.toDateString() : t('compete.selectDate')}
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>}
            </h3>
            {IS_LOGGED_IN && <Badge variant="secondary">{t('compete.adminMode')}</Badge>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[80px]">
           {selectedEvents.length === 0 ? (
               <p className="text-muted-foreground text-sm italic py-4 col-span-2">{t('compete.noEvents')}</p>
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
      </div>

      {/* Create Event Button & Form - Now at the bottom */}
      <div className="space-y-4 border-t pt-4">
        {!isFormOpen ? (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('compete.createEvent')}
          </Button>
        ) : (
          <Card className="border-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {editingId ? t('compete.editEvent') : t('compete.createEvent')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">{t('compete.eventTitle')}</Label>
                <Input
                  id="event-title"
                  placeholder={t('compete.eventTitlePlaceholder')}
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">{t('compete.eventTime')}</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">{t('compete.eventLocation')}</Label>
                <Input
                  id="event-location"
                  placeholder={t('compete.eventLocationPlaceholder')}
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">{t('compete.clickMapHint')}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEvent} disabled={isLoading || !newEvent.title}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('compete.saveEvent')}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  {t('compete.cancel')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// --- Main Compete Component ---
const Compete = () => {
  const { t } = useLanguage();
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
            {t('compete.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('compete.subtitle')}
          </p>
        </div>

        {/* --- Event Calendar Button --- */}
        <div className="flex justify-center mb-12">
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 px-8 py-6 text-lg">
                <CalendarDays className="h-6 w-6" />
                {t('compete.viewEvents')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>{t('compete.eventCalendar')}</DialogTitle>
              </DialogHeader>
              <EventCalendar />
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Challenges Timeline --- */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('compete.challenges')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            {pastChallenges.map((comp, index) => (
              <Card key={index} className="border-border bg-card opacity-70">
                <CardHeader>
                  <Badge variant="outline" className="w-fit">{t('compete.past')}</Badge>
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
                  <Badge variant="default" className="w-fit">{t('compete.active')}</Badge>
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
                  <Badge variant="secondary" className="w-fit">{t('compete.upcoming')}</Badge>
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
        <h2 className="text-3xl font-bold mb-8 text-center">{t('compete.leaderboards')}</h2>
        
        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary/50 p-1">
            <TabsTrigger value="current" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-2 h-full data-[state=active]:bg-background shadow-none">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t('compete.current')}</span>
                <span className="hidden sm:inline">{t('compete.currentMonth')}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="lastMonth" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-2 h-full data-[state=active]:bg-background shadow-none">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t('compete.winners')}</span>
                <span className="hidden sm:inline">{t('compete.lastWinners')}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-2 h-full data-[state=active]:bg-background shadow-none">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t('compete.allTimeShort')}</span>
                <span className="hidden sm:inline">{t('compete.allTime')}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Tabs defaultValue="cities" className="space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-2 bg-secondary p-1">
                <TabsTrigger value="cities" className="flex gap-2 p-2 text-xs sm:text-sm h-auto"><Trophy className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.cities')}</TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 p-2 text-xs sm:text-sm h-auto"><Medal className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.schools')}</TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 p-2 text-xs sm:text-sm h-auto"><Award className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.students')}</TabsTrigger>
              </TabsList>
              <TabsContent value="cities">
                <Card className="border-border bg-card">
                  <CardHeader><CardTitle>{t('compete.cityRankings')} - {activeChallenge?.period}</CardTitle></CardHeader>
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
                  <CardHeader><CardTitle>{t('compete.schoolRankings')} - {activeChallenge?.period}</CardTitle></CardHeader>
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
                  <CardHeader><CardTitle>{t('compete.studentRankings')} - {activeChallenge?.period}</CardTitle></CardHeader>
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
                <CardTitle className="text-lg sm:text-xl">{t('compete.lastWinnersRanking')}</CardTitle>
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
                      <div className="text-base sm:text-lg font-bold text-primary sm:self-center pl-12 sm:pl-0">{entry.score.toLocaleString()} {t('compete.points')}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allTime">
            <Card className="border-border bg-card">
              <CardHeader><CardTitle>{t('compete.allTimeRankings')}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allTimeWins.map((entry) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                        <div><div className="font-semibold text-sm sm:text-base">{entry.name}</div></div>
                      </div>
                      <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-primary">{entry.wins}<span className="text-xs sm:text-sm font-medium text-muted-foreground">{t('compete.wins')}</span></div>
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