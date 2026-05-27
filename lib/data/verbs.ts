import type { Verb } from "@/lib/types";

export const VERBS: Verb[] = [
  // ── A1 ──────────────────────────────────────────
  { id:"v001", infinitive:"be",      pastSimple:"was/were", pastParticiple:"been",       spanish:"ser/estar",          level:"A1", forms:{ present:"am/is/are", presentThird:"is",       presentParticiple:"being"      } },
  { id:"v002", infinitive:"have",    pastSimple:"had",      pastParticiple:"had",        spanish:"tener/haber",        level:"A1", forms:{ present:"have",      presentThird:"has",      presentParticiple:"having"     } },
  { id:"v003", infinitive:"do",      pastSimple:"did",      pastParticiple:"done",       spanish:"hacer",              level:"A1", forms:{ present:"do",        presentThird:"does",     presentParticiple:"doing"      } },
  { id:"v004", infinitive:"go",      pastSimple:"went",     pastParticiple:"gone",       spanish:"ir",                 level:"A1", forms:{ present:"go",        presentThird:"goes",     presentParticiple:"going"      } },
  { id:"v005", infinitive:"say",     pastSimple:"said",     pastParticiple:"said",       spanish:"decir",              level:"A1", forms:{ present:"say",       presentThird:"says",     presentParticiple:"saying"     } },
  { id:"v006", infinitive:"get",     pastSimple:"got",      pastParticiple:"got/gotten", spanish:"obtener/conseguir",  level:"A1", forms:{ present:"get",       presentThird:"gets",     presentParticiple:"getting"    } },
  { id:"v007", infinitive:"make",    pastSimple:"made",     pastParticiple:"made",       spanish:"hacer/fabricar",     level:"A1", forms:{ present:"make",      presentThird:"makes",    presentParticiple:"making"     } },
  { id:"v008", infinitive:"know",    pastSimple:"knew",     pastParticiple:"known",      spanish:"saber/conocer",      level:"A1", forms:{ present:"know",      presentThird:"knows",    presentParticiple:"knowing"    } },
  { id:"v009", infinitive:"think",   pastSimple:"thought",  pastParticiple:"thought",    spanish:"pensar/creer",       level:"A1", forms:{ present:"think",     presentThird:"thinks",   presentParticiple:"thinking"   } },
  { id:"v010", infinitive:"see",     pastSimple:"saw",      pastParticiple:"seen",       spanish:"ver",                level:"A1", forms:{ present:"see",       presentThird:"sees",     presentParticiple:"seeing"     } },
  { id:"v011", infinitive:"want",    pastSimple:"wanted",   pastParticiple:"wanted",     spanish:"querer",             level:"A1", forms:{ present:"want",      presentThird:"wants",    presentParticiple:"wanting"    } },
  { id:"v012", infinitive:"come",    pastSimple:"came",     pastParticiple:"come",       spanish:"venir",              level:"A1", forms:{ present:"come",      presentThird:"comes",    presentParticiple:"coming"     } },
  // ── A2 ──────────────────────────────────────────
  { id:"v013", infinitive:"take",    pastSimple:"took",     pastParticiple:"taken",      spanish:"tomar/llevar",       level:"A2", forms:{ present:"take",      presentThird:"takes",    presentParticiple:"taking"     } },
  { id:"v014", infinitive:"give",    pastSimple:"gave",     pastParticiple:"given",      spanish:"dar",                level:"A2", forms:{ present:"give",      presentThird:"gives",    presentParticiple:"giving"     } },
  { id:"v015", infinitive:"find",    pastSimple:"found",    pastParticiple:"found",      spanish:"encontrar",          level:"A2", forms:{ present:"find",      presentThird:"finds",    presentParticiple:"finding"    } },
  { id:"v016", infinitive:"tell",    pastSimple:"told",     pastParticiple:"told",       spanish:"decir/contar",       level:"A2", forms:{ present:"tell",      presentThird:"tells",    presentParticiple:"telling"    } },
  { id:"v017", infinitive:"use",     pastSimple:"used",     pastParticiple:"used",       spanish:"usar",               level:"A2", forms:{ present:"use",       presentThird:"uses",     presentParticiple:"using"      } },
  { id:"v018", infinitive:"feel",    pastSimple:"felt",     pastParticiple:"felt",       spanish:"sentir/sentirse",    level:"A2", forms:{ present:"feel",      presentThird:"feels",    presentParticiple:"feeling"    } },
  { id:"v019", infinitive:"try",     pastSimple:"tried",    pastParticiple:"tried",      spanish:"intentar",           level:"A2", forms:{ present:"try",       presentThird:"tries",    presentParticiple:"trying"     } },
  { id:"v020", infinitive:"leave",   pastSimple:"left",     pastParticiple:"left",       spanish:"salir/dejar",        level:"A2", forms:{ present:"leave",     presentThird:"leaves",   presentParticiple:"leaving"    } },
  { id:"v021", infinitive:"put",     pastSimple:"put",      pastParticiple:"put",        spanish:"poner",              level:"A2", forms:{ present:"put",       presentThird:"puts",     presentParticiple:"putting"    } },
  { id:"v022", infinitive:"mean",    pastSimple:"meant",    pastParticiple:"meant",      spanish:"significar",         level:"A2", forms:{ present:"mean",      presentThird:"means",    presentParticiple:"meaning"    } },
  { id:"v023", infinitive:"keep",    pastSimple:"kept",     pastParticiple:"kept",       spanish:"mantener/guardar",   level:"A2", forms:{ present:"keep",      presentThird:"keeps",    presentParticiple:"keeping"    } },
  { id:"v024", infinitive:"let",     pastSimple:"let",      pastParticiple:"let",        spanish:"dejar/permitir",     level:"A2", forms:{ present:"let",       presentThird:"lets",     presentParticiple:"letting"    } },
  // ── B1 ──────────────────────────────────────────
  { id:"v025", infinitive:"seem",    pastSimple:"seemed",   pastParticiple:"seemed",     spanish:"parecer",            level:"B1", forms:{ present:"seem",      presentThird:"seems",    presentParticiple:"seeming"    } },
  { id:"v026", infinitive:"turn",    pastSimple:"turned",   pastParticiple:"turned",     spanish:"girar/convertirse",  level:"B1", forms:{ present:"turn",      presentThird:"turns",    presentParticiple:"turning"    } },
  { id:"v027", infinitive:"show",    pastSimple:"showed",   pastParticiple:"shown",      spanish:"mostrar",            level:"B1", forms:{ present:"show",      presentThird:"shows",    presentParticiple:"showing"    } },
  { id:"v028", infinitive:"hear",    pastSimple:"heard",    pastParticiple:"heard",      spanish:"escuchar/oír",       level:"B1", forms:{ present:"hear",      presentThird:"hears",    presentParticiple:"hearing"    } },
  { id:"v029", infinitive:"ask",     pastSimple:"asked",    pastParticiple:"asked",      spanish:"preguntar/pedir",    level:"B1", forms:{ present:"ask",       presentThird:"asks",     presentParticiple:"asking"     } },
  { id:"v030", infinitive:"allow",   pastSimple:"allowed",  pastParticiple:"allowed",    spanish:"permitir",           level:"B1", forms:{ present:"allow",     presentThird:"allows",   presentParticiple:"allowing"   } },
  { id:"v031", infinitive:"spend",   pastSimple:"spent",    pastParticiple:"spent",      spanish:"gastar/pasar (tiempo)", level:"B1", forms:{ present:"spend",  presentThird:"spends",   presentParticiple:"spending"   } },
  { id:"v032", infinitive:"grow",    pastSimple:"grew",     pastParticiple:"grown",      spanish:"crecer",             level:"B1", forms:{ present:"grow",      presentThird:"grows",    presentParticiple:"growing"    } },
  { id:"v033", infinitive:"carry",   pastSimple:"carried",  pastParticiple:"carried",    spanish:"cargar/llevar",      level:"B1", forms:{ present:"carry",     presentThird:"carries",  presentParticiple:"carrying"   } },
  { id:"v034", infinitive:"happen",  pastSimple:"happened", pastParticiple:"happened",   spanish:"ocurrir/pasar",      level:"B1", forms:{ present:"happen",    presentThird:"happens",  presentParticiple:"happening"  } },
  { id:"v035", infinitive:"believe", pastSimple:"believed", pastParticiple:"believed",   spanish:"creer",              level:"B1", forms:{ present:"believe",   presentThird:"believes", presentParticiple:"believing"  } },
  { id:"v036", infinitive:"provide", pastSimple:"provided", pastParticiple:"provided",   spanish:"proporcionar",       level:"B1", forms:{ present:"provide",   presentThird:"provides", presentParticiple:"providing"  } },
  // ── B2 ──────────────────────────────────────────
  { id:"v037", infinitive:"consider",pastSimple:"considered",pastParticiple:"considered",spanish:"considerar",         level:"B2", forms:{ present:"consider",  presentThird:"considers",presentParticiple:"considering"} },
  { id:"v038", infinitive:"achieve", pastSimple:"achieved", pastParticiple:"achieved",   spanish:"lograr/alcanzar",    level:"B2", forms:{ present:"achieve",   presentThird:"achieves", presentParticiple:"achieving"  } },
  { id:"v039", infinitive:"involve", pastSimple:"involved", pastParticiple:"involved",   spanish:"involucrar",         level:"B2", forms:{ present:"involve",   presentThird:"involves", presentParticiple:"involving"  } },
  { id:"v040", infinitive:"require", pastSimple:"required", pastParticiple:"required",   spanish:"requerir/necesitar", level:"B2", forms:{ present:"require",   presentThird:"requires", presentParticiple:"requiring"  } },
  { id:"v041", infinitive:"establish",pastSimple:"established",pastParticiple:"established",spanish:"establecer",      level:"B2", forms:{ present:"establish", presentThird:"establishes",presentParticiple:"establishing"} },
  { id:"v042", infinitive:"represent",pastSimple:"represented",pastParticiple:"represented",spanish:"representar",     level:"B2", forms:{ present:"represent", presentThird:"represents",presentParticiple:"representing"} },
  { id:"v043", infinitive:"tend",    pastSimple:"tended",   pastParticiple:"tended",     spanish:"tender a/soler",     level:"B2", forms:{ present:"tend",      presentThird:"tends",    presentParticiple:"tending"    } },
  { id:"v044", infinitive:"suggest", pastSimple:"suggested",pastParticiple:"suggested",  spanish:"sugerir",            level:"B2", forms:{ present:"suggest",   presentThird:"suggests", presentParticiple:"suggesting" } },
  { id:"v045", infinitive:"maintain",pastSimple:"maintained",pastParticiple:"maintained",spanish:"mantener",           level:"B2", forms:{ present:"maintain",  presentThird:"maintains",presentParticiple:"maintaining"} },
  { id:"v046", infinitive:"identify",pastSimple:"identified",pastParticiple:"identified",spanish:"identificar",        level:"B2", forms:{ present:"identify",  presentThird:"identifies",presentParticiple:"identifying"} },
  { id:"v047", infinitive:"assume",  pastSimple:"assumed",  pastParticiple:"assumed",    spanish:"asumir/suponer",     level:"B2", forms:{ present:"assume",    presentThird:"assumes",  presentParticiple:"assuming"   } },
  { id:"v048", infinitive:"argue",   pastSimple:"argued",   pastParticiple:"argued",     spanish:"argumentar/discutir",level:"B2", forms:{ present:"argue",     presentThird:"argues",   presentParticiple:"arguing"    } },
];

export const CEFR_LEVELS = ["A1","A2","B1","B2"] as const;

const LEVEL_ORDER: Record<string, number> = { A1:0, A2:1, B1:2, B2:3, C1:4, C2:5 };

/**
 * Devuelve los verbos disponibles para un usuario según su nivel.
 */
export function getVerbsForLevel(userLevel: string): typeof VERBS {
  const userIdx = LEVEL_ORDER[userLevel] ?? 2;
  return VERBS.filter((v) => (LEVEL_ORDER[v.level] ?? 0) <= userIdx);
}

export function isVerbLevelUnlocked(level: string, userLevel: string): boolean {
  return (LEVEL_ORDER[level] ?? 0) <= (LEVEL_ORDER[userLevel] ?? 2);
}
