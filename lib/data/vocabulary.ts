import type { Word } from "@/lib/types";

export const VOCABULARY: Word[] = [
  // ── A1 ──────────────────────────────────────────
  { id:"w001", word:"Hello",      translation:"Hola",                level:"A1", category:"greetings",  example:'"Hello! How are you?"' },
  { id:"w002", word:"Goodbye",    translation:"Adiós",               level:"A1", category:"greetings",  example:'"Goodbye, see you tomorrow!"' },
  { id:"w003", word:"Please",     translation:"Por favor",           level:"A1", category:"courtesy",   example:'"Please sit down."' },
  { id:"w004", word:"Thanks",     translation:"Gracias",             level:"A1", category:"courtesy",   example:'"Thanks for your help!"' },
  { id:"w005", word:"Yes",        translation:"Sí",                  level:"A1", category:"basic",      example:'"Yes, I understand."' },
  { id:"w006", word:"No",         translation:"No",                  level:"A1", category:"basic",      example:'"No, thank you."' },
  { id:"w007", word:"Water",      translation:"Agua",                level:"A1", category:"food",       example:'"Can I have some water?"' },
  { id:"w008", word:"Food",       translation:"Comida",              level:"A1", category:"food",       example:'"The food here is amazing."' },
  { id:"w009", word:"House",      translation:"Casa",                level:"A1", category:"places",     example:'"This is my house."' },
  { id:"w010", word:"Car",        translation:"Carro",               level:"A1", category:"transport",  example:'"I drive a red car."' },
  { id:"w011", word:"Friend",     translation:"Amigo",               level:"A1", category:"people",     example:'"She is my best friend."' },
  { id:"w012", word:"Family",     translation:"Familia",             level:"A1", category:"people",     example:'"Family is everything."' },
  { id:"w013", word:"Work",       translation:"Trabajo",             level:"A1", category:"work",       example:'"I go to work at 8 AM."' },
  { id:"w014", word:"School",     translation:"Escuela",             level:"A1", category:"places",     example:'"The school is nearby."' },
  { id:"w015", word:"Book",       translation:"Libro",               level:"A1", category:"objects",    example:'"I\'m reading a good book."' },
  { id:"w016", word:"Phone",      translation:"Teléfono",            level:"A1", category:"objects",    example:'"My phone is almost dead."' },
  { id:"w017", word:"Happy",      translation:"Feliz",               level:"A1", category:"feelings",   example:'"I feel happy today."' },
  { id:"w018", word:"Sad",        translation:"Triste",              level:"A1", category:"feelings",   example:'"She looks a bit sad."' },
  { id:"w019", word:"Big",        translation:"Grande",              level:"A1", category:"adjectives", example:'"That\'s a big house!"' },
  { id:"w020", word:"Small",      translation:"Pequeño",             level:"A1", category:"adjectives", example:'"The small dog is cute."' },
  // ── A2 ──────────────────────────────────────────
  { id:"w021", word:"Travel",     translation:"Viajar",              level:"A2", category:"travel",     example:'"I love to travel abroad."' },
  { id:"w022", word:"Airport",    translation:"Aeropuerto",          level:"A2", category:"travel",     example:'"The airport is very busy."' },
  { id:"w023", word:"Hotel",      translation:"Hotel",               level:"A2", category:"travel",     example:'"We stayed at a nice hotel."' },
  { id:"w024", word:"Ticket",     translation:"Boleto",              level:"A2", category:"travel",     example:'"I bought a ticket online."' },
  { id:"w025", word:"Weather",    translation:"Clima",               level:"A2", category:"nature",     example:'"The weather is perfect today."' },
  { id:"w026", word:"Breakfast",  translation:"Desayuno",            level:"A2", category:"food",       example:'"Breakfast is included."' },
  { id:"w027", word:"Dinner",     translation:"Cena",                level:"A2", category:"food",       example:'"Let\'s have dinner together."' },
  { id:"w028", word:"Money",      translation:"Dinero",              level:"A2", category:"finance",    example:'"Do you have enough money?"' },
  { id:"w029", word:"Market",     translation:"Mercado",             level:"A2", category:"places",     example:'"The market opens at 7 AM."' },
  { id:"w030", word:"Clothes",    translation:"Ropa",                level:"A2", category:"shopping",   example:'"She bought new clothes."' },
  { id:"w031", word:"Exercise",   translation:"Ejercicio",           level:"A2", category:"health",     example:'"I exercise every morning."' },
  { id:"w032", word:"Language",   translation:"Idioma",              level:"A2", category:"education",  example:'"English is a global language."' },
  { id:"w033", word:"Message",    translation:"Mensaje",             level:"A2", category:"communication", example:'"Did you get my message?"' },
  { id:"w034", word:"Computer",   translation:"Computadora",         level:"A2", category:"tech",       example:'"My computer is very fast."' },
  { id:"w035", word:"Problem",    translation:"Problema",            level:"A2", category:"basic",      example:'"We have a small problem."' },
  { id:"w036", word:"Answer",     translation:"Respuesta",           level:"A2", category:"education",  example:'"What\'s the answer?"' },
  { id:"w037", word:"Question",   translation:"Pregunta",            level:"A2", category:"education",  example:'"Good question!"' },
  { id:"w038", word:"Weekend",    translation:"Fin de semana",       level:"A2", category:"time",       example:'"What are you doing this weekend?"' },
  { id:"w039", word:"Movie",      translation:"Película",            level:"A2", category:"entertainment", example:'"Let\'s watch a movie tonight."' },
  { id:"w040", word:"Music",      translation:"Música",              level:"A2", category:"entertainment", example:'"I listen to music every day."' },
  // ── B1 ──────────────────────────────────────────
  { id:"w041", word:"Improve",    translation:"Mejorar",             level:"B1", category:"work",       example:'"I want to improve my English."' },
  { id:"w042", word:"Experience", translation:"Experiencia",         level:"B1", category:"work",       example:'"She has a lot of experience."' },
  { id:"w043", word:"Opportunity",translation:"Oportunidad",         level:"B1", category:"work",       example:'"This is a great opportunity."' },
  { id:"w044", word:"Success",    translation:"Éxito",               level:"B1", category:"work",       example:'"Hard work leads to success."' },
  { id:"w045", word:"Decision",   translation:"Decisión",            level:"B1", category:"work",       example:'"It was a difficult decision."' },
  { id:"w046", word:"Challenge",  translation:"Desafío",             level:"B1", category:"work",       example:'"Every challenge makes you stronger."' },
  { id:"w047", word:"Conversation",translation:"Conversación",       level:"B1", category:"communication", example:'"We had a great conversation."' },
  { id:"w048", word:"Knowledge",  translation:"Conocimiento",        level:"B1", category:"education",  example:'"Knowledge is power."' },
  { id:"w049", word:"Support",    translation:"Soporte/Apoyo",       level:"B1", category:"work",       example:'"Thank you for your support."' },
  { id:"w050", word:"Environment",translation:"Ambiente",            level:"B1", category:"nature",     example:'"We must protect the environment."' },
  { id:"w051", word:"Project",    translation:"Proyecto",            level:"B1", category:"work",       example:'"The project is due Friday."' },
  { id:"w052", word:"Company",    translation:"Empresa",             level:"B1", category:"work",       example:'"She works for a big company."' },
  { id:"w053", word:"Interview",  translation:"Entrevista",          level:"B1", category:"work",       example:'"I have a job interview tomorrow."' },
  { id:"w054", word:"Customer",   translation:"Cliente",             level:"B1", category:"work",       example:'"The customer is always right."' },
  { id:"w055", word:"Skill",      translation:"Habilidad",           level:"B1", category:"work",       example:'"Communication is a key skill."' },
  { id:"w056", word:"Future",     translation:"Futuro",              level:"B1", category:"basic",      example:'"The future looks bright."' },
  { id:"w057", word:"Goal",       translation:"Meta",                level:"B1", category:"work",       example:'"Set a goal and pursue it."' },
  { id:"w058", word:"Advice",     translation:"Consejo",             level:"B1", category:"communication", example:'"Can I give you some advice?"' },
  { id:"w059", word:"Healthy",    translation:"Saludable",           level:"B1", category:"health",     example:'"Eating well keeps you healthy."' },
  { id:"w060", word:"Develop",    translation:"Desarrollar",         level:"B1", category:"work",       example:'"We need to develop new skills."' },
  // ── B2 ──────────────────────────────────────────
  { id:"w061", word:"Achievement",translation:"Logro",               level:"B2", category:"work",       example:'"Getting the job was a big achievement."' },
  { id:"w062", word:"Performance",translation:"Rendimiento",         level:"B2", category:"work",       example:'"Her performance was outstanding."' },
  { id:"w063", word:"Strategy",   translation:"Estrategia",          level:"B2", category:"work",       example:'"We need a better strategy."' },
  { id:"w064", word:"Confidence", translation:"Confianza",           level:"B2", category:"feelings",   example:'"Speak with confidence."' },
  { id:"w065", word:"Responsibility",translation:"Responsabilidad",  level:"B2", category:"work",       example:'"He took full responsibility."' },
  { id:"w066", word:"Communication",translation:"Comunicación",      level:"B2", category:"communication", example:'"Good communication is essential."' },
  { id:"w067", word:"Improvement",translation:"Mejora",              level:"B2", category:"work",       example:'"There\'s room for improvement."' },
  { id:"w068", word:"Solution",   translation:"Solución",            level:"B2", category:"work",       example:'"We found a solution quickly."' },
  { id:"w069", word:"Behavior",   translation:"Comportamiento",      level:"B2", category:"people",     example:'"His behavior was unprofessional."' },
  { id:"w070", word:"Management", translation:"Gestión",             level:"B2", category:"work",       example:'"Time management is crucial."' },
  { id:"w071", word:"Leadership", translation:"Liderazgo",           level:"B2", category:"work",       example:'"Strong leadership inspires teams."' },
  { id:"w072", word:"Research",   translation:"Investigación",       level:"B2", category:"education",  example:'"The research took two years."' },
  { id:"w073", word:"Technology", translation:"Tecnología",          level:"B2", category:"tech",       example:'"Technology is changing fast."' },
  { id:"w074", word:"Relationship",translation:"Relación",           level:"B2", category:"people",     example:'"Build strong relationships at work."' },
  { id:"w075", word:"Motivation", translation:"Motivación",          level:"B2", category:"feelings",   example:'"What\'s your motivation?"' },
  { id:"w076", word:"Discussion", translation:"Discusión",           level:"B2", category:"communication", example:'"Let\'s open the discussion."' },
  { id:"w077", word:"Industry",   translation:"Industria",           level:"B2", category:"work",       example:'"The tech industry is booming."' },
  { id:"w078", word:"Creative",   translation:"Creativo",            level:"B2", category:"adjectives", example:'"She has a very creative mind."' },
  { id:"w079", word:"Efficient",  translation:"Eficiente",           level:"B2", category:"adjectives", example:'"We need a more efficient process."' },
  { id:"w080", word:"Independent",translation:"Independiente",       level:"B2", category:"adjectives", example:'"She is very independent."' },
  // ── C1 ──────────────────────────────────────────
  { id:"w081", word:"Accurate",   translation:"Preciso",             level:"C1", category:"adjectives", example:'"The report must be accurate."' },
  { id:"w082", word:"Awareness",  translation:"Conciencia",          level:"C1", category:"advanced",   example:'"Raise awareness about climate change."' },
  { id:"w083", word:"Significant",translation:"Significativo",       level:"C1", category:"adjectives", example:'"A significant improvement was noted."' },
  { id:"w084", word:"Perspective",translation:"Perspectiva",         level:"C1", category:"advanced",   example:'"Try to see it from my perspective."' },
  { id:"w085", word:"Complex",    translation:"Complejo",            level:"C1", category:"adjectives", example:'"This is a complex situation."' },
  { id:"w086", word:"Maintain",   translation:"Mantener",            level:"C1", category:"work",       example:'"Maintain eye contact during interviews."' },
  { id:"w087", word:"Establish",  translation:"Establecer",          level:"C1", category:"work",       example:'"We need to establish clear goals."' },
  { id:"w088", word:"Contribution",translation:"Contribución",       level:"C1", category:"work",       example:'"Her contribution was invaluable."' },
  { id:"w089", word:"Competitive",translation:"Competitivo",         level:"C1", category:"adjectives", example:'"The market is highly competitive."' },
  { id:"w090", word:"Interpretation",translation:"Interpretación",   level:"C1", category:"advanced",   example:'"There are many interpretations."' },
  { id:"w091", word:"Requirement",translation:"Requisito",           level:"C1", category:"work",       example:'"Meeting every requirement is key."' },
  { id:"w092", word:"Reliable",   translation:"Confiable",           level:"C1", category:"adjectives", example:'"We need a reliable partner."' },
  { id:"w093", word:"Influence",  translation:"Influencia",          level:"C1", category:"work",       example:'"She has great influence in the team."' },
  { id:"w094", word:"Resource",   translation:"Recurso",             level:"C1", category:"work",       example:'"Allocate resources wisely."' },
  { id:"w095", word:"Negotiation",translation:"Negociación",         level:"C1", category:"work",       example:'"The negotiation lasted three hours."' },
  { id:"w096", word:"Efficiently",translation:"Eficientemente",      level:"C1", category:"advanced",   example:'"Work efficiently under pressure."' },
  { id:"w097", word:"Circumstance",translation:"Circunstancia",      level:"C1", category:"advanced",   example:'"Under no circumstance should you lie."' },
  { id:"w098", word:"Professionalism",translation:"Profesionalismo", level:"C1", category:"work",       example:'"Professionalism builds trust."' },
  // ── C2 ──────────────────────────────────────────
  { id:"w099", word:"Nevertheless",translation:"Sin embargo",        level:"C2", category:"advanced",   example:'"Nevertheless, we pushed forward."' },
  { id:"w100", word:"Furthermore",translation:"Además",              level:"C2", category:"advanced",   example:'"Furthermore, the data confirms our theory."' },
  { id:"w101", word:"Consequently",translation:"En consecuencia",    level:"C2", category:"advanced",   example:'"Consequently, sales dropped sharply."' },
  { id:"w102", word:"Substantial", translation:"Sustancial",         level:"C2", category:"adjectives", example:'"There was a substantial increase in revenue."' },
  { id:"w103", word:"Comprehensive",translation:"Integral",          level:"C2", category:"adjectives", example:'"A comprehensive review was conducted."' },
  { id:"w104", word:"Sophisticated",translation:"Sofisticado",       level:"C2", category:"adjectives", example:'"A sophisticated approach is required."' },
  { id:"w105", word:"Controversial",translation:"Controversial",     level:"C2", category:"adjectives", example:'"The decision was quite controversial."' },
  { id:"w106", word:"Simultaneously",translation:"Simultáneamente",  level:"C2", category:"advanced",   example:'"Both events occurred simultaneously."' },
  { id:"w107", word:"Perception",  translation:"Percepción",         level:"C2", category:"advanced",   example:'"Perception shapes our reality."' },
  { id:"w108", word:"Constraint",  translation:"Restricción",        level:"C2", category:"work",       example:'"Budget constraints limited our options."' },
  { id:"w109", word:"Distinguished",translation:"Distinguido",       level:"C2", category:"adjectives", example:'"A distinguished career in medicine."' },
  { id:"w110", word:"Intellectual",translation:"Intelectual",        level:"C2", category:"advanced",   example:'"An intellectual discussion about ethics."' },
  { id:"w111", word:"Consistency", translation:"Consistencia",       level:"C2", category:"work",       example:'"Consistency is key to mastery."' },
  { id:"w112", word:"Profound",    translation:"Profundo",           level:"C2", category:"adjectives", example:'"A profound impact on society."' },
  { id:"w113", word:"Compelling",  translation:"Convincente",        level:"C2", category:"adjectives", example:'"She made a compelling argument."' },
  { id:"w114", word:"Deliberately",translation:"Deliberadamente",    level:"C2", category:"advanced",   example:'"He deliberately avoided the question."' },
  { id:"w115", word:"Invaluable",  translation:"Invaluable",         level:"C2", category:"adjectives", example:'"Your feedback is invaluable."' },
  { id:"w116", word:"Nonetheless", translation:"No obstante",        level:"C2", category:"advanced",   example:'"Nonetheless, we continued our work."' },
  { id:"w117", word:"Predominantly",translation:"Predominantemente", level:"C2", category:"advanced",   example:'"The workforce is predominantly young."' },
];

export const CEFR_LEVELS = ["A1","A2","B1","B2","C1","C2"] as const;

// Orden de desbloqueo — cada nivel incluye los anteriores
const LEVEL_ORDER: Record<string, number> = { A1:0, A2:1, B1:2, B2:3, C1:4, C2:5 };

/**
 * Devuelve las palabras disponibles para un usuario según su nivel.
 * Un usuario B1 ve A1 + A2 + B1.
 */
export function getWordsForLevel(userLevel: string): typeof VOCABULARY {
  const userIdx = LEVEL_ORDER[userLevel] ?? 2; // default B1
  return VOCABULARY.filter((w) => (LEVEL_ORDER[w.level] ?? 0) <= userIdx);
}

/**
 * Devuelve si un nivel está desbloqueado para el usuario.
 */
export function isLevelUnlocked(level: string, userLevel: string): boolean {
  return (LEVEL_ORDER[level] ?? 0) <= (LEVEL_ORDER[userLevel] ?? 2);
}
