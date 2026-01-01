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
        <h2>{t('terms.acceptanceTitle')}</h2>
        <p>{t('terms.acceptanceText')}</p>

        <h2>{t('terms.useTitle')}</h2>
        <p>{t('terms.useIntro')}</p>
        <ul>
          <li>{t('terms.useItem1')}</li>
          <li>{t('terms.useItem2')}</li>
          <li>{t('terms.useItem3')}</li>
          <li>{t('terms.useItem4')}</li>
        </ul>

        <h2>{t('terms.accountsTitle')}</h2>
        <p>{t('terms.accountsText')}</p>

        <h2>{t('terms.competitionTitle')}</h2>
        <p>{t('terms.competitionText')}</p>

        <h2>{t('terms.contentTitle')}</h2>
        <p>{t('terms.contentText')}</p>

        <h2>{t('terms.prohibitedTitle')}</h2>
        <p>{t('terms.prohibitedIntro')}</p>
        <ul>
          <li>{t('terms.prohibitedItem1')}</li>
          <li>{t('terms.prohibitedItem2')}</li>
          <li>{t('terms.prohibitedItem3')}</li>
          <li>{t('terms.prohibitedItem4')}</li>
        </ul>

        <h2>{t('terms.terminationTitle')}</h2>
        <p>{t('terms.terminationText')}</p>

        <h2>{t('terms.changesTitle')}</h2>
        <p>{t('terms.changesText')}</p>

        <h2>{t('terms.contactTitle')}</h2>
        <p>{t('terms.contactText')}</p>
      </section>
    </div>
  );
};

export default Terms;