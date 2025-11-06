import { Leaf, Target, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('about.mission')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('about.missionText1')}
            </p>
            <p className="text-muted-foreground">
              {t('about.missionText2')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Link to="/our-goal" className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Target className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Our Goal</h3>
              <p className="text-sm text-muted-foreground">Making environmental education accessible to every student worldwide</p>
            </Link>
            <Link to="/our-community" className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Our Community</h3>
              <p className="text-sm text-muted-foreground">Connecting schools and students across the globe</p>
            </Link>
            <Link to="/our-impact" className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Leaf className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Our Impact</h3>
              <p className="text-sm text-muted-foreground">Real environmental change through collective action</p>
            </Link>
            <Link to="/our-values" className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <Heart className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Our Values</h3>
              <p className="text-sm text-muted-foreground">Education, action, and compassion for all living things</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
