/* ══ frontend tools ══════════════════════════════════════════════════
   Original, plain-English entries. See src/lib/tools/types.ts for the
   contract and ui-design.ts (glassmorphism) for the reference shape. */
import type { Tool } from "../../lib/tools/types";

export const FRONTEND_TOOLS: Tool[] = [
  /* ───────────────────────── frameworks ───────────────────────── */
  {
    id: "do-you-need-a-framework",
    name: "Do you need a framework?",
    category: "frontend",
    subcategory: "frameworks",
    aliases: ["vanilla js vs react", "plain html enough", "no framework", "start without react"],
    summary: "Frameworks pay for themselves once state changes the screen in more than one place.",
    description:
      "A framework buys you one thing: when data changes, the screen changes with it, without you wiring the updates by hand. If your page is static or mostly forms with server round-trips, plain HTML plus a little JS wins on speed and simplicity. If the same data appears in three widgets and changes often, hand-written sync code becomes the real framework - just a bad one.",
    whenToUse: [
      "Decision moment at the start of any new project",
      "Someone proposed React for a five-page brochure site",
      "Prototyping: ship plain HTML first, add the framework when the second stateful view appears",
    ],
    whenNotToUse: [
      "When the app already exists - this tool informs new choices, not rewrites",
      "Interview-prep context: pick boring/standard (React) for employability, not minimalism",
    ],
    difficulty: "beginner",
    controls: [
      { id: "project", label: "Project type", type: "select", def: "marketing site", options: [
        { value: "marketing site", label: "Marketing / brochure" },
        { value: "web app", label: "App with login and data" },
        { value: "dashboard", label: "Dashboard / tool" },
        { value: "prototype", label: "Weekend prototype" },
        { value: "blog", label: "Blog / content" },
      ] },
      { id: "experience", label: "Your comfort", type: "select", def: "beginner", options: [
        { value: "beginner", label: "Newest level" },
        { value: "some js", label: "Comfortable with JS" },
        { value: "shipped apps", label: "Shipped apps before" },
      ] },
    ],
    prompts: {
      cursor: `# Stack decision: no-framework-first

For a "{project}" project built by someone at "{experience}" level in this repo: start without a framework unless TWO views must sync from one piece of data. If React/Next is chosen later, keep components under 200 lines and do not add state libraries until a context provider chain exceeds three. Ask me first before adding any dependency. Document the decision and its revisit trigger in README.`,
      claude: `Act as a pragmatic architect. For a "{project}" project (builder at "{experience}" level), argue the leanest frontend that ships: plain HTML + vanilla JS vs React vs Next.js. Give the one decision rule (data changing the screen in multiple places), the cost of each option in build complexity and hosting, and a concrete revisit-trigger for upgrading. Under 20 lines, no hype.`,
      chatgpt: `I am building a {project} and I am at "{experience}" level with web tech. Do I actually need a framework like React? Explain the single question that decides it (does one piece of data update multiple places on screen?), the downsides of adding a framework anyway, and what stack you would use for exactly my case.`,
      lovable: `Generate a {project} frontend with the simplest stack that works: plain semantic HTML + modern CSS + minimal vanilla JS unless shared live state demands React. No libraries beyond the framework itself; explain the choice in the README.`,
      generic: `For a "{project}" built at "{experience}" level: choose between vanilla HTML/JS, React, and Next.js. State the deciding rule (one data, many screen places), the tradeoff of each, and the trigger to revisit. Keep it under 15 lines.`,
    },
    mistakes: [
      "Choosing React 'because tutorials' for a static site - you inherited a build pipeline to serve five HTML files",
      "Choosing no-framework for a live collaborative app - six months later you maintain a hand-rolled reactivity engine",
      "Framework debates detached from hosting: React needs a build; HTML works on any bucket",
      "Switching mid-project for mood: the second rewrite is always more expensive than the first choice",
    ],
    tips: [
      "Alpine.js or hyperscript occupy the honest middle: reactivity without a build step",
      "If the app is 'forms that go to the server', server-rendered anything beats a SPA every time",
      "The cost of a framework is not the library - it is every decision it forces (routing, state, hydration)",
      "Decide again at 3 screens: most 'no framework' projects graduate naturally to Next at that point",
    ],
    tags: ["decision", "react", "vanilla", "architecture"],
    related: ["nextjs-app-router", "vite-vs-next", "component-composition"],
    learnMore: [
      { label: "web.dev: learn vanilla JS", url: "https://web.dev/learn/javascript" },
      { label: "MDN: DOM manipulation", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" },
    ],
  },
  {
    id: "nextjs-app-router",
    name: "Next.js App Router",
    category: "frontend",
    subcategory: "frameworks",
    aliases: ["next js", "app router vs pages", "react framework with server", "server components"],
    summary: "React with a server built in: folders are routes, files decide where code runs.",
    description:
      "Next.js renders React on the server first (fast first paint, real HTML for Google) and then hands over to the browser. In the App Router, each folder is a URL and each file states its job: page.tsx renders, layout.tsx wraps, route.ts answers API calls, loading.tsx shows while data comes. Server Components run only on the server (can fetch directly, cannot use onClick) - the 'use client' line is the border between the two worlds.",
    whenToUse: [
      "Content + app hybrid: marketing pages AND a logged-in dashboard on one codebase",
      "SEO matters and you want prerendered HTML without running a CMS server",
      "You already think in React and want routing, data and deployment in one battery pack",
    ],
    whenNotToUse: [
      "Pure static site: plain HTML or a generator is 10x lighter",
      "API-only backend: Express/Fastify/Hono do not need React attached",
      "Team fluent in Vite SPA + separate backend - two extra Next concepts will not pay rent yet",
    ],
    difficulty: "intermediate",
    tags: ["react", "routing", "server components", "next"],
    controls: [
      { id: "app", label: "What you are building", type: "select", def: "site with dashboard", options: [
        { value: "site with dashboard", label: "Marketing + app" },
        { value: "content site", label: "Blog/docs/content" },
        { value: "app only", label: "App after sign-in" },
        { value: "api + pages", label: "Has API routes too" },
      ] },
      { id: "data", label: "Data source", type: "select", def: "database", options: [
        { value: "database", label: "Postgres/SQLite" },
        { value: "external api", label: "Third-party APIs" },
        { value: "files", label: "Markdown/JSON files" },
      ] },
    ],
    prompts: {
      cursor: `# Next.js App Router conventions

Structure this {app} built on Next.js (data: {data}) strictly as:
- src/app/<route>/page.tsx per URL; shared chrome in layout.tsx; pending states in loading.tsx
- Server Components by default; add 'use client' ONLY where interactivity requires (onClick, useState, browser APIs) - keep those leaves small, push the directive down not the component up
- data fetching inside server components (async/await direct), no client-side waterfalls
- API endpoints as route.ts handlers; searchparams via await params / await searchParams
- metadata via generateMetadata/generateStaticParams where URLs are enumerable`,
      claude: `Act as a Next.js App Router mentor. For a {app} with {data} data: show the folder map (page/layout/loading/route), then ONE server component that fetches directly and ONE tiny 'use client' island wired to it. Explain the 'use client' boundary rule (directive marks the module graph edge, not just the file) and when generateStaticParams beats dynamic rendering. Under 60 lines.`,
      chatgpt: `Explain Next.js App Router to a React beginner: what each of page.tsx, layout.tsx, loading.tsx, route.ts does; what a Server Component is and why 'use client' exists; how routing from folders works for my {app}. Then give a minimal 3-file example with a {data} fetch on the server.`,
      lovable: `Next.js app-router skeleton for {app}: folder-per-route under src/app, server components fetching {data} directly, one client island per interactive widget, metadata + loading states per page, no orphan 'use client' at the root.`,
      generic: "Map the Next.js App Router for a {app} with {data}: folder=route, file roles (page/layout/loading/route), server-first components with small 'use client' islands, direct async fetching, metadata and static params where enumerable. Include the rule for placing the client boundary.",
    },
    mistakes: [
      "'use client' at the top of the shared layout: the whole tree ships to the browser and server fetching dies",
      "Client fetch waterfalls: three useEffect calls when one server component could await all three together",
      "Putting DB secrets in any module reachable from a client boundary - check import graphs, not file names",
      "Renaming pages/ to app/ half-migrated: two routers, zero docs, every tutorial conflicts",
    ],
    tips: [
      "Default test: does this component call any browser API or attach handlers? If no, delete its 'use client'",
      "loading.tsx is free UX: define it once per route group and instant skeletons appear",
      "next/link prefetches visible links - your nav becomes instant between pages for zero code",
      "npm run build output prints which routes prerendered - that list is your SEO truth",
    ],
    related: ["do-you-need-a-framework", "vite-vs-next", "server-actions-forms", "fetch-async-await"],
    learnMore: [
      { label: "Next.js: App Router overview", url: "https://nextjs.org/docs/app/overview" },
      { label: "Next.js: Server Components", url: "https://nextjs.org/docs/app/building-your-application/react/server-components" },
    ],
  },
  {
    id: "vite-vs-next",
    name: "Vite or Next?",
    category: "frontend",
    subcategory: "frameworks",
    aliases: ["vite vs next.js", "spa vs ssr", "react build tool", "client only vs server rendered"],
    summary: "Vite builds a client app; Next builds a whole site with the server wired in.",
    description:
      "Vite gives you React (or Vue/Svelte) in the browser with a screaming-fast dev server - you own routing, data, and hosting as separate choices. Next ships those decisions made: server rendering, file routing, API routes, image optimisation. Choose by what the site must do on arrival: if Google and first paint need content that exists before JS runs, that is Next's job. If the app lives behind login and the shell can be blank until hydrated, Vite is simpler.",
    whenToUse: [
      "Greenfield choice where SEO/prerender is NOT required: Vite keeps the surface small",
      "Recovering an existing Vite SPA - adding Next-style data flows means a migration, not a plugin",
      "Teaching React fundamentals: Vite's client-only model matches the mental model",
    ],
    whenNotToUse: [
      "Content-heavy public sites: the prerender gap is an SEO tax you will pay forever",
      "When you need API routes on the same origin soon - that is Next re-entering through the side door",
      "As a debate about quality: both are excellent; this is a hosting/rendering decision",
    ],
    difficulty: "beginner",
    tags: ["build tools", "react", "decision", "hosting"],
    controls: [
      { id: "seo", label: "SEO needed?", type: "toggle", def: true, onValue: "public pages that must rank", offValue: "app behind login" },
      { id: "team", label: "Team size", type: "select", def: "solo", options: [
        { value: "solo", label: "One person" },
        { value: "small team", label: "2-5 devs" },
        { value: "big team", label: "6+" },
      ] },
    ],
    prompts: {
      cursor: `# Vite SPA vs Next.js - record the decision

For this project ({seo}, {team} team): write an ADR (architecture decision record) in docs/ choosing Vite or Next.js against these criteria: first-paint HTML without JS (on), route-level prefetch, one-origin API, deploy target support, and how many decisions each leaves to us. State the chosen option, the trigger that would flip it (e.g., adding public pages to a Vite app), and what would need migrating. Reference existing repo reality, do not invent files.`,
      claude: `Act as a neutral stack advisor. {seo}, {team} team: compare Vite (+router, +hosting choices) against Next.js on: prerendered first paint, data fetching model, API colocation, build speed, hosting lock-in, and how many 'you decide' items remain. End with a recommendation and the one sentence that would justify reversing it in six months. No vendor cheerleading.`,
      chatgpt: `What's the actual difference between a Vite React app and Next.js? Cover: where the HTML comes from on first visit, SEO implications, API routes, deployment options, dev speed. My context: {seo} with a {team} team - which do you pick and name the tradeoff you are accepting.`,
      lovable: `Set up this app choosing between Vite and Next.js based on: {seo}, {team} team. Whichever is chosen, document the other option's trigger in the README and keep the component tree portable (no framework-specific data patterns leaking into leaf components).`,
      generic: "Compare Vite and Next.js for {seo}, {team} team: first-paint HTML, routing/data/API colocation, deploy targets, dev velocity, decision count left to you. Recommend one with the reversal trigger stated.",
    },
    mistakes: [
      "Picking Vite for a directory site, then hand-rolling SSR for 'one page' - now you own a renderer",
      "Picking Next for an internal tool: you pay the server-component tax for routing you already had",
      "Ignoring that migration between them is a rewrite, not a refactor - decide before components multiply",
      "Benchmarking dev-server speed as the deciding factor: boot time is minutes per day either way",
    ],
    tips: [
      "One question decides most cases: must the first HTML response contain the content? yes→Next, no→Vite",
      "Vite + react-router + a tiny server is a fine architecture - just be honest that you are rebuilding Next's menu",
      "Hosting shapes this: Vite = any static host; Next = Vercel/self-hosted node - check before coding",
      "If both feel equal, take Next: prefetched links and metadata APIs remove chores you did not budget for",
    ],
    related: ["nextjs-app-router", "do-you-need-a-framework", "spa-hosting-static"],
    learnMore: [
      { label: "Vite: why Vite", url: "https://vite.dev/guide/why" },
      { label: "Next.js: when to use", url: "https://nextjs.org/docs/app/get-started" },
    ],
  },
  {
    id: "framework-picker",
    name: "React vs Vue vs Svelte",
    category: "frontend",
    subcategory: "frameworks",
    aliases: ["which frontend framework", "vue or react", "svelte worth it", "best js framework for beginners"],
    summary: "All three solve the same problem; pick for jobs, ecosystem, and vibe - the tech is a tie.",
    description:
      "React, Vue and Svelte all say: describe the screen from data, they update it. The differences are philosophical: React keeps everything as JavaScript expressions (verbose, explicit, ecosystem giant), Vue puts reactivity in the template with batteries included (approachable, one-file components), Svelte compiles it away (least code, small-gestures magic, smaller job market). Your hiring plan and library needs should decide, not benchmark threads.",
    whenToUse: [
      "First framework choice where employability matters: React has roughly every job listing",
      "Solo projects wanting gentle syntax and built-in everything: Vue",
      "Performance-sensitive small apps and interactive pieces: Svelte",
    ],
    whenNotToUse: [
      "When your team already ships in one of them: the switch cost beats the philosophy",
      "For apps that are mostly the map/canvas/WebGL layer: framework choice barely registers",
      "As a forever decision: each re-renders similarly for typical CRUD UIs",
    ],
    difficulty: "beginner",
    tags: ["react", "vue", "svelte", "decision"],
    controls: [
      { id: "priority", label: "Top priority", type: "select", def: "jobs", options: [
        { value: "jobs", label: "Employability" },
        { value: "speed of learning", label: "Fastest to learn" },
        { value: "performance", label: "Small & fast output" },
        { value: "ecosystem", label: "Libraries & examples" },
      ] },
      { id: "style", label: "Code taste", type: "select", def: "js everywhere", options: [
        { value: "js everywhere", label: "All JavaScript, even the markup" },
        { value: "html first", label: "Real HTML in the file" },
        { value: "least code", label: "Smallest possible program" },
      ] },
    ],
    prompts: {
      cursor: `# Framework choice, decided transparently

For this {style} builder prioritising {priority}, write the short decision into README: React/Vue/Svelte against exactly these axes (jobs, learning curve, bundle output, library surface). Pick ONE; justify in three sentences tied to my {priority}; list the two things I give up. Then scaffold with the official tool (create-react-app is retired - use a maintained template) and do NOT add state/routing/UI libraries in the initial commit beyond router if required.`,
      claude: `Act as a career-aware mentor. Priorities: {priority}; style taste: {style}. Give a comparison of React, Vue, Svelte as a short table (jobs, learnability, output size, ecosystem, hiring-region caveats), one recommendation with its cost, and the 10-line 'hello counter' in the winner and one runner-up so I feel the syntax difference immediately.`,
      chatgpt: `For someone prioritising {priority} who likes {style} code: React, Vue or Svelte? Compare them fairly on jobs, learning speed, output bundle, and ecosystem, recommend one, show the same tiny counter component in two of them, and tell me the honest downsides of your pick.`,
      lovable: `Scaffold this project in {style} preference with {priority} as top priority: if React, function components + hooks only; if Vue, single-file components with script setup; if Svelte, runes. Official template, zero extra libraries in commit one.`,
      generic: "React vs Vue vs Svelte for {priority} (style: {style}): fair comparison across jobs, learning curve, output, ecosystem; one recommendation with its honest costs; a two-framework micro-example of the same widget.",
    },
    mistakes: [
      "Framework-hopping every project: depth in one pays more than breadth across three",
      "Choosing by benchmark: all three are fast enough for CRUD; your product bugs will not be framework-shaped",
      "Ignoring the region: Svelte is loved in some markets and invisible in job boards in others",
      "Adopting a framework for one library that only exists in another: check the addon first, then decide",
    ],
    tips: [
      "Transferable 80%: components, props, reactivity, effects - learning the second framework is a weekend job",
      "Vue and Svelte files literally contain HTML: if that soothes you, that preference IS data",
      "React's verbosity is feature-not-bug in teams: one obvious way to do things, every codebase alike",
      "Whichever you pick: hooks/composition model (React), composables (Vue), or runes (Svelte) are the same idea renamed",
    ],
    related: ["do-you-need-a-framework", "vite-vs-next", "component-composition"],
    learnMore: [
      { label: "Vue: ecosystem overview", url: "https://vuejs.org/guide/ecosystem/overview" },
      { label: "Svelte: runes", url: "https://svelte.dev/docs/svelte/runes" },
    ],
  },
  {
    id: "component-composition",
    name: "Component composition",
    category: "frontend",
    subcategory: "frameworks",
    aliases: ["props vs children", "components inside components", "slot", "avoid prop drilling", "reusable components"],
    summary: "Build small pieces that accept other pieces - the alternative to a god-component.",
    description:
      "Composition means assembling UI from parts that pass through each other instead of configuring one big component with twenty props. React calls the passed-in part children (or a named prop), Vue and Svelte call it slots. The payoff: Card does not need to know it will ever contain a PricingTable; the feature flag prop dies; the file stays readable because each piece owns exactly one job.",
    whenToUse: [
      "A component has a boolean prop that only changes the middle third of its JSX",
      "You are three 'mode' props deep into one component",
      "Design systems: shell components (Modal, Card, Layout) that must hold unknown futures",
    ],
    whenNotToUse: [
      "Genuinely fixed widgets (a date input) - children slots for everything is its own dogma",
      "Tiny one-page apps where one 'Page' component honestly is the leaf",
      "As refactoring for its own sake: extract at the second real variation, not the first",
    ],
    difficulty: "intermediate",
    tags: ["react", "architecture", "props", "design system"],
    controls: [],
    prompts: {
      cursor: `# Composition refactor

Find the component in this repo with the most boolean/mode props that swap its inner content. Refactor toward composition:
- the shell keeps structure and styling; the changing region becomes a children (React) / slot (Vue/Svelte) / snippet prop
- variant-specific wiring moves OUT of the shell into the assembled pieces; delete the props that no longer carry information
- where two modes must share behaviour, use context (React) or provide/inject (Vue) or props passing one level - do not thread 5 props through 3 untouched layers
No new libraries; behaviour and markup output must not change.`,
      claude: `Act as a component architect. Show the same UI twice: first as a god-component with 6 mode props (the smell), then composed as shell + children/slots where each piece owns one job. State the two signals that it is time to compose (a boolean that rewrites the middle of the JSX; the third variant prop), when context beats slotting, and one case where props-of-components beats both. 50 lines max.`,
      chatgpt: `Explain component composition (children/slots) to a React beginner with a concrete before/after: a Card component that currently takes variant, showFooter, showBadge props vs one that accepts sub-components. When is passing components as props better than children? Keep it tutorial-calm.`,
      lovable: `Refactor UI shells in this codebase to composition: Modal/Card/Layout accept content through children or slots instead of mode props; feature logic lives in the leaves; no prop chains through layers that do not use them.`,
      generic: "Demonstrate component composition vs a god-component: shell accepts children/slots, variant logic moves to leaves, context used instead of threading untouched props. Give the two refactor signals and one anti-dogma case where fixed widgets stay closed.",
    },
    mistakes: [
      "Prop threading five layers deep: intermediate components are mailrooms, not modules",
      "Slot soup: 6 named slots in one component is a 6-boolean-props smell wearing a trench coat",
      "Composing at the first draft: premature extraction duplicates what a simple prop would have done",
      "Rendering callbacks that close over everything: pass data through context/hooks when the piece needs the shell's world",
    ],
    tips: [
      "React's rule of thumb: if you wrote {showHeader && <Header/>}, you wrote a slot with extra steps",
      "Compound components (Tabs + Tabs.List + Tabs.Panel) share state via context, expose none via props",
      "Name the shell after the job ('Layout'), not the look - composition ages better than styling",
      "The extraction test: could this piece be reused WITHOUT changing its parent's file? If never, leave it inline",
    ],
    related: ["nextjs-app-router", "local-state-vs-server-state", "framework-picker"],
    learnMore: [
      { label: "React: composition vs inheritance", url: "https://react.dev/learn/passing-props-to-a-component" },
      { label: "Vue: slots", url: "https://vuejs.org/guide/components/slots" },
    ],
  },

  /* ─────────────────────── state & data ─────────────────────── */
  {
    id: "local-state-vs-server-state",
    name: "Local state vs server state",
    category: "frontend",
    subcategory: "state-and-data",
    aliases: ["where should data live", "useState for api data", "caching thinking", "state management confusion"],
    summary: "Data you own changes with useState; data the server owns needs a cache, not a store.",
    description:
      "The biggest state bug is treating server data like local state: you copy it into useState, it goes stale, and you write a sync ritual on top. The honest split: local state is things the browser owns (open panel, form draft, selected tab). Server state is copies of someone else's truth (user list, pricing) - it belongs in a cache with freshness rules (React Query/SWR or the framework's own loader), where invalidation is a real concept.",
    whenToUse: [
      "Every time you reach for useState to hold fetched data - stop and re-read the second sentence",
      "Choosing between a store library and a query cache for a new feature",
      "Debugging 'the list is stale after I edit it'",
    ],
    whenNotToUse: [
      "Trivially static config: importing constants is not state management",
      "Before the app has real server data at all - premature cache adoption is a dependency",
    ],
    difficulty: "intermediate",
    tags: ["react", "caching", "state", "architecture"],
    controls: [],
    prompts: {
      cursor: `# Local vs server state audit

Classify every useState/useStore holding DATA fetched from a server (vs UI state like open/draft/selected). For each misplacement: move server copies into the query/cache layer already present (React Query/SWR/Svelte Query; if none exists in the repo, PROPOSE adding one and wait for my approval before installing), or into route loaders for Next data. Replace manual refresh effects with invalidation after mutations (invalidate by resource key). Keep genuine UI state exactly where it is. Produce a table: state, current home, new home, invalidation trigger.`,
      claude: `Act as a state architect. Give the classification rule (who owns the truth: browser → local state, server → cache) and apply it to the common suspects: fetched lists, form drafts, open panels, selected tab, current user. For server-state, contrast 'copy into useState + refetch effect' with query-cache invalidation and show 6 lines of each. Then name the two symptoms of the wrong choice (stale UI after mutation, double-fetch storms).`,
      chatgpt: `Beginner question: I fetch a list and put it in useState - people say that's wrong. Explain local state vs server state, why copies go stale, what React Query/SWR do differently (cache keys, invalidation, freshness), and when plain useState is still correct. Give one tiny before/after example.`,
      lovable: `Split state cleanly in this app: UI state (open, draft, selected) in useState/stores; all server data in the cache layer with query keys per resource; every mutation invalidates by key instead of refetching manually. No fetched data ever lives in plain useState.`,
      generic: "Define the local-vs-server-state boundary (truth owner), show the stale-copy antipattern and the cache/invalidation alternative, classify six common cases, and list the symptoms that reveal a misplaced copy.",
    },
    mistakes: [
      "The sync ritual: useEffect refetching a store copy every time another component mutates it",
      "Global state library for server data - you rebuilt React Query badly and called it a store",
      "Form drafts in the query cache: they belong to the browser and vanish on purpose",
      "No invalidation keys: everything refetches when anything changes because 'all data' is one key",
    ],
    tips: [
      "One-line test: if two tabs can disagree, it is server state (it needs freshness rules)",
      "staleTime thinking: most lists are fine for 30-60 seconds; instant refetch on mount is a choice, not a default",
      "Optimistic updates live in the cache, not the component: rollback is the cache's job",
      "Next.js loaders + revalidatePath is the same philosophy server-side: caches with invalidation, not copies",
    ],
    related: ["fetch-async-await", "react-query-caching", "nextjs-app-router", "url-as-state"],
    learnMore: [
      { label: "TkDodo: state management compilers", url: "https://tkdodo.eu/blog/state-management-compilers" },
      { label: "React Query: overview", url: "https://tanstack.com/query/latest/docs/framework/react/overview" },
    ],
  },
  {
    id: "fetch-async-await",
    name: "Fetching data, simply",
    category: "frontend",
    subcategory: "state-and-data",
    aliases: ["how to call an api", "fetch json", "loading error state", "async await in react"],
    summary: "One request, three states: loading, error, data - written out until you feel it.",
    description:
      "Every data fetch has exactly three outcomes; a component that can show only one of them is buggy by construction. fetch() returns a Response that is 'ok' even for 404s (check res.ok yourself), and the JSON comes in a second await. In React that trio lives as a small state machine; in server components or plain JS it is just await with a try/catch. Master this shape before any library abstracts it away.",
    whenToUse: [
      "Learning the raw mechanics before React Query/SWR abstract them",
      "Server-side code, route handlers, scripts: async/await with try/catch is the final form",
      "Auditing a component that lacks a loading or error branch (they are everywhere)",
    ],
    whenNotToUse: [
      "Repeated app-wide fetched data: the copy-into-state pattern is the starting point, not the system - see the cache split",
      "When the framework gives you data directly (Next loaders): do not re-implement inside",
    ],
    difficulty: "beginner",
    tags: ["javascript", "api", "react", "basics"],
    controls: [
      { id: "url", label: "Endpoint", type: "select", def: "/api/projects", options: [
        { value: "/api/projects", label: "My app's own API" },
        { value: "github api", label: "GitHub's public API" },
        { value: "weather api", label: "Any third-party JSON API" },
      ] },
    ],
    prompts: {
      cursor: `# Clean fetch with full state coverage

Implement fetching from {url} with the explicit three-state shape:
- status: idle|loading|error|ready (one state variable, not three booleans that can contradict)
- fetch: await res.ok guard BEFORE res.json() (404 is not a network error - check it), then json
- on error, show the message and a Retry that re-runs the same effect cleanly
- loading state renders a placeholder of final size (no jump); data render is the fourth branch
- AbortController per effect so route changes do not setState late`,
      claude: `Act as a fundamentals teacher. Write one fetch component for {url} covering loading/error/data with a single status state machine, res.ok checking, AbortController, and retry. Then list the three beginner traps it avoids (res.ok, forgotten error branch, setState after unmount) with one line each. 40 lines max, no libraries.`,
      chatgpt: `Teach me fetch() in JavaScript step by step for {url}: the two awaits (response, then json), what res.ok means and why 404 still resolves, then the React version with loading/error/data states. Comment every line for a beginner.`,
      lovable: `Data views in this app always render four states from one status variable: idle, loading (sized placeholder), error (message + retry), ready. Fetching from {url} follows it; nothing shows a blank screen mid-await.`,
      generic: "Demonstrate a complete fetch for {url}: single status machine, both awaits, res.ok semantics, abort-on-unmount, sized loading placeholder, retry on error. Note the three beginner traps this structure prevents.",
    },
    mistakes: [
      "Treating 404/500 as success because fetch did not reject - res.ok is the status gate",
      "Three separate booleans (loading, error, empty): states that can contradict each other",
      "setState in a stale effect after navigation: the silent 'unmounted component' warning",
      "Forgetting res.json() is a second await - the 'objects are not iterable' beginner wall",
    ],
    tips: [
      "One status string beats four flags; every UI bug in fetching is a contradiction between flags",
      "Loading placeholder should match final size - the jump is called layout shift and users feel it",
      "Retry re-runs the original function; do not reload the page to retry a list",
      "In server components the same shape is one await + one try - the three outcomes are universal",
    ],
    related: ["local-state-vs-server-state", "react-query-caching", "form-submit-states", "skeleton-loading"],
    learnMore: [
      { label: "MDN: fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
      { label: "MDN: AbortController", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController" },
    ],
  },
  {
    id: "react-query-caching",
    name: "Query cache (React Query)",
    category: "frontend",
    subcategory: "state-and-data",
    aliases: ["react query", "swr", "server state library", "data fetching tool", "cache api calls"],
    summary: "Give every fetch a key and the library handles loading, cache, refetch and dedupe.",
    description:
      "React Query (or SWR) treats server data as a cache of keyed resources: useQuery({ queryKey: ['projects'], queryFn }) gives you data, isLoading, error - plus deduplication (two components asking for ['projects'] cause one request), freshness policy, background refetch on focus, and targeted invalidation after a save. You stop writing effects; you start describing which server data this screen needs.",
    whenToUse: [
      "App-wide lists/detail views where staleness bugs already appeared",
      "Multiple screens needing the same resource (dedupe becomes free)",
      "Mutations with optimistic UI: the cache rollback is exactly what it is built for",
    ],
    whenNotToUse: [
      "One static fetch on one page: useEffect+fetch honestly suffices - do not install a framework for it",
      "Server Components with loaders (Next): the cache already lives upstream - adding it twice confuses both",
      "Ask-before-add territory: this is a dependency decision, take it to the human",
    ],
    difficulty: "advanced",
    tags: ["react", "caching", "library", "data"],
    controls: [
      { id: "lib", label: "Flavour", type: "select", def: "React Query (TanStack)", options: [
        { value: "React Query (TanStack)", label: "React Query (most complete)" },
        { value: "SWR", label: "SWR (minimal, Vercel-flavoured)" },
        { value: "Svelte Query", label: "Svelte Query (same engine)" },
      ] },
    ],
    prompts: {
      cursor: `# Query cache adoption for {lib}

APPROVAL-FIRST: adding {lib} is a new dependency - list its bundle impact and wait for my go. Once approved:
- wrap the app with the QueryClientProvider; devtools only in development
- move each existing server-data effect into useQuery with a resource-shaped key (['projects', id], not ['data1'])
- replace post-save refetch calls with invalidateQueries by key prefix
- one retry policy: default for reads, zero retries for mutations
- leave UI state and one-shot fetches untouched`,
      claude: `Act as a data-layer engineer. Contrast useEffect-fetching with {lib} for the same resource: show the antipattern (6 lines), then the query version with a good key, staleTime choice, focus-refetch, and invalidate-on-mutation. Enumerate exactly what the library gives (dedupe, cache freshness, retry, devtools) and the honest costs (bundle, indirection, keys to name). Under 50 lines.`,
      chatgpt: `What problem does React Query (or SWR) solve that useEffect + fetch does not? Explain cache keys, deduplication, staleTime vs cacheTime, and invalidation after mutations, with a tiny example each. When would you NOT use it?`,
      lovable: `Data layer for this app using {lib}: resource-keyed queries, skeleton via isLoading, error toast via onError, mutations that invalidate by key prefix. No component fetches with raw useEffect anymore.`,
      generic: "Adopt a query cache ({lib}): keyed resources, isLoading/error/data everywhere, dedupe, freshness policy, invalidate-after-mutate, devtools in dev. Include the dependency-approval note and the cases raw fetch still wins.",
    },
    mistakes: [
      "Keys named by feature ('dashboardData') instead of resource ('projects', id): invalidation becomes guesswork",
      "Refetching manually where invalidating belongs: you keep the staleness, lose the cache",
      "Wrapping every constant and one-shot call in queries: the cache is for server state, everything else was fine",
      "Skipping retry policy: 500 errors that need a human get hammered ten times by default settings",
    ],
    tips: [
      "Keys are your cache API: prefix-shaped arrays invalidate by family (['projects'] hits all project queries)",
      "staleTime 60s is a better default than the library's 0 for most content apps - set it once at the provider",
      "useMutation + onSuccess invalidate is the canonical save dance; optimistic variants belong in the docs",
      "React Query works perfectly inside Next server-action codebases: client cache stays about client reads",
    ],
    related: ["local-state-vs-server-state", "fetch-async-await", "url-as-state", "skeleton-loading"],
    learnMore: [
      { label: "TanStack Query docs", url: "https://tanstack.com/query/latest/docs/framework/react/overview" },
      { label: "SWR docs", url: "https://swr.vercel.app/docs/getting-started" },
    ],
  },
  {
    id: "localstorage-persist",
    name: "localStorage & persistence",
    category: "frontend",
    subcategory: "state-and-data",
    aliases: ["save data in browser", "remember settings", "persist theme", "json in storage"],
    summary: "The browser's sticky note: small, same-origin, string-only - and the three rules that follow.",
    description:
      "localStorage keeps key/value strings per origin (~5MB), survives reloads, syncs never - it is a sticky note, not a database. Three rules cover most bugs: it is strings (JSON.parse/stringify round-trips with a try/catch default), it does not exist during server rendering (guard every read for the browser), and it is user-visible-editable (never trust what comes back, validate shape and version your payloads).",
    whenToUse: [
      "Preferences: theme, density, last-viewed tab, dismissed banners",
      "Draft rescue: unsaved form text survives an accidental close",
      "Tiny recent-activity lists (last N prompts/views)",
    ],
    whenNotToUse: [
      "Anything the server should also know (saves, sync): that is the backend's database",
      "Secrets: readable by any script on your page - tokens never go here",
      "Big or queryable collections: IndexedDB (or SQLite) is the real browser database",
    ],
    difficulty: "beginner",
    tags: ["browser", "storage", "javascript", "settings"],
    controls: [
      { id: "key", label: "Key name", type: "select", def: "app:prefs", options: [
        { value: "app:prefs", label: "app:prefs (settings)" },
        { value: "app:draft", label: "app:draft (form rescue)" },
        { value: "app:recent", label: "app:recent (activity list)" },
      ] },
      { id: "fallback", label: "If data is broken", type: "select", def: "defaults silently", options: [
        { value: "defaults silently", label: "Return defaults quietly" },
        { value: "reset + notify", label: "Clear it and tell the user" },
      ] },
    ],
    prompts: {
      cursor: `# localStorage persistence for {key}

Implement read/write for {key} with all three rules enforced:
- JSON round-trip inside try/catch; corrupt payload handling: {fallback}
- a version field inside the stored object; ignore-and-default on version mismatch (cheap migration hook)
- SSR-safe: every access behind a browser check (typeof window or mounted gate) so server render never touches it
- validation of shape AFTER parse (keys, types, lengths) - stored data is untrusted input
- writes: wrap in try (quota errors are real); reads: never throw
Provide the small useStored(key, default) hook and refactor manual getItem/setItem call sites onto it.`,
      claude: `Act as a browser-storage realist. Show safe {key} persistence: JSON+try/catch, embedded version field with mismatch handling ({fallback}), SSR guards, post-parse shape validation, quota-error-tolerant writes. Give one hook (~20 lines) covering all. Then state the two things localStorage must NEVER hold (secrets, server-owned truth) with one reason each.`,
      chatgpt: `How do I save small settings in the browser with localStorage? Cover: string-only storage and JSON, a try/catch around parsing, checking we're in the browser (for SSR frameworks), a version field for future changes, and what should never be stored there. Write a get/set pair for {key}.`,
      lovable: `Persist {key} in localStorage via a typed hook: JSON round-trip with defaults on corruption ({fallback}), versioned payload, browser-only access, never for auth tokens or anything the server owns.`,
      generic: "Implement {key} persistence safely: JSON round-trips with try/catch ({fallback}), versioned payloads, SSR guards, shape validation on read, quota-safe writes. List the storage's three limits (strings, same-origin, user-editable) and their consequences.",
    },
    mistakes: [
      "Crash on corrupt JSON: stored data WILL be broken someday (quota, old versions, extensions) - try/catch the parse",
      "Reading during render on the server: 'localStorage is not defined' is an SSR bug with one guard",
      "Trusting parsed shape without validation: someone's console is your input",
      "Storing the whole app state 'just in case': one stale copy is a million-user support ticket",
    ],
    tips: [
      "Prefix keys (app:prefs) - origins are shared with anything you embed later",
      "Version inside the payload, not in the key name; migrations then run in one place",
      "Quota is per-origin: a bloated draft key can starve every other feature - cap sizes",
      "For drafts: debounce writes and clear on successful submit; the rescue is the only job",
    ],
    related: ["url-as-state", "local-state-vs-server-state", "safety-check-secrets", "data-table"],
    learnMore: [
      { label: "MDN: localStorage", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" },
      { label: "MDN: IndexedDB (the real browser DB)", url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" },
    ],
  },
  {
    id: "url-as-state",
    name: "URL as state",
    category: "frontend",
    subcategory: "state-and-data",
    aliases: ["query params for filters", "shareable page state", "deep link", "back button behaviour"],
    summary: "Anything a user might want to bookmark or send to a friend belongs in the URL, not a store.",
    description:
      "The URL is the only state that survives refresh, sharing, back-button, and opening in a new tab. Putting filters, pages, open tabs, and searches into query parameters (with replaceState so typing does not flood history) turns every screen into a link. Users bookmark them; your support screenshots have context; analytics have detail. State that is ephemeral (typing a password) stays out.",
    whenToUse: [
      "Directory/list pages: filters, sort, page number, active search",
      "Multi-step UIs where refresh currently loses everything",
      "Anything QA says 'how do I link to that exact view?' about",
    ],
    whenNotToUse: [
      "Secrets and PII in the address bar (history, referrers, logs see all)",
      "Fast-changing values typed per keystroke - debounce into the URL (~300ms)",
      "App-wide UI chrome (theme) that never needs sharing - localStorage suits it",
    ],
    difficulty: "intermediate",
    tags: ["routing", "history api", "filters", "ux"],
    controls: [
      { id: "framework", label: "Routing world", type: "select", def: "Next.js", options: [
        { value: "Next.js", label: "Next.js (useSearchParams/router)" },
        { value: "React Router", label: "React Router" },
        { value: "plain", label: "Plain browser (URLSearchParams)" },
      ] },
    ],
    prompts: {
      cursor: `# URL-driven state for this list

In {framework}, move filter/sort/page/search UI state into query parameters:
- read on render (useSearchParams / URLSearchParams), write with replace:true (typing must not spam history)
- only non-default values appear in the URL (?f=tools not ?f=all&sort=desc&page=1)
- debounce user typing ~300ms before writing; clear-to-default when the field empties
- SSR: search params are client-only after hydration - guard accordingly
- a 'Copy link to this view' button that copies the current URL is included
State not in the URL: open dropdown internals, draft typing values, hover state.`,
      claude: `Act as a deep-linking advocate. Convert one filtered list to URL state in {framework}: param read/write patterns, replaceState rationale vs pushState, default-omission for a clean shareable URL, debounce for typing, the SSR guard, and a copy-link affordance. Then contrast what stays OUT of the URL (ephemeral UI, secrets) and why. <45 lines.`,
      chatgpt: `Why do people say 'put your filters in the URL'? Explain for {framework}: the shared state, query parameters basics, why replace instead of push while typing, what belongs in a URL vs what does not, and how the back button behaves when you get it right. Small code example per point.`,
      lovable: `Shareable views: every filter, sort, page and search on this listing lives in the query string ({framework} params), typing debounced into the URL, defaults omitted, plus a 'copy link' chip. Refresh and share never lose position.`,
     generic: "Design URL-as-state for a listing: query params for filters/sort/page/search, replaceState during typing (debounced), default-omission, what must never be in a URL, and how back/refresh/share all start working. Framework: {framework}.",
    },
    mistakes: [
      "pushState on every keystroke: the back button becomes archaeology - replace during typing, push on commit",
      "Full default param spam (?page=1&sort=desc&f=all): unreadable, unbookmarkable, analytics noise",
      "Reading params without SSR guard (window.location) in server-rendered apps: hydration crash",
      "Two sources of truth: component useState AND the URL, drifting apart after the first edit",
    ],
    tips: [
      "The test that settles it: 'would a user want this view in a link?' - yes means URL",
      "URLSearchParams is the shared primitive across every framework - learn it once",
      "Version your param names (f= not filter=) only when collisions demand; readability beats cleverness",
      "Analytics gold: URL-state views tell you which filter combos are actually popular",
    ],
    related: ["localstorage-persist", "nextjs-app-router", "seo-meta-basics", "react-query-caching"],
    learnMore: [
      { label: "MDN: URLSearchParams", url: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" },
      { label: "MDN: history.replaceState", url: "https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState" },
    ],
  },

  /* ── forms ══════════════════════════════════════════════════════ */
  {
    id: "form-validation",
    name: "Form Validation",
    category: "frontend",
    subcategory: "forms",
    aliases: ["input validation", "error messages", "required fields", "checking the form"],
    summary: "Tell people what is wrong with a field before they hit send, not after.",
    description:
      "Validation means checking each input against the rules you actually need (is this an email? is it 8 characters?) and showing the result next to the field that failed. The friendly sequence is: check when the person leaves the field, show a specific fix next to it, then re-check as they type again. The browser already does a lot of this - type=email and the required attribute work with no JavaScript.",
    whenToUse: [
      "Any field you can already reject: emails, passwords, card numbers, dates",
      "Long sign-up flows where one dead field at the end wastes the whole attempt",
      "Before calling an API - a local check is free, a server round-trip is not",
    ],
    whenNotToUse: [
      "One-email inputs: native type=email plus required is enough, skip the library",
      "Fields where any input is legal (usernames are weirder than you think)",
      "As a security layer - validation is courtesy; the server must still check everything",
    ],
    difficulty: "beginner",
    tags: ["forms", "ux", "validation", "errors"],
    controls: [
      { id: "err", label: "Error colour", type: "color", def: "#c0392b" },
      { id: "ok", label: "Success colour", type: "color", def: "#2e7d32" },
      { id: "radius", label: "Field radius", type: "slider", def: 8, min: 0, max: 16, step: 2, unit: "px" },
      { id: "bg", label: "Form background", type: "color", def: "#fbf7f1" },
      { id: "text", label: "Text", type: "color", def: "#221a13" },
    ],
    cssTemplate: `.demo-root { background: {bg}; color: {text}; padding: 22px; border-radius: 12px; }

.demo-root .field { margin-bottom: 16px; }
.demo-root .field label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; }
.demo-root .field input {
  width: 100%; box-sizing: border-box;
  padding: 10px 12px; font-size: 14px;
  border: 2px solid #cfc7ba; border-radius: {radius};
  background: #ffffff; color: #221a13;
}
.demo-root .field input.ok { border-color: {ok}; }
.demo-root .field input.bad {
  border-color: {err};
  background: color-mix(in srgb, {err} 6%, #ffffff);
}
.demo-root .msg { margin: 6px 0 0; font-size: 12px; line-height: 1.4; }
.demo-root .msg.bad { color: {err}; }
.demo-root .msg.ok { color: {ok}; }`,
    demoHtml: `<div class="field">
  <label for="fv-email">Email</label>
  <input id="fv-email" class="ok" value="ada@example.com" />
  <p class="msg ok">Looks good - we can reach you here.</p>
</div>
<div class="field">
  <label for="fv-pass">Password</label>
  <input id="fv-pass" class="bad" value="123" />
  <p class="msg bad">Too short. Use at least 8 characters.</p>
</div>`,
    codeSnippets: {
      "Native HTML": `<input type="email" name="email" required
       pattern="[^@]+@[^@]+\\.[a-z]"
       title="An email like name@site.com" />
<!-- the browser validates on submit for free - no JavaScript -->`,
      "Vanilla JS": `function check(input) {
  const value = input.value.trim();
  const ok = input.type === "email"
    ? /.+@.+\\..+/.test(value)
    : value.length >= 8;
  input.classList.toggle("bad", !ok && value.length > 0);
  input.classList.toggle("ok", ok);
  return ok;
}
// check on blur, re-check on input once a field has errored`,
    },
    prompts: {
      cursor: `Add inline validation to the forms in this repo. Rules: validate a field on blur (leaving it), then re-validate on every keystroke only after its first error. Each error message sits under its field, names the field, and states the fix ('Use at least 8 characters', never 'Invalid input'). Keep the native required and type attributes so the browser helps. Error colour #c0392b, success #2e7d32, field border-radius 8px. Do not add a validation library - ask me first if you think one is unavoidable.`,
      claude: `Act as a pragmatic front-end developer. Design validation for a signup form (email, password, display name) without any libraries. Cover: which native HTML constraints to use, when to run JS checks (blur, then input after first error), where messages render, and how errors are announced to screen readers (aria-describedby). Warn about the traps: validating on every keystroke before the first error, disabling submit until the form is perfect, and colour-only error states.`,
      chatgpt: `Explain form validation for a beginner. I have a signup form with email and password. What can plain HTML attributes do with no JavaScript, when should JavaScript check a field (while typing? after leaving it?), and how do I write an error message that tells people how to fix the problem instead of just saying invalid?`,
      lovable: `A signup form with inline validation: fields for email and password, native required and type attributes, an error line under a field that shows after it loses focus (password needs at least 8 characters, message in red #c0392b), a subtle green border when a field passes. No validation libraries.`,
      generic: `Build form validation for an email + password signup: native HTML constraints first, JS checks on blur then on input after the first error, specific fix-it messages under each field (#c0392b for errors, #2e7d32 for success), and aria-describedby so screen readers hear the error. No libraries.`,
    },
    mistakes: [
      "Dropping every error in a red box at the top of the page - people re-read the form hunting for the cause",
      "Validating while typing before the first real error: flagging 'a@' as invalid mid-word feels like being shouted at",
      "Colour-only feedback: red borders with no text exclude colour-blind users and screen readers",
      "A phone-number regex that rejects valid numbers - if in doubt, only check that something was typed",
    ],
    tips: [
      "The message is a remedy, not a verdict: 'Use at least 8 characters' beats 'Invalid password'",
      "Start with the browser's Constraint Validation API - required, type, pattern, min - before installing anything",
      "Re-validate on typing only after a field has failed once; before that, stay quiet",
      "Client-side validation is courtesy, server-side validation is security. Ship both.",
    ],
    related: ["accessible-labels", "controlled-vs-uncontrolled", "form-submit-states"],
    learnMore: [
      { label: "MDN: Client-side form validation", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation" },
      { label: "MDN: Constraint Validation API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation" },
    ],
  },
  {
    id: "controlled-vs-uncontrolled",
    name: "Controlled vs Uncontrolled Inputs",
    category: "frontend",
    subcategory: "forms",
    aliases: ["react state forms", "refs vs state", "formdata", "two ways to read an input"],
    summary: "Two ways to read a form in React: keep every keystroke in state, or ask the DOM when you need it.",
    description:
      "A controlled input keeps its value in React state and re-renders on every keystroke - full power over the value (live validation, formatting, dependent fields). An uncontrolled input lives in the DOM; you read it once with a ref or a FormData object when the form is submitted - far less rendering. Neither is 'correct': use controlled when the value drives other screen updates, uncontrolled when you just need the answer at the end.",
    whenToUse: [
      "Controlled: live validation, character counters, cascading fields, masked input",
      "Uncontrolled: long forms you read once on submit, search boxes, login pages",
      "Uncontrolled with FormData is the shortest path when you POST to a server action",
    ],
    whenNotToUse: [
      "Controlled for every field everywhere - a 40-input settings page re-rendering per keystroke",
      "Either pattern outside React's form world: vanilla JS always reads the DOM directly",
      "Uncontrolled when you must show the value elsewhere on screen - you will end up fighting the DOM",
    ],
    difficulty: "intermediate",
    tags: ["react", "forms", "state", "refs"],
    controls: [],
    prompts: {
      cursor: `Review every form in this repo and convert the ones that do not need live state to uncontrolled inputs: read values on submit with a FormData object (or a single ref) instead of one useState per field. Leave fields controlled only when their value drives another part of the screen (live validation, counters, dependent dropdowns) and add a one-line comment saying why. No new dependencies.`,
      claude: `Act as a React performance-minded reviewer. For a 20-field settings form currently written fully controlled (a useState per field), explain what re-renders on each keystroke and when that cost is justified. Then rewrite it uncontrolled using FormData on submit, and list the three cases where a field must stay controlled: live validation, value shown elsewhere, input formatting. Short and decisive.`,
      chatgpt: `I keep seeing two React form styles: one with a useState and onChange for every input, another that just reads the form when you hit submit. What are they called (controlled vs uncontrolled), which is faster, and how do I decide for a signup form versus a 20-field admin page? Show both with minimal code.`,
      lovable: `Rewrite the demo form as an uncontrolled form: native input elements, no per-field state, onSubmit builds values with new FormData(form) and logs an object. Keep one controlled field only where live validation needs the value mid-typing, and comment why it is controlled.`,
      generic: `Explain controlled vs uncontrolled inputs. Give a controlled example (live password-strength meter) and an uncontrolled example (FormData on submit), the render cost of each, and the decision rule: a field is controlled only when its value changes something else on screen during typing.`,
    },
    mistakes: [
      "Forty useState hooks for a form read once at submit - every keystroke re-renders the whole page",
      "Going uncontrolled then needing the value elsewhere, and poking at the DOM with querySelector to patch it",
      "Mixing the two on one field: value from state but only reading refs on submit - they drift apart",
      "Forgetting that uncontrolled fields keep their value after a failed submit (good) unless you reset the form (also fine) - know which you want",
    ],
    tips: [
      "FormData(form) + Object.fromEntries(formData) is two lines to a clean values object",
      "React 19's useActionState and form action props push most login pages toward uncontrolled",
      "Rule of thumb: if typing in field A changes anything outside field A, A is controlled",
      "defaultValue (not value) is the uncontrolled initial value in React",
    ],
    related: ["form-validation", "server-actions-forms", "component-composition"],
    learnMore: [
      { label: "React docs: Controlled components", url: "https://react.dev/reference/react/components#uncontrolled-components" },
      { label: "MDN: Using FormData", url: "https://developer.mozilla.org/en-US/docs/Web/API/FormData" },
    ],
  },
  {
    id: "accessible-labels",
    name: "Accessible Labels",
    category: "frontend",
    subcategory: "forms",
    aliases: ["label for input", "aria-label", "placeholder is not a label", "form labels"],
    summary: "Every input needs a name a screen reader can say out loud - and placeholder is not it.",
    description:
      "A real label element wired to its input with for and id names the field for screen readers, and clicking the label focuses the input (a bigger hit target for free). A placeholder is not a label: it disappears on typing, often fails contrast checks, and many screen readers skip it. Icon-only buttons need the same treatment via aria-label, because a magnifier glyph says 'search' to your eyes and nothing to a reader.",
    whenToUse: [
      "Every single input, select and textarea - no exceptions",
      "Icon-only buttons: aria-label='Search' (and empty alt on the inner SVG)",
      "Checkbox and radio groups: a fieldset and legend name the whole group",
    ],
    whenNotToUse: [
      "Do not add aria-label on top of a visible label that already works - the visible words should win",
      "A visually hidden label you can never see is legal but suspicious: usually you just wanted a real label",
      "Not a substitute for error messages - a named field still needs its problem explained (aria-describedby)",
    ],
    difficulty: "beginner",
    tags: ["accessibility", "forms", "labels", "a11y"],
    controls: [],
    prompts: {
      cursor: `Audit this repo's forms for naming: every input needs a real label element connected by for and id, or an aria-label when a visible label genuinely breaks the layout. Replace any placeholder being used as the only label. Give icon-only buttons aria-labels. Wire error text with aria-describedby. Do not restructure the layout - keep the visible design identical.`,
      claude: `Act as an accessibility reviewer. Explain why placeholder-as-label fails (vanishes on typing, low contrast, inconsistent reader support), then give the four correct patterns: label/for-id, visually-hidden label, aria-label for icon-only controls, and fieldset/legend for radio and checkbox groups. Include the aria-describedby pattern that links an error message to its field. Minimal, copy-pasteable markup for each.`,
      chatgpt: `My login form only uses placeholders like 'Email' inside the inputs, and my search button is just a magnifying-glass icon. Is that accessible? Explain what a screen reader hears, what happens to the placeholder once I start typing, and fix both with the least markup possible.`,
      lovable: `Generate the same form design but accessible: visible labels above each input wired with for and id, placeholders as optional examples only, the icon search button given aria-label='Search', and radio answers wrapped in a fieldset with a legend.`,
      generic: `Give every input a real label (for/id), use placeholder only as an example not a name, aria-label icon-only buttons, wrap groups in fieldset and legend, and link errors via aria-describedby. Keep the visible design unchanged.`,
    },
    mistakes: [
      "Placeholder used as the only label: the field is nameless once text is typed",
      "aria-label overriding a visible label - if the words differ, screen reader users hear a different field than sighted users point at",
      "Checkbox groups with no legend: a reader says 'checked' forty times and never says which question",
      "Labelling by visual position alone ('everyone knows the first box is email')",
    ],
    tips: [
      "Test: tab through the page with your eyes closed - every stop must announce itself",
      "Clicking a label focuses its input - long labels become comfortable hit targets",
      "The sr-only / visually-hidden class pattern gives you a real label that is invisible by design",
      "aria-labelledby can name a field with a whole heading already on screen",
    ],
    related: ["form-validation", "alt-text-and-labels", "aria-when-needed"],
    learnMore: [
      { label: "MDN: Accessible forms", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Accessible_forms" },
      { label: "W3C WAI: Labels and tooltips", url: "https://www.w3.org/WAI/tutorials/forms/labels/" },
    ],
  },
  {
    id: "form-submit-states",
    name: "Form Submit States",
    category: "frontend",
    subcategory: "forms",
    aliases: ["loading button", "pending submit", "double submit", "button spinner"],
    summary: "A submit button that shows waiting, done, or failed - so nobody pays twice.",
    description:
      "Between the click and the answer there is dead air, and dead air makes people click again. A submit button should walk through the states it actually has: idle, then processing (spinner plus disabled so a second click cannot fire), then a clear success or a retryable failure that puts the button back. The demo shows all four states side by side; your job is to make one button pass through them in order.",
    whenToUse: [
      "Anything with real consequences behind the button: payments, sign-ups, deletes",
      "Slow endpoints you cannot cache away (>300ms feels dead)",
      "Multi-step forms where each step's button owes the same state promise",
    ],
    whenNotToUse: [
      "Instant local actions (open a modal, toggle a row) - there is no wait to represent",
      "Search-as-you-type inputs: debounce and skip the button theatre",
      "Disabled-looking-but-enabled buttons: if you fake the state without the behaviour, it is a lie",
    ],
    difficulty: "beginner",
    tags: ["forms", "ux", "loading", "buttons"],
    controls: [
      { id: "accent", label: "Button colour", type: "color", def: "#b4602c" },
      { id: "done", label: "Success colour", type: "color", def: "#2e7d32" },
      { id: "radius", label: "Button radius", type: "slider", def: 10, min: 0, max: 20, step: 2, unit: "px" },
      { id: "bg", label: "Card background", type: "color", def: "#fbf7f1" },
    ],
    cssTemplate: `.demo-root { background: {bg}; padding: 22px; border-radius: 14px; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }

.demo-root .sb-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; font-size: 14px; font-weight: 700;
  border: none; border-radius: {radius};
  background: {accent}; color: #fff;
}
.demo-root .sb-btn.busy { opacity: .65; }
.demo-root .sb-btn.done { background: {done}; }
.demo-root .sb-btn.ghost { background: #d8d0c4; color: #6b6157; }

.demo-root .spinner {
  width: 14px; height: 14px; border-radius: 999px;
  border: 2px solid rgba(255,255,255,.45); border-top-color: #fff;
  animation: sb-spin .8s linear infinite;
}
@keyframes sb-spin { to { transform: rotate(360deg); } }

.demo-root .tick { font-size: 14px; line-height: 1; }

@media (prefers-reduced-motion: reduce) {
  .demo-root .spinner { animation-duration: 1.6s; }
}`,
    demoHtml: `<button class="sb-btn" type="button">Pay $12</button>
<button class="sb-btn busy" type="button"><span class="spinner"></span>Paying…</button>
<button class="sb-btn done" type="button"><span class="tick">✓</span>Paid</button>
<button class="sb-btn ghost" type="button">Try again</button>`,
    codeSnippets: {
      React: `const [status, setStatus] = useState("idle"); // idle | pending | done | error
async function submit(e) {
  e.preventDefault();
  setStatus("pending");
  try { await pay(); setStatus("done"); }
  catch { setStatus("error"); }
}
<button disabled={status === "pending"}>
  {status === "pending" ? "Paying…" : status === "done" ? "Paid ✓"
   : status === "error" ? "Try again" : "Pay $12"}
</button>`,
      "CSS only": `.btn[disabled] { opacity: .65; cursor: progress; }
.btn[disabled]::after {
  content: ""; width: 14px; height: 14px; margin-left: 8px;
  border-radius: 999px; border: 2px solid rgba(255,255,255,.45);
  border-top-color: #fff; animation: spin .8s linear infinite;
}`,
    },
    prompts: {
      cursor: `Give every submit button in this repo the four-state treatment: idle, pending (disabled plus a spinner and changed label), success (a clear done label, then reset or navigate), error (restore the button with a retry label and keep the form's typed values). Derive the states from one status variable - no separate isLoading and isDone booleans that can contradict each other. Keep the design tokens already in the project; do not add dependencies.`,
      claude: `Act as a careful UX engineer. Specify the lifecycle of a payment submit button: click, pending, success, failure, retry. Cover the disabled-during-pending rule that stops double charges, why the label should change while the spinner runs, keeping focus on the button through transitions, and the prefers-reduced-motion alternative to a spinning ring. Give React code with a single status union type instead of three booleans.`,
      chatgpt: `After I click Subscribe my button does nothing for two seconds, so people click it again and sometimes get charged twice. What states should a submit button visibly have, and how do I disable it while waiting without making the page feel frozen? Give beginner-friendly HTML, CSS and JavaScript.`,
      lovable: `A subscribe button with real submit states: normal brown button, while pending it is disabled with a small spinner and says 'Subscribing…', on success it turns green and says 'Subscribed ✓', on error it returns with 'Try again' and an error line under the form that preserves the typed values.`,
      generic: `Implement a four-state submit button (idle, pending, success, error) driven by one status value: pending disables and shows a spinner, success changes the label, error restores with retry and keeps form values. Respect reduced motion. No libraries.`,
    },
    mistakes: [
      "Re-enabling the button before the server confirms: the second click is a second charge",
      "isLoading + isDone + isError booleans drifting into the impossible state where two are true",
      "A spinner that finishes and navigates so fast the user never learns what happened - show done for a beat",
      "Disabling on click but leaving the old label: users assume the button is broken, not busy",
    ],
    tips: [
      "Disable with the attribute, not just pointer-events - the button must leave the tab order too",
      "Change the text while waiting ('Subscribing…'): a spinning icon alone reads as decoration",
      "On error, restore focus to the button and keep every typed value - losing the form loses the user",
      "One status string (idle, pending, done, error) makes impossible states unrepresentable",
    ],
    related: ["toast-notification", "skeleton-loading", "form-validation"],
    learnMore: [
      { label: "MDN: The button element (disabled)", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" },
      { label: "WAI-ARIA: aria-busy", url: "https://www.w3.org/TR/wai-aria-1.2/#aria-busy" },
    ],
  },
  {
    id: "server-actions-forms",
    name: "Server Actions & Form Actions",
    category: "frontend",
    subcategory: "forms",
    aliases: ["next server actions", "form without an api", "post without fetch", "actions in react"],
    summary: "Point a form at a function instead of an API: the POST, validation and re-render come free.",
    description:
      "A server action is a function that only runs on the server, wired straight into a form's action prop - no endpoint, no fetch wrapper, no client bundle for the logic. The native form POST keeps working with JavaScript disabled, pending and error state arrive through useActionState, and after success you call revalidate to refresh the data the page already fetched. It collapses the old three-file loop (endpoint, fetcher, form) into one honest function.",
    whenToUse: [
      "Next.js App Router apps where forms mutate your own data: sign-ups, settings, purchases",
      "When you want progressive enhancement (the form works before hydration) without writing two paths",
      "Small teams that do not want to maintain a parallel internal REST API",
    ],
    whenNotToUse: [
      "The endpoint must serve mobile apps or third parties - REST/GraphQL is the contract they need",
      "Non-Next React or Vite SPAs: actions are framework plumbing, not a standard",
      "Realtime or streaming responses - actions answer once, with a redirect or re-render",
    ],
    difficulty: "advanced",
    tags: ["next.js", "forms", "server", "api"],
    controls: [],
    prompts: {
      cursor: `Convert the repo's fetch-to-endpoint form handlers to Next.js server actions where the app already uses the App Router: a 'use server' action function that validates input on the server (never trust the form), returns a typed result with field errors, and calls revalidatePath on success. Wire the form with useActionState for pending and error UI. Leave any endpoint that other clients consume as a route handler. No new dependencies.`,
      claude: `Act as a Next.js architect. Compare a classic form (form posts, client fetch to an API route, manual re-fetch) against a server action wired to the form action prop with useActionState. Cover what each step becomes, why server-side validation is still mandatory, progressive enhancement when JS is off, and when a route handler is still the right answer (mobile clients, webhooks, public APIs). Under 20 lines.`,
      chatgpt: `I use Next.js App Router and every form in my app has a matching API route just to insert a row. People say server actions replace that. Explain in plain terms what a server action is, how a form calls one, how I show loading and errors, and whether I still need database checks inside it.`,
      lovable: `Build the newsletter signup as a Next.js server action: one 'use server' function validating the email and storing it, the form wired with action plus useActionState for 'Subscribing…' and error states, and revalidatePath so the subscriber count on the page updates without a manual fetch. No separate API route.`,
      generic: `Explain server actions for form handling in the Next.js App Router: the action attribute wiring, validation inside the action (server-side, always), useActionState for pending and error UI, revalidate after success, and the cases where a plain route handler or REST API is still correct for external clients.`,
    },
    mistakes: [
      "Trusting the form because 'the client already validated it' - the server action must re-check every field",
      "Reading secrets in a file that lacks 'use server' and shipping the query into the browser bundle",
      "Throwing away typed values on error: return field errors and repopulate instead of an empty form",
      "Deleting a route handler other integrations (mobile, webhooks) still call because 'actions replaced APIs'",
    ],
    tips: [
      "One action = validate, mutate, revalidate - the three files you used to write are now three lines",
      "useActionState gives you isPending without a second loading hook",
      "Redirects from actions are how you signal success idiomatically (then show state on the target page)",
      "Progressive enhancement comes free only if you pass the function to a real form element, not an onClick",
    ],
    related: ["nextjs-app-router", "rest-api-basics", "controlled-vs-uncontrolled"],
    learnMore: [
      { label: "Next.js docs: Server Actions and Mutations", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations" },
      { label: "React docs: useActionState", url: "https://react.dev/reference/react/useActionState" },
    ],
  },

  /* ── performance ════════════════════════════════════════════════ */
  {
    id: "image-optimization",
    name: "Image Optimization",
    category: "frontend",
    subcategory: "performance",
    aliases: ["webp", "lazy loading", "image sizes", "next/image", "responsive images"],
    summary: "Images are usually the heaviest thing you ship - and almost always over-sized.",
    description:
      "A 4000-pixel photo in a 400-pixel slot costs the same bytes whether or not anyone can see the extra detail. Optimization is four habits: serve the format the browser is good at (AVIF or WebP), size it to the display box, set width and height so nothing jumps when it lands, and load below-the-fold images only when scrolling near them (loading=lazy). A framework's Image component automates most of this - but the four ideas are the real skill.",
    whenToUse: [
      "Any page where photos carry the design: hero images, galleries, e-commerce grids",
      "User uploads - never trust that a phone camera produces a 200 KB file",
      "Every marketing page that Google's page-speed report complains about",
    ],
    whenNotToUse: [
      "Tiny decorative icons: inline SVG weighs nothing and never needs lazy loading",
      "The one above-the-fold hero image - lazy loading it makes the biggest paint slower, not faster",
      "Images used as CSS backgrounds - native loading attributes do not apply there",
    ],
    difficulty: "beginner",
    tags: ["performance", "images", "webp", "lazy"],
    controls: [],
    prompts: {
      cursor: `Audit the images in this repo's pages: add explicit width and height attributes or CSS aspect-ratio boxes to every image (no layout shift), set loading='lazy' and decoding='async' on anything below the fold, keep the hero image eager, and convert large PNGs used for photographs to AVIF with a WebP or JPEG fallback. If the project already uses Next.js Image, check its sizes and priority props instead of adding attributes by hand. Do not add dependencies.`,
      claude: `Act as a web performance engineer. Rank the wins for an image-heavy landing page: correct format (AVIF, WebP fallback), correct pixel size for the slot, width and height set to kill layout shift, loading=lazy below the fold but never for the LCP hero, and fetchpriority=high on the hero. For each, say what it fixes and its approximate byte or millisecond impact. Under 20 lines, no tool evangelism.`,
      chatgpt: `My website takes ages to load and PageSpeed blames images. I have photos from my phone that are about 5 MB each shown inside small boxes. Explain in beginner terms: what format should I use (webp or avif?), what do the width and height attributes fix, and when does lazy loading help versus hurt?`,
      lovable: `Rebuild the gallery grid with optimized images: AVIF with WebP or JPEG fallback via picture sources, each slot holding an aspect-ratio box so nothing shifts while loading, everything below the first row lazy, and the hero image eager with fetchpriority high. No layout jitter, no giant files.`,
      generic: `Optimize page images: serve AVIF or WebP sized to the display box, give every image width and height or an aspect-ratio container, lazy-load below the fold, keep the hero eager and fetchpriority=high, and explain which step cuts the most bytes.`,
    },
    mistakes: [
      "A 5 MB phone photo shrunk with CSS - the browser still downloads all 5 MB to draw it at 300 px",
      "Lazy loading the hero image: the biggest paint on the page now waits for JavaScript to care",
      "No width and height: every late image shoves the text below it down the screen (a CLS score killer)",
      "Converting flat logos and icons to AVIF - they were SVG and you made them heavier",
    ],
    tips: [
      "AVIF for photos where you control encoding; WebP for broad safety; JPEG stays fine for many cases",
      "The srcset and sizes attributes let the browser pick the right file per screen - the framework's Image does this for you",
      "Aspect-ratio boxes cost one CSS line and remove layout shift for the whole grid",
      "If users upload images, re-encode server-side on receipt; do it once and store small forever",
    ],
    related: ["core-web-vitals", "code-splitting-lazy", "spa-hosting-static"],
    learnMore: [
      { label: "web.dev: Eager-load LCP images", url: "https://web.dev/articles/lcp" },
      { label: "MDN: Lazy loading", url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading" },
    ],
  },
  {
    id: "code-splitting-lazy",
    name: "Code Splitting & Lazy Loading",
    category: "frontend",
    subcategory: "performance",
    aliases: ["dynamic import", "lazy routes", "splitting the bundle", "load only what you need"],
    summary: "Ship the page the user opened, not the whole app they might never visit.",
    description:
      "Bundlers can chop your JavaScript into pieces: one chunk for the route you land on, more for screens behind clicks. The two everyday levers are route-level splitting (each page loads its own code) and React.lazy plus Suspense for heavyweight components (the chart on the settings page, the modal nobody opened yet). You pay for this with a little bookkeeping - every lazy thing needs a fallback to look at while it arrives - but you never pay for downloading features that stay closed.",
    whenToUse: [
      "Multi-route apps where the second screen is big: dashboards, editors, analytics pages",
      "Heavy, rarely-opened widgets: chart libraries, rich text editors, map tiles, the admin panel",
      "When your bundle analyzer shows 300 KB of JavaScript the landing page never touches",
    ],
    whenNotToUse: [
      "Tiny apps: one route, 50 KB total - splitting just adds requests and a spinner",
      "Lazy loading the code needed for first paint (the hero, the nav) - you made yourself wait",
      "Before measuring: splitting without a bundle report is rearranging deck chairs",
    ],
    difficulty: "intermediate",
    tags: ["performance", "bundles", "react", "loading"],
    controls: [],
    prompts: {
      cursor: `Trim this app's initial JavaScript: keep route-level code splitting as configured by the framework, then wrap only the heavyweight, rarely-opened components (pick them from the bundle analysis if one exists) in React.lazy with a Suspense fallback that matches the layout so nothing jumps. Do not lazy-load anything on the landing route's first paint, and do not add dependencies. List which chunks moved out of the initial load.`,
      claude: `Act as a bundle-diet surgeon. Given a landing page that loads 280 KB of JavaScript of which only 60 KB renders above the fold, prescribe the split: route-level chunks, React.lazy plus Suspense for the settings chart and admin area, dynamic import on click for the coupon-code modal. Explain why lazy-loading header and hero components would backfire, and what each fallback should look like to avoid layout shift. No hype, just the moves.`,
      chatgpt: `My single-page app downloads one huge JavaScript file before anything appears, even though a user mostly visits the home page. What is code splitting, what do dynamic import and React.lazy actually do, and which parts of an app are usually worth splitting out first? Give an everyday analogy and then simple code.`,
      lovable: `Split the app's JavaScript by route, and make the analytics chart on the settings page load lazily with React.lazy and a skeleton that matches its final height, so the initial load of the home page stays small. Keep the header and hero eagerly loaded.`,
      generic: `Explain code splitting for a growing app: route-level chunks, React.lazy with Suspense for heavy rarely-used components, dynamic import on interaction, why first-paint code must stay eager, and how skeletons prevent layout shift while chunks load.`,
    },
    mistakes: [
      "Lazy-loading the components needed for first paint: the spinner now IS the landing experience",
      "No fallback (or a zero-height one): content arrives by shoving everything below it down the page",
      "Splitting into fifty 4 KB chunks - request overhead eats the win before users feel it",
      "Adding dynamic import to chase a bundle warning you never actually measured",
    ],
    tips: [
      "Measure first: a bundle analyzer (rollup-plugin-visualizer or source-map-explorer) shows who ate the bundle",
      "The best chunks follow user journeys - settings, checkout, admin - not code folders",
      "Import on interaction: fire the dynamic import on hover or focus so the chunk lands before the click",
      "Framework routing usually already splits per page; your manual work is components, not routes",
    ],
    related: ["bundle-diet", "nextjs-app-router", "core-web-vitals"],
    learnMore: [
      { label: "React docs: lazy and Suspense", url: "https://react.dev/reference/react/lazy" },
      { label: "web.dev: Reduce unused JavaScript", url: "https://web.dev/articles/unused-javascript" },
    ],
  },
  {
    id: "bundle-diet",
    name: "Bundle Diet",
    category: "frontend",
    subcategory: "performance",
    aliases: ["dependency size", "tree shaking", "too many packages", "node_modules obesity"],
    summary: "Every npm install is a download you owe your users - check the price first.",
    description:
      "Library authors optimize for their API, not your bundle. The date utility you added for one format string can cost more than your entire app; the icon set you browsed ships 200 KB whether or not you use 3 icons - unless the import style lets tree shaking chop it down. Bundle diet is a habit, not a cleanup: check the size before installing, import leaves instead of whole trees, and keep a bundle report honest by glancing at it whenever dependencies change.",
    whenToUse: [
      "Before every new dependency - there is always a smaller answer or a native one",
      "Libraries with many entry points (icons, date, lodash-style toolkits): deep imports only",
      "When a bundle report shows a package doing 1% of the work with 40% of the bytes",
    ],
    whenNotToUse: [
      "Server-only code: bundle weight is a browser tax, dev tools and CLI deps are free",
      "Rewriting a needed 15 KB library out of purity - a lean dependency beats your regex bug farm",
      "Micro-optimizing before the app ships something users want",
    ],
    difficulty: "intermediate",
    tags: ["performance", "dependencies", "bundles", "tree-shaking"],
    controls: [],
    prompts: {
      cursor: `Run the project's bundle analyzer (or add a build-time size report if none exists) and list the top ten dependencies in the client bundle with their parsed sizes. For each of the three heaviest: check whether a native API or a one-line function replaces it, or whether a deep, tree-shakable import shrinks it. Propose the changes as a diff list and wait for my approval before removing any dependency. Do not add new packages.`,
      claude: `Act as a bundle auditor. A landing page ships 260 KB of third-party JavaScript to render a hero, a pricing table and a contact form. Rank the usual suspects (a date library, an icon set imported wholesale, lodash, moment-sized habits, an analytics SDK loaded at boot), give the native or lighter alternative for each, and explain tree shaking: what import style lets the bundler chop unused code, and what breaks it. Under 20 lines.`,
      chatgpt: `My React app's bundle is huge but I only installed five small packages. Why do npm packages make builds so big, what is tree shaking and why does it matter whether I import the whole library or one function from it, and what tools can I use to see which package is responsible?`,
      lovable: `Audit this app's client bundle: replace any wholesale icon or utility imports with per-item imports so tree shaking works, drop dependencies that exist for one function call in favor of a local helper, and keep the same visible behaviour. Show what was removed and the byte savings per change.`,
      generic: `Explain bundle diet for front-end apps: check size before installing, deep imports for tree shaking, native replacements for single-purpose libraries, and a recurring bundle report so regressions get caught - with the caveat that server-only dependencies cost users nothing.`,
    },
    mistakes: [
      "Importing the whole icon set for one arrow: import that icon, not the museum",
      "A moment-sized date library for 'Jan 5' - Intl.DateTimeFormat has been native for a decade",
      "Assuming bundlers tree-shake everything: CommonJS internals and side-effect flags can block it silently",
      "Deleting a dependency because it looks heavy while it powers the one feature users came for",
    ],
    tips: [
      "A bundle analyzer turns 'feels heavy' into 'this package, these kilobytes'",
      "Named per-function imports (import debounce from a toolkit's es module entry) are the tree-shakable style",
      "Write the 20-line helper first; install only when edge cases genuinely pile up",
      "Add the size report to CI so a sneaky transitive dependency cannot bloat main unnoticed",
    ],
    related: ["code-splitting-lazy", "do-you-need-a-framework", "core-web-vitals"],
    learnMore: [
      { label: "MDN: Tree shaking concept", url: "https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking" },
      { label: "web.dev: Reduce unused JavaScript", url: "https://web.dev/articles/unused-javascript" },
    ],
  },
  {
    id: "core-web-vitals",
    name: "Core Web Vitals",
    category: "frontend",
    subcategory: "performance",
    aliases: ["lcp", "inp", "cls", "pagespeed score", "google page experience"],
    summary: "Three numbers Google uses to describe how your page feels: slow to show, slow to answer, or jumpy.",
    description:
      "LCP measures when the main content actually appears (target under 2.5 seconds), INP measures how quickly the page reacts to a tap or key (under 200 ms), and CLS measures how much layout jumps around while loading (under 0.1). They are real-user measurements, not lab scores, so a page can be 'green' in a test tool and red in the field. The fixes map cleanly: images and servers for LCP, JavaScript for INP, width and height attributes for CLS.",
    whenToUse: [
      "Any public page where search ranking or conversion is money: marketing, shop, docs",
      "Right after launch, when field data exists and lab tests stop being the whole truth",
      "As the shared language when a report says 'the page feels janky' - translate it to a metric",
    ],
    whenNotToUse: [
      "Internal tools behind a login: nobody ranks them, so chase real complaints first",
      "As a religion - a 96 vs 92 score that users do not feel is busywork",
      "Before the page has real traffic: lab numbers without field numbers mislead in both directions",
    ],
    difficulty: "intermediate",
    tags: ["performance", "seo", "metrics", "ux"],
    controls: [],
    prompts: {
      cursor: `Profile this site's slowest user journey and map each finding to a Core Web Vital: LCP (identify the hero image or server time, fix with optimized eager-loaded images, preload or caching), INP (find long tasks on interaction, defer non-critical scripts, split heavy handlers), CLS (add width, height or aspect-ratio to every image, embed, and late-loading slot). Report which metric each change targets. Do not chase score for its own sake - only changes a user would feel.`,
      claude: `Act as a performance consultant. A store's product page has LCP 4.1 s (giant unoptimized hero), INP 340 ms (analytics SDK running during interactions), CLS 0.27 (banner injected after load). Give the diagnosis and fix for each in priority order by user-perceived difference, note which are field-vs-lab traps, and what to re-measure after. No generic checklists - commit to the three causes I gave you.`,
      chatgpt: `Explain Core Web Vitals to a developer who has never heard the terms. What exactly do LCP, INP and CLS measure, what are the passing thresholds, how is field data different from running PageSpeed once, and give one concrete fix for each metric that does not require rebuilding the site.`,
      lovable: `Improve this page's Core Web Vitals without changing the design: eager-load and size the hero image with fetchpriority high for LCP, defer the analytics script and move heavy handlers off the interaction path for INP, and give every image and embed an aspect-ratio box so nothing jumps for CLS.`,
      generic: `Diagnose a slow page by Core Web Vitals: LCP under 2.5 s (images, server, render-blocking), INP under 200 ms (long tasks, third-party scripts), CLS under 0.1 (reserved dimensions). Explain the field-vs-lab difference and give one fix per metric ranked by felt impact.`,
    },
    mistakes: [
      "Chasing the lab score while ignoring field data: the test ran on a fast machine you do not have",
      "Fixing CLS by hiding late content until 'everything is ready' - you traded a jump for a blank page",
      "Blaming only images for LCP when the server itself took 1.8 s to answer (check time-to-first-byte first)",
      "Cutting the one third-party script users came for because it dinged the number by eight points",
    ],
    tips: [
      "Order the fixes by cause: server time first, then the image, then JavaScript - LCP is a chain",
      "INP replaced FID in 2024: it measures the slowest interaction, not the first one",
      "Chrome DevTools' Performance panel plus the web-vitals library on your own page beats any one-off scan",
      "Defer and async are different tools: async loads whenever, defer loads in order before the page is ready",
    ],
    related: ["image-optimization", "bundle-diet", "spa-hosting-static"],
    learnMore: [
      { label: "web.dev: Core Web Vitals", url: "https://web.dev/articles/vitals" },
      { label: "Search Console: Core Web Vitals report", url: "https://search.google.com/u/1/search-console/core-web-vitals" },
    ],
  },
  {
    id: "spa-hosting-static",
    name: "Hosting a Single-Page App",
    category: "frontend",
    subcategory: "performance",
    aliases: ["refresh gives 404", "react router on netlify", "static host for a spa", "index.html rewrite"],
    summary: "One HTML file plus JavaScript - which means the server must learn to lie politely.",
    description:
      "A single-page app has only one real page: /index.html. Routes like /settings exist purely inside the browser, so when someone refreshes there, the host goes looking for a file called settings and finds nothing - the infamous 404 on refresh. The fix is a rewrite rule: serve index.html for any path the app owns, and let client-side routing take it from there. Static hosting (Netlify, GitHub Pages, buckets) also means no server code: every API call leaves for somewhere else.",
    whenToUse: [
      "Deploying a Vite or Create React App build to any static host: add the SPA rewrite on day one",
      "Client-side route refreshing 404s - the classic symptom, fixed by one rewrite",
      "Preview-and-share workflows: static hosting is free, fast and global for pure front ends",
    ],
    whenNotToUse: [
      "You need SEO for deep routes: a bucket of index.html is invisible to crawlers that do not run JavaScript - render server-side instead",
      "Server code is required anyway (auth callbacks, secrets, uploads) - a full-stack host does both",
      "Next or Remix apps: they emit their own server or static output; the framework handles this",
    ],
    difficulty: "beginner",
    tags: ["deployment", "spa", "hosting", "routing"],
    controls: [],
    prompts: {
      cursor: `Configure this static SPA deploy so deep links survive refresh: add the host's SPA rewrite so all unmatched routes serve index.html (Netlify _redirects with a 200 rewrite, Vercel rewrites, or the equivalent for the platform in use - check which one this repo deploys to before writing anything). Keep /api paths excluded. Add cache headers: hashed assets immutable, index.html must-revalidate. No new dependencies.`,
      claude: `Act as a deployment engineer. Explain, for a Vite-built SPA on a static host: why /pricing refreshes to 404, the catch-all rewrite to index.html and its exact syntax for Netlify and Vercel, why static assets should be cached forever while index.html must never be, and the honest SEO limitation of client-only rendering versus a server-rendered framework. Under 20 lines.`,
      chatgpt: `I built a React app with Vite and put it on a free static host. The home page works but refreshing the dashboard page says 404, and Google finds nothing except the home page. What is happening inside the server, what is a rewrite rule, and when should I stop doing this and use a framework that renders on the server?`,
      lovable: `Deploy config for this Vite SPA: host rewrite so every unknown path serves index.html with a 200 (not a 301 redirect), long-lived caching for the hashed assets folder, no-cache on index.html, and a note in the README on why deep-route SEO needs server rendering.`,
      generic: `Explain SPA hosting on static files: the single index.html architecture, why refreshed routes 404, the catch-all 200 rewrite per major host, caching rules for hashed assets versus index.html, and the point where you outgrow this for SEO and move to server rendering.`,
    },
    mistakes: [
      "A 301 redirect to index.html instead of a 200 rewrite: every deep link now serves the home page's URL",
      "Forgetting the rewrite and shipping the app with a broken refresh - users live on bookmarks and back buttons",
      "Caching index.html forever: after deploy, half the world keeps loading last week's app",
      "Calling the app SEO-safe because 'the test passed' on a crawler that runs JavaScript - some do not",
    ],
    tips: [
      "The test is two clicks: open a deep route, press refresh - if it 404s, add the rewrite",
      "Netlify wants '/* /index.html 200' in _redirects; Vercel wants a catch-all rewrite - one file, not a build plugin",
      "If prerendering matters, a prerender pass (or switching to Next) beats waiting for crawlers to hydrate",
      "The framework's build already preloads the main script in index.html - stop hand-editing the template",
    ],
    related: ["vite-vs-next", "nextjs-app-router", "image-optimization"],
    learnMore: [
      { label: "Vite guide: Deploying a static site", url: "https://vite.dev/guide/static-deploy" },
      { label: "MDN: Single-page application glossary", url: "https://developer.mozilla.org/en-US/docs/Glossary/SPA" },
    ],
  },

  /* ── accessibility ══════════════════════════════════════════════ */
  {
    id: "focus-visible-rings",
    name: "Focus Rings",
    category: "frontend",
    subcategory: "accessibility",
    aliases: ["focus outline", "keyboard focus", "tab ring", "outline none considered harmful"],
    summary: "The ring around a tabbed-to control is a keyboard user's mouse pointer - never remove it without a replacement.",
    description:
      "Every interactive element gets a focus indicator when reached by keyboard, and the lazy CSS reset of outline: none deletes it - the page becomes invisible to anyone using Tab. The modern answer is :focus-visible: browsers show the ring for keyboard arrivals and hide it for mouse clicks, so you get the accessibility without the visual noise. Style it deliberately - 2 px or more, offset so it reads on any background, colour with 3:1 contrast against both surfaces.",
    whenToUse: [
      "Every custom-styled button, link, input, card-with-click and dropdown in the design system",
      "Replacing the default ring with a brand-styled one (it must stay at least as visible)",
      "Any CSS reset that contains an outline: none line you did not write on purpose",
    ],
    whenNotToUse: [
      "As decoration on click focus for mouse users - that is what :focus-visible is for",
      "On non-interactive elements: a ring around a paragraph means nothing and confuses the tab story",
      "Instead of fixing order - a gorgeous ring around the wrong tab sequence is still the wrong sequence",
    ],
    difficulty: "beginner",
    tags: ["accessibility", "css", "keyboard", "focus"],
    controls: [
      { id: "ring", label: "Ring colour", type: "color", def: "#b4602c" },
      { id: "width", label: "Ring width", type: "slider", def: 3, min: 1, max: 6, step: 1, unit: "px" },
      { id: "offset", label: "Ring offset", type: "slider", def: 2, min: 0, max: 6, step: 1, unit: "px" },
      { id: "radius", label: "Corner radius", type: "slider", def: 8, min: 0, max: 20, step: 2, unit: "px" },
      { id: "bg", label: "Background", type: "color", def: "#fbf7f1" },
    ],
    cssTemplate: `.demo-root { background: {bg}; padding: 22px; border-radius: 12px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }

.demo-root .fr-link { color: #2f5d8a; font-size: 14px; }
.demo-root .fr-btn {
  border: none; padding: 9px 16px; font-size: 14px; font-weight: 700;
  background: #221a13; color: #fff;
}
.demo-root .fr-input {
  padding: 9px 12px; font-size: 14px; width: 150px;
  border: 2px solid #cfc7ba; background: #fff; color: #221a13;
}
.demo-root .fr-card {
  padding: 10px 14px; font-size: 13px;
  border: 2px solid #e2dad0; background: #fff; color: #221a13;
}

.demo-root :is(a, button, input, [tabindex]):focus-visible {
  outline: {width} solid {ring};
  outline-offset: {offset}px;
  border-radius: {radius};
}`,
    demoHtml: `<a class="fr-link" href="#fr">Read the docs</a>
<button class="fr-btn" type="button">Save</button>
<input class="fr-input" placeholder="Email" aria-label="Email" />
<div class="fr-card" tabindex="0" role="button">Press me (focusable card)</div>
<p style="flex-basis:100%; margin:6px 0 0; font-size:12px; color:#6b6157">Tab through - every stop should announce itself with the ring.</p>`,
    codeSnippets: {
      Tailwind: `<button class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ...">
  Save
</button>
<!-- global reset guard: kill outlines only via :not(:focus-visible) -->`,
      CSS: `/* keep default rings until you have styled better ones */
:focus:not(:focus-visible) { outline: none; }
:focus-visible {
  outline: 3px solid #b4602c;
  outline-offset: 2px;
}
/* never: * { outline: none } - that is a keyboard blackout */`,
    },
    prompts: {
      cursor: `Fix focus visibility across this repo: remove every blanket outline none from the CSS, then define one design-system focus treatment using :focus-visible - minimum 2px solid ring, 2px offset, colour with at least 3:1 contrast against both the component and the page background, following the component's border-radius. Apply it to links, buttons, inputs, custom role=button cards and dropdown triggers. Verify by tabbing through the page with the mouse untouched. No dependencies.`,
      claude: `Act as an accessibility engineer. Explain :focus versus :focus-visible (why the browser hides rings for mouse clicks), the WCAG 2.4.7 focus-visible and 1.4.11 non-text-contrast requirements (3:1 against adjacent colours), why outline-offset exists, and the safe reset pattern ':focus:not(:focus-visible) { outline: none }'. Give a copy-paste focus token set: colour, width, offset, radius. Under 18 lines.`,
      chatgpt: `Someone told me my site is unusable with a keyboard because 'you can never see where you are'. What is the focus ring, why do designers remove it, what does focus-visible do, and what ring style is both pretty and accessible? Explain as if I have never heard the words.`,
      lovable: `Add a visible keyboard focus style to every interactive element in this design: on keyboard focus (focus-visible), a 3px solid #b4602c outline with 2px offset following each component's corner radius, while mouse clicks keep the design clean. Remove any outline none resets that currently cause a blackout.`,
      generic: `Style accessible focus rings with :focus-visible: at least 2px solid, offset 2px, 3:1 contrast against the page and component, matching corner radius, applied to links, buttons, inputs and custom focusable cards - and the reset pattern that keeps mouse clicks clean without removing keyboard focus.`,
    },
    mistakes: [
      "The outline: none reset from a template: keyboard users now wander blind - this is the single most common a11y bug on the web",
      "A 1px ring in low contrast: technically present, practically invisible, still a WCAG fail",
      "Rings hidden behind overflow clipping - the outline renders, then the card crops it",
      "Styling only :focus so mouse clicks get rings too, then ripping outlines out in frustration instead of using :focus-visible",
    ],
    tips: [
      "The whole audit is one keystroke: put the mouse down and press Tab across the page",
      "outline beats box-shadow for focus: it survives zoom, high-contrast mode and never gets clipped by overflow",
      "Match the ring's radius to the button's - an offset square ring around a pill looks accidental",
      "Test on the darkest and busiest background in the design; the ring must read there too",
    ],
    related: ["keyboard-nav", "semantic-html-first", "aria-when-needed"],
    learnMore: [
      { label: "MDN: :focus-visible", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible" },
      { label: "W3C WAG: Focus Visible (2.4.7)", url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" },
    ],
  },
  {
    id: "semantic-html-first",
    name: "Semantic HTML First",
    category: "frontend",
    subcategory: "accessibility",
    aliases: ["use the right tag", "button vs div", "nav main aside", "html elements meaning"],
    summary: "The right tag brings behaviour, accessibility and structure for free - a div brings nothing.",
    description:
      "HTML elements are not paint boxes, they are contracts: button promises keyboard activation, focusability, a role screen readers announce, and click-on-Space as well as Enter. A div with onClick promises none of that and you will re-implement four of them wrong. The same goes for structure - header, nav, main, article and headings give assistive tech an outline of the page; twelve nested divs give it a shrug. Pick the semantic element first and restyle it; only invent a div pattern when nothing semantic fits.",
    whenToUse: [
      "Every new component: choose the element before choosing the CSS",
      "Auditing click handlers on divs - if it acts like a control, make it a button",
      "Page skeletons: landmarks (header, nav, main, footer) and a real heading order",
    ],
    whenNotToUse: [
      "Pure layout wrappers that carry styles and nothing else - divs are exactly right there",
      "When the semantic element's defaults fight a needed pattern (a link styled as a button inside a form) - choose, comment, and patch the gap",
      "Rewriting a working accessible app for purity's sake - audit the gaps, do not redecorate",
    ],
    difficulty: "beginner",
    tags: ["accessibility", "html", "semantics", "structure"],
    controls: [],
    prompts: {
      cursor: `Find divs and spans with onClick handlers in this repo and convert each to the proper element (button for actions, a for navigation with href, label wrapping its control) while preserving every current visual style - restyle via classes so nothing on screen changes. Fix heading order to one h1 per page with no skipped levels, and wrap the page frame in header, nav, main and footer landmarks. No ARIA unless a converted element genuinely needs it.`,
      claude: `Act as an accessibility-first HTML reviewer. For each of these, name what the semantic element gives for free that the div version must re-create manually (focus, keydown Enter/Space, role, announced name, disabled attribute): button vs div-onclick, a vs styled-span navigation, native details vs hand-rolled accordion, input type=checkbox vs clickable box. Then state the two cases where a div is genuinely correct. Table format, under 18 lines.`,
      chatgpt: `My tutor said 'always use a button, not a clickable div' but I do not see the difference - both respond to a click. Explain what a real button does behind the scenes that my div does not, in terms of keyboard, screen readers and forms, and list which HTML tags give free structure to a page.`,
      lovable: `Rebuild this component tree with semantic elements: actions become buttons, navigation links become a with href, the page frame becomes header, nav, main, article and footer with a correct heading ladder, and the toggle becomes a real details or checkbox - keep the current visual design pixel-for-pixel via classes.`,
      generic: `Explain semantic HTML first: the free behaviour and accessibility of button, a, label, details, nav, main and heading structure versus div soup; when a div is still right; and how to restyle a semantic element without losing its contract with assistive tech.`,
    },
    mistakes: [
      "role='button' on a div: you announced it, but forgot tabIndex, the Enter key, the Space key and the disabled state",
      "Div soup layouts: screen-reader users navigate by landmarks and headings and find a page with no outline",
      "a href='#' used as a click catcher: it scrolls, it lies about its destination, keyboard users get trapped in jump links",
      "Heading level skipped every section for font size: h2 straight to h4 is a broken map on purpose",
    ],
    tips: [
      "Try the mouse-less pass: if a control cannot be reached and fired by keyboard, its element choice is wrong",
      "Style the semantic element (buttons reset cleanly with all: unset) instead of faking it",
      "One h1, then never skip a level - font size is CSS's job, outline depth is the heading's",
      "Native details and summary give you an accordion with zero JavaScript: exploit the freebies before building",
    ],
    related: ["aria-when-needed", "keyboard-nav", "component-composition"],
    learnMore: [
      { label: "MDN: HTML element reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" },
      { label: "W3C WAI: Landmark roles", url: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/" },
    ],
  },
  {
    id: "alt-text-and-labels",
    name: "Alt Text & Icon Names",
    category: "frontend",
    subcategory: "accessibility",
    aliases: ["image alt", "screen reader name", "accessible name", "describing images"],
    summary: "A screen reader reads your images out loud - decide what it should say, or say nothing at all.",
    description:
      "Alt text is a sentence you write for the person who cannot see the photo: useful info the image carries ('Chart: sales doubled in March') beats a filename or 'image of a chart', and a purely decorative background gets alt='' so the reader skips it silently instead of announcing wallpaper. The same naming rule covers icon-only controls: a magnifying-glass button needs aria-label='Search'. The one hard rule never to break: do not write 'image of' or 'photo of' - the reader already announces that.",
    whenToUse: [
      "Every img, and every svg used at content size: a name or an explicit empty alternative",
      "Icon-only buttons anywhere in the interface: a button whose only child is an icon has no name",
      "Charts and diagrams - write the takeaway in alt, or link a long description",
    ],
    whenNotToUse: [
      "Decorative flourishes: give alt='', do not invent a description to fill the field",
      "Images that duplicate visible text (a thumbnail beside its own title): empty alt avoids double announcement",
      "alt as a keyword field for SEO - write for the reader; search engines read the rest of the page",
    ],
    difficulty: "beginner",
    tags: ["accessibility", "images", "icons", "screen-readers"],
    controls: [],
    prompts: {
      cursor: `Audit every img and inline svg in this repo: content-carrying images get concise alt text that states what a sighted user learns from them (no 'image of', no filenames, under about 125 characters); purely decorative images get alt='' (not a missing attribute - empty means intentionally skipped); images next to their own caption or title text get alt=''. Give every icon-only button an aria-label matching its visible action ('Search', 'Close'). List each change with the reason.`,
      claude: `Act as a screen-reader user testing this page. Produce the decision rules I can hand to developers: when to write informational alt (what the image teaches), when decorative gets alt='', when a caption already covers it, how complex charts get a long description, and how an svg or icon-only button receives an accessible name (aria-label versus empty-alt on the inner icon). Give five correct markup examples and the three most common wrong ones. Under 20 lines.`,
      chatgpt: `I built a gallery site and every image is missing alt text - Lighthouse is furious. Explain what good alt text actually does for a blind visitor, what a screen reader literally says when alt is empty versus missing, and fix these three examples: a photo of my dog, a decorative swirl under a heading, and a graph showing subscriptions grew 30 percent.`,
      lovable: `Add proper accessible names to the app: descriptive alt on every content image (what someone learns, not 'image of'), empty alt on all decorative flourishes and gradients, aria-label on icon-only buttons like Search and Close matching the action, and long alt summaries for charts including the trend they show.`,
      generic: `Explain alt text decisions: informational alt that states what the image teaches, alt='' for decorative and duplicate-of-caption images (missing versus empty behave differently), long descriptions for charts, and aria-label names for icon-only buttons - with the no-'image of' rule and examples of each case.`,
    },
    mistakes: [
      "alt='image of sunset' - the reader already says 'image', so the user hears 'image, image of sunset'",
      "alt omitted entirely on decorative borders: the reader announces filenames as poetry",
      "alt='' replaced by removing the attribute: missing alt on a content image reads as 'this page is unfinished'",
      "Copy-pasted identical alt across a grid ('product photo', 'product photo' forty times): no name, no way to tell rows apart",
    ],
    tips: [
      "The test: read the page aloud from the alt attributes alone - does a sightless listener know what is here?",
      "Aim for the sentence you would text a friend describing the photo - usually under 125 characters",
      "For the icon inside a button, name the button (aria-label on the button, empty alt on the inner icon) - not both",
      "Charts: alt states the conclusion ('Sales doubled in March'), not the axes",
    ],
    related: ["accessible-labels", "semantic-html-first", "aria-when-needed"],
    learnMore: [
      { label: "W3C WAI: An alt Decision Tree", url: "https://www.w3.org/WAI/ARIA/apg/practices/" },
      { label: "MDN: img alt attribute", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#alt" },
    ],
  },
  {
    id: "keyboard-nav",
    name: "Keyboard Navigation",
    category: "frontend",
    subcategory: "accessibility",
    aliases: ["tab order", "skip link", "focus trap", "keyboard accessible"],
    summary: "The whole site should run on Tab, Enter and Escape - a lot of users have no mouse and none coming.",
    description:
      "Keyboard users travel by Tab, Shift+Tab, Enter, Space and Escape, so the page needs a logical stop order (follow the visual layout, left to right, top to bottom), visible focus on every stop, a skip link past the mega-nav, and arrow keys for menu and tab-list internals. The two hardest spots are custom widgets: modals must trap focus while open and hand it back on close, and anything built from divs must be given tabindex and key handlers a native control already had. One Tab-through per release catches most of this cheaply.",
    whenToUse: [
      "Every interactive page, before any visual polish: this is a functional floor, not a feature",
      "Custom dropdowns, menus, dialogs, tab panels, sliders - all need keys as well as clicks",
      "Long pages: a skip-to-content link is two lines and saves everyone the nav gauntlet",
    ],
    whenNotToUse: [
      "Not 'everything arrow-key-able': Tab through controls, arrows inside widgets - mimic what native elements actually do",
      "Rebuilding focus order with positive tabindex numbers: fix source order instead, the numbers are a tarpit",
      "As an afterthought at launch - retrofitting a div-based menu is more expensive than the button version",
    ],
    difficulty: "intermediate",
    tags: ["accessibility", "keyboard", "focus", "widgets"],
    controls: [],
    prompts: {
      cursor: `Make this app fully keyboard operable. Fixes in order: add a skip-to-content link as the first tab stop (visually hidden until focused); remove every positive tabindex (source order should already match layout); for each custom menu, tab list and dropdown implement the native key contract - arrow keys move within, Enter or Space activates, Escape closes and returns focus to the trigger; dialogs get a focus trap while open plus focus restore on close. Verify with a mouse-less pass and report which flows you tested. No new dependencies.`,
      claude: `Act as an accessibility engineer auditing a React app's keyboard story. Cover: natural tab order versus positive tabindex (why the latter is a trap), the skip link as first stop, the per-widget key contracts for menus, tab lists and comboboxes (which arrows, which keys activate, what Escape does), focus trap and focus restore for dialogs, and :focus-visible as the cursor of this world. Give a concise per-widget table. No generic advice - name the keys.`,
      chatgpt: `How do people using only a keyboard browse a website, exactly which keys do they press, and what breaks for them on sites built with clickable divs and pop-up dialogs? Explain tab order, focus, the skip link, and what a modal must do while it is open so a keyboard user does not get lost behind it.`,
      lovable: `Add the keyboard layer to this app: a focusable skip link before the nav, Tab order following visual order, arrow-key navigation inside the dropdown menu with Escape closing and returning focus to the button, and the modal trapping focus while open and restoring it on close. Keep the visuals unchanged.`,
      generic: `Make the page keyboard-complete: skip link first, natural tab order with no positive tabindex, native key contracts per custom widget (arrows within menus and tabs, Enter or Space to activate, Escape to close), dialog focus trap with restore, visible :focus-visible rings everywhere - and a mouse-less test pass to prove it.`,
    },
    mistakes: [
      "Escape closes the modal but focus vanishes to the top of the page: return it to the button that opened it",
      "Tab leaks behind an open dialog: the user cycles a ghost page while the modal gleams on top",
      "Positive tabindex values as a band-aid for bad source order - they create tab stops from hell",
      "Dropdown menus with hover only: no focus entry, no arrow keys, which is exactly how they break on touch and switch devices too",
    ],
    tips: [
      "The 30-second audit: mouse off, refresh, Tab across the page - if you can never see where you are, start with focus rings",
      "Copy the native answer: a select element already knows its keys - mimic, do not improvise",
      "A focus trap is ten lines with a querySelectorAll loop, or a framework dialog gives it to you free",
      "Skip links can be visually hidden and appear on focus - free utility, zero design cost",
    ],
    related: ["focus-visible-rings", "modal-dialog", "aria-when-needed"],
    learnMore: [
      { label: "WAI-ARIA Authoring Practices: keyboard interface", url: "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/" },
      { label: "MDN: Keyboard-accessible controls", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/tabindex" },
    ],
  },
  {
    id: "aria-when-needed",
    name: "ARIA, Only When Needed",
    category: "frontend",
    subcategory: "accessibility",
    aliases: ["aria roles", "screen reader attributes", "aria-label", "first rule of aria"],
    summary: "ARIA says what a control is to a screen reader - and the best ARIA is often none at all.",
    description:
      "ARIA attributes annotate elements with semantics HTML does not carry: role, aria-expanded, aria-live for async text, aria-current for the active page. The First Rule of ARIA: do not use ARIA if a native element already does it - a real button needs zero roles, a div with role='button' needs you to hand-build every behaviour the button had for free. The two most damaging myths: an aria-label on an element you can also see (the label should match the visible text), and aria-hidden on something still in the tab order (invisible to readers, but keyboard users still hit it).",
    whenToUse: [
      "State on widgets HTML lacks: aria-expanded on disclosure buttons, aria-current on nav, aria-live on results",
      "Naming controls whose only content is an icon (aria-label on the button)",
      "Custom roles on genuinely custom widgets - tabs, sliders, grids - matching the ARIA APG pattern",
    ],
    whenNotToUse: [
      "Anything a native element already does: no role='button' on a div with your hand-rolled keydown, no role='checkbox' on a styled span",
      "Decorative aria-labels on text the reader already speaks: adding a label to plain paragraphs adds noise, not meaning",
      "Guessing roles - an unlabelled widget with a wrong role is worse than the plain HTML version",
    ],
    difficulty: "intermediate",
    tags: ["accessibility", "aria", "screen-readers", "widgets"],
    controls: [],
    prompts: {
      cursor: `Audit this repo's ARIA for the First Rule: remove every role or aria attribute duplicating a native element's behaviour (role='button' spans with onClick become real buttons; aria-checked divs become checkboxes). Keep ARIA only where HTML has no equivalent: aria-expanded and aria-controls on disclosure triggers, aria-current on the active nav item, aria-live='polite' on async status text, aria-label on icon-only buttons. Flag any aria-hidden element that is still tabbable and fix the pair (tabindex -1 too). List every removal with its reason. No new dependencies.`,
      claude: `Act as an ARIA specialist. State the First Rule of ARIA and its logic (native elements ship behaviour ARIA cannot add - role announces, it does not implement). Then the three everyday misfires: aria-label mismatching visible text (speech input users say the label and it matches nothing), aria-hidden on still-focusable elements, and redundant roles on native elements. Finally, list the four ARIA attributes genuinely worth hand-writing: aria-expanded plus aria-controls, aria-live, aria-current, aria-label or labelledby for icon names. Under 18 lines.`,
      chatgpt: `I added role='button' and aria-pressed to my clickable div but a screen-reader friend says it still feels broken. Explain what ARIA actually does (spoiler: it only announces, it does not build behaviour), why I should have used a real button, and what the first rule of ARIA means for me.`,
      lovable: `Strip the redundant ARIA from this component library: real semantic elements carry their own roles (no role='button' on buttons), and keep only the genuinely load-bearing attributes - aria-expanded with aria-controls on accordions, aria-live polite on toast regions, aria-current page on the active nav link, and aria-label on icon-only buttons.`,
      generic: `Explain the First Rule of ARIA: prefer native elements because ARIA announces but never implements behaviour; the misfires (label versus visible text, aria-hidden on tabbable things, redundant roles); and the four attributes genuinely worth writing - expanded plus controls, live regions, current, and names for icon-only controls.`,
    },
    mistakes: [
      "role='button' as decoration on a div: announced like a button, broken like a div - no focus, no Enter, no Space",
      "aria-label overriding visible text: voice-control users say the words they see and the wrong thing fires",
      "aria-hidden='true' on a widget still in the tab order: readers skip it, keyboard users cannot - half the population loses",
      "Adding an aria-live region to everything: the page becomes a radio station nobody controls",
    ],
    tips: [
      "Test order: first try a native element, then the native element plus one ARIA state, only then a custom pattern from APG",
      "aria-live='polite' for '3 results found'; assertive only for fires - most status text is polite",
      "If you need role and tabindex and keydown just to fake a button, that is the universe telling you to use a button",
      "The ARIA APG has a copyable pattern for every common widget - improvising menu semantics is how myths spread",
    ],
    related: ["semantic-html-first", "focus-visible-rings", "keyboard-nav"],
    learnMore: [
      { label: "W3C: Using ARIA (First Rule)", url: "https://www.w3.org/TR/using-aria/" },
      { label: "MDN: ARIA reference", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA" },
    ],
  },
];
