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
            <h2 className="text-3xl font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground text-lg mb-4">
              Our values guide every decision we make and shape the culture of our global community. 
              They reflect our commitment to creating a better world for all living things.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">Education</h3>
                  <p className="text-muted-foreground mb-4">
                    Knowledge is power. We believe in making environmental education accessible, engaging, 
                    and actionable. Every student deserves to understand the science behind climate change 
                    and the solutions within their reach.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Evidence-based learning materials</li>
                    <li>• Accessible to all, regardless of background</li>
                    <li>• Practical knowledge that leads to action</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Sprout className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">Action</h3>
                  <p className="text-muted-foreground mb-4">
                    Learning must lead to doing. We empower students to take meaningful action in their 
                    communities, turning awareness into impact. Every small action contributes to larger change.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Hands-on environmental projects</li>
                    <li>• Community-led initiatives</li>
                    <li>• Measurable, real-world impact</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Heart className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">Compassion</h3>
                  <p className="text-muted-foreground mb-4">
                    Environmental protection starts with caring—for our planet, for all species, and for 
                    each other. We foster a community built on empathy, respect, and kindness.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Respect for all living things</li>
                    <li>• Inclusive and supportive community</li>
                    <li>• Understanding diverse perspectives</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <HandHeart className="h-12 w-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-2xl mb-3">Collaboration</h3>
                  <p className="text-muted-foreground mb-4">
                    No one can solve the climate crisis alone. We believe in the power of collective action, 
                    bringing together students, schools, and communities worldwide.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Global network of change-makers</li>
                    <li>• Shared knowledge and resources</li>
                    <li>• Stronger together than apart</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Living Our Values</h3>
            <p className="text-muted-foreground mb-4">
              These aren't just words on a page—they're principles we practice every day. From how we design 
              our curriculum to how we support our community, our values guide us forward.
            </p>
            <p className="text-muted-foreground">
              When you join EcoLearn, you become part of a movement that prioritizes education, celebrates 
              action, practices compassion, and thrives on collaboration.
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-muted-foreground mb-6">
              Ready to be part of a community that lives these values every day? Start your journey with EcoLearn.
            </p>
            <Link to="/about">
              <Button size="lg">Learn More About Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurValues;
