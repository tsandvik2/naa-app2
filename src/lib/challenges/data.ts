export interface ChallengeEntry {
  text: string;
  cat: string;
  cam?: boolean;
  p?: string; // punishment
}

export interface ChallengeDB {
  easy: { solo: ChallengeEntry[]; group: ChallengeEntry[] };
  medium: { solo: ChallengeEntry[]; group: ChallengeEntry[] };
  wild: { solo: ChallengeEntry[]; group: ChallengeEntry[] };
  safe: { solo: ChallengeEntry[]; group: ChallengeEntry[] };
}

export const CHALLENGES: ChallengeDB = {
  easy: {
    solo: [
      { text: "Lag et selvportrett med bare emojis og send til en venn 🎨", cat: "kreativ" },
      { text: "Finn det mest dramatiske du kan fotografere i rommet ditt akkurat nå 📸", cat: "kreativ", cam: true },
      { text: "Skriv en 4-linjes rap om det kjedeligste objektet du ser 🎤", cat: "kreativ" },
      { text: "Ring noen du ikke har snakket med på lenge, bare for å si hei 📞", cat: "sosial" },
      { text: "Lag verdens rareste sandwich og ta et dramatisk bilde av den 🥪", cat: "kreativ", cam: true },
      { text: "Dans alene til første sang på shuffle i 60 sekunder – gjør det skikkelig! 🕺", cat: "fysisk", cam: true },
      { text: "Tegn et portrett av favorittpersonen din uten å løfte pennen ✏️", cat: "kreativ", cam: true },
      { text: "Send en overdrevet kompliment til noen akkurat nå 💌", cat: "sosial" },
      { text: "Finn noe i rommet som ligner et kjent ansikt og ta bilde av det 🔍", cat: "kreativ", cam: true },
      { text: "Gjør 20 push-ups mens du synger favorittlåten din høyt 💪", cat: "fysisk" },
      { text: "Gå ut og finn det vakreste bladet eller steinen du kan. Ta et kunstnerisk bilde 🍂", cat: "fysisk", cam: true },
      { text: "Lag et kunstverk av det som er i søppelbøtten akkurat nå 🗑️", cat: "kreativ", cam: true },
      { text: "Skriv et dikt om værmeldingen for i dag 🌦️", cat: "kreativ" },
      { text: "Ta et bilde av skyggen din i en morsom positur 🕶️", cat: "fysisk", cam: true },
      { text: "Send en melding til mamma eller pappa kun med emojis og se hva de svarer 📱", cat: "sosial" },
      { text: "Finn tre ting i rommet som starter på samme bokstav og ta bilde av dem 🔤", cat: "kreativ", cam: true },
      { text: "Gjør ti hopp på ett bein mens du holder balanse så lenge du kan ⚖️", cat: "fysisk" },
      { text: "Tegn ansiktet ditt med feil hånd og post resultatet 🖐️", cat: "kreativ", cam: true },
      { text: "Legg deg på gulvet og ta et bilde rett opp i taket 📷", cat: "kreativ", cam: true },
      { text: "Skriv ned fem rare ting du har gjort denne uken 📝", cat: "kreativ" },
    ],
    group: [
      { text: "Alle lager et ansikt av maten sin – send bilde til gjengen. Stem på beste! 🍽️", cat: "kreativ", cam: true, p: "Taperen gjør en kylling-dans og filmer det 🐔" },
      { text: "Hvem holder rett ansikt lengst mens de andre lager grimaser? 😐", cat: "sosial", cam: true, p: "Taperen gjør sin beste kylling-dans foran alle 🐔" },
      { text: "Alle skriver en 4-linjes rap om personen til høyre og leser høyt 🎤", cat: "kreativ", p: "Dårligste rapper synger sin rap som voice memo til alle 🎵" },
      { text: "Hvem finner den rareste tingen i lommen sin? Alle viser frem! 👜", cat: "sosial", cam: true, p: "Den med kjedeligst gjenstand bærer den som halskjede i 30 min 😄" },
      { text: "Alle tegner hverandre – 60 sekunder per portrett. Vis frem og stem i gjengen! 🖼️", cat: "kreativ", cam: true, p: "Dårligste kunstner bruker bildet som profilbilde i 12 timer 😂" },
      { text: "Alle poserer som en kjent statue i 30 sekunder – stem på best! 🗿", cat: "kreativ", cam: true, p: "Taperen er DJ resten av kvelden 🎵" },
      { text: "Synkroniser et hopp og ta bilde akkurat idet alle er i luften 🦘", cat: "fysisk", cam: true, p: "Den som ikke hopper høyt nok gjør 10 squats 🏋️" },
      { text: "Alle lager verdens beste grimase – stem på hvem som vinner! 😜", cat: "sosial", cam: true, p: "Den med kjedeligst grimase gjør en kylling-dans 🐔" },
      { text: "Alle skriver ned en morsom fakta om seg selv på papir, blander og leser opp 🤫", cat: "sosial", p: "Alle gjetter hvem som eier hvilken fakta 🕵️" },
      { text: "Hvem kan balansere flest ting på hodet? Film det! 🎩", cat: "fysisk", cam: true, p: "Taperen bærer én ting på hodet i 10 minutter 😂" },
    ],
  },
  medium: {
    solo: [
      { text: "Hold 1 min seriøs tale: du er Norges beste kokk 👨‍🍳 Ingen latter tillatt!", cat: "kreativ", cam: true },
      { text: "Send en overdramatisk unnskyldning til noen for noe HELT uviktig 😭", cat: "sosial" },
      { text: "Gå ut og finn noe blått innen 5 minutter – ta et kunstnerisk bilde 🔵", cat: "fysisk", cam: true },
      { text: "Bytt profilbilde til det mest dramatiske selfiet du kan ta – hold det 24 timer 📷", cat: "sosial", cam: true },
      { text: "Skriv og send en 10-setnings novelle om naboen din på 5 minutter 📖", cat: "kreativ" },
      { text: "Lær deg en dans-move fra YouTube på 10 minutter og film resultatet 💃", cat: "fysisk", cam: true },
      { text: "Lag en 15-sekunders reklame for gjenstanden nærmest deg akkurat nå 📹", cat: "kreativ", cam: true },
      { text: "Gå en tur ute og hils på ti fremmede med overdreven entusiasme 👋", cat: "fysisk" },
      { text: "Ta bilde av fem ting ute som alle er samme farge 🎨", cat: "fysisk", cam: true },
      { text: "Finn en offentlig benk og hold en stumfilm-monolog på 30 sekunder 🎭", cat: "kreativ", cam: true },
      { text: "Sprint til nærmeste lykt og tilbake – ta tid og forsøk å slå den 🏃", cat: "fysisk" },
      { text: "Lag en skulptur av det du finner ute på 5 minutter 🌿", cat: "kreativ", cam: true },
      { text: "Klatr opp noe trygt og ta et bilde fra fugleperspektiv 🦅", cat: "fysisk", cam: true },
      { text: "Tegn et kart over nabolaget ditt fra hukommelsen – så detaljert du klarer 🗺️", cat: "kreativ", cam: true },
      { text: "Lag et portrett av en venn kun med emojier på 2 minutter og send det 🎨", cat: "kreativ" },
    ],
    group: [
      { text: "En person ringer en butikk og spør seriøst om de har usynlig tape 📞", cat: "sosial", p: "Taperen ringer ny butikk med enda rimeligere spørsmål 😂" },
      { text: "Alle lager en 15-sekunders stumfilm med det rundt dere. Stem på beste! 🎬", cat: "kreativ", cam: true, p: "Dårligste regissør spiller statist i neste film 🎭" },
      { text: "Send til den 7. i kontaktlisten: 'Du vet hva du har gjort.' Vent på svar 😂", cat: "sosial", p: "Den som ler først sender samme melding til to nye kontakter 💀" },
      { text: "Alle bytter telefon i 3 minutter og sender én melding til tilfeldig kontakt 📱", cat: "kaos", p: "Den som sender noe kjedelig velger neste utfordring 🎯" },
      { text: "Gjengen lager salg-pitch for et hverdagsobjekt på 5 min – stem! 💼", cat: "kreativ", cam: true, p: "Dårligste selger bruker objektet som hatt hele kvelden 🎩" },
    ],
  },
  wild: {
    solo: [
      { text: "Gå i en butikk og spør helt seriøst etter energikrystaller til hunden din 🔮", cat: "sosial", cam: true },
      { text: "Bestill på kafé med falsk aksent — hold den HELE veien 🎭", cat: "sosial", cam: true },
      { text: "Gå bort til en fremmed og si at du er STOR fan av arbeidet deres 🌟", cat: "sosial", cam: true },
      { text: "Ring noen og si kun 'Du vet hva du har gjort' og legg på 📞", cat: "kaos" },
      { text: "Ta en spontan selfie med den første fremmede som sier ja på gaten 🤳", cat: "sosial", cam: true },
      { text: "Gå inn i en butikk og spør om de har 'retroaktiv pizza'. Film reaksjonen 🎥", cat: "kaos", cam: true },
      { text: "Snakk KUN i spørsmål til neste person i 5 min 🤔 Ingen påstander!", cat: "sosial" },
      { text: "Si til en fremmed at du har mistet hunden din — beskriv en helt oppdiktet hund 🐕", cat: "kaos" },
      { text: "Gi deg selv et falskt navn + yrke og presenter deg for neste fremmed 🕵️", cat: "sosial" },
      { text: "Ring en pizza-restaurant og spør om de leverer til månen 🌕", cat: "kaos" },
    ],
    group: [
      { text: "En i gjengen er berømt – resten er fans. Dere møtes tilfeldig ute. Spill det ut! 🌟", cat: "kaos", cam: true, p: "Den som bryter karakter bærer tittelen 'Amatørskuespiller' resten av dagen 🎭" },
      { text: "Alle lager synkronisert dans til tilfeldig sang. 5 min å øve – film og post! 💃", cat: "kaos", cam: true, p: "Den med dårligst timing ber gjengen om tilgivelse overdramatisk 😂" },
      { text: "En person er 'ja-personen' – sier ja til alt de andre foreslår i 10 minutter! 😈", cat: "kaos", p: "Nekter ja-personen dobles varigheten og alle bytter roller 😂" },
      { text: "Alle bytter personlighet med personen til høyre i 15 minutter. Inn i karakter NÅ! 🎭", cat: "kaos", cam: true, p: "Den som bryter ut av karakteren raskest velger neste utfordring 🎯" },
      { text: "Flash mob! Alle fryser på signal i et offentlig rom i 30 sekunder 🧊", cat: "kaos", cam: true, p: "Den som beveger seg velger neste utfordring 🎯" },
    ],
  },
  safe: {
    solo: [
      { text: "Tegn selvportrett på 60 sekunder – vis det frem! 🎨", cat: "kreativ", cam: true },
      { text: "Finn 5 blå gjenstander hjemme og lag en kreativ oppstilling 🔵", cat: "kreativ", cam: true },
      { text: "Send en morsom GIF til en kompis akkurat nå 😄", cat: "sosial" },
      { text: "Lag en 30-sekunders reklame for favorittmaten din 📺", cat: "kreativ", cam: true },
      { text: "Dans til favorittlåten din i 1 minutt – ingen stopp! 🕺", cat: "fysisk", cam: true },
      { text: "Finn noe hjemme som ligner et dyr og ta et kunstnerisk bilde 🐾", cat: "kreativ", cam: true },
      { text: "Skriv en sang om skoledagen på fire linjer 🎵", cat: "kreativ" },
      { text: "Balanser en ting på hodet og gå fra ett rom til et annet 🎩", cat: "fysisk" },
    ],
    group: [
      { text: "Alle lager det morsomste ansiktet de kan – stem i gjengen! 😜", cat: "sosial", cam: true, p: "Kjedeligste ansikt gjør en kylling-dans 🐔" },
      { text: "Lag en synkronisert dans på 30 sekunder – film det! 💃", cat: "kreativ", cam: true, p: "Den med dårligst timing velger neste utfordring 😅" },
      { text: "Alle poserer som berømte statuer – hvem er best? 🗿", cat: "kreativ", cam: true, p: "Taperen er DJ resten av kvelden 🎵" },
      { text: "Lag en menneskekjede og gå ti skritt uten å miste grepet 🤝", cat: "fysisk", p: "Den som slipper velger neste utfordring 🎯" },
      { text: "Alle skriker favorittlåten sin samtidig i 10 sekunder 🎤", cat: "sosial", cam: true, p: "Den med lavest volum synger alene etterpå 🎵" },
    ],
  },
};

export interface ChallengeOptions {
  mood: string;
  time: string;
  players: number | string;
  ageGroup: string;
}

export interface SelectedChallenge {
  text: string;
  cat: string;
  cam: boolean;
  punishment: string | null;
  difficulty: "easy" | "medium" | "wild" | "safe";
  timeMinutes: number;
}

export function pickChallenge(opts: ChallengeOptions): SelectedChallenge {
  const isGroup =
    opts.players === "4+" ||
    (typeof opts.players === "number" && opts.players > 1);

  // Pick difficulty based on mood
  let difficulty: "easy" | "medium" | "wild" | "safe";
  if (opts.ageGroup === "13-15") {
    difficulty = "safe";
  } else if (opts.mood === "Klar for galskap") {
    difficulty = "wild";
  } else if (opts.mood === "Energisk") {
    difficulty = "medium";
  } else if (opts.mood === "Avslappet") {
    difficulty = "easy";
  } else {
    difficulty = "easy";
  }

  const pool = CHALLENGES[difficulty][isGroup ? "group" : "solo"];
  const entry = pool[Math.floor(Math.random() * pool.length)];

  // Time in minutes
  let timeMinutes = 10;
  if (opts.time === "30 min") timeMinutes = 30;
  else if (opts.time === "1 time") timeMinutes = 60;
  else if (opts.time === "Hele kvelden") timeMinutes = 120;

  return {
    text: entry.text,
    cat: entry.cat,
    cam: !!entry.cam,
    punishment: entry.p ?? null,
    difficulty,
    timeMinutes,
  };
}

export const DAILY_CHALLENGE: ChallengeEntry = {
  text: "Hils på tre nye mennesker i dag – si noe genuint hyggelig til hver 👋",
  cat: "sosial",
};

export const AVATARS = [
  { em: "🔥", label: "Flamme", vibe: "Energisk" },
  { em: "⚡", label: "Lyn", vibe: "Rask" },
  { em: "🌊", label: "Bølge", vibe: "Rolig" },
  { em: "🎯", label: "Mål", vibe: "Fokusert" },
  { em: "🦁", label: "Løve", vibe: "Modig" },
  { em: "🐺", label: "Ulv", vibe: "Vill" },
  { em: "🦊", label: "Rev", vibe: "Lur" },
  { em: "🐉", label: "Drage", vibe: "Episk" },
  { em: "🌙", label: "Måne", vibe: "Mystisk" },
  { em: "☀️", label: "Sol", vibe: "Glad" },
  { em: "🌈", label: "Regnbue", vibe: "Fargerik" },
  { em: "💎", label: "Diamant", vibe: "Sjelden" },
];

export function generateFriendCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "NÅ-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
