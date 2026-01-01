import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TreePine, Droplets, Wind, Heart, Recycle, Users, Leaf, Sun, Mountain, Fish, Bird, Flower2, Globe, Lightbulb, BookOpen, Sprout, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Learn = () => {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const topics = [
    {
      id: "wildlife",
      title: t('learn.topics.wildlife.title'),
      icon: Heart,
      content: [
        {
          subtitle: t('learn.topics.wildlife.content1.subtitle'),
          text: t('learn.topics.wildlife.content1.text'),
        },
        {
          subtitle: t('learn.topics.wildlife.content2.subtitle'),
          text: t('learn.topics.wildlife.content2.text'),
        },
      ],
    },
    {
      id: "pollution",
      title: t('learn.topics.pollution.title'),
      icon: Wind,
      content: [
        {
          subtitle: t('learn.topics.pollution.content1.subtitle'),
          text: t('learn.topics.pollution.content1.text'),
        },
        {
          subtitle: t('learn.topics.pollution.content2.subtitle'),
          text: t('learn.topics.pollution.content2.text'),
        },
      ],
    },
    {
      id: "recycling",
      title: t('learn.topics.recycling.title'),
      icon: Recycle,
      content: [
        {
          subtitle: t('learn.topics.recycling.content1.subtitle'),
          text: t('learn.topics.recycling.content1.text'),
        },
        {
          subtitle: t('learn.topics.recycling.content2.subtitle'),
          text: t('learn.topics.recycling.content2.text'),
        },
      ],
    },
    {
      id: "forests",
      title: t('learn.topics.forests.title'),
      icon: TreePine,
      content: [
        {
          subtitle: t('learn.topics.forests.content1.subtitle'),
          text: t('learn.topics.forests.content1.text'),
        },
        {
          subtitle: t('learn.topics.forests.content2.subtitle'),
          text: t('learn.topics.forests.content2.text'),
        },
      ],
    },
    {
      id: "water",
      title: t('learn.topics.water.title'),
      icon: Droplets,
      content: [
        {
          subtitle: t('learn.topics.water.content1.subtitle'),
          text: t('learn.topics.water.content1.text'),
        },
        {
          subtitle: t('learn.topics.water.content2.subtitle'),
          text: t('learn.topics.water.content2.text'),
        },
      ],
    },
    {
      id: "community",
      title: t('learn.topics.community.title'),
      icon: Users,
      content: [
        {
          subtitle: t('learn.topics.community.content1.subtitle'),
          text: t('learn.topics.community.content1.text'),
        },
        {
          subtitle: t('learn.topics.community.content2.subtitle'),
          text: t('learn.topics.community.content2.text'),
        },
      ],
    },
    {
      id: "climate",
      title: t('learn.topics.climate.title'),
      icon: Sun,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "biodiversity",
      title: t('learn.topics.biodiversity.title'),
      icon: Leaf,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "mountains",
      title: t('learn.topics.mountains.title'),
      icon: Mountain,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "oceans",
      title: t('learn.topics.oceans.title'),
      icon: Fish,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "birds",
      title: t('learn.topics.birds.title'),
      icon: Bird,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "gardens",
      title: t('learn.topics.gardens.title'),
      icon: Flower2,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "global",
      title: t('learn.topics.global.title'),
      icon: Globe,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "energy",
      title: t('learn.topics.energy.title'),
      icon: Lightbulb,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "education",
      title: t('learn.topics.education.title'),
      icon: BookOpen,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
    {
      id: "agriculture",
      title: t('learn.topics.agriculture.title'),
      icon: Sprout,
      content: [
        { subtitle: t('learn.topics.comingSoon'), text: t('learn.topics.comingSoonText') },
      ],
    },
  ];

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopicData = topics.find((t) => t.id === selectedTopic);

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

        {/* 4-column grid of topic buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {filteredTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-sm border-2 transition-all aspect-square shadow-sm hover:shadow-md ${
                selectedTopic === topic.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card border-border hover:border-primary/50 hover:bg-accent/50"
              }`}
            >
              <topic.icon className="h-7 w-7" />
              <span className="text-xs font-semibold text-center leading-tight">{topic.title}</span>
            </button>
          ))}
        </div>

        {/* Content panel - only shown when a topic is selected */}
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