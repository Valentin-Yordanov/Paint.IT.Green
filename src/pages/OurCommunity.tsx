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
            <h2 className="text-3xl font-bold mb-4">A Global Network of Change-Makers</h2>
            <p className="text-muted-foreground text-lg mb-4">
              P.I.G connects students from diverse backgrounds and cultures, creating a vibrant community 
              united by their passion for environmental protection. Our platform fosters collaboration, 
              friendship, and collective action across borders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-lg p-6">
              <MessageSquare className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">Share & Connect</h3>
              <p className="text-sm text-muted-foreground">
                Exchange ideas, share success stories, and collaborate on projects with students from around the world.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">Celebrate Together</h3>
              <p className="text-sm text-muted-foreground">
                Recognize achievements, celebrate milestones, and inspire each other to reach new heights.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <HandHeart className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">Support Network</h3>
              <p className="text-sm text-muted-foreground">
                Find mentors, ask questions, and receive guidance from experienced environmental advocates.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">School Partnerships</h3>
              <p className="text-sm text-muted-foreground">
                Connect your entire school with others worldwide for collaborative environmental initiatives.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Community Impact</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Our community has planted over 50,000 trees, organized 1,000+ local cleanup events, and reached 
              500,000 students across 85 countries. Together, we're proving that collective action creates 
              real change.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">85</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Trees Planted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1K+</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
            <p className="text-muted-foreground mb-6">
              Become part of a global movement of students taking action for our planet. Connect, share, and 
              make a difference together.
            </p>
            <Link to="/community">
              <Button size="lg">Explore Community</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurCommunity;
