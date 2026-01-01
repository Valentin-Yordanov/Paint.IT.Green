import { Leaf, TrendingUp, TreeDeciduous, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const OurImpact = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <Leaf className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('ourImpact.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('ourImpact.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('ourImpact.measurableChange')}</h2>
            <p className="text-muted-foreground text-lg mb-4">
              {t('ourImpact.measurableChangeText')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-lg p-8">
              <TreeDeciduous className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">52,000+</div>
              <h3 className="font-semibold text-xl mb-2">{t('ourImpact.treesPlanted')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourImpact.treesPlantedText')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-8">
              <Droplets className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">2M+</div>
              <h3 className="font-semibold text-xl mb-2">{t('ourImpact.plasticRemoved')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourImpact.plasticRemovedText')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-8">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <h3 className="font-semibold text-xl mb-2">{t('ourImpact.behaviorChange')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourImpact.behaviorChangeText')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-8">
              <Leaf className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <h3 className="font-semibold text-xl mb-2">{t('ourImpact.schoolGardens')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourImpact.schoolGardensText')}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">{t('ourImpact.beyondNumbers')}</h2>
            <p className="text-muted-foreground text-lg mb-4">
              {t('ourImpact.beyondNumbersText')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">{t('ourImpact.studentStories')}</h3>
            <div className="space-y-4">
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                {t('ourImpact.story1')}
                <footer className="mt-2 not-italic font-semibold">{t('ourImpact.story1Author')}</footer>
              </blockquote>
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                {t('ourImpact.story2')}
                <footer className="mt-2 not-italic font-semibold">{t('ourImpact.story2Author')}</footer>
              </blockquote>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">{t('ourImpact.bePartOfImpact')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('ourImpact.bePartOfImpactText')}
            </p>
            <Link to="/compete">
              <Button size="lg">{t('ourImpact.startMakingImpact')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurImpact;