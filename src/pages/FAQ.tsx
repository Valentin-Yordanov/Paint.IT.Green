import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();
  const faqs = [
    {
      question: "What is P.I.G?",
      answer: "P.I.G is an educational platform that teaches students about environmental conservation through interactive learning, competitions, and community engagement."
    },
    {
      question: "Who can join P.I.G?",
      answer: "P.I.G is open to students of all ages, teachers, school administrators, and parents. Each user type has different access levels and features."
    },
    {
      question: "How do the competitions work?",
      answer: "Competitions run weekly, monthly, and yearly at city, school, and individual student levels. Participants earn points for completing environmental challenges and actions."
    },
    {
      question: "Is P.I.G free to use?",
      answer: "Yes! P.I.G is completely free for all students and educators. Our mission is to make environmental education accessible to everyone."
    },
    {
      question: "How can my school join?",
      answer: "School administrators can register their school through our platform. Once registered, teachers can create groups and invite students to join."
    },
    {
      question: "What kind of activities can we post?",
      answer: "Schools can share photos and updates about recycling drives, tree planting events, clean-up activities, and any environmental initiatives undertaken by students."
    },
    {
      question: "How are winners determined in competitions?",
      answer: "Winners are determined by points earned through verified environmental actions. Schools and cities with the most active participants receive recognition."
    },
    {
      question: "Can parents track their child's progress?",
      answer: "Yes! Parents with accounts can follow their child's school group and see the environmental activities they're participating in."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('faq.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-16 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default FAQ;
