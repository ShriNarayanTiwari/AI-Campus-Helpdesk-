# AI Campus Helpdesk

A React and TypeScript campus assistant for fictional Cedarbrook Campus. DEMO DATA — NOT OFFICIAL.

Use Node 22.12+ or Node 24. Run `npm ci`, `npm run lint`, `npm test` and `npm run build`. Run `npm start` for the server or serve the built dist directory as a static site.

The active handbook is assembled in src/data/cedar.ts from structured fees, hours, club, event and timetable data. The chat uses recent messages and selects local facts. An optional server-side GEMINI_API_KEY enables record selection for unresolved questions; normal campus answers need no account, key or billing. No secret belongs in the browser. The older GLA corpus and its regression tests are retained for reference. They are outside the active answer path.

Profiles, chat history, registrations, tickets and bookmarks are browser-local. The exam timetable covers the listed first-semester dates. No private university system is connected.
