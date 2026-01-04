import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Users, Recycle, TreePine, ArrowRight, Sparkles } from "lucide-react";
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
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Trophy,
      title: t('home.feature2.title'),
      description: t('home.feature2.desc'),
      link: "/compete",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Users,
      title: t('home.feature3.title'),
      description: t('home.feature3.desc'),
      link: "/community",
      gradient: "from-sky-500 to-blue-600",
    },
  ];

  const stats = [
    { icon: TreePine, value: "10,000+", label: t('home.stats.trees'), color: "text-emerald-500" },
    { icon: Recycle, value: "50+", label: t('home.stats.schools'), color: "text-sky-500" },
    { icon: Users, value: "5,000+", label: t('home.stats.students'), color: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-primary/20" />
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container relative z-10 py-20">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              {t('home.hero.title')}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> {t('home.hero.title.highlight')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/learn">
                <Button size="lg" className="gap-2 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/80">
                  <BookOpen className="h-5 w-5" />
                  {t('home.hero.start')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/compete">
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-lg rounded-xl backdrop-blur-sm bg-background/50 border-primary/30 hover:bg-primary/10 transition-all hover:scale-105">
                  <Trophy className="h-5 w-5" />
                  {t('home.hero.view')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="group">
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8 space-y-6 relative">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                    
                    <div className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="bg-gradient-to-br from-card via-card to-secondary/50 rounded-3xl p-12 shadow-xl border border-border/50">
            <div className="grid md:grid-cols-3 gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-4 group">
                  <div className="flex justify-center">
                    <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`h-10 w-10 ${stat.color}`} />
                    </div>
                  </div>
                  <div className={`text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent`}>{stat.value}</div>
                  <div className="text-lg text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
