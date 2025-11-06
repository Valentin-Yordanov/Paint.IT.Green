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

  // Footer
  'footer.tagline': 'Empowering students worldwide to protect our planet through education and action.',
  'footer.platform': 'Platform',
  'footer.resources': 'Resources',
  'footer.legal': 'Legal',
  'footer.aboutUs': 'About Us',
  'footer.contact': 'Contact',
  'footer.faq': 'FAQ',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.rights': 'All rights reserved.',
  'footer.madeWith': 'Made with 💚 for a greener planet',

  // About
  'about.title': 'About EcoLearn',
  'about.subtitle': 'Empowering the next generation to protect our planet through education, competition, and community action.',
  'about.mission': 'Our Mission',
  'about.missionText1': 'EcoLearn is dedicated to creating a global community of environmentally conscious students who understand the importance of protecting our planet.',
  'about.missionText2': 'Through interactive learning, friendly competition, and community engagement, we inspire students of all ages to take meaningful action in preserving nature.',

  // Learn
  'learn.title': 'Learn About Nature Conservation',
  'learn.subtitle': 'Discover why protecting our environment is crucial and how you can make a difference',
  'learn.wildlife': 'Wildlife Protection',
  'learn.pollution': 'Fighting Pollution',
  'learn.recycling': 'Recycling & Reusing',
  'learn.forests': 'Forest Conservation',
  'learn.water': 'Water Conservation',
  'learn.communityAction': 'Community Action',
  'learn.remember': 'Remember',
  'learn.rememberText': 'Every small action counts. Whether it\'s picking up litter, planting a tree, or teaching someone else about conservation - you\'re making a difference. Together, we can protect our beautiful planet for generations to come!',

  // Compete
  'compete.title': 'Competitions & Leaderboards',
  'compete.subtitle': 'See how cities, schools, and students are competing to make the biggest environmental impact',
  'compete.challenges': 'Current Challenges',
  'compete.cities': 'Cities',
  'compete.schools': 'Schools',
  'compete.students': 'Students',
  'compete.cityRankings': 'City Rankings - Monthly',
  'compete.schoolRankings': 'School Rankings - Monthly',
  'compete.studentRankings': 'Student Rankings - Monthly',

  // Community
  'community.title': 'Community Feed',
  'community.subtitle': 'Celebrate achievements and share environmental initiatives from schools around the world',
  'community.createPost': 'Create Post',
  'community.public': 'Public',
  'community.mySchool': 'My School',
  'community.myPosts': 'My Posts',

  // Contact
  'contact.title': 'Contact Us',
  'contact.subtitle': 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
  'contact.sendMessage': 'Send us a message',
  'contact.getInTouch': 'Get in touch',
  'contact.getInTouchText': 'Whether you\'re a student, teacher, or school administrator, we\'re here to help you make a difference.',
  'contact.email': 'Email',
  'contact.phone': 'Phone',
  'contact.address': 'Address',
  'contact.yourName': 'Your Name',
  'contact.yourEmail': 'Your Email',
  'contact.subject': 'Subject',
  'contact.yourMessage': 'Your Message',
  'contact.send': 'Send Message',

  // FAQ
  'faq.title': 'Frequently Asked Questions',
  'faq.subtitle': 'Find answers to common questions about EcoLearn and how to get the most out of our platform.',

  // Privacy
  'privacy.title': 'Privacy Policy',
  'privacy.lastUpdated': 'Last updated:',

  // Terms
  'terms.title': 'Terms of Service',
  'terms.lastUpdated': 'Last updated:',

  // 404
  'notFound.title': '404',
  'notFound.subtitle': 'Oops! Page not found',
  'notFound.home': 'Return to Home',

  // Our Goal
  'ourGoal.title': 'Our Goal',
  'ourGoal.subtitle': 'Making environmental education accessible to every student worldwide',
  'ourGoal.breaking': 'Breaking Down Barriers',
  'ourGoal.breakingText': 'We believe that every student, regardless of their location, economic status, or background, deserves access to quality environmental education. Our platform removes traditional barriers by providing free, engaging, and comprehensive learning resources.',
  'ourGoal.freeResources': 'Free Resources',
  'ourGoal.freeResourcesDesc': 'All our educational materials are completely free and available to students worldwide.',
  'ourGoal.globalReach': 'Global Reach',
  'ourGoal.globalReachDesc': 'Available in multiple languages, reaching students across continents and cultures.',
  'ourGoal.inclusiveLearning': 'Inclusive Learning',
  'ourGoal.inclusiveLearningDesc': 'Designed for diverse learning styles and abilities, ensuring everyone can participate.',
  'ourGoal.vision': 'Our Vision for the Future',
  'ourGoal.visionText': 'By 2030, we aim to reach 10 million students across 150 countries, creating a generation of environmentally conscious global citizens. We\'re not just teaching about climate change—we\'re empowering students to become active participants in solving it.',
  'ourGoal.joinMission': 'Join Our Mission',
  'ourGoal.joinMissionText': 'Whether you\'re a student, teacher, or school administrator, you can be part of this global movement to make environmental education accessible to all.',
  'ourGoal.startLearning': 'Start Learning Today',

  // Our Community
  'ourCommunity.title': 'Our Community',
  'ourCommunity.subtitle': 'Connecting schools and students across the globe in a shared mission to protect our planet',
  'ourCommunity.globalNetwork': 'A Global Network of Change-Makers',
  'ourCommunity.globalNetworkText': 'EcoLearn connects students from diverse backgrounds and cultures, creating a vibrant community united by their passion for environmental protection. Our platform fosters collaboration, friendship, and collective action across borders.',
  'ourCommunity.shareConnect': 'Share & Connect',
  'ourCommunity.shareConnectDesc': 'Exchange ideas, share success stories, and collaborate on projects with students from around the world.',
  'ourCommunity.celebrateTogether': 'Celebrate Together',
  'ourCommunity.celebrateTogetherDesc': 'Recognize achievements, celebrate milestones, and inspire each other to reach new heights.',
  'ourCommunity.supportNetwork': 'Support Network',
  'ourCommunity.supportNetworkDesc': 'Find mentors, ask questions, and receive guidance from experienced environmental advocates.',
  'ourCommunity.schoolPartnerships': 'School Partnerships',
  'ourCommunity.schoolPartnershipsDesc': 'Connect your entire school with others worldwide for collaborative environmental initiatives.',
  'ourCommunity.impact': 'Community Impact',
  'ourCommunity.impactText': 'Our community has planted over 50,000 trees, organized 1,000+ local cleanup events, and reached 500,000 students across 85 countries. Together, we\'re proving that collective action creates real change.',
  'ourCommunity.countries': 'Countries',
  'ourCommunity.studentsCount': 'Students',
  'ourCommunity.treesPlanted': 'Trees Planted',
  'ourCommunity.events': 'Events',
  'ourCommunity.joinCommunity': 'Join Our Community',
  'ourCommunity.joinCommunityText': 'Become part of a global movement of students taking action for our planet. Connect, share, and make a difference together.',
  'ourCommunity.exploreCommunity': 'Explore Community',

  // Our Impact
  'ourImpact.title': 'Our Impact',
  'ourImpact.subtitle': 'Real environmental change through collective action',
  'ourImpact.measurable': 'Measurable Environmental Change',
  'ourImpact.measurableText': 'Every action taken by our community creates real, lasting impact. From reducing plastic waste to planting forests, we track and celebrate every positive change our students make.',
  'ourImpact.treesPlantedTitle': 'Trees Planted',
  'ourImpact.treesPlantedDesc': 'Our reforestation projects have planted over 52,000 trees, absorbing thousands of tons of CO2 annually.',
  'ourImpact.plasticRemoved': 'Plastic Items Removed',
  'ourImpact.plasticRemovedDesc': 'Beach and community cleanups have removed over 2 million plastic items from natural environments.',
  'ourImpact.behaviorChange': 'Behavior Change',
  'ourImpact.behaviorChangeDesc': '85% of students report lasting changes in their environmental habits after completing our programs.',
  'ourImpact.schoolGardens': 'School Gardens',
  'ourImpact.schoolGardensDesc': 'Student-led initiatives have established over 150 sustainable school gardens worldwide.',
  'ourImpact.beyondNumbers': 'Beyond Numbers',
  'ourImpact.beyondNumbersText': 'Our impact extends beyond statistics. Students develop leadership skills, schools implement sustainable policies, and communities become more environmentally conscious. We\'re creating a ripple effect that touches families, neighborhoods, and entire regions.',
  'ourImpact.studentStories': 'Student Stories',
  'ourImpact.bePartOfImpact': 'Be Part of the Impact',
  'ourImpact.bePartText': 'Join thousands of students creating real environmental change. Your actions matter.',
  'ourImpact.startMakingImpact': 'Start Making Impact',

  // Our Values
  'ourValues.title': 'Our Values',
  'ourValues.subtitle': 'Education, action, and compassion for all living things',
  'ourValues.whatWeStandFor': 'What We Stand For',
  'ourValues.whatWeStandForText': 'Our values guide every decision we make and shape the culture of our global community. They reflect our commitment to creating a better world for all living things.',
  'ourValues.education': 'Education',
  'ourValues.educationText': 'Knowledge is power. We believe in making environmental education accessible, engaging, and actionable. Every student deserves to understand the science behind climate change and the solutions within their reach.',
  'ourValues.action': 'Action',
  'ourValues.actionText': 'Learning must lead to doing. We empower students to take meaningful action in their communities, turning awareness into impact. Every small action contributes to larger change.',
  'ourValues.compassion': 'Compassion',
  'ourValues.compassionText': 'Environmental protection starts with caring—for our planet, for all species, and for each other. We foster a community built on empathy, respect, and kindness.',
  'ourValues.collaboration': 'Collaboration',
  'ourValues.collaborationText': 'No one can solve the climate crisis alone. We believe in the power of collective action, bringing together students, schools, and communities worldwide.',
  'ourValues.livingValues': 'Living Our Values',
  'ourValues.livingValuesText': 'These aren\'t just words on a page—they\'re principles we practice every day. From how we design our curriculum to how we support our community, our values guide us forward.',
  'ourValues.livingValuesText2': 'When you join EcoLearn, you become part of a movement that prioritizes education, celebrates action, practices compassion, and thrives on collaboration.',
  'ourValues.joinMission': 'Join Our Mission',
  'ourValues.joinMissionText': 'Ready to be part of a community that lives these values every day? Start your journey with EcoLearn.',
  'ourValues.learnMore': 'Learn More About Us',
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

  // Footer
  'footer.tagline': 'Овластяваме учениците по целия свят да защитят нашата планета чрез образование и действие.',
  'footer.platform': 'Платформа',
  'footer.resources': 'Ресурси',
  'footer.legal': 'Правна информация',
  'footer.aboutUs': 'За нас',
  'footer.contact': 'Контакти',
  'footer.faq': 'Въпроси',
  'footer.privacy': 'Политика за поверителност',
  'footer.terms': 'Условия за ползване',
  'footer.rights': 'Всички права запазени.',
  'footer.madeWith': 'Направено с 💚 за по-зелена планета',

  // About
  'about.title': 'За EcoLearn',
  'about.subtitle': 'Овластяваме следващото поколение да защитава нашата планета чрез образование, състезания и действия на общността.',
  'about.mission': 'Нашата мисия',
  'about.missionText1': 'EcoLearn е посветен на създаването на глобална общност от екологично съзнателни ученици, които разбират важността на защитата на нашата планета.',
  'about.missionText2': 'Чрез интерактивно учене, приятелски състезания и ангажиране на общността, ние вдъхновяваме ученици от всички възрасти да предприемат значими действия за опазване на природата.',

  // Learn
  'learn.title': 'Научете за опазването на природата',
  'learn.subtitle': 'Открийте защо защитата на околната среда е от решаващо значение и как можете да направите промяна',
  'learn.wildlife': 'Защита на дивата природа',
  'learn.pollution': 'Борба със замърсяването',
  'learn.recycling': 'Рециклиране и повторна употреба',
  'learn.forests': 'Опазване на горите',
  'learn.water': 'Опазване на водата',
  'learn.communityAction': 'Действия на общността',
  'learn.remember': 'Запомнете',
  'learn.rememberText': 'Всяко малко действие има значение. Дали е вдигане на боклук, засаждане на дърво или обучаване на някой друг за опазване - вие правите промяна. Заедно можем да защитим нашата красива планета за бъдещите поколения!',

  // Compete
  'compete.title': 'Състезания и класации',
  'compete.subtitle': 'Вижте как градове, училища и ученици се състезават за най-голямо екологично въздействие',
  'compete.challenges': 'Текущи предизвикателства',
  'compete.cities': 'Градове',
  'compete.schools': 'Училища',
  'compete.students': 'Ученици',
  'compete.cityRankings': 'Класация на градовете - месечна',
  'compete.schoolRankings': 'Класация на училищата - месечна',
  'compete.studentRankings': 'Класация на учениците - месечна',

  // Community
  'community.title': 'Общностна лента',
  'community.subtitle': 'Празнувайте постижения и споделяйте екологични инициативи от училища по целия свят',
  'community.createPost': 'Създай публикация',
  'community.public': 'Публични',
  'community.mySchool': 'Моето училище',
  'community.myPosts': 'Моите публикации',

  // Contact
  'contact.title': 'Свържете се с нас',
  'contact.subtitle': 'Имате въпроси? Ще се радваме да чуем от вас. Изпратете ни съобщение и ще отговорим възможно най-скоро.',
  'contact.sendMessage': 'Изпратете ни съобщение',
  'contact.getInTouch': 'Свържете се',
  'contact.getInTouchText': 'Независимо дали сте ученик, учител или училищен администратор, ние сме тук, за да ви помогнем да направите промяна.',
  'contact.email': 'Имейл',
  'contact.phone': 'Телефон',
  'contact.address': 'Адрес',
  'contact.yourName': 'Вашето име',
  'contact.yourEmail': 'Вашият имейл',
  'contact.subject': 'Тема',
  'contact.yourMessage': 'Вашето съобщение',
  'contact.send': 'Изпрати съобщение',

  // FAQ
  'faq.title': 'Често задавани въпроси',
  'faq.subtitle': 'Намерете отговори на общи въпроси за EcoLearn и как да получите най-доброто от нашата платформа.',

  // Privacy
  'privacy.title': 'Политика за поверителност',
  'privacy.lastUpdated': 'Последна актуализация:',

  // Terms
  'terms.title': 'Условия за ползване',
  'terms.lastUpdated': 'Последна актуализация:',

  // 404
  'notFound.title': '404',
  'notFound.subtitle': 'Опа! Страницата не е намерена',
  'notFound.home': 'Върнете се към начало',

  // Our Goal
  'ourGoal.title': 'Нашата цел',
  'ourGoal.subtitle': 'Правим екологичното образование достъпно за всеки ученик по света',
  'ourGoal.breaking': 'Преодоляване на бариерите',
  'ourGoal.breakingText': 'Вярваме, че всеки ученик, независимо от местоположението, икономическия статус или произхода си, заслужава достъп до качествено екологично образование. Нашата платформа премахва традиционните бариери, като предоставя безплатни, ангажиращи и изчерпателни учебни ресурси.',
  'ourGoal.freeResources': 'Безплатни ресурси',
  'ourGoal.freeResourcesDesc': 'Всички наши образователни материали са напълно безплатни и достъпни за ученици по целия свят.',
  'ourGoal.globalReach': 'Глобален обхват',
  'ourGoal.globalReachDesc': 'Достъпни на множество езици, достигащи до ученици в различни континенти и култури.',
  'ourGoal.inclusiveLearning': 'Приобщаващо учене',
  'ourGoal.inclusiveLearningDesc': 'Проектирани за различни стилове и способности за учене, осигуряващи възможност за участие на всички.',
  'ourGoal.vision': 'Нашата визия за бъдещето',
  'ourGoal.visionText': 'До 2030 г. се стремим да достигнем до 10 милиона ученици в 150 страни, създавайки поколение екологично съзнателни граждани на света. Не само преподаваме за климатичните промени - ние овластяваме учениците да станат активни участници в решаването им.',
  'ourGoal.joinMission': 'Присъединете се към нашата мисия',
  'ourGoal.joinMissionText': 'Независимо дали сте ученик, учител или училищен администратор, можете да бъдете част от това глобално движение за достъпно екологично образование за всички.',
  'ourGoal.startLearning': 'Започнете да учите днес',

  // Our Community  
  'ourCommunity.title': 'Нашата общност',
  'ourCommunity.subtitle': 'Свързваме училища и ученици по целия свят в обща мисия да защитим планетата',
  'ourCommunity.globalNetwork': 'Глобална мрежа от промяна',
  'ourCommunity.globalNetworkText': 'EcoLearn свързва ученици от различни произходи и култури, създавайки жизнена общност, обединена от страстта си към опазването на околната среда. Нашата платформа насърчава сътрудничеството, приятелството и колективните действия отвъд границите.',
  'ourCommunity.shareConnect': 'Споделяй и се свързвай',
  'ourCommunity.shareConnectDesc': 'Обменяйте идеи, споделяйте истории за успех и си сътрудничете по проекти с ученици от цял свят.',
  'ourCommunity.celebrateTogether': 'Празнувайте заедно',
  'ourCommunity.celebrateTogetherDesc': 'Признавайте постижения, празнувайте етапи и вдъхновявайте един друг да достигнете нови височини.',
  'ourCommunity.supportNetwork': 'Мрежа за подкрепа',
  'ourCommunity.supportNetworkDesc': 'Намерете ментори, задавайте въпроси и получавайте насоки от опитни застъпници на околната среда.',
  'ourCommunity.schoolPartnerships': 'Училищни партньорства',
  'ourCommunity.schoolPartnershipsDesc': 'Свържете цялото си училище с други по света за съвместни екологични инициативи.',
  'ourCommunity.impact': 'Въздействие на общността',
  'ourCommunity.impactText': 'Нашата общност е засадила над 50 000 дървета, организирала 1000+ местни събития за почистване и достигнала до 500 000 ученици в 85 страни. Заедно доказваме, че колективните действия създават реална промяна.',
  'ourCommunity.countries': 'Страни',
  'ourCommunity.studentsCount': 'Ученици',
  'ourCommunity.treesPlanted': 'Засадени дървета',
  'ourCommunity.events': 'Събития',
  'ourCommunity.joinCommunity': 'Присъединете се към нашата общност',
  'ourCommunity.joinCommunityText': 'Станете част от глобално движение на ученици, предприемащи действия за нашата планета. Свързвайте се, споделяйте и правете промяна заедно.',
  'ourCommunity.exploreCommunity': 'Разгледайте общността',

  // Our Impact
  'ourImpact.title': 'Нашето въздействие',
  'ourImpact.subtitle': 'Реална промяна в околната среда чрез колективни действия',
  'ourImpact.measurable': 'Измерима промяна в околната среда',
  'ourImpact.measurableText': 'Всяко действие, предприето от нашата общност, създава реално, трайно въздействие. От намаляване на пластмасовите отпадъци до засаждане на гори, проследяваме и празнуваме всяка положителна промяна, която учениците ни правят.',
  'ourImpact.treesPlantedTitle': 'Засадени дървета',
  'ourImpact.treesPlantedDesc': 'Нашите проекти за повторно залесяване са засадили над 52 000 дървета, поглъщащи хиляди тонове CO2 годишно.',
  'ourImpact.plasticRemoved': 'Премахнати пластмасови предмети',
  'ourImpact.plasticRemovedDesc': 'Почистванията на плажове и общности са премахнали над 2 милиона пластмасови предмета от природни среди.',
  'ourImpact.behaviorChange': 'Промяна на поведението',
  'ourImpact.behaviorChangeDesc': '85% от учениците съобщават за трайни промени в екологичните си навици след завършване на нашите програми.',
  'ourImpact.schoolGardens': 'Училищни градини',
  'ourImpact.schoolGardensDesc': 'Инициативи, ръководени от ученици, са създали над 150 устойчиви училищни градини по целия свят.',
  'ourImpact.beyondNumbers': 'Отвъд числата',
  'ourImpact.beyondNumbersText': 'Нашето въздействие надхвърля статистиката. Учениците развиват лидерски умения, училищата въвеждат устойчиви политики, а общностите стават по-екологично съзнателни. Създаваме ефект на вълна, който докосва семейства, квартали и цели региони.',
  'ourImpact.studentStories': 'Истории на ученици',
  'ourImpact.bePartOfImpact': 'Бъдете част от въздействието',
  'ourImpact.bePartText': 'Присъединете се към хиляди ученици, създаващи реална промяна в околната среда. Вашите действия имат значение.',
  'ourImpact.startMakingImpact': 'Започнете да правите въздействие',

  // Our Values
  'ourValues.title': 'Нашите ценности',
  'ourValues.subtitle': 'Образование, действие и състрадание за всички живи същества',
  'ourValues.whatWeStandFor': 'Какво застъпваме',
  'ourValues.whatWeStandForText': 'Нашите ценности ръководят всяко решение, което вземаме, и оформят културата на нашата глобална общност. Те отразяват нашия ангажимент за създаване на по-добър свят за всички живи същества.',
  'ourValues.education': 'Образование',
  'ourValues.educationText': 'Знанието е сила. Вярваме в правенето на екологичното образование достъпно, ангажиращо и приложимо. Всеки ученик заслужава да разбере науката зад климатичните промени и решенията в техния обхват.',
  'ourValues.action': 'Действие',
  'ourValues.actionText': 'Ученето трябва да води до действие. Овластяваме учениците да предприемат значими действия в своите общности, превръщайки осведомеността във въздействие. Всяко малко действие допринася за по-голяма промяна.',
  'ourValues.compassion': 'Състрадание',
  'ourValues.compassionText': 'Защитата на околната среда започва с грижата - за нашата планета, за всички видове и един за друг. Насърчаваме общност, изградена върху емпатия, уважение и доброта.',
  'ourValues.collaboration': 'Сътрудничество',
  'ourValues.collaborationText': 'Никой не може да реши климатичната криза сам. Вярваме в силата на колективните действия, обединявайки ученици, училища и общности по целия свят.',
  'ourValues.livingValues': 'Живеем с нашите ценности',
  'ourValues.livingValuesText': 'Това не са просто думи на страница - те са принципи, които практикуваме всеки ден. От начина, по който проектираме учебната си програма, до начина, по който подкрепяме общността си, нашите ценности ни водят напред.',
  'ourValues.livingValuesText2': 'Когато се присъедините към EcoLearn, ставате част от движение, което приоритизира образованието, празнува действията, практикува състрадание и процъфтява чрез сътрудничество.',
  'ourValues.joinMission': 'Присъединете се към нашата мисия',
  'ourValues.joinMissionText': 'Готови ли сте да бъдете част от общност, която живее тези ценности всеки ден? Започнете пътуването си с EcoLearn.',
  'ourValues.learnMore': 'Научете повече за нас',
};
