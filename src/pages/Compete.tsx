import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  CalendarDays,
  Pin,
  Clock,
  Star,
  Plus,
  Loader2,
  Trash2,
  Edit,
  Target,
  MapPin,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// --- 1. Custom Icons Configuration ---

// Standard Blue Icon for Events
const EventIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// "You Are Here" Icon (Green/Red via CSS filter)
const UserLocationIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-[140deg]", // Makes the marker look green/reddish
});

L.Marker.prototype.options.icon = EventIcon;

const IS_LOGGED_IN = true;
const CURRENT_USER_ID = "user-123-mock";

// --- 2. Interfaces & Mock Data ---

interface CalendarEvent {
  id: string;
  dateString: string;
  title: string;
  time: string;
  location: string;
  createdBy: string;
}

const INITIAL_MOCK_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Vitosha Cleanup", dateString: new Date().toISOString(), time: "10:00", location: "42.56, 23.29", createdBy: "other" },
  { id: "2", title: "Plovdiv Ancient Tree", dateString: new Date().toISOString(), time: "14:00", location: "42.1354, 24.7453", createdBy: "other" },
  { id: "3", title: "Varna Beach Patrol", dateString: new Date().toISOString(), time: "09:00", location: "43.2141, 27.9147", createdBy: "other" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2: return <Medal className="h-5 w-5 text-gray-400" />;
    case 3: return <Award className="h-5 w-5 text-amber-600" />;
    default: return <span className="text-muted-foreground">#{rank}</span>;
  }
};

// --- 3. Map Logic Components ---

// Handles clicking the map to set a new event location
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (!IS_LOGGED_IN) return;
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Finds the user's real GPS location
function LocationMarker() {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const map = useMap();
  const { t } = useLanguage();

  useEffect(() => {
    map.locate({ 
      enableHighAccuracy: true, 
      watch: true 
    });

    map.on("locationfound", (e) => {
      setPosition(e.latlng);
      setAccuracy(e.accuracy);
      // Optional: map.flyTo(e.latlng, 14); // Uncomment to auto-zoom to user
    });

    map.on("locationerror", (e) => {
      console.warn("Location access denied or failed", e);
    });
  }, [map]);

  if (position === null) return null;

  return (
    <>
      <Marker position={position} icon={UserLocationIcon}>
        <Popup>
          <strong>{t("You are here")}</strong>
          <br />
          Accuracy: {Math.round(accuracy)} meters
        </Popup>
      </Marker>
      <Circle center={position} radius={accuracy} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }} />
    </>
  );
}

// --- 4. EventCalendar Component ---
const EventCalendar = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", location: "" });

  // Center Map on Bulgaria
  const mapCenter: LatLngExpression = useMemo(() => [42.7339, 25.4858], []);
  const defaultZoom = 7;

  useEffect(() => {
    if (!isFormOpen) {
      setNewEvent({ title: "", time: "", location: "" });
      setEditingId(null);
    }
  }, [isFormOpen]);

  const handleSaveEvent = async () => {
    if (!selectedDate || !newEvent.title) return;
    setIsLoading(true);

    // Save locally for demo
    const eventToSave: CalendarEvent = {
      id: editingId || Date.now().toString(),
      dateString: selectedDate.toISOString(),
      title: newEvent.title,
      time: newEvent.time,
      location: newEvent.location,
      createdBy: CURRENT_USER_ID,
    };

    setEvents((prev) => {
      if (editingId) return prev.map(e => e.id === editingId ? eventToSave : e);
      return [...prev, eventToSave];
    });

    setIsLoading(false);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm(t("compete.confirmDelete"))) return;
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleEditClick = (event: CalendarEvent) => {
    setNewEvent({ title: event.title, time: event.time, location: event.location });
    setEditingId(event.id);
    setIsFormOpen(true);
  };

  const handleCancel = () => setIsFormOpen(false);

  const selectedEvents = events.filter(
    (e) => selectedDate && new Date(e.dateString).toDateString() === selectedDate.toDateString(),
  );

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px] lg:h-[400px]">
        {/* MAP */}
        <div className="rounded-2xl border border-primary/20 overflow-hidden h-full z-0 relative shadow-xl bg-card">
          <div className="absolute top-3 left-12 z-[400] px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg border border-primary/20 shadow-lg pointer-events-none">
            <span className="text-xs font-medium text-primary flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {t("Click map to add event")}
            </span>
          </div>
          <MapContainer center={mapCenter} zoom={defaultZoom} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            <MapClickHandler onLocationSelect={(lat, lng) => {
              setNewEvent(prev => ({ ...prev, location: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }));
              setIsFormOpen(true);
            }} />
            <LocationMarker />
            {events.map((event) => {
              const parts = event.location.split(",").map((p) => parseFloat(p.trim()));
              if (parts.length === 2 && !isNaN(parts[0])) {
                return (
                  <Marker key={event.id} position={[parts[0], parts[1]] as LatLngExpression} icon={EventIcon}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold text-primary mb-1">{event.title}</p>
                        <p className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> {event.time}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>

        {/* CALENDAR */}
        <div className="flex justify-center border border-primary/20 rounded-2xl bg-gradient-to-br from-card/80 via-card to-primary/5 backdrop-blur-sm p-4 h-full shadow-xl relative overflow-hidden group">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full h-full flex justify-center items-center"
            modifiers={{ event: events.map((e) => new Date(e.dateString)) }}
            modifiersStyles={{ event: { fontWeight: "bold", backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary))" } }}
          />
        </div>
      </div>

      {/* Events List & Form */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            {selectedDate ? selectedDate.toDateString() : t("compete.selectDate")}
          </h3>
          <Badge variant="outline" className="text-xs font-normal opacity-70">
            {selectedEvents.length} {t("Events")}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {selectedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-primary/10 rounded-xl">
                <p>{t("compete.noEvents")}</p>
                <p className="text-xs opacity-60 mt-1">Click the map or "+ Create Event" to add one.</p>
            </div>
          ) : (
            selectedEvents.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-primary shadow-sm bg-card/50 hover:bg-card transition-colors group">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-foreground">{event.title}</h4>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                      <span className="flex items-center gap-1"><Pin className="w-3 h-3" /> {event.location}</span>
                    </div>
                  </div>
                  {(event.createdBy === CURRENT_USER_ID || event.createdBy !== 'other') && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => handleEditClick(event)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Event Form */}
        {(isFormOpen) && (
          <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-bottom-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {editingId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? t("compete.editEvent") : t("compete.createEvent")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t("compete.eventTitle")}</Label>
                    <Input value={newEvent.title} onChange={(e) => setNewEvent(p => ({...p, title: e.target.value}))} placeholder="e.g. Park Cleanup" className="bg-background"/>
                </div>
                <div className="space-y-2">
                    <Label>{t("compete.eventTime")}</Label>
                    <Input type="time" value={newEvent.time} onChange={(e) => setNewEvent(p => ({...p, time: e.target.value}))} className="bg-background"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("compete.eventLocation")}</Label>
                <div className="flex gap-2">
                    <Input value={newEvent.location} onChange={(e) => setNewEvent(p => ({...p, location: e.target.value}))} placeholder="Click on map to set coordinates" className="bg-background font-mono text-xs"/>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handleCancel}>{t("compete.cancel")}</Button>
                <Button onClick={handleSaveEvent} disabled={!newEvent.title} className="bg-primary text-primary-foreground">{t("compete.saveEvent")}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)} className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                <Plus className="h-4 w-4 mr-2" /> {t("compete.createEvent")}
            </Button>
        )}
      </div>
    </div>
  );
};

// --- 5. Main Compete Page ---
const Compete = () => {
  const { t } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // --- MOCK DATA FOR LEADERBOARDS ---
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

  // REMIXED DATA
  const lastMonthCityLeaderboard = [...cityLeaderboard].reverse().map((item, i) => ({ ...item, rank: i + 1, points: item.points - 1000, change: "+0" }));
  const lastMonthStudentLeaderboard = [...studentLeaderboard].reverse().map((item, i) => ({ ...item, rank: i + 1, points: item.points - 50 }));
  const allTimeCityLeaderboard = [...cityLeaderboard].sort((a, b) => a.name.localeCompare(b.name)).map((item, i) => ({ ...item, rank: i + 1, points: item.points * 12, change: "" }));
  const allTimeStudentLeaderboard = [...studentLeaderboard].sort((a, b) => a.name.localeCompare(b.name)).map((item, i) => ({ ...item, rank: i + 1, points: item.points * 8 }));

  const pastChallenges = challenges.filter((c) => c.status === "Past").slice(-2);
  const activeChallenge = challenges.find((c) => c.status === "Active");
  const upcomingChallenges = challenges.filter((c) => c.status === "Upcoming").slice(0, 2);
  const lastChallenge = challenges.find((c) => c.title === "Water Savers");
  const lastChallengeTitle = lastChallenge ? `${lastChallenge.title} (${lastChallenge.period})` : "Last Challenge";

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("compete.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("compete.subtitle")}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r hover:from-secondary/90 hover:to-hover">
                <CalendarDays className="h-6 w-6" />
                {t("compete.viewEvents")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-xl border-primary/30 shadow-2xl">
              <DialogHeader className="relative z-10 pb-4 border-b border-primary/10">
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t("compete.eventCalendar")}
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className="relative z-10">
                <EventCalendar />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-4xl font-bold">{t("compete.challenges")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            {pastChallenges.map((comp, index) => (
              <Card key={index} className="border-border bg-card/50 backdrop-blur-sm opacity-70 hover:opacity-100 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <Badge variant="outline" className="w-fit bg-muted/50">{t("compete.past")}</Badge>
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
                  <Badge variant="default" className="w-fit animate-pulse">{t("compete.active")}</Badge>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-4xl animate-bounce" style={{ animationDuration: "2s" }}>{activeChallenge.icon}</span>
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
                  <Badge variant="secondary" className="w-fit bg-secondary/50">{t("compete.upcoming")}</Badge>
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
          <h2 className="text-4xl font-bold">{t("compete.leaderboards")}</h2>
        </div>

        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="grid grid-cols-3 h-auto gap-2 bg-card/50 backdrop-blur-sm p-2 border border-border/50 rounded-xl">
            <TabsTrigger value="current" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight"><span className="sm:hidden">{t("compete.current")}</span><span className="hidden sm:inline">{t("compete.currentMonth")}</span></div>
            </TabsTrigger>
            <TabsTrigger value="lastMonth" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight"><span className="sm:hidden">{t("compete.winners")}</span><span className="hidden sm:inline">{t("compete.lastWinners")}</span></div>
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex flex-col sm:flex-row gap-1 sm:gap-2 p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-xs sm:text-base font-medium leading-tight"><span className="sm:hidden">{t("compete.allTimeShort")}</span><span className="hidden sm:inline">{t("compete.allTime")}</span></div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Tabs defaultValue="cities" className="space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-2 bg-card/50 backdrop-blur-sm p-2 border border-border/50 rounded-xl">
                <TabsTrigger value="cities" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Trophy className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.cities")}</TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Medal className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.schools")}</TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Award className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.students")}</TabsTrigger>
              </TabsList>
              <TabsContent value="cities">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />{t("compete.cityRankings")} - {activeChallenge?.period}</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{cityLeaderboard.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div></div></div>
                      <div className="flex items-center gap-2 sm:gap-4"><Badge variant="outline" className="gap-1 text-green-600 bg-green-500/10 border-green-500/20 hidden sm:flex"><TrendingUp className="h-3 w-3" />{entry.change}</Badge><div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div></div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="schools">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Medal className="w-5 h-5 text-gray-400" />{t("compete.schoolRankings")} - {activeChallenge?.period}</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{schoolLeaderboard.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.city}</div></div></div>
                      <div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-600" />{t("compete.studentRankings")} - {activeChallenge?.period}</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{studentLeaderboard.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.school}</div></div></div>
                      <div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="lastMonth">
            <Tabs defaultValue="cities" className="space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-2 bg-card/50 backdrop-blur-sm p-2 border border-border/50 rounded-xl">
                <TabsTrigger value="cities" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Trophy className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.cities")}</TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Medal className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.schools")}</TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Award className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.students")}</TabsTrigger>
              </TabsList>
              <TabsContent value="cities">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />{t("compete.cityRankings")} - {lastChallengeTitle}</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{lastMonthCityLeaderboard.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div></div></div>
                      <div className="flex items-center gap-2 sm:gap-4"><div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div></div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="schools">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="text-lg sm:text-xl flex items-center gap-2"><Medal className="w-5 h-5 text-gray-400" />{t("compete.lastWinnersRanking")}</CardTitle><p className="text-muted-foreground text-sm">{lastChallengeTitle}</p></CardHeader>
                  <CardContent><div className="space-y-3">{lastMonthWinners.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4 mb-2 sm:mb-0"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.city}</div><Badge variant="secondary" className="mt-1 text-xs bg-secondary/50">{entry.achievement}</Badge></div></div>
                      <div className="text-base sm:text-lg font-bold text-primary sm:self-center pl-12 sm:pl-0">{entry.score.toLocaleString()} {t("compete.points")}</div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-600" />{t("compete.studentRankings")} - {lastChallengeTitle}</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{lastMonthStudentLeaderboard.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.school}</div></div></div>
                      <div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="allTime">
            <Tabs defaultValue="cities" className="space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-2 bg-card/50 backdrop-blur-sm p-2 border border-border/50 rounded-xl">
                <TabsTrigger value="cities" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Trophy className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.cities")}</TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Medal className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.schools")}</TabsTrigger>
                <TabsTrigger value="students" className="flex gap-2 p-3 text-xs sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"><Award className="h-3 w-3 sm:h-4 sm:w-4" />{t("compete.students")}</TabsTrigger>
              </TabsList>
              <TabsContent value="cities">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />{t("compete.allTimeRankings")} ({t("compete.cities")})</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{allTimeCityLeaderboard.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div></div></div>
                      <div className="flex items-center gap-2 sm:gap-4"><div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div></div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="schools">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />{t("compete.allTimeRankings")} ({t("compete.schools")})</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{allTimeWins.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div></div></div>
                      <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-primary">{entry.wins}<span className="text-xs sm:text-sm font-medium text-muted-foreground">{t("compete.wins")}</span></div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-600" />{t("compete.allTimeRankings")} ({t("compete.students")})</CardTitle></CardHeader>
                  <CardContent><div className="space-y-3">{allTimeStudentLeaderboard.map((entry, index) => (
                    <div key={entry.rank} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-4"><div className="w-8 sm:w-12 flex justify-center">{getRankIcon(entry.rank)}</div><div><div className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{entry.name}</div><div className="text-xs sm:text-sm text-muted-foreground">{entry.school}</div></div></div>
                      <div className="text-sm sm:text-lg font-bold text-primary">{entry.points.toLocaleString()}</div>
                    </div>))}</div></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Compete;