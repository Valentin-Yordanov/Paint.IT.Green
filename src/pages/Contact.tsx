  import { Mail, Phone, MapPin } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { useLanguage } from "@/contexts/LanguageContext";

  const Contact = () => {
    const { t } = useLanguage();
    
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('contact.title')}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {t('contact.subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('contact.sendMessage')}</h2>
              <form className="space-y-4">
                <div>
                  <Input placeholder={t('contact.yourName')} />
                </div>
                <div>
                  <Input type="email" placeholder={t('contact.yourEmail')} />
                </div>
                <div>
                  <Input placeholder={t('contact.subject')} />
                </div>
                <div>
                  <Textarea placeholder={t('contact.yourMessage')} rows={6} />
                </div>
                <Button type="submit" className="w-full">{t('contact.send')}</Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('contact.getInTouch')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('contact.getInTouchText')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
                    <p className="text-muted-foreground">paint.IT.green@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.phone')}</h3>
                    <p className="text-muted-foreground">XXXXXXXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.address')}</h3>
                    <p className="text-muted-foreground">
                      Green Street<br />
                      Environmental District<br />
                      Earth City, EC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  export default Contact;
