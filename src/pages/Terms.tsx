import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('terms.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('terms.lastUpdated')} {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container py-16 max-w-4xl prose prose-slate dark:prose-invert">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using P.I.G, you accept and agree to be bound by the terms and provisions of this agreement.
        </p>

        <h2>Use of Platform</h2>
        <p>P.I.G is intended for educational purposes. Users agree to:</p>
        <ul>
          <li>Provide accurate information during registration</li>
          <li>Maintain the security of their account</li>
          <li>Use the platform responsibly and respectfully</li>
          <li>Not post harmful, offensive, or inappropriate content</li>
        </ul>

        <h2>School and Student Accounts</h2>
        <p>
          School administrators are responsible for managing their school's presence on the platform. Students under 13 must have parental consent to use the platform.
        </p>

        <h2>Competition Rules</h2>
        <p>
          Participants in competitions must follow all rules and guidelines. P.I.G reserves the right to disqualify participants who violate competition rules or engage in fraudulent activities.
        </p>

        <h2>Content Ownership</h2>
        <p>
          Users retain ownership of the content they post, but grant P.I.G a license to use, display, and distribute that content within the platform.
        </p>

        <h2>Prohibited Activities</h2>
        <p>Users may not:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Harass or harm other users</li>
          <li>Attempt to access unauthorized areas of the platform</li>
          <li>Upload malicious code or spam</li>
        </ul>

        <h2>Termination</h2>
        <p>
          We reserve the right to terminate or suspend accounts that violate these terms or engage in inappropriate behavior.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms of Service can be directed to lENTER EMAIL.
        </p>
      </section>
    </div>
  );
};

export default Terms;
