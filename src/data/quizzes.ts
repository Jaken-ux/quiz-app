import type {
  Difficulty,
  Question,
  QuestionMockStats,
  Quiz,
} from "@/types/quiz";

// Granskningsnoter för flaggade frågor finns i docs/CONTENT-REVIEW.md.
// Datan här ska aldrig innehålla note_for_review-fält — det är intern dokumentation.

// MOCK STATS: per-fråga-statistik (totalAnswered, correctRate, averageTime)
// genereras deterministiskt utifrån frågans id + difficulty + timer i
// `synthMockStats` nedan. Ersätt med riktig backend-data när vi har en.
type QuestionDraft = Omit<Question, "mockStats">;
type QuizDraft = Omit<Quiz, "questionPool"> & { questionPool: QuestionDraft[] };

const RAW_QUIZZES: QuizDraft[] = [
  {
    id: "politiska-blundrar-1",
    title: "Politiska blundrar genom tiderna",
    description:
      "Märkliga citat och uttalanden från svensk politik. Vem sa vad?",
    interests: ["politik_samhalle", "sverige_grejer"],
    format: "text",
    difficulty: "medium",
    questionsPerSession: 10,
    estimatedMinutes: 3,
    playCount: 1247,
    likeCount: 432,
    questionPool: [
      {
        id: "politiska-blundrar-1-1",
        text: "Vem sa det berömda 'Sverige är ett fantastiskt land' efter en lång tystnad i en TV-debatt?",
        options: [
          "Göran Persson",
          "Stefan Löfven",
          "Fredrik Reinfeldt",
          "Carl Bildt",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-2",
        text: "Vilken svensk politiker blev känd för att försöka köpa en Toblerone på skattebetalarnas bekostnad?",
        options: [
          "Anna Lindh",
          "Mona Sahlin",
          "Margot Wallström",
          "Maud Olofsson",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-3",
        text: "Vilket parti föreslog en gång att Sverige skulle ha en officiell nationaldag på riktigt — inte bara en flaggdag?",
        options: [
          "Centerpartiet",
          "Socialdemokraterna",
          "Moderaterna",
          "Folkpartiet",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-4",
        text: "Vad blev känt som 'rotavdraget' egentligen en förkortning av?",
        options: [
          "Reparation, ombyggnad, tillbyggnad",
          "Renovering, ombyggnad, tillbyggnad",
          "Reparation, ommålning, tillbyggnad",
          "Renovering, ommålning, totalrenovering",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-5",
        text: "Vilken statsminister kallades 'Mister Tax' av internationell press?",
        options: [
          "Olof Palme",
          "Ingvar Carlsson",
          "Göran Persson",
          "Tage Erlander",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-6",
        text: "Hur många kommuner finns det i Sverige idag?",
        options: ["256", "278", "290", "314"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-7",
        text: "Vilket år trädde Sverige in i EU?",
        options: ["1992", "1995", "1999", "2004"],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-8",
        text: "Vad heter Sveriges högsta domstolen i kortform?",
        options: ["HD", "HovR", "Tingsrätt", "Justitiekansler"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-9",
        text: "Hur många riksdagsledamöter har Sverige?",
        options: ["249", "299", "349", "399"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-10",
        text: "Vilket parti grundades senast av dessa?",
        options: [
          "Centerpartiet",
          "Miljöpartiet",
          "Sverigedemokraterna",
          "Liberalerna",
        ],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-11",
        text: "Vem var Sveriges första kvinnliga statsminister?",
        options: [
          "Mona Sahlin",
          "Anna Lindh",
          "Magdalena Andersson",
          "Annie Lööf",
        ],
        correctIndex: 2,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-12",
        text: "Vad heter regeringens högkvarter på Helgeandsholmen i Stockholm?",
        options: ["Rosenbad", "Sagerska huset", "Riksdagshuset", "Slottet"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-13",
        text: "Vilken månad och dag är Sveriges nationaldag?",
        options: ["1 maj", "6 juni", "21 juni", "13 december"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-14",
        text: "Vad innebär ett misstroendevotum mot en minister?",
        options: [
          "Riksdagen ger förtroende",
          "Riksdagen tvingar bort ministern",
          "Statsministern avgår",
          "Folkomröstning krävs",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-15",
        text: "Vilket år hade Sverige sin senaste folkomröstning?",
        options: [
          "2003 om euron",
          "2009 om EU",
          "2016 om kärnkraft",
          "2018 om monarki",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-16",
        text: "Hur länge sitter en svensk regering normalt mellan val?",
        options: ["2 år", "3 år", "4 år", "5 år"],
        correctIndex: 2,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-17",
        text: "Vilken minister blev känd för uttalandet 'Jag är inte bekant med detaljerna'?",
        options: [
          "Det är ett vanligt politiker-citat utan särskild upphovsman",
          "Det är ett påhittat citat",
          "Detta sa Stefan Löfven",
          "Detta sa Annie Lööf",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-18",
        text: "Vilket parti har 'Rätt till heltid' som klassisk valfråga?",
        options: [
          "Moderaterna",
          "Socialdemokraterna",
          "Vänsterpartiet",
          "Centerpartiet",
        ],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-19",
        text: "Var ligger Sveriges riksdag?",
        options: [
          "Helgeandsholmen",
          "Riddarholmen",
          "Skeppsholmen",
          "Långholmen",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-20",
        text: "Vad blev Olof Palme känd för utöver sitt politiska arbete?",
        options: [
          "Var en framstående pianist",
          "Var en känd skidåkare",
          "Talade flera språk flytande",
          "Skrev kokböcker",
        ],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-21",
        text: "Vilken hatt blev politiskt symbolisk i Sverige under 1970-talet?",
        options: [
          "Pippis hatt",
          "Olof Palmes mössa",
          "Tage Erlanders sommarhatt",
          "Kåren från NF",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "politiska-blundrar-1-22",
        text: "Hur stor är riksdagsledamöternas grundlön i kronor per månad ungefär?",
        options: [
          "Cirka 40 000",
          "Cirka 70 000",
          "Cirka 100 000",
          "Cirka 150 000",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-23",
        text: "Vilken titel har den svenska statschefen?",
        options: ["Statsminister", "President", "Kung", "Riksföreståndare"],
        correctIndex: 2,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-24",
        text: "Vilket parti föreslog en gång obligatoriskt språktest för medborgarskap?",
        options: [
          "Detta har föreslagits av flera partier under olika tider",
          "Bara Sverigedemokraterna",
          "Bara Moderaterna",
          "Bara Liberalerna",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "politiska-blundrar-1-25",
        text: "Vad är en 'sakpolitisk fråga'?",
        options: [
          "En fråga om sakomröstning",
          "En fråga om konkret politiskt innehåll",
          "En fråga om grundlag",
          "En fråga om partiledare",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-26",
        text: "Vad innebär det att 'lägga ned sin röst' i riksdagen?",
        options: [
          "Lämna in valsedel",
          "Avstå från att rösta",
          "Rösta nej",
          "Lämna riksdagen",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "politiska-blundrar-1-27",
        text: "Hur många mandat krävs för majoritet i Sveriges riksdag?",
        options: ["151", "175", "200", "249"],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-28",
        text: "Vilket EU-organ består av medlemsländernas regeringschefer?",
        options: [
          "Europaparlamentet",
          "Europeiska kommissionen",
          "Europeiska rådet",
          "EU-domstolen",
        ],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-29",
        text: "Hur många EU-länder finns det idag (efter Storbritannien lämnat)?",
        options: ["25", "26", "27", "28"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "politiska-blundrar-1-30",
        text: "Vad är Sveriges officiella språk i lag?",
        options: [
          "Svenska och engelska",
          "Bara svenska",
          "Svenska och fem minoritetsspråk",
          "Det finns inget officiellt språk",
        ],
        correctIndex: 2,
        timeLimitSeconds: 15,
      },
    ],
  },
  {
    id: "svenska-uttryck-1",
    title: "Vad i hela friden betyder det här?",
    description:
      "Svenska uttryck som låter som total nonsens om man tänker efter.",
    interests: ["sprak_dialekter", "kuriosa_fakta"],
    format: "text",
    difficulty: "easy",
    questionsPerSession: 10,
    estimatedMinutes: 2,
    playCount: 2891,
    likeCount: 1184,
    questionPool: [
      {
        id: "svenska-uttryck-1-1",
        text: "Att 'glida in på en räkmacka' betyder att…",
        options: [
          "Komma sent till middagen",
          "Få något lätt utan ansträngning",
          "Bli förälskad snabbt",
          "Halka och göra bort sig",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-2",
        text: "Om någon 'har en räv bakom örat' är personen…",
        options: ["Misstänksam", "Slug", "Förkyld", "Förvirrad"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-3",
        text: "'Att gå som katten kring het gröt' betyder att man…",
        options: [
          "Är väldigt försiktig",
          "Är otålig",
          "Undviker ett känsligt ämne",
          "Är ute efter mat",
        ],
        correctIndex: 2,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-4",
        text: "Om man 'kastar pärlor för svinen' så…",
        options: [
          "Slösar något fint på fel publik",
          "Är generös mot fattiga",
          "Skämmer ut sig på fest",
          "Spelar dåliga kort",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-5",
        text: "Vad innebär 'att vara ute och cykla' i bildlig betydelse?",
        options: [
          "Att vara på rätt spår",
          "Att ha helt fel",
          "Att ta en paus",
          "Att vara bortrest",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-6",
        text: "Om någon 'tar bladet från munnen' så börjar personen…",
        options: ["Skrika", "Tala uppriktigt", "Sjunga", "Hosta"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-7",
        text: "Att 'gå i taket' betyder att man…",
        options: [
          "Är väldigt arg",
          "Är väldigt glad",
          "Är förvånad",
          "Har det jobbigt",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-8",
        text: "'Hjärtat i halsgropen' betyder att man är…",
        options: [
          "Förälskad",
          "Mycket nervös eller rädd",
          "Förkyld",
          "Otålig",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-9",
        text: "Att 'göra en pudel' betyder…",
        options: [
          "Att skratta åt sig själv",
          "Att be om ursäkt offentligt",
          "Att klä ut sig",
          "Att ljuga",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-10",
        text: "'Det är ingen ko på isen' betyder…",
        options: [
          "Det är vinter",
          "Det finns ingen brådska",
          "Inget händer",
          "Allt är fryst",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-11",
        text: "Om man 'sätter sin sista skärv' så satsar man…",
        options: ["Lite pengar", "Allt man har", "På fel häst", "I lotteri"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-12",
        text: "Att 'väcka björnen' betyder att man…",
        options: [
          "Vaknar tidigt",
          "Stör en lugn situation",
          "Är morgontrött",
          "Skäller på någon",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-13",
        text: "Vad betyder 'att ha is i magen'?",
        options: [
          "Att vara nervös",
          "Att vara förkyld",
          "Att vara lugn under press",
          "Att vara hungrig",
        ],
        correctIndex: 2,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-14",
        text: "'Tomma tunnor skramlar mest' betyder att…",
        options: [
          "Tysta personer är farliga",
          "Personer utan kunskap pratar mest",
          "Ihåligt ekar mest",
          "Det inte spelar roll",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "svenska-uttryck-1-15",
        text: "Att 'skjuta från höften' betyder att man…",
        options: [
          "Är västerlänning",
          "Reagerar snabbt utan eftertanke",
          "Är duktig på vapen",
          "Är arg",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-16",
        text: "Om någon 'tar ut svängarna' så…",
        options: [
          "Cyklar fort",
          "Tillåter sig stora friheter",
          "Är generös",
          "Pratar mycket",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-17",
        text: "'Som man bäddar får man ligga' betyder…",
        options: [
          "Sov bra",
          "Lev med konsekvenserna av dina val",
          "Var noggrann",
          "Gå tidigt till sängs",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-18",
        text: "Vad betyder 'att slå två flugor i en smäll'?",
        options: [
          "Vara våldsam",
          "Lösa två problem på en gång",
          "Vara lat",
          "Skämta dåligt",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-19",
        text: "Om man 'är ute på djupt vatten' så…",
        options: [
          "Simmar bra",
          "Är i en svår situation",
          "Är på semester",
          "Är trött",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-20",
        text: "'Att ha en fågel' eller 'ha en skruv lös' betyder…",
        options: [
          "Vara glad",
          "Vara konstig eller knäpp",
          "Ha husdjur",
          "Ha problem med möbler",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-21",
        text: "Vad betyder 'att leva på lyx'?",
        options: [
          "Spara pengar",
          "Leva överdådigt och dyrt",
          "Bo lyxigt en kort tid",
          "Resa mycket",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-22",
        text: "Om man 'tar någon på sängen' så…",
        options: [
          "Väcker dem",
          "Överraskar dem",
          "Bjuder hem dem",
          "Argumenterar med dem",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-23",
        text: "Att 'gå bet' betyder att…",
        options: ["Misslyckas", "Lyckas", "Bli arg", "Bli förkyld"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-24",
        text: "'Att tala i nattmössan' betyder att man…",
        options: [
          "Pratar i sömnen",
          "Pratar nonsens utan att veta",
          "Pratar tyst",
          "Pratar för länge",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-25",
        text: "Att 'kasta sten i glashus' betyder att man…",
        options: [
          "Bryter något medvetet",
          "Kritiserar andra för det man själv gör",
          "Är aggressiv",
          "Har otur",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-26",
        text: "Vad betyder 'att vara på smällen'?",
        options: ["Vara skadad", "Vara gravid", "Vara berusad", "Vara arg"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-27",
        text: "Att 'kasta in handduken' betyder att man…",
        options: ["Slutar boxas", "Ger upp", "Tvättar sig", "Är generös"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-28",
        text: "'Sätta P för något' betyder att…",
        options: [
          "Markera med bokstaven P",
          "Stoppa eller sätta gränser",
          "Parkera",
          "Pausa",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "svenska-uttryck-1-29",
        text: "Om någon är 'i Olles fickor' så…",
        options: [
          "Är riktigt fattig",
          "Är riktigt rik",
          "Är osynlig",
          "Är ute på äventyr",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "svenska-uttryck-1-30",
        text: "Om någon 'får kalla fötter' så…",
        options: [
          "Är förkyld",
          "Tvekar i sista stund",
          "Är trött",
          "Är rädd för mörker",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
    ],
  },
  {
    id: "kandisar-90-tal",
    title: "Glömda kändisar från 90-talet",
    description: "De var stjärnor då. Minns du dem nu?",
    interests: ["reklam_tv_forr", "musik_genom_aren"],
    format: "text",
    difficulty: "medium",
    questionsPerSession: 10,
    estimatedMinutes: 3,
    playCount: 1843,
    likeCount: 642,
    questionPool: [
      {
        id: "kandisar-90-tal-1",
        text: "Vem var programledare för 'Bingolotto' längst på 90-talet?",
        options: [
          "Lasse Brandeby",
          "Leif \"Loket\" Olsson",
          "Bengt Magnusson",
          "Lasse Kronér",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-2",
        text: "Vilken svensk grupp slog igenom internationellt med låten 'All That She Wants'?",
        options: ["Roxette", "Ace of Base", "Army of Lovers", "Dr. Alban"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-3",
        text: "Vem startade tv-programmet 'Robinson' i Sverige 1997?",
        options: [
          "Mark Levengood",
          "Harald Treutiger",
          "Martin Timell",
          "Janne Andersson",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-4",
        text: "Vilken artist hade hit-låten 'Det vackraste' 1997?",
        options: [
          "Lisa Nilsson",
          "Eva Dahlgren",
          "Marie Fredriksson",
          "Carola",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-5",
        text: "Vilket TV-program gick under namnet 'Hipp Hipp' i mitten av 90-talet?",
        options: [
          "Ett komediprogram med Henrik Schyffert m.fl.",
          "En barnshow med Lill-Babs",
          "En nyhetssatir",
          "En matlagningsserie",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-6",
        text: "Vem var sångare i Drängarna under 90-talet?",
        options: [
          "Tony Eriksson",
          "Mats Rådberg",
          "Larz-Kristerz",
          "Christer Sjögren",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-7",
        text: "Vilken artist hade megahit med '...Baby One More Time' 1998?",
        options: [
          "Christina Aguilera",
          "Britney Spears",
          "Jessica Simpson",
          "Mandy Moore",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-8",
        text: "Vilken svensk komiker blev känd för 'Hipp Hipp!' på 90-talet?",
        options: [
          "Henrik Schyffert m.fl.",
          "Christer Olsson",
          "Måns Möller",
          "Robert Gustafsson",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-9",
        text: "Vad hette pojkbandet som dominerade tonårsrummen i sent 90-tal från USA?",
        options: ["Backstreet Boys", "Boyzone", "Take That", "Westlife"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-10",
        text: "Vilket svenskt band slog igenom med 'Lovefool'?",
        options: ["Roxette", "The Cardigans", "Ace of Base", "Robyn"],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-11",
        text: "Vem programledde 'Doobidoo' som varit långkörare i SVT?",
        options: [
          "Lasse Brandeby",
          "Lasse Kronér",
          "Lennart Hyland",
          "Bengt Magnusson",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-12",
        text: "Vilken artist sjöng 'Mambo No. 5' som blev sommarhit 1999?",
        options: ["Lou Bega", "Ricky Martin", "Enrique Iglesias", "Cher"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-13",
        text: "Vilken Spice Girl kallades 'Posh Spice'?",
        options: ["Mel B", "Emma Bunton", "Victoria Beckham", "Geri Halliwell"],
        correctIndex: 2,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-14",
        text: "Vad heter karaktären som spelades av Leonardo DiCaprio i 'Titanic'?",
        options: [
          "Jack Dawson",
          "Jack Sparrow",
          "Jake Donovan",
          "James Donaldson",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-15",
        text: "Vilket TV-program lanserade Mark Levengood som programledare?",
        options: ["Mosaik", "Café", "Bonusfamiljen", "Lust"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-16",
        text: "Vilken svensk artist hade hit med 'Sista morgonen'?",
        options: ["Carola", "Lisa Nilsson", "Marie Fredriksson", "Jill Johnson"],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-17",
        text: "Vad hette tecknad serie om den lila dinosaurien som var populär bland barn?",
        options: ["Barney", "Dino", "Spike", "Rex"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-18",
        text: "Vilket band gjorde låten 'I Want It That Way'?",
        options: ["NSYNC", "Backstreet Boys", "Westlife", "Take That"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-19",
        text: "Vilken artist hade världshit med 'Believe' 1998?",
        options: ["Madonna", "Cher", "Britney Spears", "Whitney Houston"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-20",
        text: "Vad hette tv-spelet som introducerade en blå igelkott?",
        options: ["Sonic", "Mario", "Pac-Man", "Megaman"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-21",
        text: "Vilken film med dinosaurier blev fenomen 1993?",
        options: [
          "Den otroliga vandringen",
          "Jurassic Park",
          "Lejonkungen",
          "Aladdin",
        ],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-22",
        text: "Vad hette Friends-karaktären som arbetade på Central Perk?",
        options: ["Joey", "Chandler", "Ross", "Rachel"],
        correctIndex: 3,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-23",
        text: "Vilket svenskt program lanserade fenomenet 'farmen' i Sverige?",
        options: ["Robinson", "Bonde söker fru", "Farmen", "Big Brother"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-24",
        text: "Vilken Bruce Willis-film blev oväntad kassasuccé 1999?",
        options: [
          "Armageddon",
          "Det sjätte sinnet",
          "Pulp Fiction",
          "Die Hard",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-25",
        text: "Vilken Tom Hanks-film från 1994 handlar om en man med låg IQ som upplever flera historiska händelser?",
        options: ["Big", "Philadelphia", "Forrest Gump", "Apollo 13"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-26",
        text: "Vilket band skrev hit-låten 'Wonderwall'?",
        options: ["Blur", "Oasis", "Pulp", "Suede"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-27",
        text: "Vad hette katten i Disneys 'Aristokatterna'?",
        options: ["Tom", "Marie", "Felix", "Garfield"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "kandisar-90-tal-28",
        text: "Vilken film vann Oscar-galan 1998 för bästa film (för 1997 års produktioner)?",
        options: [
          "Forrest Gump",
          "Titanic",
          "Shakespeare in Love",
          "Saving Private Ryan",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "kandisar-90-tal-29",
        text: "Vilken svensk regissör är känd för film 'Lukas moder'?",
        options: [
          "Det är ett påhittat namn",
          "Lukas Moodysson",
          "Roy Andersson",
          "Lasse Hallström",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "kandisar-90-tal-30",
        text: "Vilken brittisk komedi handlade om fyra kompisar i Storbritannien?",
        options: ["Friends", "Cheers", "Father Ted", "The Office"],
        correctIndex: 2,
        timeLimitSeconds: 15,
      },
    ],
  },
  {
    id: "sverige-kuriosa-1",
    title: "Helt sant eller helt påhittat?",
    description:
      "Märkliga svenska fakta. En del stämmer. En del är ren lögn.",
    interests: ["sverige_grejer", "kuriosa_fakta"],
    format: "text",
    difficulty: "medium",
    questionsPerSession: 10,
    estimatedMinutes: 3,
    playCount: 967,
    likeCount: 341,
    questionPool: [
      {
        id: "sverige-kuriosa-1-1",
        text: "Vilket av följande är faktiskt sant om Sverige?",
        options: [
          "Det finns en lag mot att måla sitt hus rosa i vissa kommuner",
          "I Härjedalen finns det fler renar än människor",
          "Sverige har världens längsta strandlinje i Europa",
          "Det är olagligt att skratta högt på söndagar i Övertorneå",
        ],
        correctIndex: 1,
        timeLimitSeconds: 15,
      },
      {
        id: "sverige-kuriosa-1-2",
        text: "Vilken svensk uppfinning räddar fortfarande liv världen över?",
        options: [
          "Säkerhetsbältet i bilar",
          "Pacemakern",
          "Insulinsprutan",
          "Alla tre — Sverige uppfann faktiskt alla",
        ],
        correctIndex: 3,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-3",
        text: "Hur många öar har Sverige enligt officiell räkning?",
        options: [
          "Ca 21 000",
          "Ca 96 000",
          "Ca 221 000",
          "Ca 267 000",
        ],
        correctIndex: 3,
        timeLimitSeconds: 15,
      },
      {
        id: "sverige-kuriosa-1-4",
        text: "Vilket av dessa djur fanns faktiskt i Sverige förr i tiden?",
        options: ["Lejon", "Tiger", "Bison", "Mammut"],
        correctIndex: 3,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-5",
        text: "Vad är speciellt med staden Kiruna just nu?",
        options: [
          "Den flyttas bit för bit",
          "Den har inga gator",
          "Den har Sveriges lägsta befolkning",
          "Den ligger på en flytande ö",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-6",
        text: "Vad är 'surströmmingens premiär' officiellt?",
        options: [
          "Tredje torsdagen i augusti",
          "Första helgen i september",
          "Midsommarafton",
          "Det finns ingen officiell premiär",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-7",
        text: "Vilket av följande är faktiskt sant om Sverige?",
        options: [
          "Det är olagligt att ha en isbjörn som husdjur",
          "Det är olagligt att skratta i kyrkan",
          "Sverige har en officiell ölsort",
          "Det är obligatoriskt att kunna tända en eld",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "sverige-kuriosa-1-8",
        text: "Vilket djur räknas inofficiellt som Sveriges nationaldjur?",
        options: ["Älg", "Ren", "Björn", "Tjäder"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-9",
        text: "Hur kallt har det blivit som rekord i Sverige?",
        options: ["Cirka -40°C", "Cirka -53°C", "Cirka -65°C", "Cirka -78°C"],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-10",
        text: "Vad är Sveriges nationalblomma?",
        options: ["Liljekonvalj", "Linnea", "Blåklint", "Smörblomma"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "sverige-kuriosa-1-11",
        text: "Vad är speciellt med byn Kebnekaise?",
        options: [
          "Sveriges högsta bergstopp ligger där",
          "Sveriges nordligaste byn",
          "Sveriges minsta by",
          "Sveriges äldsta by",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-12",
        text: "Vilket svenskt företag uppfann den tubikförpackade kaviaren?",
        options: ["Felix", "Findus", "Abba", "Procordia"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-13",
        text: "Hur långt är Sveriges totala kustlinje ungefär?",
        options: ["1 200 km", "3 200 km", "5 200 km", "7 200 km"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-14",
        text: "Vilket är världens äldsta öppna träd som fortfarande lever, beläget i Sverige?",
        options: [
          "Old Tjikko, en gran",
          "Den gamla eken vid Linköping",
          "Trollek",
          "Mor Trärötter",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "sverige-kuriosa-1-15",
        text: "Vilken svensk uppfinnare är pappa till säkerhetsbältet med tre fästen?",
        options: ["Nils Bohlin", "Alfred Nobel", "Anders Celsius", "Nils Dacke"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-16",
        text: "Vad hette Vasa-skeppet uppkallat efter?",
        options: [
          "Kungaätten Vasa",
          "En sjökapten",
          "Ett område i Stockholm",
          "Ett blomma",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-17",
        text: "Hur många nobelpris delas ut varje år normalt?",
        options: ["3", "5", "6", "8"],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-18",
        text: "Vilken är Sveriges minsta kommun till befolkning?",
        options: ["Bjurholm", "Sorsele", "Arjeplog", "Dorotea"],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "sverige-kuriosa-1-19",
        text: "Vilket svenskt fenomen är 'lagom' språkligt motsvarighet till?",
        options: [
          "Översätts oftast som 'tillräckligt', 'passande' eller 'precis rätt'",
          "Betyder direkt 'litet'",
          "Är en typ av mat",
          "Är en sorts dans",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-20",
        text: "Vad är det främsta råvaran för svensk midsommar?",
        options: [
          "Sill",
          "Potatis",
          "Jordgubbar",
          "Alla tre — ofta tillsammans",
        ],
        correctIndex: 3,
        timeLimitSeconds: 10,
      },
      {
        id: "sverige-kuriosa-1-21",
        text: "Vilken är Sveriges äldsta universitetsstad?",
        options: ["Uppsala", "Lund", "Stockholm", "Göteborg"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "sverige-kuriosa-1-22",
        text: "Vad är ett fika på svenska?",
        options: [
          "En lättare kaffepaus med tilltugg, ofta socialt",
          "En soppmåltid",
          "En spelparti",
          "En bostadsdel",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "sverige-kuriosa-1-23",
        text: "Vilket är Sveriges äldsta tidning som fortfarande utges?",
        options: [
          "Aftonbladet",
          "Dagens Nyheter",
          "Post- och Inrikes Tidningar",
          "Svenska Dagbladet",
        ],
        correctIndex: 2,
        timeLimitSeconds: 15,
      },
      {
        id: "sverige-kuriosa-1-24",
        text: "Vilken sjö är Sveriges största?",
        options: ["Mälaren", "Vänern", "Vättern", "Hjälmaren"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "sverige-kuriosa-1-25",
        text: "Vad är 'allemansrätten'?",
        options: [
          "Rätten att vistas i naturen även på annans mark",
          "En rätt att alla måste hjälpa varandra",
          "En lag om delning av mat",
          "En traditionell sång",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-26",
        text: "Vilken svensk landsdel är känd för sin långa polara natt?",
        options: ["Skåne", "Dalarna", "Lappland", "Småland"],
        correctIndex: 2,
        timeLimitSeconds: 10,
      },
      {
        id: "sverige-kuriosa-1-27",
        text: "Vad är 'Götaplatsen'?",
        options: [
          "En central plats i Göteborg med stor staty",
          "En förort till Stockholm",
          "En park i Malmö",
          "En typ av plats utanför hus",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "sverige-kuriosa-1-28",
        text: "Vilken svensk författare skrev Pippi Långstrump?",
        options: [
          "Astrid Lindgren",
          "Selma Lagerlöf",
          "August Strindberg",
          "Tove Jansson",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "sverige-kuriosa-1-29",
        text: "Vilket är Sveriges nationalmonument vid Stockholms Slott?",
        options: [
          "Det finns inget officiellt nationalmonument",
          "Storkyrkan",
          "Riddarholmskyrkan",
          "Operahuset",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "sverige-kuriosa-1-30",
        text: "Hur många invånare har Sverige ungefär?",
        options: ["7 miljoner", "10 miljoner", "13 miljoner", "16 miljoner"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
    ],
  },
  {
    id: "reklam-jinglar",
    title: "Slogans du inte kan glömma",
    description:
      "Svenska reklamslogans som etsat sig fast — vem var de för?",
    interests: ["reklam_tv_forr", "sverige_grejer"],
    format: "text",
    difficulty: "easy",
    questionsPerSession: 10,
    estimatedMinutes: 2,
    playCount: 2103,
    likeCount: 821,
    questionPool: [
      {
        id: "reklam-jinglar-1",
        text: "Vilket företag använde sloganen 'Där du är hemma'?",
        options: ["IKEA", "ICA", "Coop", "Hemköp"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-2",
        text: "'Det finns enklare sätt att tjäna pengar på' — vilken aktör?",
        options: [
          "Skandia",
          "Trygg-Hansa",
          "Folksam",
          "Länsförsäkringar",
        ],
        correctIndex: 1,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-3",
        text: "Vilken godistillverkare hade reklamen med 'Vad gör du för Anna?'",
        options: ["Marabou", "Cloetta", "Fazer", "Ahlgrens"],
        correctIndex: 1,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-4",
        text: "Vad såldes med sloganen 'Det börjar med ett hej'?",
        options: [
          "En dejtingapp",
          "Ett bilmärke",
          "Ett kafé",
          "En frisörkedja",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-5",
        text: "Vilken kedja hade Loket Olsson som ansiktet utåt under många år?",
        options: [
          "ICA",
          "Coop",
          "Bingolotto-relaterat (inte en butik)",
          "Willys",
        ],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-6",
        text: "ICA-reklamerna med Stig — vad är hans yrke i serien?",
        options: ["Butikschef", "Kund", "Leverantör", "Politiker"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-7",
        text: "Vilken kedja har sloganen relaterad till färska livsmedel och kvalitet (svensk dagligvara)?",
        options: ["ICA", "Coop", "Hemköp", "Willys"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-8",
        text: "Vilket svenskt företag använde 'tanka och åk'-koncept i reklam?",
        options: ["OK/Q8", "Statoil", "Shell", "Preem"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-9",
        text: "'Det perfekta valet' — vilken kategori av produkter brukar använda denna slogan?",
        options: [
          "Bil",
          "Försäkring",
          "Generell — många använder den",
          "Mat",
        ],
        correctIndex: 2,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-10",
        text: "Vilken godistillverkare har en blå logotyp som de flesta känner igen?",
        options: ["Marabou", "Cloetta", "Fazer", "Ahlgrens"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-11",
        text: "Vilket företag är känt för ölen Pripps Blå?",
        options: ["Pripps Bryggerier", "Carlsberg", "Spendrups", "Falcon"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-12",
        text: "Vilken affärskedja säljer främst kläder med svensk grund?",
        options: ["H&M", "KappAhl", "Lindex", "Alla tre är svenska kedjor"],
        correctIndex: 3,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-13",
        text: "Vad är 'Volvo'-bilarnas land?",
        options: ["Sverige", "Tyskland", "Italien", "Schweiz"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-14",
        text: "Vilken svensk dryck heter 'Loka'?",
        options: ["Mineralvatten", "Öl", "Saft", "Cider"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-15",
        text: "Vilken svensk choklad använde namnet 'Plopp'?",
        options: ["Cloetta", "Marabou", "Fazer", "Karl Fazer"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-16",
        text: "Vilket företag är känd för Daim-godiset?",
        options: [
          "Marabou",
          "Cloetta",
          "Mondelez",
          "Det köptes av Marabou som äger nu",
        ],
        correctIndex: 3,
        timeLimitSeconds: 15,
      },
      {
        id: "reklam-jinglar-17",
        text: "Vilken svensk modeprofil grundade H&M?",
        options: [
          "Erling Persson",
          "Ingvar Kamprad",
          "Stefan Persson",
          "Robert Hörnell",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-18",
        text: "Vilken svensk tävling kallas oftast 'Sveriges Mästerkock'?",
        options: [
          "En matlagningstävling i TV",
          "Ett musikprogram",
          "Ett politiskt program",
          "En sportgren",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-19",
        text: "Vad hette mannen i ICA-reklamen som driver butiken?",
        options: ["Stig", "Ulf", "Sven", "Bert"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-20",
        text: "Vilken svensk bilproducent gjorde modellen 'Saab 900'?",
        options: ["Saab", "Volvo", "Scania", "Koenigsegg"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-21",
        text: "Vad är OLW känd för?",
        options: ["Chips och snacks", "Glass", "Choklad", "Drycker"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-22",
        text: "Vilket företag tillverkar Felix-produkter?",
        options: ["Procordia", "Findus", "Felix Konfekt", "Tetra Pak"],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-23",
        text: "Vilket svenskt dryckesföretag är känt för Coca-Cola-distribution i Sverige?",
        options: [
          "Coca-Cola European Partners distribuerar",
          "Spendrups",
          "Pripps",
          "Carlsberg Sverige",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "reklam-jinglar-24",
        text: "Vad är 'Polly' i svenskt godissammanhang?",
        options: [
          "En typ av choklad med marshmallow",
          "En karamell",
          "En tuggummi",
          "En lakritsbåt",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-25",
        text: "Vilket svenskt företag är känt för möbler i platta paket?",
        options: ["IKEA", "Mio", "Jysk", "EM"],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-26",
        text: "Vad heter Sveriges främsta bensinkedja förknippat med lila/orange färg?",
        options: ["Q-Star", "Statoil", "Pi", "Preem"],
        correctIndex: 3,
        timeLimitSeconds: 12,
      },
      {
        id: "reklam-jinglar-27",
        text: "Vilket svenskt mejeri säljer mjölken Arla?",
        options: [
          "Arla Foods",
          "Skånemejerier",
          "Norrmejerier",
          "Falköpings Mejeri",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-28",
        text: "Vad är 'Lussekatter' känt som?",
        options: [
          "Saffrans-bullar bakade kring jul/lucia",
          "En typ av djur",
          "En sångfest",
          "En typ av julkorv",
        ],
        correctIndex: 0,
        timeLimitSeconds: 10,
      },
      {
        id: "reklam-jinglar-29",
        text: "Vilket svenskt företag står bakom Pelle Svanslös-böckerna och relaterad merch?",
        options: [
          "Pelle Svanslös är litterär figur — flera utgivare",
          "Bonnier",
          "Norstedts",
          "Rabén & Sjögren",
        ],
        correctIndex: 0,
        timeLimitSeconds: 15,
      },
      {
        id: "reklam-jinglar-30",
        text: "Vilket svenskt företag är känt för förpackningssystemet Tetra Pak?",
        options: [
          "Tetra Pak (numera del av Tetra Laval)",
          "Bonnier",
          "ABB",
          "Ericsson",
        ],
        correctIndex: 0,
        timeLimitSeconds: 12,
      },
    ],
  },
];

// Deterministic 32-bit hash so the same question id always synthesizes
// the same numbers — feels stable across reloads while varying per
// question.
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function inRange(seed: number, min: number, max: number, decimals = 0): number {
  const span = max - min;
  const norm = (seed % 10000) / 10000;
  const value = min + norm * span;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function synthMockStats(
  questionId: string,
  difficulty: Difficulty,
  timeLimitSeconds: number,
): QuestionMockStats {
  const seed = hashString(questionId);
  const totalAnswered = Math.floor(inRange(seed, 800, 4500));

  let correctMin: number;
  let correctMax: number;
  if (difficulty === "easy") {
    correctMin = 0.65;
    correctMax = 0.85;
  } else if (difficulty === "medium") {
    correctMin = 0.35;
    correctMax = 0.65;
  } else {
    correctMin = 0.15;
    correctMax = 0.45;
  }
  const correctRate = inRange(seed >>> 8, correctMin, correctMax, 2);

  let timeMin: number;
  let timeMax: number;
  if (timeLimitSeconds <= 10) {
    timeMin = 4;
    timeMax = 7;
  } else if (timeLimitSeconds <= 12) {
    timeMin = 5;
    timeMax = 8;
  } else {
    timeMin = 6;
    timeMax = 10;
  }
  const averageTimeSeconds = inRange(seed >>> 16, timeMin, timeMax, 1);

  return { totalAnswered, correctRate, averageTimeSeconds };
}

function attachMockStats(draft: QuizDraft): Quiz {
  return {
    ...draft,
    questionPool: draft.questionPool.map((q) => ({
      ...q,
      mockStats: synthMockStats(q.id, draft.difficulty, q.timeLimitSeconds),
    })),
  };
}

export const quizzes: Quiz[] = RAW_QUIZZES.map(attachMockStats);
