import { Heart, Lightbulb, HandHeart, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const OurValues = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <Heart className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('ourValues.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('ourValues.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('ourValues.whatWeStandFor')}</h2>
            <p className="text-muted-foreground text-lg mb-4">
              {t('ourValues.whatWeStandForText')}
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">{t('ourValues.education')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('ourValues.educationText')}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t('ourValues.educationPoint1')}</li>
                    <li>• {t('ourValues.educationPoint2')}</li>
                    <li>• {t('ourValues.educationPoint3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Sprout className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">{t('ourValues.action')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('ourValues.actionText')}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t('ourValues.actionPoint1')}</li>
                    <li>• {t('ourValues.actionPoint2')}</li>
                    <li>• {t('ourValues.actionPoint3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Heart className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">{t('ourValues.compassion')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('ourValues.compassionText')}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t('ourValues.compassionPoint1')}</li>
                    <li>• {t('ourValues.compassionPoint2')}</li>
                    <li>• {t('ourValues.compassionPoint3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <HandHeart className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">{t('ourValues.collaboration')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('ourValues.collaborationText')}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {t('ourValues.collaborationPoint1')}</li>
                    <li>• {t('ourValues.collaborationPoint2')}</li>
                    <li>• {t('ourValues.collaborationPoint3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">{t('ourValues.livingValues')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('ourValues.livingValuesText')}
            </p>
            <p className="text-muted-foreground">
              {t('ourValues.livingValuesText2')}
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">{t('ourValues.joinMission')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('ourValues.joinMissionText')}
            </p>
            <Link to="/about">
              <Button size="lg">{t('ourValues.learnMore')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurValues;