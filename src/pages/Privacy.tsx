import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("privacy.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t("privacy.lastUpdated")}{" "}
            {new Date("2026-01-01").toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container py-16 max-w-4xl prose prose-slate dark:prose-invert">
        <h2>{t("privacy.intro")}</h2>
        <p>{t("privacy.introText")}</p>

        <h2>{t("privacy.collect")}</h2>
        <p>{t("privacy.collectText")}</p>
        <ul>
          <li>{t("privacy.collectItem1")}</li>
          <li>{t("privacy.collectItem2")}</li>
          <li>{t("privacy.collectItem3")}</li>
          <li>{t("privacy.collectItem4")}</li>
        </ul>

        <h2>{t("privacy.use")}</h2>
        <p>{t("privacy.useText")}</p>
        <ul>
          <li>{t("privacy.useItem1")}</li>
          <li>{t("privacy.useItem2")}</li>
          <li>{t("privacy.useItem3")}</li>
          <li>{t("privacy.useItem4")}</li>
        </ul>

        <h2>{t("privacy.sharing")}</h2>
        <p>{t("privacy.sharingText")}</p>

        <h2>{t("privacy.children")}</h2>
        <p>{t("privacy.childrenText")}</p>

        <h2>{t("privacy.contact")}</h2>
        <p>{t("privacy.contactText")}</p>
      </section>
    </div>
  );
};

export default Privacy;
