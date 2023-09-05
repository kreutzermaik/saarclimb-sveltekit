# SaarClimb - SvelteKit

> 🌐 PWA: [https://sveltekit-saarclimb.netlify.app/](https://sveltekit-saarclimb.netlify.app/)
>
> 👷‍♀️In dieser README wird die Architektur des Projektes erklärt

## 📄 Allgemein
- Dieses Projekt entsteht im Rahmen meiner Masterthesis
- Hierfür wird eine Web-App entwickelt, die Boulderer und Sportler beim Planen und Dokumentieren von Klettertouren unterstützt
- Die App wird in den dreien JavaScript Meta-Frameworks [SvelteKit](https://kit.svelte.dev/), [SolidStart](https://start.solidjs.com/getting-started/what-is-solidstart) und [Next.js](https://nextjs.org/) entwickelt und analysiert
- SaarClimb ist eine PWA (Progressive Web App)

## 💻 Tech Stack

- Die Basis bildet das Meta-Framework [SvelteKit](https://kit.svelte.dev/)
- Die Komponenten werden entsprechend mit TypeScript und HTML umgesetzt
- Die Styles werden mit [TailwindCSS](https://tailwindcss.com/) geschrieben
- Dynamische Datenanzeige wird durch die _Backend as a Service_ Plattform [Supabase](https://supabase.io/) realisiert
- Dort stehen eine PostgreSQL Datenbank sowie ein Storage für Dateien und Möglichkeiten zur Authentifizierung zur Verfügung

## 🗂️ Übersicht über die Komponenten

- Die Komponenten befinden sich im Ordner `./src/lib/` 
- Diese sind unterschieden in `Features` und `UI-Elemente`
- Die Seiten befinden sich im Ordner `./src/routes/`

## ⌘ Commands

| Command           | Action                                                |
|:------------------|:------------------------------------------------------|
| `npm install`     | Abhängigkeiten installieren                           |
| `npm run dev`     | Startet lokalen Server `http://localhost:5173/`       |
| `npm run build`   | Bauprozess für die Produktion zum Ordner `./netlify/` |
| `npm run preview` | Vorschau der gebauten App vor Deploy                  |

## 🚀 Deployment

- Die Webseite wird mit dem Tool [Netlify](https://www.netlify.com/) deployed
- Das GitHub-Repository der Webseite ist mit einem Netlify-Konto verknüpft
- Wird ein neuer Commit auf den `master`-Branch gepusht, wird die Webseite automatisch neu gebaut und deployed

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

## 📧 Kontakt

- [GitHub](https://github.com/kreutzermaik)
- [LinkedIn](https://linkedin.com/in/maik-kreutzer-889a79197)
