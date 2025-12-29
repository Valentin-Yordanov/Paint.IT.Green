import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Droplets, Wind, Heart, Recycle, Users, Leaf, Sun, Mountain, Fish, Bird, Flower2, Globe, Lightbulb, BookOpen, Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Learn = () => {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    {
      id: "wildlife",
      title: "Wildlife Protection",
      icon: Heart,
      content: [
        {
          subtitle: "Why Every Animal Matters",
          text: "Every creature, from the smallest insect to the largest whale, plays a crucial role in our ecosystem. When one species disappears, it affects the entire food chain and can have devastating consequences for our planet.",
        },
        {
          subtitle: "How You Can Help",
          text: "Create wildlife-friendly spaces in your garden, avoid using harmful pesticides, support conservation organizations, and never litter in natural habitats. Small actions add up to big changes!",
        },
      ],
    },
    {
      id: "pollution",
      title: "Fighting Pollution",
      icon: Wind,
      content: [
        {
          subtitle: "The Impact of Pollution",
          text: "Pollution harms our air, water, and soil. It affects not just wildlife, but our own health too. Plastic waste, chemical runoff, and air pollution are some of the biggest threats to our environment.",
        },
        {
          subtitle: "Taking Action",
          text: "Reduce single-use plastics, properly dispose of waste, use eco-friendly products, and encourage others to do the same. Every piece of trash properly disposed of is one less threat to our planet.",
        },
      ],
    },
    {
      id: "recycling",
      title: "Recycling & Reusing",
      icon: Recycle,
      content: [
        {
          subtitle: "The Power of Recycling",
          text: "Recycling saves natural resources, reduces landfill waste, and conserves energy. When we recycle paper, we save trees. When we recycle plastic, we reduce ocean pollution.",
        },
        {
          subtitle: "How to Recycle Right",
          text: "Learn what can be recycled in your area, clean items before recycling, reduce waste by reusing items, and compost organic waste. Make recycling a daily habit!",
        },
      ],
    },
    {
      id: "forests",
      title: "Forest Conservation",
      icon: TreePine,
      content: [
        {
          subtitle: "Why Forests Matter",
          text: "Forests are the lungs of our planet. They produce oxygen, store carbon dioxide, provide homes for countless species, and help regulate our climate. Protecting forests is crucial for our survival.",
        },
        {
          subtitle: "What You Can Do",
          text: "Plant trees, use less paper, choose sustainable wood products, and support reforestation efforts. Even planting one tree makes a difference!",
        },
      ],
    },
    {
      id: "water",
      title: "Water Conservation",
      icon: Droplets,
      content: [
        {
          subtitle: "Water Is Precious",
          text: "Clean water is essential for all life on Earth. Yet, pollution and waste threaten our water sources. Only 3% of Earth's water is fresh water, and much of it is frozen in glaciers.",
        },
        {
          subtitle: "Save Water Daily",
          text: "Turn off taps when not in use, fix leaks, take shorter showers, and never pollute water sources. Every drop saved helps ensure water for future generations.",
        },
      ],
    },
    {
      id: "community",
      title: "Community Action",
      icon: Users,
      content: [
        {
          subtitle: "Stronger Together",
          text: "Individual actions are important, but when communities work together, we can achieve amazing things. Organize clean-up events, start recycling programs, and inspire others to join the cause.",
        },
        {
          subtitle: "Getting Involved",
          text: "Talk to your teachers about starting environmental projects, join or create eco-clubs, participate in community clean-ups, and share what you learn with friends and family.",
        },
      ],
    },
    {
      id: "climate",
      title: "Climate Change",
      icon: Sun,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "biodiversity",
      title: "Biodiversity",
      icon: Leaf,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "mountains",
      title: "Mountain Ecosystems",
      icon: Mountain,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "oceans",
      title: "Ocean Life",
      icon: Fish,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "birds",
      title: "Bird Conservation",
      icon: Bird,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "gardens",
      title: "Sustainable Gardens",
      icon: Flower2,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "global",
      title: "Global Initiatives",
      icon: Globe,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "energy",
      title: "Green Energy",
      icon: Lightbulb,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "education",
      title: "Eco Education",
      icon: BookOpen,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
    {
      id: "agriculture",
      title: "Sustainable Farming",
      icon: Sprout,
      content: [
        { subtitle: "Coming Soon", text: "Content will be added here." },
      ],
    },
  ];

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

        {/* 4-column grid of topic buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-sm border-2 transition-all aspect-square shadow-sm hover:shadow-md ${
                selectedTopic === topic.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card border-border hover:border-primary/50 hover:bg-accent/50"
              }`}
            >
              <topic.icon className="h-6 w-6" />
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