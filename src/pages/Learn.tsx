import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TreePine, Droplets, Wind, Heart, Recycle, Users, Leaf, Sun, Mountain, Fish, Bird, Flower2, Globe, Lightbulb, BookOpen, Sprout, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect, MouseEvent } from "react";

// Helper component for the Spotlight Effect
const SpotlightCard = ({ 
  children, 
  onClick, 
  className = "", 
  isSelected = false 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  className?: string;
  isSelected?: boolean;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer group ${className}`}
    >
      {/* OUTER GLOW (The Border) 
        This sits behind the content. The "inset" effect is created by the content div
        being 1px smaller, revealing this layer as a border.
        The gradient tracks the mouse.
      */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(34, 197, 94, 0.4), transparent 40%)`,
        }}
      />

      {/* OUTER CONTAINER BACKGROUND
        This is the "lighter gray" (or lighter theme color) wrapper mentioned.
        It provides the base border color when the glow isn't present.
      */}
      <div className={`absolute inset-0 rounded-xl transition-colors duration-300 ${isSelected ? "bg-primary" : "bg-secondary/40"}`} />

      {/* INNER CONTENT
        This is inset by 1px (m-[1px]) to create the border effect.
        It contains the Inner Glow and the actual content.
      */}
      <div className={`relative flex h-full flex-col items-center justify-center gap-1 rounded-xl m-[1px] bg-card p-2 transition-colors duration-300 ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent/30"}`}>
        
        {/* INNER GLOW (Faint) - Only shows on current hover */}
        {!isSelected && (
           <div
           className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-xl"
           style={{
             background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(34, 197, 94, 0.1), transparent 40%)`,
           }}
         />
        )}

        {children}
      </div>
    </div>
  );
};


const Learn = () => {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Ref for the grid container to calculate shared mouse position
  const gridRef = useRef<HTMLDivElement>(null);

  const topics = [
    {
      id: "wildlife",
      title: t('learn.topic.wildlife.title'),
      icon: Heart,
      content: [
        { subtitle: t('learn.topic.wildlife.subtitle1'), text: t('learn.topic.wildlife.text1') },
        { subtitle: t('learn.topic.wildlife.subtitle2'), text: t('learn.topic.wildlife.text2') },
      ],
    },
    {
      id: "pollution",
      title: t('learn.topic.pollution.title'),
      icon: Wind,
      content: [
        { subtitle: t('learn.topic.pollution.subtitle1'), text: t('learn.topic.pollution.text1') },
        { subtitle: t('learn.topic.pollution.subtitle2'), text: t('learn.topic.pollution.text2') },
      ],
    },
    {
      id: "recycling",
      title: t('learn.topic.recycling.title'),
      icon: Recycle,
      content: [
        { subtitle: t('learn.topic.recycling.subtitle1'), text: t('learn.topic.recycling.text1') },
        { subtitle: t('learn.topic.recycling.subtitle2'), text: t('learn.topic.recycling.text2') },
      ],
    },
    {
      id: "forests",
      title: t('learn.topic.forests.title'),
      icon: TreePine,
      content: [
        { subtitle: t('learn.topic.forests.subtitle1'), text: t('learn.topic.forests.text1') },
        { subtitle: t('learn.topic.forests.subtitle2'), text: t('learn.topic.forests.text2') },
      ],
    },
    {
      id: "water",
      title: t('learn.topic.water.title'),
      icon: Droplets,
      content: [
        { subtitle: t('learn.topic.water.subtitle1'), text: t('learn.topic.water.text1') },
        { subtitle: t('learn.topic.water.subtitle2'), text: t('learn.topic.water.text2') },
      ],
    },
    {
      id: "community",
      title: t('learn.topic.community.title'),
      icon: Users,
      content: [
        { subtitle: t('learn.topic.community.subtitle1'), text: t('learn.topic.community.text1') },
        { subtitle: t('learn.topic.community.subtitle2'), text: t('learn.topic.community.text2') },
      ],
    },
    {
      id: "climate",
      title: t('learn.topic.climate.title'),
      icon: Sun,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "biodiversity",
      title: t('learn.topic.biodiversity.title'),
      icon: Leaf,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "mountains",
      title: t('learn.topic.mountains.title'),
      icon: Mountain,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "oceans",
      title: t('learn.topic.oceans.title'),
      icon: Fish,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "birds",
      title: t('learn.topic.birds.title'),
      icon: Bird,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "gardens",
      title: t('learn.topic.gardens.title'),
      icon: Flower2,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "global",
      title: t('learn.topic.global.title'),
      icon: Globe,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "energy",
      title: t('learn.topic.energy.title'),
      icon: Lightbulb,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "education",
      title: t('learn.topic.education.title'),
      icon: BookOpen,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
    {
      id: "agriculture",
      title: t('learn.topic.agriculture.title'),
      icon: Sprout,
      content: [ { subtitle: t('learn.topic.comingSoon'), text: t('learn.topic.comingSoonText') } ],
    },
  ];

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopicData = topics.find((t) => t.id === selectedTopic);

  // LOGIC FOR THE "ALL CARDS" EFFECT:
  // When mouse moves over the grid, we update CSS variables on EVERY card
  // so the outer glow (border) knows where the mouse is relative to itself.
  const handleGridMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    
    // Select all cards using a data-attribute or class
    const cards = gridRef.current.getElementsByClassName("spotlight-card-wrapper");
    
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update CSS variables directly on the DOM element for performance
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('learn.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('learn.subtitle')}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('learn.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        
        <div 
          ref={gridRef}
          onMouseMove={handleGridMouseMove}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 group/grid"
        >
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(isSelected ? null : topic.id)}
                className="spotlight-card-wrapper relative rounded-xl aspect-square focus:outline-none"
              >
                <div 
                  className={`absolute -inset-px rounded-xl opacity-0 group-hover/grid:opacity-100 transition duration-500`}
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.6), transparent 40%)`
                  }}
                />
                <div className={`absolute inset-0 rounded-xl ${isSelected ? "bg-primary" : "bg-secondary/50"}`} />
                <div 
                  className={`
                    relative h-full w-full rounded-xl m-[1px] 
                    flex flex-col items-center justify-center gap-1 p-2 
                    bg-card overflow-hidden
                    ${isSelected ? "bg-primary text-primary-foreground" : ""}
                  `}
                >
                  {!isSelected && (
                    <div 
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500"
                      style={{
                        background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.15), transparent 40%)`
                      }}
                    />
                  )}

                  <topic.icon className="h-7 w-7 relative z-10" />
                  <span className="text-xs font-semibold text-center leading-tight relative z-10">{topic.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedTopicData && (
          <Card className="border-border bg-card animate-in fade-in-50 duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <selectedTopicData.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{selectedTopicData.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTopicData.content.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {section.subtitle}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="mt-12 bg-primary text-primary-foreground border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('learn.remember')}</h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              {t('learn.rememberText')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learn;