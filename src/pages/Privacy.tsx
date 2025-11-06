import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('privacy.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('privacy.lastUpdated')} {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container py-16 max-w-4xl prose prose-slate dark:prose-invert">
        <h2>Introduction</h2>
        <p>
          At EcoLearn, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li>Name, email address, and school information</li>
          <li>Account credentials</li>
          <li>Profile information and photos</li>
          <li>Posts, comments, and other content you share</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our services</li>
          <li>Facilitate competitions and community features</li>
          <li>Send you important updates and notifications</li>
          <li>Improve our platform and user experience</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share information with schools and parents as part of our educational mission, but only with appropriate consent.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          We are committed to protecting the privacy of children. Parents and guardians have control over their children's accounts and can review or delete information at any time.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at privacy@ecolearn.org.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
