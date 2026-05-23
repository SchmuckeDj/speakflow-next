import type { Word } from "@/lib/types";

export const VOCABULARY: Word[] = [
  // A1
  { id: "w001", word: "hello", translation: "hola", level: "A1", category: "greetings", example: "Hello, how are you?" },
  { id: "w002", word: "goodbye", translation: "adiós", level: "A1", category: "greetings", example: "Goodbye! See you tomorrow." },
  { id: "w003", word: "please", translation: "por favor", level: "A1", category: "courtesy", example: "Can I have water, please?" },
  { id: "w004", word: "thank you", translation: "gracias", level: "A1", category: "courtesy", example: "Thank you for your help." },
  { id: "w005", word: "sorry", translation: "lo siento / perdón", level: "A1", category: "courtesy", example: "Sorry, I didn't understand." },
  { id: "w006", word: "yes", translation: "sí", level: "A1", category: "basic", example: "Yes, I agree." },
  { id: "w007", word: "no", translation: "no", level: "A1", category: "basic", example: "No, thank you." },
  { id: "w008", word: "help", translation: "ayuda / ayudar", level: "A1", category: "basic", example: "Can you help me?" },
  { id: "w009", word: "water", translation: "agua", level: "A1", category: "food", example: "I need a glass of water." },
  { id: "w010", word: "food", translation: "comida", level: "A1", category: "food", example: "The food is delicious." },
  // A2
  { id: "w011", word: "available", translation: "disponible", level: "A2", category: "work", example: "Are you available tomorrow?" },
  { id: "w012", word: "schedule", translation: "horario / programar", level: "A2", category: "work", example: "Let me check my schedule." },
  { id: "w013", word: "meeting", translation: "reunión", level: "A2", category: "work", example: "We have a meeting at 3pm." },
  { id: "w014", word: "deadline", translation: "fecha límite", level: "A2", category: "work", example: "The deadline is Friday." },
  { id: "w015", word: "project", translation: "proyecto", level: "A2", category: "work", example: "This project is almost done." },
  // B1
  { id: "w016", word: "implement", translation: "implementar", level: "B1", category: "tech", example: "We need to implement this feature." },
  { id: "w017", word: "deploy", translation: "desplegar / publicar", level: "B1", category: "tech", example: "Let's deploy to production." },
  { id: "w018", word: "feedback", translation: "retroalimentación", level: "B1", category: "work", example: "Can I get some feedback on this?" },
  { id: "w019", word: "prioritize", translation: "priorizar", level: "B1", category: "work", example: "We need to prioritize tasks." },
  { id: "w020", word: "collaborate", translation: "colaborar", level: "B1", category: "work", example: "Let's collaborate on this." },
  // B2
  { id: "w021", word: "leverage", translation: "aprovechar / apalancar", level: "B2", category: "business", example: "We can leverage this technology." },
  { id: "w022", word: "scalable", translation: "escalable", level: "B2", category: "tech", example: "The architecture must be scalable." },
  { id: "w023", word: "bottleneck", translation: "cuello de botella", level: "B2", category: "tech", example: "We found a bottleneck in the pipeline." },
  { id: "w024", word: "iterate", translation: "iterar", level: "B2", category: "tech", example: "Let's iterate on the design." },
  { id: "w025", word: "stakeholder", translation: "parte interesada", level: "B2", category: "business", example: "Keep the stakeholders informed." },
  // C1
  { id: "w026", word: "nuanced", translation: "matizado / con matices", level: "C1", category: "advanced", example: "Her answer was nuanced and thoughtful." },
  { id: "w027", word: "ambiguous", translation: "ambiguo", level: "C1", category: "advanced", example: "The requirements are ambiguous." },
  { id: "w028", word: "pragmatic", translation: "pragmático", level: "C1", category: "advanced", example: "We need a pragmatic solution." },
  { id: "w029", word: "coherent", translation: "coherente", level: "C1", category: "advanced", example: "The strategy must be coherent." },
  { id: "w030", word: "articulate", translation: "articular / expresar con claridad", level: "C1", category: "advanced", example: "She can articulate her ideas well." },
  // C2
  { id: "w031", word: "ubiquitous", translation: "omnipresente / ubicuo", level: "C2", category: "advanced", example: "Smartphones are ubiquitous today." },
  { id: "w032", word: "ephemeral", translation: "efímero", level: "C2", category: "advanced", example: "Social media stories are ephemeral." },
  { id: "w033", word: "dichotomy", translation: "dicotomía", level: "C2", category: "advanced", example: "There's a dichotomy between theory and practice." },
  { id: "w034", word: "paradigm", translation: "paradigma", level: "C2", category: "advanced", example: "AI is a paradigm shift." },
  { id: "w035", word: "inextricable", translation: "inextricable / inseparable", level: "C2", category: "advanced", example: "Technology is inextricable from modern life." },
];

export const VOCABULARY_CATEGORIES = [...new Set(VOCABULARY.map(w => w.category))];
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
