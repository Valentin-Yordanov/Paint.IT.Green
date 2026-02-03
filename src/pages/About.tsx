import { Leaf, Target, Users, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const { t } = useLanguage();

  const cards = [
    { to: "/our-goal", icon: Target, title: t('about.ourGoal'), desc: t('about.ourGoalDesc'), gradient: "from-emerald-500 to-teal-600" },
    { to: "/our-community", icon: Users, title: t('about.ourCommunity'), desc: t('about.ourCommunityDesc'), gradient: "from-sky-500 to-blue-600" },
    { to: "/our-impact", icon: Leaf, title: t('about.ourImpact'), desc: t('about.ourImpactDesc'), gradient: "from-amber-500 to-orange-600" },
    { to: "/our-values", icon: Heart, title: t('about.ourValues'), desc: t('about.ourValuesDesc'), gradient: "from-rose-500 to-pink-600" },
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t('about.title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">{t('about.mission')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.missionText1')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.missionText2')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <Link key={index} to={card.to} className="group">
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6 space-y-4 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                    
                    <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn more</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;