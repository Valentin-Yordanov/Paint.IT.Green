import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Users, Leaf, Recycle, TreePine } from "lucide-react";
import heroImage from "@/assets/hero-nature.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: BookOpen,
      title: t('home.feature1.title'),
      description: t('home.feature1.desc'),
      link: "/learn",
    },
    {
      icon: Trophy,
      title: t('home.feature2.title'),
      description: t('home.feature2.desc'),
      link: "/compete",
    },
    {
      icon: Users,
      title: t('home.feature3.title'),
      description: t('home.feature3.desc'),
      link: "/community",
    },
  ];

  const stats = [
    { icon: TreePine, value: "10,000+", label: t('home.stats.trees') },
    { icon: Recycle, value: "50+", label: t('home.stats.schools') },
    { icon: Users, value: "5,000+", label: t('home.stats.students') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>
        
        <div className="container relative z-10 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              {t('home.hero.title')}
              <span className="text-primary"> {t('home.hero.title.highlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/learn">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t('home.hero.start')}
                </Button>
              </Link>
              <Link to="/compete">
                <Button size="lg" variant="outline" className="gap-2">
                  <Trophy className="h-5 w-5" />
                  {t('home.hero.view')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
