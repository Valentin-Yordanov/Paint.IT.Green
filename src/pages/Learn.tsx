import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TreePine,
  Droplets,
  Wind,
  Heart,
  Recycle,
  Users,
  Leaf,
  Sun,
  Mountain,
  Fish,
  Bird,
  Flower2,
  Globe,
  Lightbulb,
  BookOpen,
  Sprout,
  Search,
  X,
  GraduationCap,
  ArrowRight,
  ArrowUp,
  Youtube,
  Gamepad2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, MouseEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RecyclingGame from "@/components/RecyclingGame";
import ForestGame from "@/components/ForestGame";

const Learn = () => {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Game state: supports 'recycling', 'forests', or null (no game)
  const [activeGame, setActiveGame] = useState<"recycling" | "forests" | null>(
    null,
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const topics = [
    {
      id: "wildlife",
      title: t("learn.topic.wildlife.title"),
      videoUrl: "https://youtu.be/K6NZfFrZqFI",
      icon: Heart,
      gradient: "from-rose-500 to-pink-600",
      content: [
        {
          subtitle: t("learn.topic.wildlife.subtitle1"),
          text: t("learn.topic.wildlife.text1"),
        },
        {
          subtitle: t("learn.topic.wildlife.subtitle2"),
          text: t("learn.topic.wildlife.text2"),
        },
      ],
    },
    {
      id: "pollution",
      title: t("learn.topic.pollution.title"),
      videoUrl: "https://youtu.be/Jle_IxxnDfE",
      icon: Wind,
      gradient: "from-slate-500 to-gray-600",
      content: [
        {
          subtitle: t("learn.topic.pollution.subtitle1"),
          text: t("learn.topic.pollution.text1"),
        },
        {
          subtitle: t("learn.topic.pollution.subtitle2"),
          text: t("learn.topic.pollution.text2"),
        },
      ],
    },
    {
      id: "recycling",
      title: t("learn.topic.recycling.title"),
      videoUrl: "https://youtu.be/tELRizk6G7E",
      icon: Recycle,
      gradient: "from-emerald-500 to-teal-600",
      content: [
        {
          subtitle: t("learn.topic.recycling.subtitle1"),
          text: t("learn.topic.recycling.text1"),
        },
        {
          subtitle: t("learn.topic.recycling.subtitle2"),
          text: t("learn.topic.recycling.text2"),
        },
      ],
    },
    {
      id: "forests",
      title: t("learn.topic.forests.title"),
      videoUrl: "https://youtu.be/6577tb-n6yQ",
      icon: TreePine,
      gradient: "from-green-600 to-emerald-700",
      content: [
        {
          subtitle: t("learn.topic.forests.subtitle1"),
          text: t("learn.topic.forests.text1"),
        },
        {
          subtitle: t("learn.topic.forests.subtitle2"),
          text: t("learn.topic.forests.text2"),
        },
      ],
    },
    {
      id: "water",
      title: t("learn.topic.water.title"),
      icon: Droplets,
      gradient: "from-sky-500 to-blue-600",
      content: [
        {
          subtitle: t("learn.topic.water.subtitle1"),
          text: t("learn.topic.water.text1"),
        },
        {
          subtitle: t("learn.topic.water.subtitle2"),
          text: t("learn.topic.water.text2"),
        },
      ],
    },
    {
      id: "community",
      title: t("learn.topic.community.title"),
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      content: [
        {
          subtitle: t("learn.topic.community.subtitle1"),
          text: t("learn.topic.community.text1"),
        },
        {
          subtitle: t("learn.topic.community.subtitle2"),
          text: t("learn.topic.community.text2"),
        },
      ],
    },
    {
      id: "climate",
      title: t("learn.topic.climate.title"),
      icon: Sun,
      gradient: "from-amber-500 to-orange-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "biodiversity",
      title: t("learn.topic.biodiversity.title"),
      icon: Leaf,
      gradient: "from-lime-500 to-green-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "mountains",
      title: t("learn.topic.mountains.title"),
      icon: Mountain,
      gradient: "from-stone-500 to-slate-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "oceans",
      title: t("learn.topic.oceans.title"),
      icon: Fish,
      gradient: "from-cyan-500 to-teal-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "birds",
      title: t("learn.topic.birds.title"),
      icon: Bird,
      gradient: "from-indigo-500 to-blue-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "gardens",
      title: t("learn.topic.gardens.title"),
      icon: Flower2,
      gradient: "from-pink-500 to-rose-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "global",
      title: t("learn.topic.global.title"),
      icon: Globe,
      gradient: "from-blue-500 to-indigo-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "energy",
      title: t("learn.topic.energy.title"),
      icon: Lightbulb,
      gradient: "from-yellow-500 to-amber-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "education",
      title: t("learn.topic.education.title"),
      icon: BookOpen,
      gradient: "from-teal-500 to-cyan-600",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
    {
      id: "agriculture",
      title: t("learn.topic.agriculture.title"),
      icon: Sprout,
      gradient: "from-lime-600 to-green-700",
      content: [
        {
          subtitle: t("learn.topic.comingSoon"),
          text: t("learn.topic.comingSoonText"),
        },
      ],
    },
  ];

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedTopicData = topics.find((t) => t.id === selectedTopic);

  useEffect(() => {
    if (selectedTopic && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [selectedTopic]);

  const handleClosePanel = () => {
    setSelectedTopic(null);
    setActiveGame(null); // Reset game state
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGridMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.getElementsByClassName(
      "spotlight-card-wrapper",
    );
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />

      {/* Hero Section */}
      <div className="relative pt-20 pb-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl mb-4">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("learn.title")}
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("learn.subtitle")}
            </p>

            <div className="relative max-w-xl mx-auto pt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("learn.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-6 h-16 rounded-2xl bg-card/90 backdrop-blur-md border-border/50 shadow-2xl text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative pb-16">
        {/* Topic Grid */}
        <div
          ref={gridRef}
          onMouseMove={handleGridMouseMove}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-12 group/grid"
        >
          {filteredTopics.map((topic, index) => {
            const isSelected = selectedTopic === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(isSelected ? null : topic.id)}
                className="spotlight-card-wrapper relative rounded-2xl aspect-square focus:outline-none group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover/grid:opacity-100 transition duration-500"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.4), transparent 40%)`,
                  }}
                />

                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-br ${topic.gradient} shadow-2xl scale-95 ring-4 ring-primary/20`
                      : "bg-gradient-to-br from-border/50 to-border/20"
                  }`}
                />

                <div
                  className={`
                    relative h-full w-full rounded-[15px] m-[1px] 
                    flex flex-col items-center justify-center gap-4 p-4 
                    overflow-hidden transition-all duration-300
                    ${
                      isSelected
                        ? "bg-transparent text-white"
                        : "bg-card/95 backdrop-blur-sm hover:bg-card/80"
                    }
                  `}
                >
                  {!isSelected && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                      style={{
                        background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.1), transparent 40%)`,
                      }}
                    />
                  )}

                  <div
                    className={`relative h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "bg-white/20 backdrop-blur-sm scale-110"
                        : `bg-gradient-to-br ${topic.gradient} shadow-lg group-hover:scale-110 group-hover:shadow-xl`
                    }`}
                  >
                    <topic.icon className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <span
                    className={`text-sm font-semibold text-center leading-tight transition-colors duration-300 ${
                      isSelected
                        ? "text-white"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {topic.title}
                  </span>

                  {isSelected && (
                    <div className="absolute bottom-3 right-3">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Topic Content Panel */}
        {selectedTopicData && (
          <div ref={panelRef} className="scroll-mt-24">
            <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-md animate-in fade-in-50 slide-in-from-bottom-4 duration-500 overflow-hidden">
              <div
                className={`h-1.5 bg-gradient-to-r ${selectedTopicData.gradient}`}
              />

              <CardHeader className="pb-6 pt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div
                      className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${selectedTopicData.gradient} flex items-center justify-center shadow-xl`}
                    >
                      <selectedTopicData.icon className="h-8 w-8 text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">
                        {selectedTopicData.title}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">
                        Explore and learn more
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-secondary h-12 w-12"
                    onClick={handleClosePanel}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 pb-10">
                {/* GAME RENDERING LOGIC */}
                {activeGame === "recycling" ? (
                  <RecyclingGame onClose={() => setActiveGame(null)} />
                ) : activeGame === "forests" ? (
                  <ForestGame onClose={() => setActiveGame(null)} />
                ) : (
                  <>
                    {/* Standard Text Content */}
                    {selectedTopicData.content.map((section, index) => (
                      <div
                        key={index}
                        className="relative pl-6 border-l-2 border-primary/30 hover:border-primary/60 transition-colors duration-300"
                      >
                        <div className="absolute left-0 top-0 w-2 h-2 -translate-x-[5px] rounded-full bg-primary/50" />
                        <h3 className="text-xl font-bold text-foreground mb-3">
                          {section.subtitle}
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {section.text}
                        </p>
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4 border-t border-border/50 mt-8">
                      <Button
                        asChild
                        className="gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                        size="lg"
                      >
                        <a
                          href={selectedTopicData.videoUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Youtube className="h-5 w-5" />
                          {t("learn.watchVideo") || "Watch Video"}
                        </a>
                      </Button>

                      {/* GAME 1: RECYCLING BUTTON */}
                      {selectedTopic === "recycling" && (
                        <Button
                          onClick={() => setActiveGame("recycling")}
                          className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all "
                          size="lg"
                        >
                          <Gamepad2 className="h-5 w-5" />
                          Play & Learn
                        </Button>
                      )}

                      {/* GAME 2: FOREST BUTTON */}
                      {selectedTopic === "forests" && (
                        <Button
                          onClick={() => setActiveGame("forests")}
                          className="gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all "
                          size="lg"
                        >
                          <Gamepad2 className="h-5 w-5" />
                          Protect Forest
                        </Button>
                      )}

                      <Button
                        onClick={handleClosePanel}
                        className={`gap-2 rounded-xl bg-gradient-to-r ${selectedTopicData.gradient} text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all`}
                        size="lg"
                      >
                        <ArrowUp className="h-4 w-4" />
                        {t("Back to Topics")}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedTopic && (
          <Card className="mt-16 border-0 shadow-2xl overflow-hidden group">
            <div className="relative bg-gradient-to-r from-primary via-primary/90 to-accent p-12 text-center overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                  <Leaf className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                  {t("learn.remember")}
                </h2>

                <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
                  {t("learn.rememberText")}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Learn;
