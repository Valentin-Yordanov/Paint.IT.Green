import { Target, BookOpen, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const OurGoal = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <Target className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('ourGoal.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('ourGoal.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('ourGoal.breaking')}</h2>
            <p className="text-muted-foreground text-lg mb-4">
              {t('ourGoal.breakingText')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg p-6">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{t('ourGoal.freeResources')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourGoal.freeResourcesDesc')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{t('ourGoal.globalReach')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourGoal.globalReachDesc')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{t('ourGoal.inclusiveLearning')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourGoal.inclusiveLearningDesc')}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">{t('ourGoal.vision')}</h2>
            <p className="text-muted-foreground text-lg mb-4">
              {t('ourGoal.visionText')}
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">{t('ourGoal.joinMission')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('ourGoal.joinMissionText')}
            </p>
            <Link to="/learn">
              <Button size="lg">{t('ourGoal.startLearning')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurGoal;