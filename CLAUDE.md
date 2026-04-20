# Quiz-app — Claude Code-instruktioner

## Om projektet
Mobilförst quiz-app där användare spelar korta quiz och ser sin percentil-placering mot alla andra spelare. Byggs först som webb (Next.js PWA), paketeras senare till native iOS/Android via Capacitor.

Samarbete med Instagram-kontot Sveriges Roligaste Klipp som driver trafik vid launch.

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

## Referens
Se docs/PROJECT.md för full projektplan.
