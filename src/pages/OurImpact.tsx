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
            <h2 className="text-3xl font-bold mb-4">Measurable Environmental Change</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Every action taken by our community creates real, lasting impact. From reducing plastic waste 
              to planting forests, we track and celebrate every positive change our students make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-lg p-8">
              <TreeDeciduous className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">52,000+</div>
              <h3 className="font-semibold text-xl mb-2">Trees Planted</h3>
              <p className="text-sm text-muted-foreground">
                Our reforestation projects have planted over 52,000 trees, absorbing thousands of tons of CO2 annually.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-8">
              <Droplets className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">2M+</div>
              <h3 className="font-semibold text-xl mb-2">Plastic Items Removed</h3>
              <p className="text-sm text-muted-foreground">
                Beach and community cleanups have removed over 2 million plastic items from natural environments.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-8">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <h3 className="font-semibold text-xl mb-2">Behavior Change</h3>
              <p className="text-sm text-muted-foreground">
                85% of students report lasting changes in their environmental habits after completing our programs.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-8">
              <Leaf className="h-12 w-12 text-primary mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <h3 className="font-semibold text-xl mb-2">School Gardens</h3>
              <p className="text-sm text-muted-foreground">
                Student-led initiatives have established over 150 sustainable school gardens worldwide.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Beyond Numbers</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Our impact extends beyond statistics. Students develop leadership skills, schools implement 
              sustainable policies, and communities become more environmentally conscious. We're creating 
              a ripple effect that touches families, neighborhoods, and entire regions.
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Student Stories</h3>
            <div className="space-y-4">
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "Through PIG, our school planted 500 trees and inspired our entire city to start a recycling program. 
                We're not just learning—we're leading change."
                <footer className="mt-2 not-italic font-semibold">— Maria, 16, Brazil</footer>
              </blockquote>
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "I organized my first beach cleanup thanks to PIG. Now we do it monthly with 50+ volunteers!"
                <footer className="mt-2 not-italic font-semibold">— David, 14, Philippines</footer>
              </blockquote>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Be Part of the Impact</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of students creating real environmental change. Your actions matter.
            </p>
            <Link to="/compete">
              <Button size="lg">Start Making Impact</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurImpact;
