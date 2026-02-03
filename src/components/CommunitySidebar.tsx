// import { Globe, School, Users, Shield } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useLanguage } from "@/contexts/LanguageContext";

// // Типове за пропъртитата, които Sidebar-а очаква от Бащата
// interface CommunitySidebarProps {
//   activeFeed: string;
//   setActiveFeed: (feed: string) => void;
//   isMobileMenuOpen: boolean;
//   setIsMobileMenuOpen: (isOpen: boolean) => void;
//   user: {
//     role: string;
//     school: string;
//     class: string;
//   };
//   headerDetails: {
//     title: string;
//     subtitle: string;
//     icon: React.ReactNode;
//   };
//   allSchools: string[];
//   allClasses: string[];
// }

// // Помощен компонент само за бутоните (локален за този файл)
// const SidebarButton = ({
//   active,
//   icon,
//   label,
//   onClick,
// }: {
//   active: boolean;
//   icon: React.ReactNode;
//   label: string;
//   onClick: () => void;
// }) => (
//   <Button
//     variant={active ? "secondary" : "ghost"}
//     className={`w-full justify-start gap-3 h-11 px-3 relative transition-all duration-200 rounded-xl ${
//       active
//         ? "bg-gradient-to-r from-primary/15 to-emerald-500/10 text-primary font-semibold shadow-sm border border-primary/20"
//         : "text-muted-foreground hover:bg-primary/5 hover:text-foreground border border-transparent"
//     }`}
//     onClick={onClick}
//   >
//     {active && (
//       <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-primary to-emerald-600 rounded-r-full" />
//     )}
//     <span className={`transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
//       {icon}
//     </span>
//     <span className="truncate">{label}</span>
//   </Button>
// );

// export const CommunitySidebar = ({
//   activeFeed,
//   setActiveFeed,
//   isMobileMenuOpen,
//   setIsMobileMenuOpen,
//   user,
//   headerDetails,
//   allSchools,
//   allClasses,
// }: CommunitySidebarProps) => {
//   const { t } = useLanguage();

//   const handleSelect = (feed: string) => {
//     setActiveFeed(feed);
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <>
//       {/* --- MOBILE OVERLAY (Darkens background when sidebar is open) --- */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       <aside
//         className={`
//           fixed md:relative 
//           h-[calc(100vh-64px)] /* Важно: Височината се съобразява с горния Навбар */
//           w-[280px] z-50 
//           bg-white/90 dark:bg-card/95 backdrop-blur-xl border-r border-primary/20 dark:border-border/40 shadow-xl
//           transform transition-transform duration-300 ease-in-out
//           flex flex-col
//           ${isMobileMenuOpen ? "translate-x-0 top-[64px]" : "-translate-x-full md:translate-x-0 md:top-0"}
//         `}
//       >
//         {/* HEADER INSIDE SIDEBAR */}
//         <div className="p-5 shrink-0 border-b border-primary/15 dark:border-border/40 bg-gradient-to-r from-primary/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-md">
//           <div className="flex items-center gap-3">
//             <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300">
//               {headerDetails.icon}
//             </div>
//             <div className="overflow-hidden">
//               <h2 className="font-bold text-lg leading-tight tracking-tight truncate bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
//                 {headerDetails.title}
//               </h2>
//               <p className="text-xs text-muted-foreground truncate">
//                 {headerDetails.subtitle}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* SCROLLABLE NAVIGATION */}
//         <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
//           {/* Main Feeds */}
//           <div className="space-y-1">
//             <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
//               <Globe size={12} />
//               {t("community.feeds")}
//             </h3>
//             <SidebarButton
//               active={activeFeed === "public"}
//               icon={<Globe size={18} />}
//               label={t("community.public")}
//               onClick={() => handleSelect("public")}
//             />
//           </div>

//           {/* Groups */}
//           {user.role === "student" && (
//             <div className="space-y-1 pt-4 border-t border-primary/10 dark:border-border/30">
//               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
//                 <Users size={12} />
//                 {t("community.myGroups")}
//               </h3>
//               <SidebarButton
//                 active={activeFeed === "mySchool"}
//                 icon={<School size={18} />}
//                 label={user.school}
//                 onClick={() => handleSelect("mySchool")}
//               />
//               <SidebarButton
//                 active={activeFeed === "myClass"}
//                 icon={<Users size={18} />}
//                 label={user.class}
//                 onClick={() => handleSelect("myClass")}
//               />
//             </div>
//           )}

//           {/* Moderator Tools */}
//           {user.role === "moderator" && (
//             <div className="space-y-1 pt-4 border-t border-primary/10 dark:border-border/30">
//               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
//                 <Shield size={12} /> {t("community.moderation")}
//               </h3>
//               {allSchools.map((school) => (
//                 <SidebarButton
//                   key={school}
//                   active={activeFeed === school}
//                   icon={<School size={18} />}
//                   label={school}
//                   onClick={() => handleSelect(school)}
//                 />
//               ))}
//               <div className="my-2 border-t border-primary/10 dark:border-border/30" />
//               {allClasses.map((cls) => (
//                 <SidebarButton
//                   key={cls}
//                   active={activeFeed === cls}
//                   icon={<Users size={18} />}
//                   label={cls}
//                   onClick={() => handleSelect(cls)}
//                 />
//               ))}
//             </div>
//           )}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default CommunitySidebar;