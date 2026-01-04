import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TreePine, Droplets, Wind, Heart, Recycle, Users, Leaf, Sun, Mountain, Fish, Bird, Flower2, Globe, Lightbulb, BookOpen, Sprout, Search, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, MouseEvent } from "react";
import { Button } from "@/components/ui/button";

const Learn = () => {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const topics = [
    { id: "wildlife", title: t('learn.topic.wildlife.title'), icon: Heart, gradient: "from-rose-500 to-pink-600", content: [
      { subtitle: t('learn.topic.wildlife.subtitle1'), text: t('learn.topic.wildlife.text1') },
      { subtitle: t('learn.topic.wildlife.subtitle2'), text: t('learn.topic.wildlife.text2') },
    ]},
    { id: "pollution", title: t('learn.topic.pollution.title'), icon: Wind, gradient: "from-slate-500 to-gray-600", content: [
      { subtitle: t('learn.topic.pollution.subtitle1'), text: t('learn.topic.pollution.text1') },
      { subtitle: t('learn.topic.pollution.subtitle2'), text: t('learn.topic.pollution.text2') },
    ]},
    { id: "recycling", title: t('learn.topic.recycling.title'), icon: Recycle, gradient: "from-emerald-500 to-teal-600", content: [
      { subtitle: t('learn.topic.recycling.subtitle1'), text: t('learn.topic.recycling.text1') },
      { subtitle: t('learn.topic.recycling.subtitle2'), text: t('learn.topic.recycling.text2') },
    ]},
    { id: "forests", title: t('learn.topic.forests.title'), icon: TreePine, gradient: "from-green-600 to-emerald-700", content: [
      { subtitle: t('learn.topic.forests.subtitle1'), text: t('learn.topic.forests.text1') },
      { subtitle: t('learn.topic.forests.subtitle2'), text: t('learn.topic.forests.text2') },
    ]},
    { id: "water", title: t('learn.topic.water.title'), icon: Droplets, gradient: "from-sky-500 to-blue-600", content: [
      { subtitle: t('learn.topic.water.subtitle1'), text: t('learn.topic.water.text1') },
      { subtitle: t('learn.topic.water.subtitle2'), text: t('learn.topic.water.text2') },
    ]},
    { id: "community", title: t('learn.topic.community.title'), icon: Users, gradient: "from-violet-500 to-purple-600", content: [
      { subtitle: t('learn.topic.community.subtitle1'), text: t('learn.topic.community.text1') },
      { subtitle: t('learn.topic.community.subtitle2'), text: t('learn.topic.community.text2') },
    ]},
    { id: "climate", title: t('learn.topic.climate.title'), icon: Sun, gradient: "from-amber-500 to-orange-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "biodiversity", title: t('learn.topic.biodiversity.title'), icon: Leaf, gradient: "from-lime-500 to-green-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "mountains", title: t('learn.topic.mountains.title'), icon: Mountain, gradient: "from-stone-500 to-slate-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "oceans", title: t('learn.topic.oceans.title'), icon: Fish, gradient: "from-cyan-500 to-teal-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "birds", title: t('learn.topic.birds.title'), icon: Bird, gradient: "from-indigo-500 to-blue-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "gardens", title: t('learn.topic.gardens.title'), icon: Flower2, gradient: "from-pink-500 to-rose-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "global", title: t('learn.topic.global.title'), icon: Globe, gradient: "from-blue-500 to-indigo-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "energy", title: t('learn.topic.energy.title'), icon: Lightbulb, gradient: "from-yellow-500 to-amber-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "education", title: t('learn.topic.education.title'), icon: BookOpen, gradient: "from-teal-500 to-cyan-600", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
    { id: "agriculture", title: t('learn.topic.agriculture.title'), icon: Sprout, gradient: "from-lime-600 to-green-700", content: [{ subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') }] },
  ];

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopicData = topics.find((t) => t.id === selectedTopic);

  const handleGridMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.getElementsByClassName("spotlight-card-wrapper");
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
      
      <div className="container relative py-16">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Environmental Education</span> ------------------------------------------------------------- Gotin efect
          </div> */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('learn.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('learn.subtitle')}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-10 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('learn.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 shadow-lg text-lg focus:border-primary transition-all"
          />
        </div>
        
        {/* Topic Grid */}
        <div 
          ref={gridRef}
          onMouseMove={handleGridMouseMove}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10 group/grid"
        >
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(isSelected ? null : topic.id)}
                className="spotlight-card-wrapper relative rounded-2xl aspect-square focus:outline-none group"
              >
                {/* Spotlight glow effect */}
                <div 
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover/grid:opacity-100 transition duration-500"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.4), transparent 40%)`
                  }}
                />
                
                {/* Card background */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isSelected 
                    ? `bg-gradient-to-br ${topic.gradient}` 
                    : "bg-secondary/50"
                }`} />
                
                {/* Card content */}
                <div 
                  className={`
                    relative h-full w-full rounded-2xl m-[1px] 
                    flex flex-col items-center justify-center gap-3 p-4 
                    overflow-hidden transition-all duration-300
                    ${isSelected 
                      ? "bg-transparent text-white" 
                      : "bg-card/95 backdrop-blur-sm hover:bg-card/80"
                    }
                  `}
                >
                  {/* Inner glow on hover */}
                  {!isSelected && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                      style={{
                        background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.1), transparent 40%)`
                      }}
                    />
                  )}

                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : `bg-gradient-to-br ${topic.gradient} shadow-lg group-hover:scale-110`
                  }`}>
                    <topic.icon className={`h-7 w-7 ${isSelected ? "text-white" : "text-white"}`} />
                  </div>
                  
                  <span className={`text-sm font-semibold text-center leading-tight ${
                    isSelected ? "text-white" : "text-foreground"
                  }`}>
                    {topic.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Topic Content */}
        {selectedTopicData && (
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-bottom-4 duration-500 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${selectedTopicData.gradient}`} />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${selectedTopicData.gradient} flex items-center justify-center shadow-lg`}>
                    <selectedTopicData.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-3xl">{selectedTopicData.title}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-secondary"
                  onClick={() => setSelectedTopic(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pb-8">
              {selectedTopicData.content.map((section, index) => (
                <div key={index} className="space-y-3 pl-4 border-l-2 border-primary/30">
                  <h3 className="text-xl font-bold text-foreground">
                    {section.subtitle}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Call to Action Card */}
        <Card className="mt-16 border-0 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-10 text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-foreground">{t('learn.remember')}</h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              {t('learn.rememberText')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Learn;