import { Target, BookOpen, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OurGoal = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <Target className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Goal</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Making environmental education accessible to every student worldwide
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Breaking Down Barriers</h2>
            <p className="text-muted-foreground text-lg mb-4">
              We believe that every student, regardless of their location, economic status, or background, 
              deserves access to quality environmental education. Our platform removes traditional barriers 
              by providing free, engaging, and comprehensive learning resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg p-6">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">Free Resources</h3>
              <p className="text-sm text-muted-foreground">
                All our educational materials are completely free and available to students worldwide.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">Global Reach</h3>
              <p className="text-sm text-muted-foreground">
                Available in multiple languages, reaching students across continents and cultures.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">Inclusive Learning</h3>
              <p className="text-sm text-muted-foreground">
                Designed for diverse learning styles and abilities, ensuring everyone can participate.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Our Vision for the Future</h2>
            <p className="text-muted-foreground text-lg mb-4">
              By 2030, we aim to reach 10 million students across 150 countries, creating a generation 
              of environmentally conscious global citizens. We're not just teaching about climate change—we're 
              empowering students to become active participants in solving it.
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-muted-foreground mb-6">
              Whether you're a student, teacher, or school administrator, you can be part of this global movement 
              to make environmental education accessible to all.
            </p>
            <Link to="/learn">
              <Button size="lg">Start Learning Today</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurGoal;
