import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Users, Leaf, Recycle, TreePine } from "lucide-react";
import heroImage from "@/assets/hero-nature.jpg";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Learn & Discover",
      description: "Explore why nature conservation matters and how every action counts",
      link: "/learn",
    },
    {
      icon: Trophy,
      title: "Compete & Win",
      description: "Join weekly, monthly, and yearly competitions between cities and schools",
      link: "/compete",
    },
    {
      icon: Users,
      title: "Share & Connect",
      description: "Celebrate achievements and inspire others in your school community",
      link: "/community",
    },
  ];

  const stats = [
    { icon: TreePine, value: "10,000+", label: "Trees Planted" },
    { icon: Recycle, value: "50+", label: "Schools Participating" },
    { icon: Users, value: "5,000+", label: "Students Engaged" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>
        
        <div className="container relative z-10 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Protect Our Planet,
              <span className="text-primary"> Together</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join students from around the world in learning about nature conservation
              and making a real difference in your community
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/learn">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
              <Link to="/compete">
                <Button size="lg" variant="outline" className="gap-2">
                  <Trophy className="h-5 w-5" />
                  View Competitions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Make a Difference
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines education, competition, and community to inspire
              environmental action
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of students already making a difference in their communities
            </p>
            <Link to="/learn">
              <Button size="lg" variant="secondary" className="gap-2">
                <Leaf className="h-5 w-5" />
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
