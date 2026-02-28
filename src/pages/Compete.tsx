import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
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
  {
    id: "1",
    title: "Vitosha Cleanup",
    dateString: new Date().toISOString(),
    time: "10:00",
    location: "42.56, 23.29",
    createdBy: "other",
  },
  {
    id: "2",
    title: "Plovdiv Ancient Tree",
    dateString: new Date().toISOString(),
    time: "14:00",
    location: "42.1354, 24.7453",
    createdBy: "other",
  },
  {
    id: "3",
    title: "Varna Beach Patrol",
    dateString: new Date().toISOString(),
    time: "09:00",
    location: "43.2141, 27.9147",
    createdBy: "other",
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

// --- 3. Map Logic Components ---

// Handles clicking the map to set a new event location
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
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
      watch: true,
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
      <Circle
        center={position}
        radius={accuracy}
        pathOptions={{ color: "green", fillColor: "green", fillOpacity: 0.1 }}
      />
    </>
  );
}

// --- 4. EventCalendar Component ---
const EventCalendar = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_MOCK_EVENTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Consolidated form state
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    location: "",
  });

  // Map settings
  const mapCenter: LatLngExpression = useMemo(() => [42.7339, 25.4858], []);
  const defaultZoom = 7;
  const eventDates = useMemo(
    () => events.map((e) => new Date(e.dateString)),
    [events],
  );

  // Reset form when closed
  useEffect(() => {
    if (!isFormOpen) {
      setFormData({ title: "", time: "", location: "" });
      setEditingId(null);
    }
  }, [isFormOpen]);

  const selectedEvents = useMemo(() => {
    return events.filter(
      (e) =>
        selectedDate &&
        new Date(e.dateString).toDateString() === selectedDate.toDateString(),
    );
  }, [events, selectedDate]);

  const getEventPosition = (location: string): LatLngExpression | null => {
    const parts = location.split(",").map((p) => parseFloat(p.trim()));
    return parts.length === 2 && !isNaN(parts[0])
      ? ([parts[0], parts[1]] as LatLngExpression)
      : null;
  };

  const handleSaveEvent = async () => {
    if (!selectedDate || !formData.title) return;
    const eventToSave: CalendarEvent = {
      id: editingId || Date.now().toString(),
      dateString: selectedDate.toISOString(),
      title: formData.title,
      time: formData.time,
      location: formData.location,
      createdBy: CURRENT_USER_ID,
    };
    setEvents((prev) =>
      editingId
        ? prev.map((e) => (e.id === editingId ? eventToSave : e))
        : [...prev, eventToSave],
    );
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t("compete.confirmDelete"))) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEditClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      title: event.title,
      time: event.time,
      location: event.location,
    });
    setEditingId(event.id);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({ title: "", time: "", location: "" });
    setIsFormOpen(true);
  };

  const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }, [map]);
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* --- TOP SECTION: MAP & CALENDAR --- */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:h-[320px] shrink-0">
        {/* MAP */}
        <div className="relative h-[250px] min-h-[250px] lg:h-full w-full rounded-xl border border-border/40 shadow-sm overflow-hidden bg-muted/20 shrink-0 order-2 lg:order-1">
          <div className="absolute top-3 left-3 z-[400] px-2.5 py-1 bg-background/95 backdrop-blur rounded-md border shadow-sm pointer-events-none">
            <span className="text-[10px] font-semibold text-primary flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {t("Click map to add event")}
            </span>
          </div>
          <MapContainer
            center={mapCenter}
            zoom={defaultZoom}
            className="h-full w-full z-0"
          >
            <ResizeMap />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            <MapClickHandler
              onLocationSelect={(lat, lng) => {
                setFormData((prev) => ({
                  ...prev,
                  location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                }));
                setIsFormOpen(true);
              }}
            />
            <LocationMarker />
            {events.map((event) => {
              const position = getEventPosition(event.location);
              if (!position) return null;
              return (
                <Marker key={event.id} position={position} icon={EventIcon}>
                  <Popup>
                    <div className="p-0.5 min-w-[100px]">
                      <p className="font-bold text-xs text-primary mb-0.5">
                        {event.title}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* CALENDAR */}
        <div className="h-[340px] lg:h-full w-full flex justify-center items-center border border-border/40 rounded-xl bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden shrink-0 order-1 lg:order-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full h-full flex items-center justify-center p-3"
            classNames={{
              months: "w-full h-full flex flex-col",
              month: "w-full h-full flex flex-col justify-between",
              table: "w-full h-full flex-1",
              head_row: "flex w-full justify-between mb-2",
              head_cell:
                "text-muted-foreground w-full font-normal text-[0.8rem]",
              row: "flex w-full mt-2 justify-between",
              cell: "w-full text-center relative p-0 focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 mx-auto hover:bg-primary/10 rounded-md transition-colors",
              nav_button:
                "border hover:bg-muted hover:text-foreground opacity-50 hover:opacity-100 h-8 w-8",
              caption:
                "relative flex justify-center items-center pt-1 pb-4 relative",
            }}
            modifiers={{ event: eventDates }}
            modifiersStyles={{
              event: {
                fontWeight: "700",
                color: "hsl(var(--primary))",
                textDecoration:
                  "underline decoration-wavy decoration-primary/40",
              },
            }}
          />
        </div>
      </div>

      {/* --- BOTTOM SECTION HEADER --- */}
      <div className="flex items-center justify-between pt-2 border-t border-border/10 shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground/90">
            <CalendarDays className="w-5 h-5 text-primary" />
            {selectedDate
              ? selectedDate.toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })
              : t("compete.selectDate")}
          </h3>
          <Badge variant="secondary" className="px-2 py-0.5 text-xs">
            {selectedEvents.length} {t("Events")}
          </Badge>
        </div>
        {!isFormOpen && (
          <Button
            size="sm"
            onClick={handleCreateClick}
            className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-none h-8"
          >
            <Plus className="h-4 w-4 mr-1.5" /> {t("compete.createEvent")}
          </Button>
        )}
      </div>

      {/* --- SPLIT VIEW: LIST & FORM --- */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div
          className={`overflow-y-auto h-[350px] pr-2 space-y-2 w-full ${isFormOpen ? "hidden lg:block lg:flex-1" : "block"}`}
        >
          {selectedEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted/50 rounded-xl min-h-[150px]">
              <p className="text-sm">{t("compete.noEvents")}</p>
            </div>
          ) : (
            selectedEvents.map((event) => (
              <Card
                key={event.id}
                className="group overflow-hidden border-l-4 border-l-primary hover:shadow-sm transition-all bg-card/60"
              >
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{event.title}</h4>
                    <div className="flex gap-3 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                    </div>
                  </div>
                  {event.createdBy === CURRENT_USER_ID && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-blue-500"
                        onClick={(e) => handleEditClick(event, e)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-red-500"
                        onClick={(e) => handleDelete(event.id, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* RIGHT: CREATE/EDIT FORM */}
        {isFormOpen && (
          <div className="w-full lg:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-border/40 pt-4 lg:pt-0 lg:pl-4 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 h-auto">
              <div className="flex items-center justify-between mb-4 text-primary font-medium text-sm">
                <span className="flex items-center gap-2">
                  {editingId ? (
                    <Edit className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {editingId
                    ? t("compete.editEvent")
                    : t("compete.createEvent")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsFormOpen(false)}
                >
                  <span className="text-lg leading-none">&times;</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    {t("compete.eventTitle")}
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. Tree Planting"
                    className="bg-background h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    {t("compete.eventTime")}
                  </Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, time: e.target.value }))
                    }
                    className="bg-background h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    {t("compete.eventLocation")}
                  </Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, location: e.target.value }))
                    }
                    placeholder="Click on map..."
                    className="bg-background font-mono text-xs h-9"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                >
                  {t("compete.cancel")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEvent}
                  disabled={!formData.title}
                >
                  {t("compete.saveEvent")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 5. Main Compete Page ---
const Compete = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // --- MOCK DATA FOR LEADERBOARDS ---
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

  const lastMonthWinners = [
    {
      rank: 1,
      name: "Roosevelt High",
      city: "Riverside City",
      score: 850,
      achievement: "Saved 50,000+ gallons of water.",
    },
    {
      rank: 2,
      name: "Lincoln Elementary",
      city: "Green Valley",
      score: 790,
      achievement: "38,000+ gallons saved.",
    },
    {
      rank: 3,
      name: "Kennedy School",
      city: "Oakwood",
      score: 680,
      achievement: "Reduced water usage by 20%.",
    },
    {
      rank: 4,
      name: "Washington Middle",
      city: "Mountain View",
      score: 640,
      achievement: "Best overall participation rate.",
    },
    {
      rank: 5,
      name: "Jefferson Academy",
      city: "Green Valley",
      score: 550,
      achievement: "High educational outreach.",
    },
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
  const lastMonthCityLeaderboard = [...cityLeaderboard]
    .reverse()
    .map((item, i) => ({
      ...item,
      rank: i + 1,
      points: item.points - 1000,
      change: "+0",
    }));
  const lastMonthStudentLeaderboard = [...studentLeaderboard]
    .reverse()
    .map((item, i) => ({ ...item, rank: i + 1, points: item.points - 50 }));
  const allTimeCityLeaderboard = [...cityLeaderboard]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item, i) => ({
      ...item,
      rank: i + 1,
      points: item.points * 12,
      change: "",
    }));
  const allTimeStudentLeaderboard = [...studentLeaderboard]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item, i) => ({ ...item, rank: i + 1, points: item.points * 8 }));

  const pastChallenges = challenges
    .filter((c) => c.status === "Past")
    .slice(-2);
  const activeChallenge = challenges.find((c) => c.status === "Active");
  const upcomingChallenges = challenges
    .filter((c) => c.status === "Upcoming")
    .slice(0, 2);
  const lastChallenge = challenges.find((c) => c.title === "Water Savers");
  const lastChallengeTitle = lastChallenge
    ? `${lastChallenge.title} (${lastChallenge.period})`
    : "Last Challenge";

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
              <Button
                size="lg"
                className="gap-2 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r hover:from-secondary/90 hover:to-hover"
              >
                <CalendarDays className="h-6 w-6" />
                {t("compete.viewEvents")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px] max-h-[90vh] flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-xl border-primary/30 shadow-2xl">
              <DialogHeader className="relative z-10 pb-4 border-b border-primary/10 shrink-0">
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-3xl opacity-100">
                    {t("compete.eventCalendar")}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="relative z-10 flex-1 min-h-0 w-full mt-4">
                <EventCalendar />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <h2 className="text-2xl sm:text-4xl font-bold text-center">
              {t("compete.challenges")}
            </h2>
          </div>

          {(() => {
            const allChallenges = [
              ...pastChallenges.map((c) => ({ ...c, type: "past" as const })),
              ...(activeChallenge
                ? [{ ...activeChallenge, type: "active" as const }]
                : []),
              ...upcomingChallenges.map((c) => ({
                ...c,
                type: "upcoming" as const,
              })),
            ];

            const renderCard = (
              comp: (typeof allChallenges)[number],
              index: number,
            ) => {
              if (comp.type === "active") {
                return (
                  <Card
                    key={`active-${index}`}
                    className="border-primary border-2 bg-gradient-to-br from-primary/10 via-card to-primary/5 backdrop-blur-sm shadow-xl shadow-primary/20 relative overflow-hidden group h-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="relative z-10">
                      <Badge variant="default" className="w-fit">
                        {t("compete.active")}
                      </Badge>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-4xl">{comp.icon}</span>
                        <div>
                          <CardTitle className="text-xl">
                            {comp.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {comp.period}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-foreground">{comp.description}</p>
                    </CardContent>
                  </Card>
                );
              }
              if (comp.type === "past") {
                return (
                  <Card
                    key={`past-${index}`}
                    className="border-border bg-card/50 backdrop-blur-sm opacity-70 hover:opacity-100 transition-all duration-300 hover:shadow-lg group h-full"
                  >
                    <CardHeader>
                      <Badge variant="outline" className="w-fit bg-muted/50">
                        {t("compete.past")}
                      </Badge>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {comp.icon}
                        </span>
                        <div>
                          <CardTitle className="text-lg">
                            {comp.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {comp.period}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {comp.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              }
              return (
                <Card
                  key={`upcoming-${index}`}
                  className="border-dashed border-primary/30 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 hover:shadow-lg hover:border-primary/50 group h-full"
                >
                  <CardHeader>
                    <Badge
                      variant="secondary"
                      className="w-fit bg-secondary/50"
                    >
                      {t("compete.upcoming")}
                    </Badge>
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        {comp.icon}
                      </span>
                      <div>
                        <CardTitle className="text-lg">{comp.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {comp.period}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {comp.description}
                    </p>
                  </CardContent>
                </Card>
              );
            };

            const activeIndex = pastChallenges.length;

            return isMobile ? (
              <Carousel
                opts={{ align: "center", loop: false, startIndex: activeIndex }}
                className="w-full px-4"
              >
                <CarouselContent>
                  {allChallenges.map((comp, index) => (
                    <CarouselItem key={index} className="basis-[85%]">
                      {renderCard(comp, index)}
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                {allChallenges.map((comp, index) => renderCard(comp, index))}
              </div>
            );
          })()}
        </div>

        {/* --- Leaderboards --- */}
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            {t("compete.leaderboards")}
          </h2>
        </div>

        <Tabs defaultValue="current" className="space-y-6 sm:space-y-8">
          <TabsList className="grid grid-cols-3 h-auto gap-1.5 sm:gap-2 bg-card/50 backdrop-blur-sm p-1.5 sm:p-2 border border-border/50 rounded-xl">
            <TabsTrigger
              value="current"
              className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-[10px] sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t("compete.current")}</span>
                <span className="hidden sm:inline">
                  {t("compete.currentMonth")}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="lastMonth"
              className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-[10px] sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t("compete.winners")}</span>
                <span className="hidden sm:inline">
                  {t("compete.lastWinners")}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="allTime"
              className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:p-3 h-full data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              <div className="flex flex-col sm:block text-[10px] sm:text-base font-medium leading-tight">
                <span className="sm:hidden">{t("compete.allTimeShort")}</span>
                <span className="hidden sm:inline">{t("compete.allTime")}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* === CURRENT MONTH CONTENT === */}
          <TabsContent value="current">
            <Tabs defaultValue="cities" className="space-y-6 sm:space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-1.5 bg-card/50 backdrop-blur-sm p-1.5 border border-border/50 rounded-xl">
                <TabsTrigger
                  value="cities"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.cities")}
                </TabsTrigger>
                <TabsTrigger
                  value="schools"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Medal className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.schools")}
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.students")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cities">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      {t("compete.cityRankings")} - {activeChallenge?.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {cityLeaderboard.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <Badge
                              variant="outline"
                              className="gap-1 text-green-600 bg-green-500/10 border-green-500/20 hidden md:flex"
                            >
                              <TrendingUp className="h-3 w-3" />
                              {entry.change}
                            </Badge>
                            <div className="text-sm sm:text-lg font-bold text-primary tabular-nums">
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
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      {t("compete.schoolRankings")} - {activeChallenge?.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {schoolLeaderboard.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {entry.city}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary tabular-nums flex-shrink-0">
                            {entry.points.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      {t("compete.studentRankings")} - {activeChallenge?.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {studentLeaderboard.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {entry.school}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary tabular-nums flex-shrink-0">
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

          {/* === LAST MONTH CONTENT === */}
          <TabsContent value="lastMonth">
            <Tabs defaultValue="cities" className="space-y-6 sm:space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-1.5 bg-card/50 backdrop-blur-sm p-1.5 border border-border/50 rounded-xl">
                <TabsTrigger
                  value="cities"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.cities")}
                </TabsTrigger>
                <TabsTrigger
                  value="schools"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Medal className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.schools")}
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.students")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cities">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      {t("compete.cityRankings")} - {lastChallengeTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {lastMonthCityLeaderboard.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <div className="text-sm sm:text-lg font-bold text-primary tabular-nums">
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
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                      <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      {t("compete.lastWinnersRanking")}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {lastChallengeTitle}
                    </p>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {lastMonthWinners.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 mb-0 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-lg text-foreground truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {entry.city}
                              </div>
                              <Badge
                                variant="secondary"
                                className="mt-1 text-[10px] sm:text-xs bg-secondary/50 truncate max-w-full"
                              >
                                {entry.achievement}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary sm:self-center pl-2 sm:pl-0 flex-shrink-0 tabular-nums">
                            {entry.score.toLocaleString()}{" "}
                            <span className="hidden sm:inline">
                              {t("compete.points")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      {t("compete.studentRankings")} - {lastChallengeTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {lastMonthStudentLeaderboard.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {entry.school}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary tabular-nums flex-shrink-0">
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

          {/* === ALL TIME CONTENT === */}
          <TabsContent value="allTime">
            <Tabs defaultValue="cities" className="space-y-6 sm:space-y-8">
              <TabsList className="grid grid-cols-3 h-auto gap-1.5 bg-card/50 backdrop-blur-sm p-1.5 border border-border/50 rounded-xl">
                <TabsTrigger
                  value="cities"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.cities")}
                </TabsTrigger>
                <TabsTrigger
                  value="schools"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Medal className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.schools")}
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="flex gap-1.5 p-2 text-[10px] sm:text-sm h-auto rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("compete.students")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cities">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      {t("compete.allTimeRankings")} ({t("compete.cities")})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {allTimeCityLeaderboard.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <div className="text-sm sm:text-lg font-bold text-primary tabular-nums">
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
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      {t("compete.allTimeRankings")} ({t("compete.schools")})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {allTimeWins.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm sm:text-lg font-bold text-primary tabular-nums flex-shrink-0">
                            {entry.wins}
                            <span className="text-[10px] sm:text-sm font-medium text-muted-foreground">
                              {t("compete.wins")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      {t("compete.allTimeRankings")} ({t("compete.students")})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {allTimeStudentLeaderboard.map((entry, index) => (
                        <div
                          key={entry.rank}
                          className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-6 sm:w-12 flex justify-center text-sm sm:text-base">
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                                {entry.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {entry.school}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold text-primary tabular-nums flex-shrink-0">
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
        </Tabs>
      </div>
    </div>
  );
};

export default Compete;
