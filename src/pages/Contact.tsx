import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const { t } = useLanguage();

  const contactInfo = [
    { icon: Mail, title: t('contact.email'), value: "paint.IT.green@gmail.com", gradient: "from-emerald-500 to-teal-600" },
    { icon: Phone, title: t('contact.phone'), value: "XXXXXXXXXX", gradient: "from-sky-500 to-blue-600" },
    { icon: MapPin, title: t('contact.address'), value: "Green Street\nEnvironmental District\nEarth City, EC 12345", gradient: "from-amber-500 to-orange-600" },
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="container relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Get in Touch</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t('contact.title')}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8">{t('contact.sendMessage')}</h2>
              <form className="space-y-6">
                <div>
                  <Input 
                    placeholder={t('contact.yourName')} 
                    className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <Input 
                    type="email" 
                    placeholder={t('contact.yourEmail')} 
                    className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <Input 
                    placeholder={t('contact.subject')} 
                    className="h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder={t('contact.yourMessage')} 
                    rows={6} 
                    className="rounded-xl bg-secondary/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl gap-2 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                  <Send className="h-5 w-5" />
                  {t('contact.send')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('contact.getInTouch')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('contact.getInTouchText')}
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex items-start gap-5">
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <info.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{info.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
