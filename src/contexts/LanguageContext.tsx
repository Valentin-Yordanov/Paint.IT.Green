import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bg';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const translations = language === 'bg' ? bgTranslations : enTranslations;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const enTranslations: Record<string, string> = {
  // Navigation
  'nav.home': 'Home',
  'nav.learn': 'Learn',
  'nav.compete': 'Compete',
  'nav.community': 'Community',
  'nav.profile': 'Profile',
  'nav.ecolearn': 'EcoLearn',

  // Home Page
  'home.hero.title': 'Protect Our Planet,',
  'home.hero.title.highlight': 'Together',
  'home.hero.subtitle': 'Join students from around the world in learning about nature conservation and making a real difference in your community',
  'home.hero.start': 'Start Learning',
  'home.hero.view': 'View Competitions',
  'home.features.title': 'Everything You Need to Make a Difference',
  'home.features.subtitle': 'Our platform combines education, competition, and community to inspire environmental action',
  'home.feature1.title': 'Learn & Discover',
  'home.feature1.desc': 'Explore why nature conservation matters and how every action counts',
  'home.feature2.title': 'Compete & Win',
  'home.feature2.desc': 'Join weekly, monthly, and yearly competitions between cities and schools',
  'home.feature3.title': 'Share & Connect',
  'home.feature3.desc': 'Celebrate achievements and inspire others in your school community',
  'home.stats.trees': 'Trees Planted',
  'home.stats.schools': 'Schools Participating',
  'home.stats.students': 'Students Engaged',

  // Profile Page
  'profile.title': 'My Profile',
  'profile.subtitle': 'Track your environmental impact and achievements',
  'profile.overview': 'Overview',
  'profile.settings': 'Settings',
  'profile.points': 'Total Points',
  'profile.trees': 'Trees Planted',
  'profile.challenges': 'Challenges Done',
  'profile.lessons': 'Lessons Finished',
  'profile.achievements': 'Recent Achievements',
  'profile.goals': 'Active Goals',
  'profile.newGoal': 'Set New Goal',
  'profile.createGoal': 'Create a New Goal',
  'profile.goalTitle': 'Goal Title',
  'profile.goalDesc': 'Description',
  'profile.goalPlaceholder': 'e.g., Plant 100 Trees',
  'profile.goalDescPlaceholder': 'Describe your goal...',
  'profile.createButton': 'Create Goal',
  'profile.settingsTitle': 'Profile Settings',
  'profile.name': 'Full Name',
  'profile.email': 'Email',
  'profile.school': 'School',
  'profile.role': 'Role',
  'profile.edit': 'Edit Profile',
  'profile.save': 'Save Changes',
  'profile.cancel': 'Cancel',
  'profile.updated': 'Profile updated!',
  'profile.updatedDesc': 'Your profile has been saved successfully.',
  'profile.goalCreated': 'Goal created!',
  'profile.goalCreatedDesc': 'Your new goal has been added successfully.',
  'profile.goalDeleted': 'Goal deleted',
  'profile.goalDeletedDesc': 'Your goal has been removed.',
  'profile.language': 'Language',
  'profile.languageDesc': 'Switch website language',

  // Achievements
  'achievement.treePlanter': 'Tree Planter',
  'achievement.treePlanterDesc': 'Planted 10 trees',
  'achievement.quizMaster': 'Quiz Master',
  'achievement.quizMasterDesc': 'Completed 5 quizzes with 100%',
  'achievement.champion': 'Community Champion',
  'achievement.championDesc': 'Reached 1000 points',

  // Time
  'time.daysAgo': 'days ago',
  'time.weekAgo': 'week ago',
  'time.weeksAgo': 'weeks ago',

  // Common
  'common.student': 'Student',
  'common.goldTier': 'Gold Tier',
};

const bgTranslations: Record<string, string> = {
  // Navigation
  'nav.home': 'Начало',
  'nav.learn': 'Учене',
  'nav.compete': 'Състезания',
  'nav.community': 'Общност',
  'nav.profile': 'Профил',
  'nav.ecolearn': 'ЕкоУчене',

  // Home Page
  'home.hero.title': 'Защитете нашата планета,',
  'home.hero.title.highlight': 'Заедно',
  'home.hero.subtitle': 'Присъединете се към ученици от цял свят в изучаването на опазването на природата и правенето на реална промяна във вашата общност',
  'home.hero.start': 'Започни да учиш',
  'home.hero.view': 'Виж състезанията',
  'home.features.title': 'Всичко необходимо за да направите промяна',
  'home.features.subtitle': 'Нашата платформа комбинира образование, състезания и общност, за да вдъхнови екологични действия',
  'home.feature1.title': 'Учи и откривай',
  'home.feature1.desc': 'Изследвайте защо опазването на природата е важно и как всяко действие има значение',
  'home.feature2.title': 'Състезавай се и печели',
  'home.feature2.desc': 'Присъединете се към седмични, месечни и годишни състезания между градове и училища',
  'home.feature3.title': 'Споделяй и свързвай',
  'home.feature3.desc': 'Празнувайте постижения и вдъхновявайте другите в училищната си общност',
  'home.stats.trees': 'Засадени дървета',
  'home.stats.schools': 'Участващи училища',
  'home.stats.students': 'Ангажирани ученици',

  // Profile Page
  'profile.title': 'Моят профил',
  'profile.subtitle': 'Проследете вашето екологично въздействие и постижения',
  'profile.overview': 'Преглед',
  'profile.settings': 'Настройки',
  'profile.points': 'Общо точки',
  'profile.trees': 'Засадени дървета',
  'profile.challenges': 'Завършени предизвикателства',
  'profile.lessons': 'Завършени уроци',
  'profile.achievements': 'Последни постижения',
  'profile.goals': 'Активни цели',
  'profile.newGoal': 'Задай нова цел',
  'profile.createGoal': 'Създай нова цел',
  'profile.goalTitle': 'Заглавие на целта',
  'profile.goalDesc': 'Описание',
  'profile.goalPlaceholder': 'напр., Засади 100 дървета',
  'profile.goalDescPlaceholder': 'Опишете вашата цел...',
  'profile.createButton': 'Създай цел',
  'profile.settingsTitle': 'Настройки на профила',
  'profile.name': 'Пълно име',
  'profile.email': 'Имейл',
  'profile.school': 'Училище',
  'profile.role': 'Роля',
  'profile.edit': 'Редактирай профила',
  'profile.save': 'Запази промените',
  'profile.cancel': 'Откажи',
  'profile.updated': 'Профилът е актуализиран!',
  'profile.updatedDesc': 'Вашият профил е запазен успешно.',
  'profile.goalCreated': 'Целта е създадена!',
  'profile.goalCreatedDesc': 'Вашата нова цел е добавена успешно.',
  'profile.goalDeleted': 'Целта е изтрита',
  'profile.goalDeletedDesc': 'Вашата цел е премахната.',
  'profile.language': 'Език',
  'profile.languageDesc': 'Сменете езика на уебсайта',

  // Achievements
  'achievement.treePlanter': 'Садител на дървета',
  'achievement.treePlanterDesc': 'Засади 10 дървета',
  'achievement.quizMaster': 'Майстор на теста',
  'achievement.quizMasterDesc': 'Завърши 5 теста със 100%',
  'achievement.champion': 'Шампион на общността',
  'achievement.championDesc': 'Достигна 1000 точки',

  // Time
  'time.daysAgo': 'дни преди',
  'time.weekAgo': 'седмица преди',
  'time.weeksAgo': 'седмици преди',

  // Common
  'common.student': 'Ученик',
  'common.goldTier': 'Златен ранг',
};
