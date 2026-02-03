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
            {t('terms.lastUpdated')} {new Date("2026-01-01").toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container py-16 max-w-4xl prose prose-slate dark:prose-invert">
        <h2>{t('terms.acceptance')}</h2>
        <p>{t('terms.acceptanceText')}</p>

        <h2>{t('terms.use')}</h2>
        <p>{t('terms.useText')}</p>
        <ul>
          <li>{t('terms.useItem1')}</li>
          <li>{t('terms.useItem2')}</li>
          <li>{t('terms.useItem3')}</li>
          <li>{t('terms.useItem4')}</li>
        </ul>

        <h2>{t('terms.accounts')}</h2>
        <p>{t('terms.accountsText')}</p>

        <h2>{t('terms.competition')}</h2>
        <p>{t('terms.competitionText')}</p>

        <h2>{t('terms.content')}</h2>
        <p>{t('terms.contentText')}</p>

        <h2>{t('terms.prohibited')}</h2>
        <p>{t('terms.prohibitedText')}</p>
        <ul>
          <li>{t('terms.prohibitedItem1')}</li>
          <li>{t('terms.prohibitedItem2')}</li>
          <li>{t('terms.prohibitedItem3')}</li>
          <li>{t('terms.prohibitedItem4')}</li>
        </ul>

        <h2>{t('terms.termination')}</h2>
        <p>{t('terms.terminationText')}</p>

        <h2>{t('terms.changes')}</h2>
        <p>{t('terms.changesText')}</p>

        <h2>{t('terms.contact')}</h2>
        <p>{t('terms.contactText')}</p>
      </section>
    </div>
  );
};

export default Terms;