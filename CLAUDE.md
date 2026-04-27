# Sveriges Roligaste Quiz — Claude Code-instruktioner

## Om projektet
**Sveriges Roligaste Quiz** är en humor-quiz-app — inte en allmänbildningsapp. Korta quiz om svenska kändisar, politiska blundrar, kuriosa, dialekter, kulturnostalgi och folkets tycke. Roligt först, kunskap sen. Spelarna ska skratta, dela med kompisar och säga "vänta lyssna här" — placering och rating finns kvar som krydda men är inte huvudsaken.

Mobilförst webb (Next.js PWA), paketeras senare till native iOS/Android via Capacitor.

Samarbete med Instagram-kontot **sverigesroligastevideor** (~452k följare) som driver trafik och delar quiz-klipp.

## Teknisk stack
- Next.js 14+ med App Router
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui (New York style)
- Framer Motion för animationer
- Supabase för backend (läggs till senare — inte i prototyp-fasen)
- Vercel för hosting

## Designprinciper
- Mobile-first: allt designas för 375–430px bredd först
- Lekfull och färgstark känsla (som en spel-app, inte en företagsapp)
- Touch-ytor minst 44px
- Snabb feedback: alla interaktioner ska ge respons inom 100ms
- WCAG AA-kontrast

## Konventioner
- Språk i UI: svenska
- Språk i kod/kommentarer: engelska (funktionsnamn, variabler, kommentarer)
- Filnamn: kebab-case för filer, PascalCase för React-komponenter
- Använd TypeScript-typer överallt, inga `any`
- Använd shadcn-komponenter där det passar, bygg egna när det behövs
- Feature-baserad mappstruktur: src/features/quiz/, src/features/profile/, etc.

## Scope-gränser (vad som är MVP)
- I scope: konto, quiz-flöde, spela quiz, percentil-resultat, profil, statistik, badges
- Ej i scope nu: användargenererade quiz, följa andra, push-notiser, native-app

## Byggordning för prototypen
1. Design-tokens + layout-shell med mobil-ram och bottom-nav
2. Hem-flödet med hårdkodad quiz-data
3. Quiz-spelskärm (fråga-för-fråga med timer)
4. Resultatskärm med fake percentil
5. Profil-sida med mock-stats
6. Onboarding + avatar-väljare
7. Koppla på Supabase (senare)

Jobba med mock-data först. Backend tillkommer när flödet känns rätt.

## Pool-modellen

Alla quiz är pool-baserade. Ett quiz har en `questionPool: Question[]`
(idealt 25+ frågor) och ett `questionsPerSession`-tal (default 10).
Vid varje sessionstart drar `drawSessionQuestions(quiz)` i
`src/lib/draw-questions.ts` ett random-urval ur poolen via
Fisher-Yates. Spelar man om får man en ny mix.

**Mätningen sker per fråga.** Varje `Question` bär `mockStats`
(totalAnswered, correctRate, averageTimeSeconds) — påhittad crowd-data
tills vi har en backend (`synthMockStats` i `src/data/quizzes.ts`
genererar siffror deterministiskt från frågans id, så samma fråga
får alltid samma "crowd"). `calculateQuestionScore` i
`src/lib/scoring.ts` ger varje fråga en score (bas + tidsbonus
× svårighetsmultiplikator från crowd correct-rate) och en percentil
relativt crowd. `calculateSessionAggregate` rullar upp till session:
totalScore, correctCount, snitt-percentil och en aggregerad
`overallPercentile` (70% snitt + 30% rätt-andel) som sparas på `Play`.

`Play.sessionAnswers: SessionAnswer[]` lagrar per-fråga-bryt-ner
(questionId, wasCorrect, timeUsedSeconds, scoreEarned,
percentileForQuestion). Result-skärmen läser dessa och visar en
collapsible "Visa per fråga"-sektion. Lagringen ligger på
`quiz-app.plays`.

`Play.isFirstAttempt` finns kvar för att skilja första officiella
försök från återspel — återspel sparas men markeras "🔁 Påverkar
inte din officiella placering".

## Progression och nivåer

Vi har skrotat det gamla rating-systemet (1000–3000-skalan, decay,
classic/fast-mode). Ersatt med ett 5-stegsystem per intresse i
`src/lib/progression.ts`. `getProgressionLevel(questionsAnswered,
averagePercentile)` returnerar nivå:

- 🌱 Nybörjare (`#9CA3AF`) — under 10 frågor besvarade
- 💙 Hängiven (`#3B82F6`) — 10+ frågor
- 🌟 Skicklig (`#10B981`) — 25+ frågor & ≥60% snittpercentil
- 🏅 Expert (`#A855F7`) — 50+ frågor & ≥75% snittpercentil
- 👑 Mästare (`#F59E0B`) — 100+ frågor & ≥90% snittpercentil

Volym-grindar gör att ingen kan blixt-lyfta till Mästare på 5 spel.
Beräknas i `compute-stats.ts` (per intresse, multi-räknat när ett
quiz har flera intressen) och visas på profil ("Min utveckling")
och stats-sidan (full-tier).

## Event-quiz (kommande, inte byggt)

Idén är fasta event-quiz för månadens, veckans, partner-samarbeten
etc. — där alla spelare får samma frågeordning utan random-draw.
Dessa byggs ovanpå pool-modellen som en flagga eller en separat
quiz-typ. Inte byggt ännu — när det byggs ska "Dagens utmaning"
på stats-sidan vara hemmet för det.

## Intressen istället för kategorier

Tidigare hade vi en `Category`-typ som låste varje quiz till exakt en
bucket. Nu har vi 12 **intressen** (`Interest` i `src/types/quiz.ts`)
och varje quiz taggas med en `interests: Interest[]`-array — quiz kan
alltså bo i flera intressen samtidigt. Metadata (emoji, namn, färg,
Tailwind-klasser) finns centralt i `src/lib/interests.ts`.
`primaryInterest(interests)` ger ett ledande intresse för UI som bara
har plats för ett.

Visuellt språk:
- Första försök: röd primär, "officiellt"-känsla (rosetter, percentil-bar)
- Återspel: sky/cyan accent på överline + banner ("🔁 Återspel"),
  i övrigt samma layout

## Personalisering (smaktest + smart slump)

Vid onboarding gör användaren ett **smaktest** — väljer minst 3 av 12
intressen i en grid. Sparas på `User.interests` i localStorage. Befintliga
användare utan intressen får ett mini-onboarding (bara smaktest-steget)
via `OnboardingGate` innan resten av appen visas igen.

`pickRandomQuiz(allQuizzes, userInterests, excludeIds)` i
`src/lib/smart-random.ts` är hem-flödets slumpknapp:

1. Filtrera bort de senaste 3 visade (excludeIds).
2. Om någon kandidat delar intresse med användaren → välj bland dem.
3. Annars → välj fritt ur kandidatpoolen (fallback, så användaren aldrig
   fastnar bara för att utbudet är litet).
4. Sista utväg: ignorera excludeIds.

Användaren kan ändra intressen från profilen ("Mina intressen" → editor
med samma `InterestPicker`-komponent som onboarding använder).
Information om hur slumpen fungerar visas i en bottom sheet bakom
en "Anpassat efter dig"-pill på hem-skärmen.

## Landningssidor per intresse

Varje intresse har en egen landningssida på `/intresse/[slug]`
(`src/app/intresse/[slug]/page.tsx`). Slug-format: `'sverige_grejer'`
↔ `/intresse/sverige-grejer` via `interestToSlug`/`slugToInterest`
i `src/lib/interests.ts`. En översiktssida på `/intressen` listar
alla 12 intressen som klickbara kort.

**Tema är primär kategori, format är metadata.** Quiz är taggade
med `interests: Interest[]` (vad det handlar om) och `format: QuizFormat`
(hur det presenteras — text, bild, ljud, omröstning, sant/falskt,
blandat). Landningssidan grupperar quiz först per intresse, sedan
per format. När nya format läggs till (ex. bildquiz) syns de
automatiskt som egna sektioner på landningssidan så fort minst ett
quiz med det formatet är taggat med intresset — sektioner med 0
träffar hoppas över helt så sidan aldrig visar tomma kategorier.

**Hero-skinning per intresse**: `INTEREST_HERO_GRADIENT` och
`INTEREST_HERO_DARK_TEXT` styr toppfärg och text-kontrast (ljusa
pasteller får mörk text, mättade färger får vit). `INTEREST_BUTTON_BG`
ger CTA-knappens färg på landningssidan. Resten av sidan följer
appens normala stil — färgen indikerar tema, inte bygger om appen.

**Smart-random scoping**: `pickRandomQuiz(allQuizzes, { onlyInterest })`
låser slumpen till ett intresse (landningssidans CTA). Default-läget
(utan `onlyInterest`) använder fortfarande `userInterests` med
fallback. `excludeIds` är best-effort i båda lägena.

**Klickbara intressetaggar**: `InterestTag` (i
`src/features/quiz/interest-tag.tsx`) renderas som `<button>` som
router-pushar — inte `<Link>` — för att undvika nästlade `<a>`
inuti quiz-kortets ytter-Link. Tags finns på QuizCard,
RevealedCard, CompactQuizRow, FullQuizRow på landningssidan, samt
profilens "Mina intressen". Format-pillen (`FormatPill`) öppnar
en bottom sheet med formatets beskrivning vid klick.

## Progressiv stats-vy

Statistik-fliken har tre nivåer baserat på `totalPlays`:

- **0–2 spel** (`minimal`): Bara header + välkomstkort. Inga
  badges, inga staplar.
- **3–9 spel** (`growing`): Header, streak-kort, fyra stat-tiles
  (frågor, sessioner, snittpercentil, träffsäkerhet) och badges.
- **10+ spel** (`full`): Allt ovan + "Min utveckling"-sektion
  med nivåtaggar per intresse (alla 12).

Inga rating-element kvar (XP-bar, ratings per kategori) — vi har
gått över till percentil + progression. Tier-funktionen (`tierFor`)
bor inline i `src/app/stats/page.tsx`.

## Glömda data i localStorage

Tidigare versioner skrev till `quiz-app.training-sessions` och
`quiz-app.ratings`. De nycklarna läses inte längre — finns kvar
i lokal lagring för befintliga användare men stör inget. Inget
behov av migration eller städning.

## Referens
Se docs/PROJECT.md för full projektplan.

## App-känsla, inte webb-känsla

Detta är en webb som SKA KÄNNAS SOM EN NATIV APP. Inte en responsiv webb.
Det här är ett starkt direktiv och ska genomsyra all UI-kod.

### Prototyp-fas (nuvarande)
Appen körs i en browser och det är okej att browser-chrome (adressfält,
flikar) är synligt. PWA-installation är INTE prioriterat nu — fokus är
att allt innanför viewporten ska kännas som en app.

### Krav på app-känsla
- Hela appen wrappas i en AppShell med bottom-nav (Hem, Stats, Profil — Träna är borttaget)
- Safe areas respekteras (env(safe-area-inset-*))
- 100dvh används, inte 100vh (undviker Safari-bråk)
- Input font-size minst 16px (förhindrar iOS auto-zoom vid fokus)
- Skärm-övergångar animeras med Framer Motion (slide/fade, 200-300ms)
- Bottom sheets istället för mitt-på-skärmen-modaler
- Pull-to-refresh i scroll-feeds där det är relevant
- Skeleton loaders, inte spinners
- Ingen text-markering på knappar (user-select: none på interaktiva element)
- Tryckfeedback på alla knappar (scale-down eller opacity-dip)

### Onboarding-flöde (obligatoriskt innan appen kan användas)
1. Steg 1 — namn + avatar (bibliotek av färdiga illustrationer)
2. Steg 2 — smaktest: välj minst 3 av 12 intressen
3. Landar i hem-fliken

### Konto i prototyp-fas
- Sparas i localStorage, inte i backend
- Nyckel: `quiz-app.user` → { username, avatar, interests, createdAt }
- Om ingen user finns → visa fullt onboarding
- Om user finns men interests är tom/saknas → mini-onboarding (bara smaktest)
- Om user är komplett → hoppa direkt till hem

### Förbjudet i UI
- Hamburger-menyer
- Breadcrumbs
- Footer med länkar eller "om oss"-info
- "Desktop-vyer" eller bredare layouts för stora skärmar

### Desktop-beteende
På skärmar bredare än 430px:
- App renderas centrerat i en mobil-ram (430px bred)
- Runtom visas en neutral bakgrund
- Detta för att testare på datorn ska se "app i en telefon"

### Senare (efter prototyp-fasen)
- PWA-manifest för installerbar app
- Service worker för offline-stöd
- iOS-meta-taggar för full-screen-läge
- Push-notiser (endast i native via Capacitor)
