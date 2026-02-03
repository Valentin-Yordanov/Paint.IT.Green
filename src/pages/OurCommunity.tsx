import { Users, MessageSquare, Award, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const OurCommunity = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <Users className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('ourCommunity.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('ourCommunity.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('ourCommunity.globalNetwork')}</h2>
            <p className="text-muted-foreground text-lg mb-4">
              {t('ourCommunity.globalNetworkText')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-lg p-6">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{t('ourCommunity.shareConnect')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourCommunity.shareConnectDesc')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{t('ourCommunity.celebrateTogether')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourCommunity.celebrateTogetherDesc')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <HandHeart className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{t('ourCommunity.supportNetwork')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourCommunity.supportNetworkDesc')}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{t('ourCommunity.schoolPartnerships')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ourCommunity.schoolPartnershipsDesc')}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">{t('ourCommunity.impact')}</h2>
            <p className="text-muted-foreground text-lg mb-6">
              {t('ourCommunity.impactDesc')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">85</div>
                <div className="text-sm text-muted-foreground">{t('ourCommunity.countries')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500K+</div>
                <div className="text-sm text-muted-foreground">{t('ourCommunity.studentsCount')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">{t('ourCommunity.treesPlanted')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1K+</div>
                <div className="text-sm text-muted-foreground">{t('ourCommunity.events')}</div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">{t('ourCommunity.joinCommunity')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('ourCommunity.joinCommunityText')}
            </p>
            <Link to="/community">
              <Button size="lg">{t('ourCommunity.exploreCommunity')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurCommunity;