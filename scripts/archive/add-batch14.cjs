const fs = require('fs');
const {inflateSync, deflateSync} = require('zlib');
const src = fs.readFileSync('src/App.jsx','utf8');
const m = src.match(/const Z = "([^"]+)"/);
const data = JSON.parse(inflateSync(Buffer.from(m[1],'base64')).toString('utf8'));

const E = "ФАЗА 0 \u2014 РАЗВЕДКА: Прочитай структуру, конфиги, зависимости, тесты. ";
const A = " АНТИ-ЛУП: 3 ошибки \u2014 смена подхода.";

function P(id, role, icon, ac, time, taskDesc, tags, difficulty) {
  const cmd = id.startsWith("rl-") ? "/ralph-loop" : id.startsWith("fd-") ? "/feature-dev" : id.startsWith("rv-") ? "/review-pr" : id.startsWith("cr-") ? "/code-review" : id.startsWith("sm-") ? "/simplify" : id.startsWith("lp-") ? "/loop" : id.startsWith("cm-") ? "/commit" : "/feature-dev";
  const text = cmd === "/ralph-loop" ? '/ralph-loop "' + E + 'ЗАДАЧА: ' + taskDesc + A + '" --completion-promise "DONE"' : cmd === "/loop" ? '/loop 5m "' + taskDesc + '"' : taskDesc;
  return { id, m: cmd, mk: "claude", role, type: "command", icon, ac, time, text, tags: tags.split(","), difficulty, output: "Result", related: [], prereqs: [], v: "11.1" };
}

const add = [];

// MOBILE — 40
add.push(
  P("rl-rn-new-arch","React Native New Arch","◈","#61dafb","~2h","Fabric renderer + TurboModules + Hermes. Миграция legacy bridge. Bridgeless mode.","react-native,fabric","advanced"),
  P("rl-rn-expo-router","Expo Router","▲","#000020","~1h","File-based routing Expo Router v3: layouts, stacks, tabs, modals, deep linking.","expo,router","intermediate"),
  P("rl-rn-navigation","React Navigation v7","⇆","#61dafb","~1h","Stack/Tab/Drawer, typed navigation, linking, deep links, gestures, native-stack.","react-native,navigation","intermediate"),
  P("rl-rn-state","RN State (Zustand/Jotai)","◇","#61dafb","~45m","Zustand store persist AsyncStorage, Jotai atoms, Redux Toolkit (если большой).","react-native,state","intermediate"),
  P("rl-rn-reanimated","Reanimated 3","✿","#61dafb","~1-2h","useSharedValue, useAnimatedStyle, gesture-handler, Layout animations, withSpring/withTiming.","reanimated,animation","intermediate"),
  P("rl-rn-skia","React Native Skia","◬","#61dafb","~1-2h","Canvas, paths, shaders, animations, 60fps graphics, Fabric integration.","skia,graphics","advanced"),
  P("rl-rn-flashlist","FlashList Performance","⇣","#61dafb","~45m","Shopify FlashList: recycling, estimatedItemSize, performance vs FlatList.","react-native,list","intermediate"),
  P("rl-rn-mmkv","MMKV Storage","◇","#61dafb","~30m","react-native-mmkv: фast key-value store, encryption, multi-process, vs AsyncStorage.","storage,mmkv","beginner"),
  P("rl-rn-camera","RN Camera","◎","#61dafb","~1h","vision-camera: photo/video, frame processors, ML kit integration, permissions.","camera,vision","intermediate"),
  P("rl-rn-biometric","RN Biometric Auth","⚿","#61dafb","~45m","expo-local-authentication / react-native-biometrics: Face ID, Touch ID, fingerprint, fallback PIN.","biometric,auth","intermediate"),
  P("rl-rn-deep-link","RN Deep Linking","⇨","#61dafb","~1h","Universal links (iOS), App Links (Android), URL schemes, deferred deep linking, branch.io.","deep-linking","intermediate"),
  P("rl-rn-push","RN Push Notifications","🔔","#61dafb","~1-2h","Expo notifications / FCM / APNs, background handlers, rich notifications, channels.","push,notifications","intermediate"),
  P("rl-rn-background","RN Background Tasks","⎚","#61dafb","~1h","Background fetch, geolocation, audio playback. iOS BGAppRefreshTask, Android WorkManager.","background","advanced"),
  P("rl-rn-websocket","RN WebSocket","⇶","#61dafb","~45m","WebSocket client, reconnect logic, heartbeat, foreground/background handling.","websocket,real-time","intermediate"),
  P("rl-rn-updates-eas","EAS Update OTA","⇩","#000020","~45m","Expo EAS Update: channels, branches, rollout, rollback, runtime versions.","expo,eas,ota","intermediate"),
  P("rl-rn-sentry","RN Sentry","🐛","#61dafb","~45m","Sentry setup: sourcemaps, native crashes, release health, performance traces.","sentry,errors","intermediate"),
  P("rl-rn-revenuecat","RN RevenueCat IAP","◈","#61dafb","~1-2h","In-app purchases, subscriptions management, entitlements, server notifications.","iap,subscriptions","intermediate"),
  P("rl-rn-onesignal","RN OneSignal","🔔","#61dafb","~1h","OneSignal push, segmentation, automations, A/B tests, in-app messages.","onesignal,push","intermediate"),
  P("rl-rn-storybook","RN Storybook","◇","#61dafb","~1h","Storybook для RN: on-device preview, Chromatic, visual regression.","storybook,rn","intermediate"),
  P("rl-rn-testing","RN Testing","✓","#61dafb","~1-2h","Jest + Testing Library RN, Detox E2E, Maestro, snapshot tests.","rn,testing","intermediate"),
  P("rl-rn-fastlane","RN Fastlane","⎈","#00ddb1","~1-2h","Fastlane lanes: build/test/deploy iOS+Android, match, gym, supply, pilot.","fastlane,deploy","advanced"),
  P("rl-rn-perf","RN Performance","⚡","#61dafb","~1h","Hermes, InteractionManager, avoid bridge traffic, memoization, Flipper profiler.","rn,performance","intermediate"),
  P("rl-flutter-setup","Flutter 3.x Setup","🎯","#02569b","~1h","Flutter project, widgets tree, Material 3, Cupertino, hot reload.","flutter,dart","intermediate"),
  P("rl-flutter-state-riverpod","Flutter Riverpod","◈","#02569b","~1h","Riverpod 2 providers, ref.watch/read, AsyncValue, family/autoDispose, testing.","flutter,riverpod","intermediate"),
  P("rl-flutter-bloc","Flutter Bloc","◎","#02569b","~1h","flutter_bloc: Bloc/Cubit, events/states, BlocBuilder/BlocListener/BlocConsumer, hydrated_bloc.","flutter,bloc","intermediate"),
  P("rl-flutter-go-router","Flutter go_router","⇆","#02569b","~45m","Declarative routing, deep links, redirects, shell route, error handling.","flutter,routing","intermediate"),
  P("rl-flutter-animations","Flutter Animations","✿","#02569b","~1h","AnimatedBuilder, Hero, implicit (AnimatedContainer), explicit (AnimationController), Rive.","flutter,animations","intermediate"),
  P("rl-flutter-native","Flutter Native Channels","⇆","#02569b","~1h","MethodChannel, EventChannel, Platform-specific code (Swift/Kotlin), pigeon.","flutter,native","advanced"),
  P("rl-ios-swiftdata","iOS SwiftData","◇","#f05138","~1h","SwiftData 17+: @Model, @Query, ModelContainer, migrations from Core Data.","ios,swiftdata","intermediate"),
  P("rl-ios-observation","iOS @Observable","⎈","#f05138","~45m","Observation framework iOS 17+, @Observable macro, vs @ObservableObject.","ios,swift,observation","intermediate"),
  P("rl-ios-actor","Swift Actors","⎈","#f05138","~1h","Actor isolation, @MainActor, global actors, Sendable, structured concurrency.","swift,actors,concurrency","advanced"),
  P("rl-ios-widget","iOS Widgets","⊞","#f05138","~1h","WidgetKit: timeline provider, configurable, Lock Screen widgets, Live Activities.","ios,widgets","intermediate"),
  P("rl-ios-livekit","iOS Live Activities","◐","#f05138","~1h","ActivityKit: start/update/end, Dynamic Island, push updates via APNs.","ios,live-activities","intermediate"),
  P("rl-ios-storekit2","iOS StoreKit 2","◈","#f05138","~1-2h","StoreKit 2 async/await, subscriptions, transactions, App Store Server API.","ios,storekit,iap","intermediate"),
  P("rl-android-compose-nav","Compose Navigation","⇆","#3ddc84","~45m","Navigation Compose 3, typed destinations, deep links, bottom sheet navigation.","android,compose,navigation","intermediate"),
  P("rl-android-room","Android Room","◇","#3ddc84","~1h","Room: entities, DAOs, relations, migrations, Flow observables, Paging 3.","android,room","intermediate"),
  P("rl-android-workmanager","Android WorkManager","⎚","#3ddc84","~1h","One-time/periodic work, constraints, chains, observability, foreground service.","android,workmanager","intermediate"),
  P("rl-android-datastore","Android DataStore","◇","#3ddc84","~45m","Proto DataStore + Preferences DataStore, migration from SharedPreferences.","android,datastore","beginner"),
  P("rl-android-hilt","Android Hilt DI","◈","#3ddc84","~45m","Hilt: @HiltAndroidApp, @Module, @Provides/@Binds, scopes, testing modules.","android,hilt,di","intermediate"),
  P("rl-kotlin-multiplatform","Kotlin Multiplatform","◈","#7f52ff","~2-3h","KMP: shared module, expect/actual, Ktor, SQLDelight, Compose Multiplatform, iOS/Android/Web.","kmp,kotlin","advanced"),
);

// AI / LLM advanced — 30
add.push(
  P("rl-llm-function-calling","LLM Function Calling","◈","#8b5cf6","~1h","Tool use / function calling schemas (OpenAI/Anthropic), argument parsing, validation, error handling.","llm,tools,function-calling","intermediate"),
  P("rl-llm-structured-output","LLM Structured Output","◇","#8b5cf6","~45m","JSON mode, structured output, Zod schema, response_format, retry on parse fail.","llm,json","intermediate"),
  P("rl-llm-streaming","LLM Streaming UX","⇉","#8b5cf6","~45m","SSE/ReadableStream, token-by-token rendering, aborting, partial JSON parsing.","llm,streaming","intermediate"),
  P("rl-llm-cost-opt","LLM Cost Optimization","💰","#8b5cf6","~1h","Prompt caching, smaller models for easy tasks, batch API, context compression, semantic dedup.","llm,cost","intermediate"),
  P("rl-llm-prompt-caching","Anthropic Prompt Caching","◈","#8b5cf6","~30m","cache_control breakpoints, 5m/1h TTL, cache usage metrics, $ savings calculation.","anthropic,caching","beginner"),
  P("rl-llm-batch-api","LLM Batch API","⇶","#8b5cf6","~45m","OpenAI/Anthropic Batch API: 50% скидка, async processing, max 24h, use для offline jobs.","llm,batch","intermediate"),
  P("rl-rag-chunking","RAG Chunking Strategies","◐","#8b5cf6","~1h","Fixed-size vs semantic vs recursive character splitting, overlap, metadata, chunk headers.","rag,chunking","intermediate"),
  P("rl-rag-retrieval-eval","RAG Retrieval Eval","⎃","#8b5cf6","~1h","Recall@k, nDCG, MRR, synthetic Q&A generation, golden set, regression tests.","rag,evaluation","advanced"),
  P("rl-rag-query-rewrite","RAG Query Rewriting","⇄","#8b5cf6","~45m","HyDE, multi-query, step-back prompting, query decomposition.","rag,queries","intermediate"),
  P("rl-agent-tool-use","Agent Tool Use","⚙","#8b5cf6","~1-2h","Agent loop: reasoning → tool call → observation → next step. Max iterations, loop detection.","agent,tools","advanced"),
  P("rl-agent-reflection","Agent Reflection","◐","#8b5cf6","~1h","Self-reflection: generate → critique → refine loop. Improves quality at cost of latency.","agent,reflection","advanced"),
  P("rl-agent-memory","Agent Memory","🧠","#8b5cf6","~1-2h","Short-term (context window) vs long-term (vector DB). Summarization, conversation history.","agent,memory","advanced"),
  P("rl-langchain-v3","LangChain v0.3","⎈","#8b5cf6","~1-2h","LCEL: Runnables, chains, RunnableParallel, .stream/.batch, integrations, LangSmith.","langchain,lcel","intermediate"),
  P("rl-langgraph","LangGraph State Machines","⇶","#8b5cf6","~1-2h","LangGraph: nodes, edges, state, conditional branches, checkpointing, human-in-loop.","langgraph,agents","advanced"),
  P("rl-llamaindex","LlamaIndex RAG","🦙","#8b5cf6","~1h","LlamaIndex: indexes (Vector/List/Tree), query engines, agents, evaluation.","llamaindex,rag","intermediate"),
  P("rl-haystack","Haystack Pipelines","🔍","#8b5cf6","~1h","Haystack v2: pipelines, components, Elasticsearch retriever, prompt builder, evaluators.","haystack,rag","intermediate"),
  P("rl-openai-assistants","OpenAI Assistants API","🤖","#10a37f","~1-2h","Assistants v2: threads, runs, file_search, code_interpreter, function tools, streaming.","openai,assistants","intermediate"),
  P("rl-anthropic-tools","Anthropic Claude Tools","⎈","#d97706","~45m","Claude tool use: schemas, parallel tool calls, computer use beta, citations.","anthropic,claude","intermediate"),
  P("rl-vercel-ai","Vercel AI SDK","▲","#000000","~1h","streamUI, useChat, useCompletion, providers (OpenAI/Anthropic/Google), tool invocations.","ai-sdk,vercel","intermediate"),
  P("rl-mcp-servers","MCP Server Build","⎔","#8b5cf6","~1-2h","Model Context Protocol: tools, resources, prompts. stdio/SSE transport. Claude Desktop integration.","mcp,anthropic","advanced"),
  P("rl-llm-guardrails-input","Input Guardrails","⚿","#8b5cf6","~45m","Prompt injection detection, jailbreak detection, PII scrub, toxicity filter.","llm,guardrails","intermediate"),
  P("rl-llm-guardrails-output","Output Guardrails","⚿","#8b5cf6","~45m","Hallucination check, format validation, PII leak, citation verification.","llm,guardrails","intermediate"),
  P("rl-semantic-router","Semantic Router","◈","#8b5cf6","~45m","Route queries к правильной функции/prompt на основе semantic similarity (embeddings).","llm,routing","intermediate"),
  P("rl-llm-fallback","LLM Fallback Chain","⎄","#8b5cf6","~45m","Primary model → fallback (цена/качество), retry on failure, graceful degradation.","llm,reliability","intermediate"),
  P("rl-llm-observability","LLM Observability","◈","#8b5cf6","~1h","LangSmith / Langfuse / Helicone: trace logging, token costs, latency, quality metrics.","llm,observability","intermediate"),
  P("rl-rag-hybrid-rerank","Hybrid RAG + Rerank","⇶","#8b5cf6","~1-2h","BM25 + vector → RRF fusion → reranker (Cohere/bge-reranker). Multi-stage.","rag,hybrid,rerank","advanced"),
  P("rl-text-to-sql","Text-to-SQL","⎈","#8b5cf6","~1h","Natural language → SQL. Schema in prompt, few-shot, validation, execute + return results.","llm,sql","intermediate"),
  P("rl-code-interpreter","Code Interpreter","⌨","#8b5cf6","~1h","Sandboxed Python/JS execution (Pyodide/Deno/Modal), file upload, plot rendering.","code-interpreter,sandbox","advanced"),
  P("rl-voice-to-text","Whisper STT","🎙","#8b5cf6","~45m","OpenAI Whisper API, Deepgram, AssemblyAI. Streaming partial transcripts, speaker diarization.","stt,whisper","intermediate"),
  P("rl-text-to-voice","TTS Systems","🔊","#8b5cf6","~45m","ElevenLabs, OpenAI TTS, PlayHT. Streaming, voice cloning, multilingual, SSML.","tts,audio","intermediate"),
);

// TESTING — 30
add.push(
  P("rl-vitest","Vitest Config","✓","#729b1b","~45m","Vitest: happy-dom, coverage (v8/istanbul), mocks, snapshots, in-source testing, UI runner.","vitest,testing","intermediate"),
  P("rl-jest-config","Jest Advanced Config","◎","#c21325","~45m","Jest projects, transformIgnore, moduleNameMapper, setupFiles, globalSetup, snapshot serializers.","jest,testing","intermediate"),
  P("rl-playwright-setup","Playwright Setup","🎭","#2ead33","~1h","Playwright config, projects (chromium/firefox/webkit), fixtures, test.extend, trace viewer.","playwright,e2e","intermediate"),
  P("rl-playwright-pom","Playwright POM","◈","#2ead33","~1h","Page Object Model, component objects, screenshot testing, visual snapshots, CI report.","playwright,pom","intermediate"),
  P("rl-playwright-api","Playwright API Testing","⎘","#2ead33","~1h","request fixture, JSON API tests, auth persistence, storageState, mock responses.","playwright,api","intermediate"),
  P("rl-cypress","Cypress E2E","🌲","#17202c","~1h","Cypress 13, commands, intercepts, component testing, cy-origin, Cypress Cloud.","cypress,e2e","intermediate"),
  P("rl-testing-library","React Testing Library","◆","#e33332","~1h","Queries priority (getByRole > getByLabelText > getByText), userEvent, waitFor, screen, custom render.","rtl,react,testing","intermediate"),
  P("rl-msw","MSW Mock Service Worker","⎈","#ff6a33","~1h","MSW v2: http handlers, ws handlers, browser + node, GraphQL.","msw,mocking","intermediate"),
  P("rl-pact-testing","Pact Contract Tests","🤝","#0ea5e9","~1-2h","Consumer-driven contracts, pact broker, can-i-deploy, webhooks между provider/consumer.","pact,contracts","advanced"),
  P("rl-postman-newman","Postman + Newman","⎘","#ff6c37","~45m","Postman collections, newman CLI, CI integration, Postman Monitors, environments.","postman,api","intermediate"),
  P("rl-jmeter","JMeter Load","⎚","#d22128","~1-2h","JMeter: thread groups, samplers, assertions, listeners, distributed testing.","jmeter,load","intermediate"),
  P("rl-gatling","Gatling Load","⎚","#fd3932","~1-2h","Gatling Scala/Java DSL, scenarios, injection profiles, assertions, HTML report.","gatling,load","advanced"),
  P("rl-stryker","Mutation Testing","🧬","#e74c3c","~1h","Stryker Mutator: mutations, kill, survived, timeout, mutator config, incremental.","stryker,mutation","intermediate"),
  P("rl-snapshot-test","Snapshot Testing","📸","#729b1b","~30m","toMatchSnapshot, inline snapshots, UI snapshots (Chromatic/Percy), when not to snapshot.","snapshot,testing","beginner"),
  P("rl-visual-regression","Visual Regression","👁","#10b981","~1h","Chromatic, Percy, Playwright screenshots, Happo. Threshold, viewports, review workflow.","visual,regression","intermediate"),
  P("rl-testing-strategy","Testing Strategy","◎","#10b981","~1h","Testing pyramid vs trophy, unit/integration/e2e ratio, cost vs confidence.","testing,strategy","intermediate"),
  P("rl-test-data","Test Data Management","◇","#10b981","~45m","Factories (faker, factory_bot), fixtures, test DB reset, TestContainers, realistic data.","testing,data","intermediate"),
  P("rl-test-coverage","Coverage Tooling","◈","#10b981","~30m","Istanbul, c8, coverage thresholds, excluded files, coverage in CI, diff coverage.","coverage,testing","intermediate"),
  P("rl-contract-sql","DB Contract Tests","◇","#10b981","~45m","Schema contract tests, migration forward+backward, data fixtures, TestContainers DB.","testing,database","intermediate"),
  P("rl-flaky-tests","Flaky Test Fixing","◆","#ef4444","~45m","Detect flaky (retries), root causes (timing/async/order), quarantine, track metrics.","testing,flaky","intermediate"),
  P("rl-test-doubles","Test Doubles","◇","#10b981","~30m","Dummies, fakes, stubs, spies, mocks. When to use each. Sinon vs jest.mock vs vi.fn.","testing,mocks","beginner"),
  P("rl-test-parallelism","Parallel Test Execution","⇶","#10b981","~45m","Isolation: unique DB per worker, shard by suite, Vitest/Jest maxWorkers, CI matrix.","testing,parallel","intermediate"),
  P("rl-api-contract-test","API Contract (OpenAPI)","⎘","#10b981","~45m","Dredd/Schemathesis validate API response vs OpenAPI spec. Fuzz testing из spec.","testing,openapi","intermediate"),
  P("rl-chaos-k8s","Chaos Testing K8s","🌋","#326ce5","~1h","Chaos Mesh / LitmusChaos: pod kill, network latency, partition, stress tests.","chaos,k8s","advanced"),
  P("rl-game-day","Game Day Exercise","⚡","#ef4444","~2h","Planned chaos exercise: incident scenarios, team response, observability gaps, post-mortem.","chaos,incident","advanced"),
  P("rl-bdd-cucumber","BDD Cucumber","◇","#43b02a","~1h","Gherkin syntax, step definitions, hooks, scenario outlines. When BDD works.","bdd,cucumber","intermediate"),
  P("rl-tdd-deep","TDD Deep","🔴","#ef4444","~1h","Red-Green-Refactor, triangulation, ATDD, TDD for legacy code, mocks vs integration.","tdd,testing","intermediate"),
  P("rl-accessibility-testing","A11y Testing Automation","♿","#2563eb","~45m","axe-core в CI, Playwright + @axe-core/playwright, jest-axe, pa11y-ci, thresholds.","a11y,testing","intermediate"),
  P("rl-fuzz-testing","Fuzz Testing","⚛","#ef4444","~1h","AFL, libFuzzer, Atheris (Python), go-fuzz, cargo-fuzz, coverage-guided input generation.","fuzz,security","advanced"),
  P("rl-smoke-test","Smoke Tests","💨","#10b981","~30m","Minimal critical-path tests post-deploy, synthetic monitoring, API health checks, Playwright smoke suite.","smoke,testing","beginner"),
);

// SECURITY deep — 30
add.push(
  P("rl-owasp-top10-2024","OWASP Top 10 2024","⚠","#dc2626","~2h","A01-A10 актуально для 2024. Broken Access Control, Crypto Failures, Injection, Insecure Design...","owasp,security","intermediate"),
  P("rl-api-security","API Security (OWASP API)","🔐","#dc2626","~1-2h","OWASP API Top 10: BOLA, broken auth, excessive data, mass assignment, improper inventory.","api,security","intermediate"),
  P("rl-sso-saml","SSO SAML 2.0","⚿","#dc2626","~1-2h","SAML 2.0: IdP/SP, assertions, SAMLResponse, signature verification, metadata.","saml,sso","advanced"),
  P("rl-sso-oidc","OpenID Connect","⚿","#dc2626","~1h","OIDC на OAuth2: id_token JWT, UserInfo endpoint, discovery, JWKS, scopes.","oidc,sso","intermediate"),
  P("rl-passkey","Passkeys (WebAuthn)","🔑","#dc2626","~1-2h","WebAuthn registration/authentication, navigator.credentials, resident keys, platform authenticators.","webauthn,passkey","intermediate"),
  P("rl-magic-link","Magic Link Auth","✉","#dc2626","~45m","Email link login: token generation, TTL, one-time, secure session creation.","magic-link,auth","beginner"),
  P("rl-rbac","RBAC Implementation","⚿","#dc2626","~1h","Roles, permissions matrix, hierarchical roles, UI + API enforcement, audit log.","rbac,authorization","intermediate"),
  P("rl-abac","ABAC Policies","⚿","#dc2626","~1h","Attribute-based access: OPA Rego, XACML, policy evaluation, JSON input.","abac,opa,authorization","advanced"),
  P("rl-casbin","Casbin Authorization","⚿","#dc2626","~1h","Casbin: model + policy, RBAC/ABAC/RESTful, enforcer, adapters, watcher.","casbin,authorization","intermediate"),
  P("rl-secret-scanning","Secret Scanning","🔎","#dc2626","~45m","gitleaks, trufflehog, detect-secrets в pre-commit + CI. .gitleaks.toml allowlist.","secrets,scanning","intermediate"),
  P("rl-sast","SAST Tools","🔍","#dc2626","~45m","Semgrep, CodeQL, SonarQube: rules, CI integration, SARIF format, PR comments.","sast,security","intermediate"),
  P("rl-dast","DAST Tools","🔍","#dc2626","~45m","OWASP ZAP, Burp Suite, Nuclei. Active scan vs passive. Authenticated scans.","dast,security","intermediate"),
  P("rl-sbom","SBOM Generation","📋","#dc2626","~45m","CycloneDX / SPDX format, syft/grype, attach to release, compliance (NTIA).","sbom,supply-chain","intermediate"),
  P("rl-supply-chain","Supply Chain Security","🔗","#dc2626","~1h","npm audit, Snyk, Dependabot, SLSA framework, signed commits, keyless (sigstore/cosign).","supply-chain,security","advanced"),
  P("rl-container-scanning","Container Image Scanning","🐳","#dc2626","~45m","Trivy, grype, Anchore. Base image minimal (distroless/alpine), scan в CI, policy.","containers,scanning","intermediate"),
  P("rl-dockerfile-security","Dockerfile Security","🐳","#dc2626","~45m","Non-root user, minimal base, multi-stage, no secrets в layers, HEALTHCHECK, trust.","docker,security","intermediate"),
  P("rl-iam-least-privilege","IAM Least Privilege","⚿","#dc2626","~1h","Principle of least privilege: AWS Access Analyzer, permissions boundary, session policies.","iam,aws","advanced"),
  P("rl-waf-rules","WAF Rules","🛡","#dc2626","~1h","AWS WAF / Cloudflare WAF: OWASP CRS, rate-based rules, geo blocking, bot management.","waf,security","intermediate"),
  P("rl-ddos-protection","DDoS Protection","🛡","#dc2626","~1h","Cloudflare / AWS Shield, rate limiting edges, tarpit, BGP anycast, auto-scaling.","ddos,security","advanced"),
  P("rl-security-headers","Security Headers","⚿","#dc2626","~30m","CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.","headers,security","beginner"),
  P("rl-cors-config","CORS Correctly","⇆","#dc2626","~30m","Origin whitelist, credentials, preflight caching, wildcards pitfalls, per-endpoint policies.","cors,security","intermediate"),
  P("rl-password-hashing","Password Hashing","⚿","#dc2626","~30m","Argon2id preferred, bcrypt ok, never MD5/SHA. Work factor tuning, pepper + salt.","password,crypto","intermediate"),
  P("rl-session-security","Session Security","⚿","#dc2626","~45m","Secure/HttpOnly/SameSite cookies, session rotation on login, idle timeout, fingerprinting.","session,security","intermediate"),
  P("rl-mfa-enforcement","MFA Enforcement","⚿","#dc2626","~45m","Policy: require MFA for admin/payment, step-up auth for sensitive, grace period.","mfa,2fa","intermediate"),
  P("rl-audit-log","Audit Log","📝","#dc2626","~45m","Who/what/when/where immutable log, append-only, retention, SIEM integration.","audit,compliance","intermediate"),
  P("rl-pii-handling","PII Handling","🔒","#dc2626","~1h","Classification, encryption at rest, tokenization, GDPR subject access/delete, data minimization.","pii,gdpr","intermediate"),
  P("rl-gdpr-compliance","GDPR Compliance","📜","#dc2626","~1-2h","Consent, data minimization, right to access/delete/portability, DPO, DPIA, 72h breach.","gdpr,compliance","intermediate"),
  P("rl-pentest-prep","Pentest Preparation","🎯","#dc2626","~45m","Scope, rules of engagement, environment setup, disclosure, remediation tracking.","pentest,security","intermediate"),
  P("rl-threat-model","Threat Modeling","◈","#dc2626","~1-2h","STRIDE, DFD, attack trees, mitigations priority, tool: OWASP Threat Dragon.","threat-model,security","advanced"),
  P("rl-incident-response","Incident Response","🚨","#dc2626","~1h","Prep/detect/analyze/contain/eradicate/recover/lessons. Runbook templates, on-call.","incident,security","intermediate"),
);

// PERF / OPTIMIZATION — 30
add.push(
  P("rl-bundle-webpack","Webpack Bundle Opt","⎔","#8dd6f9","~1h","splitChunks, tree-shaking sideEffects, module federation, bundle-analyzer, persistent cache.","webpack,bundle","intermediate"),
  P("rl-vite-optimize","Vite Build Optimization","⚡","#646cff","~45m","Rollup options, manualChunks, compression, inline images, CSS code splitting.","vite,bundle","intermediate"),
  P("rl-esbuild","esbuild Setup","⚡","#ffcf00","~30m","Lightning-fast bundler, loaders, plugins, watch mode, CSS/SVG/JSON imports.","esbuild,bundler","beginner"),
  P("rl-turbopack","Turbopack Status","⚡","#000000","~30m","Next.js Turbopack (beta→stable), migration from webpack, каких фич пока нет.","turbopack,nextjs","intermediate"),
  P("rl-swc","SWC Compiler","⎈","#9cafaf","~30m","SWC vs Babel (20x faster), plugins, jsc config, next.js default compiler.","swc,compiler","intermediate"),
  P("rl-core-web-vitals","Core Web Vitals","◈","#4285f4","~1h","LCP/INP/CLS targets, real user metrics via CrUX/PageSpeed, field vs lab.","cwv,performance","intermediate"),
  P("rl-lcp-optimize","LCP Optimization","⚡","#4285f4","~45m","Preload hero image, priority hint, remove render-blocking, inline critical CSS, preconnect CDN.","lcp,performance","intermediate"),
  P("rl-inp-optimize","INP Optimization","⚡","#4285f4","~45m","Break long tasks (scheduler.postTask), debounce, useTransition, Web Worker для heavy.","inp,performance","intermediate"),
  P("rl-cls-optimize","CLS Optimization","⚡","#4285f4","~30m","Reserve image/video space (aspect-ratio), font-display: optional, avoid injecting above fold.","cls,performance","intermediate"),
  P("rl-image-optimization","Image Optimization","◐","#4285f4","~45m","AVIF > WebP > JPEG fallback, responsive srcset, lazy loading, LQIP, CDN transformations.","images,performance","intermediate"),
  P("rl-font-optimization","Font Optimization","A","#4285f4","~45m","font-display: swap/optional, subsetting, variable fonts, preload, self-host, size-adjust.","fonts,performance","intermediate"),
  P("rl-critical-rendering","Critical Rendering Path","⎔","#4285f4","~1h","HTML parsing, CSSOM, render blocking, preload scanner, HTTP/2 push vs preload.","rendering,performance","advanced"),
  P("rl-prefetching","Prefetching Strategies","⇶","#4285f4","~45m","rel=preload/prefetch/modulepreload, priority hints, speculation rules (Chrome 109+).","prefetch,performance","intermediate"),
  P("rl-http3-quic","HTTP/3 QUIC","⚡","#4285f4","~45m","QUIC transport, 0-RTT, head-of-line blocking fix, Alt-Svc header, CDN support.","http3,quic","intermediate"),
  P("rl-service-worker-cache","SW Cache Strategies","⎚","#f38020","~1h","Workbox recipes: cache-first (assets), network-first (HTML), SWR (API), precache.","service-worker,cache","intermediate"),
  P("rl-web-worker","Web Workers","⎔","#4285f4","~45m","Offload CPU-heavy tasks, Comlink для простого API, transferable objects, SharedArrayBuffer.","web-worker,performance","intermediate"),
  P("rl-wasm-intro","WebAssembly Intro","⎔","#654ff0","~1h","WASM use cases, Rust → wasm-pack, AssemblyScript, module instantiation, performance gains.","wasm,performance","advanced"),
  P("rl-lighthouse-ci","Lighthouse CI","◈","#4285f4","~45m","Lighthouse CI assert against budgets, budgets.json, github action, compare PR vs base.","lighthouse,ci","intermediate"),
  P("rl-perf-budget","Performance Budgets","◈","#4285f4","~45m","Bundle size/LCP/INP budgets per page type, CI assertion, regression alert.","performance,budget","intermediate"),
  P("rl-db-index-tune","Index Tuning","⎈","#10b981","~1h","Missing indexes (pg_stat_statements), duplicate, unused (pg_stat_user_indexes), covering, partial.","database,indexes","advanced"),
  P("rl-db-query-opt","Query Optimization","⎈","#10b981","~1h","EXPLAIN ANALYZE, bad plans (seq scan on big table), stats (ANALYZE), plan cache, JOIN order.","database,queries","advanced"),
  P("rl-cpu-intensive","CPU Intensive Workloads","⎈","#ef4444","~1h","Offload к worker threads, queue для async batch, vectorization (SIMD), cluster mode (Node).","cpu,performance","advanced"),
  P("rl-memory-optim","Memory Optimization","⎈","#ef4444","~1h","Avoid memory leaks (closures/listeners), WeakMap/WeakRef, streaming больших файлов.","memory,performance","advanced"),
  P("rl-streaming-response","Streaming Responses","⇉","#10b981","~45m","Node stream.Readable, ReadableStream, Chunked transfer, SSE, reduce TTFB.","streaming,performance","intermediate"),
  P("rl-gzip-brotli","Gzip vs Brotli","⎈","#10b981","~30m","Brotli 20-26% better than gzip, precompress static, dynamic Brotli level 4-6.","compression,performance","beginner"),
  P("rl-cdn-multi","Multi-CDN Setup","⎔","#f38020","~45m","Multi-CDN для resilience (Cloudflare + Fastly), DNS-based routing, health checks.","cdn,reliability","advanced"),
  P("rl-lazy-hydration","Lazy Hydration","⎚","#61dafb","~45m","Astro client:visible, Solid/Qwik resumability, React partial hydration (experimental).","hydration,performance","advanced"),
  P("rl-perf-monitoring","Perf Monitoring (RUM)","◈","#10b981","~45m","web-vitals lib → analytics, Datadog/New Relic RUM, p75 metric, attribution.","rum,monitoring","intermediate"),
  P("rl-synthetic-monitoring","Synthetic Monitoring","👁","#10b981","~45m","Pingdom/Checkly: scripted browser checks, API uptime, multi-region, alert channels.","monitoring,synthetic","intermediate"),
  P("rl-cold-start-lambda","Lambda Cold Starts","⎚","#ff9900","~45m","Provisioned concurrency, SnapStart (Java), smaller package, Node 20+, bundling.","lambda,cold-start","intermediate"),
);

add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
if (toAdd.length !== add.length) console.error('Dup:', add.filter(p=>existingIds.has(p.id)).map(p=>p.id));
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, 'prompts. Total:', data.P.length);
