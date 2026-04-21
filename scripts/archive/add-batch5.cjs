const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 ПОЛНАЯ РАЗВЕДКА ПРОЕКТА:\nПрочитай ВЕСЬ проект рекурсивно. Изучи структуру, конфиги, зависимости, точки входа, БД, API, тесты, CI, git log.\n\n";
const A = "\n\nАНТИ-ЛУП: 3 одинаковых ошибки = кардинальная смена подхода.";

const add = [
  {id:"rl-rust",m:"/ralph-loop",mk:"claude",role:"Rust App",type:"command",icon:"\u{1F980}",ac:"#dea584",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Rust приложение.\n\nSTRUCTURE: src/main.rs, src/lib.rs, src/handlers/, src/models/, src/config.rs.\nWEB: Axum/Actix-web, tower middleware.\nDB: SQLx (async), migrations.\nERROR: thiserror + anyhow, proper Result<T, E> chains.\nTESTS: cargo test, integration tests в tests/ dir.\nCLIPPY: cargo clippy -- -D warnings.\nDOCKER: multi-stage (builder → scratch).\nRELEASE: cargo build --release, strip binary.' + A + '" --completion-promise "DONE"',
   tags:["rust","axum","sqlx","systems"],difficulty:"advanced",output:"Rust app",related:["rl-api","rl-docker"],prereqs:[],v:"10.1"},

  {id:"rl-vue",m:"/ralph-loop",mk:"claude",role:"Vue 3 App",type:"command",icon:"\u{1F49A}",ac:"#42b883",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Vue 3 приложение.\n\nSETUP: Vite + Vue 3 + TypeScript + Pinia + Vue Router.\nCOMPOSITION API: setup(), ref, reactive, computed, watch, composables.\nCOMPONENTS: SFC с <script setup>, defineProps, defineEmits.\nSTATE: Pinia stores (defineStore), typed getters/actions.\nROUTING: Vue Router 4, guards, lazy routes.\nTESTS: Vitest + @vue/test-utils, component + unit.\nSTYLE: scoped CSS, CSS Modules, или Tailwind.' + A + '" --completion-promise "DONE"',
   tags:["vue","vue3","pinia","composition-api"],difficulty:"intermediate",output:"Vue 3 app",related:["rl-ui","rl-tailwind"],prereqs:[],v:"10.1"},

  {id:"rl-svelte",m:"/ralph-loop",mk:"claude",role:"SvelteKit App",type:"command",icon:"\u{1F525}",ac:"#ff3e00",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: SvelteKit приложение.\n\nSTRUCTURE: src/routes/, src/lib/, src/params/.\nROUTES: +page.svelte, +layout.svelte, +server.ts (API).\nLOAD: +page.server.ts load functions, form actions.\nSTATE: Svelte stores ($store), derived.\nSTYLE: scoped CSS в <style>, Tailwind.\nSSR: server-side rendering по умолчанию.\nDEPLOY: adapter-auto/adapter-node/adapter-vercel.\nTESTS: Vitest + @testing-library/svelte.' + A + '" --completion-promise "DONE"',
   tags:["svelte","sveltekit","ssr","fullstack"],difficulty:"intermediate",output:"SvelteKit app",related:["rl-feat","rl-tailwind"],prereqs:[],v:"10.1"},

  {id:"rl-trpc",m:"/ralph-loop",mk:"claude",role:"tRPC Setup",type:"command",icon:"\u{1F517}",ac:"#398ccb",time:"~1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: tRPC — type-safe API.\n\nSERVER: tRPC router, procedures (query/mutation), context (auth, db).\nVALIDATION: zod schemas для input.\nMIDDLEWARE: isAuthed, rateLimit.\nCLIENT: createTRPCReact, typed hooks.\nINFER: RouterOutput/RouterInput types.\nSUBSCRIPTIONS: WebSocket для real-time.\nTESTS: caller для unit tests.\nINTEGRATION: Next.js / Express / standalone.' + A + '" --completion-promise "DONE"',
   tags:["trpc","type-safe","api","zod","rpc"],difficulty:"intermediate",output:"tRPC API",related:["rl-api","rl-nextjs"],prereqs:[],v:"10.1"},

  {id:"rl-testing-react",m:"/ralph-loop",mk:"claude",role:"React Testing",type:"command",icon:"\u{1F9EA}",ac:"#61dafb",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Тестирование React компонентов.\n\nSETUP: Vitest + @testing-library/react + jsdom.\nPATTERNS:\n- render(): базовый рендер без краша\n- screen.getByRole(): находи по a11y ролям, не testid\n- userEvent: клики, ввод, keyboard\n- waitFor/findBy: async assertions\n- renderHook(): тестирование hooks\n\nMOCKS: vi.mock для модулей, MSW для API.\nSNAPSHOT: только для stable UI, не для всего.\nCOVERAGE: >80%, focus на бизнес-логику в hooks.' + A + '" --completion-promise "DONE"',
   tags:["react","testing","testing-library","vitest","hooks"],difficulty:"intermediate",output:"React тесты",related:["rl-test","rl-ui"],prereqs:[],v:"10.1"},

  {id:"rl-supabase",m:"/ralph-loop",mk:"claude",role:"Supabase Integration",type:"command",icon:"\u{26A1}",ac:"#3ecf8e",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Supabase интеграция.\n\nSETUP: @supabase/supabase-js, .env (URL + anon key).\nAUTH: signUp, signInWithPassword, signInWithOAuth (Google/GitHub).\nDB: typed queries (supabase.from(\"table\").select/insert/update/delete).\nRLS: Row Level Security policies для каждой таблицы.\nSTORAGE: upload/download files, signed URLs.\nREALTIME: subscribe to changes (postgres_changes).\nEDGE FUNCTIONS: Deno runtime для server logic.\nTYPES: supabase gen types для TypeScript.' + A + '" --completion-promise "DONE"',
   tags:["supabase","baas","postgres","auth","realtime"],difficulty:"intermediate",output:"Supabase app",related:["rl-auth","rl-db"],prereqs:[],v:"10.1"},

  {id:"rl-docker-opt",m:"/ralph-loop",mk:"claude",role:"Docker Optimization",type:"command",icon:"\u{1F433}",ac:"#0db7ed",time:"~30m-1h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Оптимизация Docker.\n\nIMAGE SIZE: multi-stage, alpine/distroless, .dockerignore.\nLAYERS: COPY package*.json -> install -> COPY . (cache deps).\nSECURITY: non-root USER, read-only fs, no secrets in layers.\nBUILD: BuildKit (DOCKER_BUILDKIT=1), cache mounts.\nCOMPOSE: health checks, depends_on condition, resource limits.\nSCAN: docker scout / trivy для CVE.\nPROD: pin versions, no :latest, reproducible builds.' + A + '" --completion-promise "DONE"',
   tags:["docker","optimization","security","buildkit"],difficulty:"intermediate",output:"Optimized Docker",related:["rl-docker","rl-deploy"],prereqs:[],v:"10.1"},

  {id:"rl-monit",m:"/ralph-loop",mk:"claude",role:"Monitoring Stack",type:"command",icon:"\u{1F4C8}",ac:"#e6522c",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Monitoring stack.\n\nMETRICS: Prometheus + Grafana или Datadog.\nENDPOINT: GET /metrics (prom-client / prometheus_client).\nDASHBOARD: request rate, error rate, latency (p50/p95/p99), memory, CPU.\nALERTS: error rate >1%, latency p95 >500ms, memory >80%.\nLOGS: structured (JSON), ELK или Loki.\nTRACING: OpenTelemetry, distributed traces.\nUPTIME: health check endpoint, external monitor (UptimeRobot/Checkly).\nSLOs: define SLIs, error budgets.' + A + '" --completion-promise "DONE"',
   tags:["monitoring","prometheus","grafana","alerts","observability"],difficulty:"advanced",output:"Monitoring stack",related:["rl-logging","rl-deploy"],prereqs:[],v:"10.1"},

  {id:"rl-terraform",m:"/ralph-loop",mk:"claude",role:"Terraform IaC",type:"command",icon:"\u{1F30D}",ac:"#7b42bc",time:"~1-2h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Terraform Infrastructure as Code.\n\nSTRUCTURE: main.tf, variables.tf, outputs.tf, terraform.tfvars.\nMODULES: reusable modules в modules/ dir.\nSTATE: remote backend (S3 + DynamoDB lock).\nENVIRONMENTS: workspaces или directory per env.\nRESOURCES: VPC, EC2/ECS, RDS, S3, CloudFront, Route53.\nSECURITY: no secrets в .tf files, use variables.\nCI: terraform plan в PR, apply на merge.\nIMPORT: terraform import для existing resources.' + A + '" --completion-promise "DONE"',
   tags:["terraform","iac","aws","infrastructure","devops"],difficulty:"advanced",output:"Terraform IaC",related:["rl-docker","rl-ci","rl-deploy"],prereqs:[],v:"10.1"},

  {id:"rl-k8s",m:"/ralph-loop",mk:"claude",role:"Kubernetes Deploy",type:"command",icon:"\u{2638}",ac:"#326ce5",time:"~2-3h",
   text:'/ralph-loop "' + E + 'ЗАДАЧА: Kubernetes deployment.\n\nMANIFESTS: Deployment, Service, Ingress, ConfigMap, Secret.\nHELM: Chart.yaml, values.yaml, templates/.\nSCALING: HPA (CPU/memory), resource requests/limits.\nNETWORKING: Service (ClusterIP/LoadBalancer), Ingress (nginx/traefik).\nSTORAGE: PVC для persistent data.\nSECRETS: sealed-secrets или external-secrets.\nCI/CD: build image -> push registry -> kubectl apply / helm upgrade.\nMONITORING: liveness/readiness probes, metrics.' + A + '" --completion-promise "DONE"',
   tags:["kubernetes","k8s","helm","deployment","devops"],difficulty:"advanced",output:"K8s deployment",related:["rl-docker","rl-ci"],prereqs:[],v:"10.1"},
];

add.forEach(p => { p.compact = p.text.slice(0, 400); });
data.P = [...data.P, ...add];

// More combos
data.COMBOS.ru.push(
  { name:"Vue/Svelte Stack", agents:["rl-vue","rl-tailwind","rl-auth","rl-test","rl-deploy"], ids:["rl-vue","rl-tailwind","rl-auth","rl-test","rl-deploy"], desc:"Vue/Svelte + Tailwind + auth + тесты + deploy" },
  { name:"Infrastructure", agents:["rl-terraform","rl-k8s","rl-docker-opt","rl-monit","rl-backup"], ids:["rl-terraform","rl-k8s","rl-docker-opt","rl-monit","rl-backup"], desc:"Terraform + K8s + Docker + мониторинг + бэкапы" },
);
data.COMBOS.en.push(
  { name:"Vue/Svelte Stack", agents:["rl-vue","rl-tailwind","rl-auth","rl-test","rl-deploy"], ids:["rl-vue","rl-tailwind","rl-auth","rl-test","rl-deploy"], desc:"Vue/Svelte + Tailwind + auth + tests + deploy" },
  { name:"Infrastructure", agents:["rl-terraform","rl-k8s","rl-docker-opt","rl-monit","rl-backup"], ids:["rl-terraform","rl-k8s","rl-docker-opt","rl-monit","rl-backup"], desc:"Terraform + K8s + Docker + monitoring + backups" },
);

// More configs
data.CONFIGS.push(
  {
    id: 'tsconfig',
    name: 'tsconfig.json (strict)',
    icon: '\u{1F4D8}',
    accent: '#3178c6',
    desc: 'TypeScript strict config',
    text: '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "ESNext",\n    "moduleResolution": "bundler",\n    "strict": true,\n    "noUncheckedIndexedAccess": true,\n    "noImplicitOverride": true,\n    "noPropertyAccessFromIndexSignature": true,\n    "exactOptionalPropertyTypes": true,\n    "noFallthroughCasesInSwitch": true,\n    "forceConsistentCasingInFileNames": true,\n    "jsx": "react-jsx",\n    "paths": { "@/*": ["./src/*"] },\n    "outDir": "dist",\n    "skipLibCheck": true\n  },\n  "include": ["src"],\n  "exclude": ["node_modules", "dist"]\n}'
  },
  {
    id: 'prettier',
    name: '.prettierrc',
    icon: '\u{1F3A8}',
    accent: '#f7b93e',
    desc: 'Prettier config',
    text: '{\n  "semi": true,\n  "singleQuote": true,\n  "trailingComma": "all",\n  "printWidth": 100,\n  "tabWidth": 2,\n  "arrowParens": "always",\n  "endOfLine": "lf",\n  "plugins": ["prettier-plugin-tailwindcss"]\n}'
  },
  {
    id: 'gitignore',
    name: '.gitignore',
    icon: '\u{1F6AB}',
    accent: '#f05033',
    desc: 'Git ignore для Node.js проекта',
    text: 'node_modules/\ndist/\n.next/\n.nuxt/\nbuild/\ncoverage/\n\n.env\n.env.local\n.env.production\n*.pem\n*.key\n\n*.log\n*.tsbuildinfo\n.DS_Store\nThumbs.db\n\n.vscode/settings.json\n!.vscode/extensions.json'
  },
);

const json = JSON.stringify(data);
const compressed = deflateSync(json).toString('base64');
const newSrc = src.replace(/const Z = "[^"]+"/, 'const Z = "' + compressed + '"');
fs.writeFileSync('src/App.jsx', newSrc);
console.log('Prompts:', data.P.length);
console.log('Combos:', data.COMBOS.ru.length);
console.log('Configs:', data.CONFIGS.length);
console.log('Cheat sections:', Object.keys(data.CHEAT).length);
