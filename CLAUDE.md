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

## Hybrid-modell: Quiz vs Träna

Appen har två lägen som existerar parallellt:

**Quiz-läget**: Fasta utmaningar med samma frågor för alla spelare.
Första försöket räknas officiellt och ger percentil-placering. Efterföljande
försök är "träningsläge" — visar resultat men ändrar inte placering.
Veckans quiz, månadens quiz och alla signatur-quiz tillhör detta läge.

**Träna-läget**: Endless-sessions där 10 random frågor dras ur en pool
baserat på kategori + svårighet. Inget officiellt resultat — istället
en rating per kategori (1000 vid start, rör sig 100–3000) som följer
användarens kunskap upp och ner. Två lägen: Klassisk (15s/fråga) och
Snabb (7s/fråga, dubbla rating-effekten).

Träna-frågorna lever i `src/data/question-pool.ts` (taggade med
kategori + svårighet) — separat från `src/data/quizzes.ts` som driver
de fasta quizen. Utöka poolen genom att lägga till fler `QuestionPoolItem`
i den listan; `drawQuestions(category, difficulty, count)` i
`src/lib/training.ts` plockar slumpvis när en session startas.

Visuellt språk:
- Quiz-läge officiellt: röd primär, "ranking"-känsla (rosetter, percentil)
- Quiz-läge träning (replay av spelat quiz): blå/grön accent, mjukare ton
- Träna-läge: blå/grön gradient genomgående, "övning och tillväxt"

## Rating-systemet

Varje kategori har sin egen rating som börjar på 1000 och rör sig
mellan 100 och 3000. Bara Träna-läget påverkar rating; Quiz-läget
ger percentil men inte rating.

**Per fråga (`calculateQuestionDelta` i `src/lib/rating.ts`):**
- Lätt: rätt +6, fel −10
- Medel: rätt +10, fel −10
- Svår: rätt +15, fel −5
- Tidsbonus: rätt på under halva tidsgränsen ger +3

**Per session:** sum av alla frågedelta, gånger 2 om läget är Snabb.

**Nivåtrappa (färger används konsekvent där rating visas):**
- 🌱 Nybörjare (`#9CA3AF`) — < 800
- 💙 Hängiven (`#3B82F6`) — 800–1199
- 🌟 Skicklig (`#10B981`) — 1200–1599
- 🏅 Expert (`#A855F7`) — 1600–1999
- 👑 Mästare (`#F59E0B`) — 2000+

Rating sparas i localStorage under `quiz-app.ratings` som en map
keyad på kategori. `useRatings()` ger reaktiv åtkomst,
`updateRating(category, delta)` skriver. Ingen rating decay över
tid — bara prestation flyttar siffran.

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
- Hela appen wrappas i en AppShell med bottom-nav (Hem, Stats, Profil)
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
1. Välkomstskärm med kort intro
2. Välj avatar (bibliotek av färdiga illustrationer)
3. Välj användarnamn
4. Landar i hem-fliken

### Konto i prototyp-fas
- Sparas i localStorage, inte i backend
- Nyckel: `quiz-app.user` → { username, avatar, createdAt }
- Om ingen user finns → visa onboarding
- Om user finns → hoppa direkt till hem

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
