import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Trophy, Medal, Award, TrendingUp, CalendarDays, Pin, Clock, Star, Plus, Loader2, Trash2, Edit, Leaf, Sparkles, Target, Flame } from "lucide-react";
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
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/30">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEAFLET MAP */}
        <div className="rounded-2xl border border-primary/20 overflow-hidden h-[320px] z-0 relative shadow-xl bg-gradient-to-br from-card to-card/80 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 left-3 z-20 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg border border-primary/20 shadow-lg">
            <span className="text-xs font-medium text-primary flex items-center gap-1.5">
              <Pin className="w-3 h-3" />
              {t('compete.clickMapHint')}
            </span>
          </div>
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

        <div className="flex justify-center border border-primary/20 rounded-2xl bg-gradient-to-br from-card/80 via-card to-primary/5 backdrop-blur-sm p-3 h-[320px] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full h-full relative z-10"
            modifiers={{ event: events.map(e => new Date(e.dateString)) }}
            modifiersStyles={{
              event: { fontWeight: 'bold', backgroundColor: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))', border: '2px solid hsl(var(--primary))', borderRadius: '8px' }
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
            {IS_LOGGED_IN && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{t('compete.adminMode')}</Badge>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[80px]">
           {selectedEvents.length === 0 ? (
               <p className="text-muted-foreground text-sm italic py-4 col-span-2">{t('compete.noEvents')}</p>
           ) : (
               selectedEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-primary shadow-lg bg-gradient-to-r from-card/90 via-card/80 to-primary/5 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-4 relative z-10">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                        {event.createdBy === CURRENT_USER_ID && (
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" onClick={() => handleEditClick(event)}>
                                    <Edit className="h-3.5 w-3.5"/>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all" onClick={() => handleDelete(event.id)}>
                                    <Trash2 className="h-3.5 w-3.5"/>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-md"><Clock className="w-3 h-3 text-primary"/> {event.time}</span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 rounded-md"><Pin className="w-3 h-3"/> {event.location}</span>
                    </div>
                  </CardContent>
                </Card>
               ))
           )}
        </div>
      </div>

      {/* Create Event Button & Form - Now at the bottom */}
      <div className="space-y-4 border-t border-primary/10 pt-4">
        {!isFormOpen ? (
          <Button onClick={() => setIsFormOpen(true)} className="gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4" />
            {t('compete.createEvent')}
          </Button>
        ) : (
          <Card className="border-primary/30 bg-gradient-to-br from-card/95 via-card to-primary/5 backdrop-blur-sm shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  {editingId ? <Edit className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
                </div>
                {editingId ? t('compete.editEvent') : t('compete.createEvent')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-2">
                <Label htmlFor="event-title" className="text-sm font-medium">{t('compete.eventTitle')}</Label>
                <Input
                  id="event-title"
                  placeholder={t('compete.eventTitlePlaceholder')}
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-background/60 border-primary/20 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time" className="text-sm font-medium">{t('compete.eventTime')}</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="bg-background/60 border-primary/20 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location" className="text-sm font-medium">{t('compete.eventLocation')}</Label>
                <Input
                  id="event-location"
                  placeholder={t('compete.eventLocationPlaceholder')}
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-background/60 border-primary/20 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSaveEvent} disabled={isLoading || !newEvent.title} className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/80">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('compete.saveEvent')}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all">
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

// --- Main Compete Component ----------------------------------------------------------------------------------------------------------------------
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
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      </div>

      {/* Floating decorative elements - Enhanced density */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
        {/* Top section */}
        <Trophy className="absolute top-12 left-[3%] w-10 h-10 text-yellow-500/25 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0s' }} />
        <Medal className="absolute top-20 right-[8%] w-8 h-8 text-gray-400/25 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <Award className="absolute top-32 left-[12%] w-9 h-9 text-amber-600/25 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
        <Leaf className="absolute top-16 right-[22%] w-7 h-7 text-primary/20 animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <Sparkles className="absolute top-48 left-[6%] w-8 h-8 text-primary/25 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
        <Target className="absolute top-10 left-[35%] w-6 h-6 text-primary/20 animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '0.8s' }} />
        <Flame className="absolute top-36 right-[4%] w-8 h-8 text-orange-500/20 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '2.5s' }} />
        <Star className="absolute top-8 right-[35%] w-7 h-7 text-yellow-400/25 animate-bounce" style={{ animationDuration: '5.8s', animationDelay: '1.2s' }} />
        <Leaf className="absolute top-56 right-[15%] w-6 h-6 text-primary/20 animate-bounce" style={{ animationDuration: '4.8s', animationDelay: '0.3s' }} />
        <Trophy className="absolute top-24 left-[48%] w-6 h-6 text-yellow-500/20 animate-bounce" style={{ animationDuration: '5.2s', animationDelay: '1.8s' }} />
        <Sparkles className="absolute top-40 left-[25%] w-7 h-7 text-primary/20 animate-bounce" style={{ animationDuration: '4.3s', animationDelay: '2.2s' }} />
        <Medal className="absolute top-64 right-[28%] w-5 h-5 text-gray-400/20 animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '0.7s' }} />
        
        {/* Middle section */}
        <Award className="absolute top-[35%] left-[2%] w-8 h-8 text-amber-600/20 animate-bounce" style={{ animationDuration: '4.7s', animationDelay: '1.3s' }} />
        <Target className="absolute top-[40%] right-[3%] w-7 h-7 text-primary/15 animate-bounce" style={{ animationDuration: '6.2s', animationDelay: '2.8s' }} />
        <Flame className="absolute top-[30%] left-[18%] w-6 h-6 text-orange-500/15 animate-bounce" style={{ animationDuration: '4.9s', animationDelay: '0.9s' }} />
        <Star className="absolute top-[45%] right-[18%] w-8 h-8 text-yellow-400/20 animate-bounce" style={{ animationDuration: '5.3s', animationDelay: '1.6s' }} />
        <Leaf className="absolute top-[38%] left-[45%] w-5 h-5 text-primary/15 animate-bounce" style={{ animationDuration: '6.5s', animationDelay: '2.1s' }} />
        <Sparkles className="absolute top-[42%] right-[42%] w-6 h-6 text-primary/20 animate-bounce" style={{ animationDuration: '4.1s', animationDelay: '0.4s' }} />
        
        {/* Bottom section */}
        <Leaf className="absolute bottom-20 right-[10%] w-9 h-9 text-primary/20 animate-bounce" style={{ animationDuration: '4.8s', animationDelay: '0.3s' }} />
        <Sparkles className="absolute bottom-40 left-[15%] w-7 h-7 text-primary/25 animate-bounce" style={{ animationDuration: '5.2s', animationDelay: '1.8s' }} />
        <Trophy className="absolute bottom-16 right-[25%] w-8 h-8 text-yellow-500/20 animate-bounce" style={{ animationDuration: '4.3s', animationDelay: '2.2s' }} />
        <Medal className="absolute bottom-32 left-[30%] w-6 h-6 text-gray-400/20 animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '0.7s' }} />
        <Award className="absolute bottom-24 left-[4%] w-8 h-8 text-amber-600/20 animate-bounce" style={{ animationDuration: '4.7s', animationDelay: '1.3s' }} />
        <Target className="absolute bottom-48 right-[6%] w-7 h-7 text-primary/15 animate-bounce" style={{ animationDuration: '6.2s', animationDelay: '2.8s' }} />
        <Flame className="absolute bottom-12 left-[42%] w-6 h-6 text-orange-500/20 animate-bounce" style={{ animationDuration: '4.4s', animationDelay: '1.1s' }} />
        <Star className="absolute bottom-56 right-[38%] w-7 h-7 text-yellow-400/20 animate-bounce" style={{ animationDuration: '5.1s', animationDelay: '1.9s' }} />
        <Leaf className="absolute bottom-36 left-[52%] w-5 h-5 text-primary/15 animate-bounce" style={{ animationDuration: '6.3s', animationDelay: '2.4s' }} />
        <Sparkles className="absolute bottom-64 left-[8%] w-6 h-6 text-primary/20 animate-bounce" style={{ animationDuration: '4.6s', animationDelay: '0.6s' }} />
        <Trophy className="absolute bottom-44 right-[48%] w-5 h-5 text-yellow-500/15 animate-bounce" style={{ animationDuration: '5.4s', animationDelay: '2.0s' }} />
        <Medal className="absolute bottom-8 right-[15%] w-6 h-6 text-gray-400/15 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '0.8s' }} />
      </div>

      <div className="container relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Trophy className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Compete & Win</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
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
              <Button size="lg" className="gap-2 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                <CalendarDays className="h-6 w-6" />
                {t('compete.viewEvents')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-xl border-primary/30 shadow-2xl">
              {/* Dialog background decorations */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />
                <CalendarDays className="absolute top-4 right-12 w-6 h-6 text-primary/10 animate-bounce" style={{ animationDuration: '4s' }} />
                <Leaf className="absolute top-12 right-4 w-5 h-5 text-primary/15 animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
                <Sparkles className="absolute bottom-16 left-4 w-5 h-5 text-primary/15 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }} />
                <Star className="absolute bottom-8 right-8 w-4 h-4 text-yellow-500/15 animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }} />
                <Trophy className="absolute top-20 left-4 w-4 h-4 text-yellow-500/10 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '0.8s' }} />
              </div>
              <DialogHeader className="relative z-10 pb-4 border-b border-primary/10">
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent font-bold">
                    {t('compete.eventCalendar')}
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className="relative z-10">
                <EventCalendar />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Challenges Timeline --- */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">{t('compete.challenges')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            {pastChallenges.map((comp, index) => (
              <Card key={index} className="border-border bg-card/50 backdrop-blur-sm opacity-70 hover:opacity-100 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <Badge variant="outline" className="w-fit bg-muted/50">{t('compete.past')}</Badge>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{comp.icon}</span>
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
              <Card className="border-primary border-2 bg-gradient-to-br from-primary/10 via-card to-primary/5 backdrop-blur-sm shadow-xl shadow-primary/20 transform scale-105 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <Badge variant="default" className="w-fit animate-pulse">{t('compete.active')}</Badge>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>{activeChallenge.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{activeChallenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{activeChallenge.period}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-foreground">{activeChallenge.description}</p>
                </CardContent>
              </Card>
            )}
            {upcomingChallenges.map((comp, index) => (
              <Card key={index} className="border-dashed border-primary/30 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:shadow-lg hover:border-primary/50 group">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit bg-secondary/50">{t('compete.upcoming')}</Badge>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{comp.icon}</span>
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
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-yellow-500 bg-clip-text text-transparent">{t('compete.leaderboards')}</h2>
        </div>
        
        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="grid grid-cols-3 h-auto gap-2 bg-card/50 backdrop-blur-sm p-2 border border-border/50 rounded-xl">
            <TabsTrigger value="current" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t('compete.current')}</span>
                <span className="hidden sm:inline">{t('compete.currentMonth')}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="lastMonth" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t('compete.winners')}</span>
                <span className="hidden sm:inline">{t('compete.lastWinners')}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t('compete.allTimeShort')}</span>
                <span className="hidden sm:inline">{t('compete.allTime')}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Tabs defaultValue="cities" className="space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-2 bg-card/50 backdrop-blur-sm p-2 border border-border/50 rounded-xl">
                <TabsTrigger value="cities" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Trophy className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.cities')}</TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Medal className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.schools')}</TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Award className="h-3 w-3 sm:h-4 sm:w-4" />{t('compete.students')}</TabsTrigger>
              </TabsList>
              <TabsContent value="cities">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      {t('compete.cityRankings')} - {activeChallenge?.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cityLeaderboard.map((entry, index) => (
                        <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center gap-4">
                            <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                            <div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div></div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4"><Badge variant="outline" className="gap-1 text-green-600 bg-green-500/10 border-green-500/20 hidden sm:flex"><TrendingUp className="h-3 w-3" />{entry.change}</Badge><div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="schools">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="w-5 h-5 text-gray-400" />
                      {t('compete.schoolRankings')} - {activeChallenge?.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {schoolLeaderboard.map((entry, index) => (
                        <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center gap-4">
                            <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                            <div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.city}</div></div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      {t('compete.studentRankings')} - {activeChallenge?.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {studentLeaderboard.map((entry, index) => (
                        <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center gap-4">
                            <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                            <div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.school}</div></div>
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
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  {t('compete.lastWinnersRanking')}
                </CardTitle>
                <p className="text-muted-foreground text-sm">{lastChallengeTitle}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lastMonthWinners.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                        <div>
                          <div className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">{entry.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{entry.city}</div>
                          <Badge variant="secondary" className="mt-1 text-xs bg-secondary/50">{entry.achievement}</Badge>
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
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  {t('compete.allTimeRankings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTimeWins.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div>
                        <div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div></div>
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
