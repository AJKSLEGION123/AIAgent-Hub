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

// BACKEND FRAMEWORKS (40)
add.push(
  P("rl-express-setup","Express.js Production","⎔","#000000","~1-2h","Express + TS: middleware stack, error handler, validation (zod/joi), rate limit, helmet, CORS, compression, structured logs, graceful shutdown.","express,nodejs,backend","intermediate"),
  P("rl-express-auth","Express JWT Auth","⚿","#000000","~1h","JWT authentication: access + refresh tokens, middleware check, refresh endpoint, logout (blacklist), bcrypt passwords.","express,jwt,auth","intermediate"),
  P("rl-fastify-setup","Fastify API","⚡","#000000","~1h","Fastify: schemas, plugins, hooks, serialization, faster than Express, built-in validation, autoload.","fastify,nodejs","intermediate"),
  P("rl-nestjs-setup","NestJS Architecture","◈","#e0234e","~2h","NestJS: modules, providers (DI), controllers, guards, interceptors, pipes, DTOs, exception filters.","nestjs,typescript,di","advanced"),
  P("rl-nestjs-graphql","NestJS GraphQL","◊","#e0234e","~1-2h","NestJS GraphQL code-first: resolvers, Args, Mutation, subscriptions, DataLoader, Apollo Federation.","nestjs,graphql","advanced"),
  P("rl-nestjs-microservices","NestJS Microservices","◫","#e0234e","~2h","@nestjs/microservices: TCP/Redis/NATS/Kafka transports, message patterns, hybrid apps.","nestjs,microservices","advanced"),
  P("rl-hono-cloudflare","Hono on Cloudflare Workers","⎔","#f38020","~1h","Hono в Workers: routing, middleware, D1/KV/R2 bindings, JWT, deploy wrangler.","hono,cloudflare,workers","intermediate"),
  P("rl-koa","Koa.js Async","⇶","#33333d","~1h","Koa: ctx, async middleware chain, generator-style flow, koa-router, koa-body, error handling.","koa,nodejs","intermediate"),
  P("rl-fastapi","FastAPI Python","⚡","#009688","~1-2h","FastAPI: Pydantic v2, async routes, dependency injection, OpenAPI auto, SQLAlchemy, Alembic migrations.","fastapi,python","intermediate"),
  P("rl-fastapi-auth","FastAPI OAuth2","⚿","#009688","~1h","OAuth2PasswordBearer, JWT, bcrypt, scopes, user dependency, refresh tokens.","fastapi,oauth2","intermediate"),
  P("rl-django-setup","Django 5 Setup","◆","#092e20","~2h","Django 5: async views, settings split, apps structure, models, migrations, admin, DRF.","django,python","intermediate"),
  P("rl-django-drf","Django REST Framework","◒","#092e20","~1-2h","DRF: serializers, viewsets, routers, permissions, throttling, pagination, JWT auth.","django,drf,api","intermediate"),
  P("rl-django-async","Django Async Views","⇶","#092e20","~1h","async def view, ORM async, channels для WebSocket, async middleware.","django,async","advanced"),
  P("rl-flask","Flask Minimal API","⚘","#000000","~45m","Flask: blueprints, Flask-SQLAlchemy, Flask-Login, marshmallow, production WSGI (gunicorn).","flask,python","beginner"),
  P("rl-rails-setup","Rails 7.2+ Setup","◆","#cc0000","~1-2h","Rails 7: Hotwire (Turbo + Stimulus), importmaps, propshaft, Action Cable, Solid Queue.","rails,ruby","intermediate"),
  P("rl-rails-api","Rails API-only","⎘","#cc0000","~1h","rails new --api, serializers (jsonapi/blueprinter), versioning, rate limit (rack-attack).","rails,api","intermediate"),
  P("rl-rails-hotwire","Rails Hotwire","⚡","#cc0000","~1h","Turbo Frames, Turbo Streams, broadcasts, Stimulus controllers, real-time без JS фреймворка.","rails,hotwire,turbo","intermediate"),
  P("rl-laravel","Laravel 11","◆","#ff2d20","~1-2h","Laravel 11: streamlined structure, Eloquent, Blade, queues, Horizon, Sanctum auth.","laravel,php","intermediate"),
  P("rl-laravel-livewire","Laravel Livewire 3","⚡","#ff2d20","~1h","Livewire components, wire:model, alpine integration, actions, validation, file upload.","laravel,livewire","intermediate"),
  P("rl-symfony","Symfony 7","◆","#000000","~2h","Symfony 7: bundles, DI, Doctrine, Messenger, Security, Twig, API Platform.","symfony,php","intermediate"),
  P("rl-spring-boot","Spring Boot 3","◒","#6db33f","~2-3h","Spring Boot 3: Jakarta EE, native image (GraalVM), WebFlux reactive, Spring Data JPA.","spring,java","advanced"),
  P("rl-spring-security","Spring Security","⚿","#6db33f","~2h","OAuth2 resource server, JWT, method security, CORS, CSRF, password encoding.","spring,security","advanced"),
  P("rl-go-fiber","Go Fiber","⚡","#00acd7","~1h","Fiber: Express-like для Go, routing, middleware, validator, JWT, WebSocket.","go,fiber","intermediate"),
  P("rl-go-echo","Go Echo Framework","⎈","#00acd7","~1h","Echo: context, middleware, binding, validation, JWT, graceful shutdown.","go,echo","intermediate"),
  P("rl-go-gin","Go Gin Framework","⚘","#00acd7","~1h","Gin: routing, middleware, binding, validation, recovery, rate limit.","go,gin","intermediate"),
  P("rl-rust-axum","Rust Axum","⎔","#ce422b","~2h","Axum: tower middleware, extractors, state, routing, WebSocket, SSE.","rust,axum","advanced"),
  P("rl-rust-actix","Rust Actix-web","⚡","#ce422b","~2h","Actix-web: actors, middleware, extractors, WebSocket, performance leader.","rust,actix","advanced"),
  P("rl-elixir-phoenix","Elixir Phoenix","♔","#4e2a8e","~2h","Phoenix LiveView: server-rendered reactive UI, channels, presence, real-time.","elixir,phoenix","advanced"),
  P("fd-rest-api-design","REST API Design","⎘","#10b981","~1h","REST principles: resources, HTTP methods, status codes, versioning (/v1), pagination, filtering, HATEOAS.","rest,api,design","intermediate"),
  P("fd-graphql-schema","GraphQL Schema Design","◊","#e535ab","~1-2h","Schema-first: types, queries, mutations, subscriptions, unions, interfaces, directives, Relay cursors.","graphql,schema","intermediate"),
  P("fd-grpc-service","gRPC Service","⎔","#4285f4","~1-2h","Proto3 files, services, streaming (unary/server/client/bidi), gateway для HTTP/JSON, auth.","grpc,proto","advanced"),
  P("fd-trpc","tRPC End-to-End","◆","#398ccb","~1-2h","tRPC router, procedures, middleware, zod validation, type inference client↔server.","trpc,typescript","intermediate"),
  P("fd-openapi-gen","OpenAPI + Code Gen","⎘","#85ea2d","~1h","OpenAPI 3.1 spec, swagger-ui, redoc, oazapfts/openapi-typescript для client, Prism mock.","openapi,swagger","intermediate"),
  P("fd-asyncapi","AsyncAPI (events)","⇶","#85ea2d","~1h","AsyncAPI для event-driven: publish/subscribe, channels, schemas, Kafka/AMQP/WebSocket bindings.","asyncapi,events","intermediate"),
  P("fd-webhooks","Webhook System","⇨","#10b981","~1-2h","Outbound webhooks: retries с backoff, HMAC signatures, event types, dashboard, replay, dead letter.","webhooks,events","intermediate"),
  P("fd-server-sent-events","Server-Sent Events","⇉","#10b981","~45m","SSE: EventSource, retry, last-event-id resume, events/id/data fields, proxy buffering (nginx).","sse,real-time","intermediate"),
  P("fd-long-polling","HTTP Long Polling","⇄","#10b981","~45m","Long polling fallback для SSE/WebSocket, timeout strategy, holding connection, fairness.","long-polling","intermediate"),
  P("rl-api-versioning","API Versioning Strategy","◎","#10b981","~1h","URL path (/v1/), header (Accept: application/vnd.api.v2+json), query param. Deprecation, Sunset header.","api,versioning","intermediate"),
  P("rl-api-pagination","Pagination Strategies","⇥","#10b981","~45m","Offset vs cursor vs keyset. Link header (RFC 5988). Total count trade-offs. GraphQL Relay.","api,pagination","intermediate"),
  P("rl-api-filter-sort","API Filter/Sort Spec","◈","#10b981","~45m","?filter[status]=active&sort=-created_at. JSON:API spec, RSQL/FIQL для сложных фильтров.","api,filtering","intermediate"),
);

// DATABASE (40)
add.push(
  P("rl-postgres-tuning","Postgres Tuning","⎈","#336791","~1-2h","shared_buffers, work_mem, effective_cache_size, maintenance_work_mem. EXPLAIN ANALYZE BUFFERS, pg_stat_statements.","postgres,performance","advanced"),
  P("rl-postgres-indexes","Postgres Indexes","◈","#336791","~1h","B-tree/Hash/GIN/GiST/BRIN. Partial, expression, covering (INCLUDE). Unused indexes detection.","postgres,indexes","intermediate"),
  P("rl-postgres-json","Postgres JSONB","◇","#336791","~1h","JSONB vs JSON, operators (@>, ?, ?&, ?|), GIN index, JSON_PATH queries, validation.","postgres,jsonb","intermediate"),
  P("rl-postgres-partition","Postgres Partitioning","⫴","#336791","~1-2h","Declarative partitioning: range/list/hash. Attach/detach, constraint exclusion, pg_partman.","postgres,partitioning","advanced"),
  P("rl-postgres-fts","Postgres Full-Text Search","⌕","#336791","~1h","tsvector/tsquery, GIN index, ranking (ts_rank), highlighting, pg_trgm для fuzzy.","postgres,fts","intermediate"),
  P("rl-postgres-replication","Postgres Replication","⇆","#336791","~2h","Streaming replication, logical replication, hot standby, failover (Patroni), read replicas.","postgres,replication","advanced"),
  P("rl-postgres-vacuum","Postgres VACUUM","⎄","#336791","~45m","Autovacuum tuning, VACUUM FULL vs ANALYZE, bloat detection, pg_repack для online rebuild.","postgres,vacuum,maintenance","intermediate"),
  P("rl-postgres-pooling","Postgres Connection Pooling","⚮","#336791","~45m","pgBouncer (session/transaction/statement pooling), PgCat, prepared statements compatibility.","postgres,pgbouncer","intermediate"),
  P("rl-postgres-backup","Postgres Backup Strategy","⇩","#336791","~1h","pg_dump (logical), pg_basebackup (physical), PITR с WAL, continuous archival, restore testing.","postgres,backup","intermediate"),
  P("rl-pgvector","pgvector для AI","◈","#336791","~1h","pgvector extension, embeddings column, HNSW vs IVFFlat index, similarity queries (<->, <#>, <=>).","postgres,pgvector,ai","intermediate"),
  P("rl-mysql-setup","MySQL 8 Setup","⎈","#4479a1","~1h","InnoDB, utf8mb4 charset, timezone, slow query log, performance_schema, MySQLTuner.","mysql,database","intermediate"),
  P("rl-mysql-tuning","MySQL Tuning","⎄","#4479a1","~1h","innodb_buffer_pool_size, max_connections, query cache (устарел), index stats.","mysql,performance","advanced"),
  P("rl-mongodb-setup","MongoDB Setup","◉","#47a248","~1h","Replica set, sharding, indexes (compound, text, TTL, geo), aggregation framework.","mongodb,nosql","intermediate"),
  P("rl-mongodb-aggregation","MongoDB Aggregation","⇶","#47a248","~1-2h","Pipeline: $match, $group, $project, $lookup (joins), $unwind, $facet, $graphLookup.","mongodb,aggregation","advanced"),
  P("rl-redis-setup","Redis Setup","⎔","#dc382d","~1h","Redis 7: data types (strings, lists, sets, hashes, streams, sorted sets), persistence (RDB/AOF).","redis,cache","intermediate"),
  P("rl-redis-patterns","Redis Patterns","◈","#dc382d","~1-2h","Cache-aside, write-through, distributed locks (Redlock), rate limiting, leaderboards, pub/sub, streams.","redis,patterns","intermediate"),
  P("rl-redis-cluster","Redis Cluster","⧈","#dc382d","~1-2h","Sharding, replica per shard, resharding, failover, CLIENT PAUSE, key hash tags.","redis,cluster","advanced"),
  P("rl-elasticsearch","Elasticsearch Setup","⌕","#005571","~1-2h","Cluster setup, indexing strategy, mappings, analyzers, shards/replicas, snapshot.","elasticsearch,search","intermediate"),
  P("rl-elasticsearch-query","ES Query DSL","⌕","#005571","~1h","Match/term/range/bool, aggregations, highlighting, suggesters, scripted fields.","elasticsearch,queries","intermediate"),
  P("rl-opensearch","OpenSearch Migration","⌕","#005eb8","~1h","Fork from ES 7.10, differences, migration path, security plugin.","opensearch","intermediate"),
  P("rl-clickhouse","ClickHouse OLAP","◬","#ffcc00","~1-2h","Columnar DB, MergeTree engine, materialized views, sharding, Kafka engine.","clickhouse,olap","advanced"),
  P("rl-sqlite-wal","SQLite WAL Mode","◇","#003b57","~30m","WAL journal, PRAGMA settings, prepared statements, connection per thread.","sqlite,embedded","beginner"),
  P("rl-dynamodb","DynamoDB Single Table","⊞","#4053d6","~1-2h","Single-table design: PK/SK, GSI/LSI, access patterns, adjacency list для graphs.","dynamodb,nosql,aws","advanced"),
  P("rl-firestore","Firestore Structure","⬟","#ffca28","~1h","Collections, documents, subcollections, composite indexes, security rules, real-time.","firestore,firebase","intermediate"),
  P("rl-supabase","Supabase Full Stack","◉","#3ecf8e","~1h","Postgres + Auth + Realtime + Storage + Edge Functions. Row-level security.","supabase,postgres","intermediate"),
  P("rl-neon","Neon Serverless Postgres","◇","#00e599","~45m","Neon branching, autoscale, pooler, compute vs storage separation.","neon,serverless,postgres","intermediate"),
  P("rl-planetscale","PlanetScale Vitess","⎈","#000000","~45m","Vitess sharded MySQL, branching, deploy requests, schema changes online.","planetscale,mysql","intermediate"),
  P("rl-prisma","Prisma ORM","◆","#2d3748","~1-2h","schema.prisma, migrate, generate, relations, transactions, raw queries, connection pool.","prisma,orm","intermediate"),
  P("rl-drizzle","Drizzle ORM","⎈","#c5f74f","~1h","Drizzle: type-safe SQL-like, migrations, relational queries, edge-compatible.","drizzle,orm","intermediate"),
  P("rl-typeorm","TypeORM","◈","#fe0902","~1h","Entities, repositories, query builder, transactions, migrations, relations.","typeorm,nodejs","intermediate"),
  P("rl-sqlalchemy","SQLAlchemy 2","◆","#d71f00","~1-2h","Async engine, declarative base, relationship, query, sessionmaker, Alembic.","sqlalchemy,python","intermediate"),
  P("rl-migrations","DB Migration Strategy","⇶","#10b981","~45m","Forward-only migrations, reversibility, zero-downtime (add col/dual-write/backfill/drop).","migrations,database","intermediate"),
  P("rl-seed-data","Database Seeding","🌱","#10b981","~45m","Seeds for dev/staging, factory pattern (Faker), idempotent, transaction wrap, environment-specific.","seeding,testing","beginner"),
  P("rl-db-snapshot","DB Snapshot for Tests","◈","#10b981","~30m","Snapshot restore для integration тестов, Docker volume, tmpfs performance.","testing,database","intermediate"),
  P("rl-materialized-view","Materialized Views","◇","#336791","~45m","CREATE MATERIALIZED VIEW, REFRESH (CONCURRENTLY), indexes, scheduled refresh.","postgres,views","intermediate"),
  P("rl-db-sharding","Sharding Strategy","⫴","#10b981","~2h","Horizontal sharding: by user_id/tenant/geo. Hash/range/directory. Resharding pain.","sharding,scale","advanced"),
  P("rl-read-replicas","Read Replicas","⇆","#10b981","~1h","Read/write split, replication lag handling, read-your-writes consistency, failover.","replicas,database","intermediate"),
  P("rl-db-sharding-vitess","Vitess Sharding","⧈","#ff6b00","~2h","Vitess topology, vschema, resharding workflow, query planner.","vitess,mysql","advanced"),
  P("rl-db-locks","Database Locks","◇","#10b981","~45m","Row vs table locks, shared vs exclusive, deadlock detection, FOR UPDATE SKIP LOCKED.","locks,concurrency","advanced"),
  P("rl-db-transactions","Transaction Isolation","⇄","#10b981","~1h","Read uncommitted/committed/repeatable read/serializable. Phantom reads, Lost updates. MVCC.","transactions,isolation","advanced"),
);

// DEVOPS / CLOUD / IaC (50)
add.push(
  P("rl-k8s-basics","Kubernetes Basics","⎈","#326ce5","~2h","Pods, Deployments, Services, ConfigMaps, Secrets, Ingress, namespaces. kubectl основы.","kubernetes,k8s","intermediate"),
  P("rl-k8s-helm","Helm Charts","⎈","#0f1689","~1-2h","Chart structure, values.yaml, templates, helpers, hooks, dependencies, helm lint/test.","helm,kubernetes","intermediate"),
  P("rl-k8s-kustomize","Kustomize Overlays","⎈","#326ce5","~1h","Base + overlays (dev/staging/prod), patches, resources, generators, transformers.","kustomize,kubernetes","intermediate"),
  P("rl-k8s-secrets","K8s Secret Management","⚿","#326ce5","~1h","Sealed Secrets, External Secrets Operator + Vault/AWS Secrets Manager, SOPS + age.","k8s,secrets","intermediate"),
  P("rl-k8s-autoscale","K8s HPA + VPA","⇈","#326ce5","~1h","HPA на CPU/memory/custom metrics (Prometheus Adapter), VPA, Cluster Autoscaler, KEDA.","k8s,autoscaling","advanced"),
  P("rl-k8s-istio","Istio Service Mesh","⧈","#466bb0","~2h","Istio install, VirtualService, DestinationRule, mTLS, traffic shifting, observability.","istio,service-mesh","advanced"),
  P("rl-k8s-linkerd","Linkerd Lightweight","⧈","#2bada8","~1-2h","Linkerd install, automatic mTLS, traffic split, multicluster, cheaper than Istio.","linkerd,service-mesh","intermediate"),
  P("rl-k8s-argocd","ArgoCD GitOps","⇶","#ef7b4d","~1-2h","ArgoCD Application, ApplicationSet, sync policies, health checks, SSO.","argocd,gitops","intermediate"),
  P("rl-k8s-flux","Flux CD","⇶","#316ce6","~1h","Flux v2: GitRepository, Kustomization, HelmRelease, notifications, image automation.","flux,gitops","intermediate"),
  P("rl-k8s-cert-manager","cert-manager","◎","#326ce5","~45m","Let's Encrypt issuer, ClusterIssuer, Certificate CR, DNS/HTTP challenges, ingress annotations.","cert-manager,tls","intermediate"),
  P("rl-k8s-nginx-ingress","NGINX Ingress","⎔","#009639","~45m","NGINX Ingress Controller, Ingress rules, TLS, rewrite annotations, rate limit, auth.","nginx,ingress","intermediate"),
  P("rl-k8s-traefik","Traefik Ingress","⎔","#24a1c1","~45m","Traefik v3, IngressRoute CRD, middlewares, observability, auto cert.","traefik,ingress","intermediate"),
  P("rl-k8s-prometheus","kube-prometheus-stack","◈","#e6522c","~1-2h","kube-prometheus-stack Helm chart: Prometheus, Grafana, Alertmanager, node-exporter, kube-state-metrics.","k8s,prometheus,grafana","intermediate"),
  P("rl-k8s-loki","Loki Logging","≣","#f5a800","~1h","Grafana Loki: log aggregation, LogQL, Promtail/Vector shippers, retention, query.","loki,logs","intermediate"),
  P("rl-k8s-tempo","Grafana Tempo Tracing","⧈","#f5a800","~1h","Tempo: distributed tracing backend, OTLP ingestion, retention, exemplars link метрик к трейсам.","tempo,tracing","intermediate"),
  P("rl-k8s-velero","Velero Backup","⇩","#326ce5","~45m","Velero: backup K8s resources + PV snapshots, schedules, restore, disaster recovery.","velero,backup","intermediate"),
  P("rl-k8s-network-policy","Network Policies","⚿","#326ce5","~45m","NetworkPolicy resource: ingress/egress rules, namespace selectors, pod selectors, Calico/Cilium.","networkpolicy,security","intermediate"),
  P("rl-k8s-psp","Pod Security Standards","⚿","#326ce5","~45m","Pod Security Admission: privileged/baseline/restricted levels, namespace labels.","k8s,security","intermediate"),
  P("rl-k8s-opa","OPA Gatekeeper","⚿","#326ce5","~1h","OPA Gatekeeper: ConstraintTemplate, Constraint, policy-as-code для K8s.","opa,policy","advanced"),
  P("rl-terraform-setup","Terraform Project Structure","◈","#7b42bc","~1h","modules/, environments/, backend (S3+DynamoDB), variables, outputs, state locking.","terraform,iac","intermediate"),
  P("rl-terraform-aws","Terraform AWS","⎈","#ff9900","~2h","VPC, subnets, EC2, RDS, S3, IAM, SGs. Module structure. tfsec scan.","terraform,aws","intermediate"),
  P("rl-terraform-gcp","Terraform GCP","⎈","#4285f4","~1-2h","Projects, VPC, GKE, Cloud SQL, IAM bindings, Workload Identity.","terraform,gcp","intermediate"),
  P("rl-terraform-azure","Terraform Azure","⎈","#0089d6","~1-2h","Resource groups, VNet, AKS, SQL Database, Storage accounts, RBAC assignments.","terraform,azure","intermediate"),
  P("rl-terraform-cloudflare","Terraform Cloudflare","⎈","#f38020","~1h","DNS zones, Workers, Pages, Access, Zero Trust policies, Stream.","terraform,cloudflare","intermediate"),
  P("rl-terraform-state","Terraform State Mgmt","⚙","#7b42bc","~1h","Remote state S3+lock, workspace vs separate dirs, import existing resources, state rm, refresh.","terraform,state","intermediate"),
  P("rl-pulumi","Pulumi IaC","◈","#8a3391","~1-2h","Pulumi с TypeScript/Python: stacks, config, secrets, import, convert from TF.","pulumi,iac","intermediate"),
  P("rl-ansible-playbook","Ansible Playbooks","⎈","#ee0000","~1-2h","Inventory, playbooks, roles, handlers, vars, vault for secrets, molecule testing.","ansible,config","intermediate"),
  P("rl-packer","Packer AMI/Images","⎈","#02a8ef","~1h","Packer build AMI/Docker/QEMU, provisioners (shell/ansible), variables, builders.","packer,images","intermediate"),
  P("rl-aws-vpc","AWS VPC Design","☁","#ff9900","~1-2h","VPC CIDR, public/private subnets, NAT gateway, IGW, route tables, VPC peering/TGW, security groups.","aws,vpc,networking","intermediate"),
  P("rl-aws-ecs","AWS ECS Fargate","☁","#ff9900","~2h","Task definition, service, ALB, autoscale, ECR, CloudWatch logs, IAM task role.","aws,ecs,fargate","intermediate"),
  P("rl-aws-lambda","AWS Lambda","☁","#ff9900","~1h","Lambda function, layers, env vars, VPC config, triggers (API Gateway/S3/SQS), monitoring.","aws,lambda,serverless","intermediate"),
  P("rl-aws-cloudfront","AWS CloudFront","☁","#ff9900","~1h","Distribution, origins, cache behaviors, Lambda@Edge, signed URLs, WAF.","aws,cloudfront,cdn","intermediate"),
  P("rl-aws-s3-static","S3 Static Website","☁","#ff9900","~45m","Bucket + website hosting, CloudFront OAC, deployment (sync), cache invalidation.","aws,s3,static","beginner"),
  P("rl-aws-iam","AWS IAM Best Practices","⚿","#ff9900","~1h","Principle of least privilege, roles vs users, MFA, trust policies, permission boundaries, Access Analyzer.","aws,iam,security","intermediate"),
  P("rl-aws-cloudwatch","CloudWatch Alarms","◈","#ff9900","~45m","Metric alarms, composite alarms, anomaly detection, SNS notifications, dashboards.","aws,cloudwatch","intermediate"),
  P("rl-aws-step-functions","AWS Step Functions","⇶","#ff9900","~1-2h","State machines, ASL, integrations (Lambda/SQS), parallel/map states, error handling.","aws,stepfunctions","intermediate"),
  P("rl-gcp-gke","GCP GKE Setup","⎈","#4285f4","~1-2h","Autopilot vs Standard, node pools, Workload Identity, Anthos, multi-cluster.","gcp,gke,kubernetes","intermediate"),
  P("rl-gcp-cloudrun","Cloud Run Serverless","⎔","#4285f4","~1h","Stateless containers, scaling to zero, traffic split, CPU allocation, WebSocket.","gcp,cloudrun,serverless","intermediate"),
  P("rl-gcp-pubsub","GCP Pub/Sub","⇨","#4285f4","~1h","Topic/subscription, push vs pull, ordering keys, dead letter, schemas.","gcp,pubsub","intermediate"),
  P("rl-azure-aks","Azure AKS","⎈","#0089d6","~1-2h","AKS cluster, AAD integration, ACR, Azure Monitor, ingress options.","azure,aks","intermediate"),
  P("rl-cf-workers","Cloudflare Workers","⎔","#f38020","~1h","Workers: wrangler, KV/D1/R2/Durable Objects, Cron Triggers, Workers AI.","cloudflare,workers","intermediate"),
  P("rl-cf-pages","Cloudflare Pages","◆","#f38020","~45m","Pages deployment, preview branches, Functions, _headers/_redirects, bindings.","cloudflare,pages","beginner"),
  P("rl-cf-r2","Cloudflare R2","⊕","#f38020","~30m","R2 object storage, S3-compatible, zero egress fees, presigned URLs.","cloudflare,r2","beginner"),
  P("rl-cf-tunnels","Cloudflare Tunnels","⇆","#f38020","~45m","cloudflared tunnel, expose local services, zero-trust access, WARP.","cloudflare,tunnels","intermediate"),
  P("rl-gh-actions","GitHub Actions Advanced","⎈","#2088ff","~1-2h","Reusable workflows, composite actions, matrix, environments, approvals, OIDC.","github-actions,ci","intermediate"),
  P("rl-gitlab-ci","GitLab CI/CD","⎈","#fc6d26","~1-2h",".gitlab-ci.yml stages, rules, needs (DAG), parallel, includes, CI/CD variables, review apps.","gitlab-ci","intermediate"),
  P("rl-jenkins","Jenkins Pipeline","⎈","#d33833","~1-2h","Jenkinsfile declarative, stages, agents, credentials, shared libraries, multibranch.","jenkins,ci","intermediate"),
  P("rl-circleci","CircleCI Config","⎈","#343434","~1h","config.yml, workflows, orbs, caches, parallelism, contexts.","circleci,ci","intermediate"),
  P("rl-drone-ci","Drone CI","⎈","#212121","~1h","Drone pipelines, plugins, secrets, services, matrix.","drone,ci","intermediate"),
  P("rl-ci-cache","CI Build Cache","◈","#10b981","~45m","Cache node_modules/gems/pip, Docker layer cache, Turbo remote cache, sccache.","ci,cache,performance","intermediate"),
);

// MESSAGING / QUEUES (20)
add.push(
  P("rl-kafka-producer","Kafka Producer Patterns","⇨","#231f20","~1h","Acks, idempotence, transactions, compression, partitioner, batching, error handling.","kafka,producer","intermediate"),
  P("rl-kafka-consumer","Kafka Consumer Patterns","⇦","#231f20","~1h","Consumer group, offsets, rebalance, seek, at-least-once vs exactly-once, error DLQ.","kafka,consumer","intermediate"),
  P("rl-kafka-streams","Kafka Streams","⇶","#231f20","~1-2h","KStream/KTable, aggregations, joins, windowing, state stores, interactive queries.","kafka-streams","advanced"),
  P("rl-kafka-connect","Kafka Connect","⇆","#231f20","~1h","Connectors (source/sink), converters, SMTs, Debezium, distributed mode.","kafka,connect","intermediate"),
  P("rl-rabbitmq","RabbitMQ Setup","⎔","#ff6600","~1h","Exchanges (direct/topic/fanout/headers), queues, bindings, acks, DLQ, TTL.","rabbitmq,amqp","intermediate"),
  P("rl-nats","NATS Messaging","⇶","#27aae1","~1h","NATS Core, JetStream (streams/consumers), request-reply, queue groups, KV/Object Store.","nats,messaging","intermediate"),
  P("rl-sqs-sns","AWS SQS + SNS","⇨","#ff9900","~1h","Fan-out SNS→SQS, DLQ, message retention, visibility timeout, FIFO vs standard.","aws,sqs,sns","intermediate"),
  P("rl-eventbridge","AWS EventBridge","⇶","#ff9900","~1h","Event buses, rules, targets, schema registry, cross-account, scheduled events.","aws,eventbridge","intermediate"),
  P("rl-bullmq","BullMQ Jobs","⎔","#dc382d","~1h","BullMQ: queue, worker, repeatable jobs, flow, priorities, rate limit, events, UI.","bullmq,redis,queues","intermediate"),
  P("rl-celery","Celery Tasks","⎔","#37814a","~1-2h","Celery: broker (Redis/RabbitMQ), tasks, chains/groups/chords, beat scheduler, Flower.","celery,python,queues","intermediate"),
  P("rl-sidekiq","Sidekiq Ruby","⎔","#b23525","~1h","Sidekiq: workers, concurrency, retries, unique jobs, cron jobs, enterprise features.","sidekiq,ruby","intermediate"),
  P("rl-temporal","Temporal Workflows","⇶","#000000","~2h","Temporal: workflows, activities, signals, queries, timers, cron. SDKs для Go/Java/TS/Python.","temporal,durable","advanced"),
  P("rl-cron-job-robust","Robust Cron Jobs","⚙","#10b981","~45m","Locking (no overlap), timeout, retry, logging, idempotency, observability.","cron,scheduling","intermediate"),
  P("rl-scheduled-tasks","Scheduled Tasks","⚙","#10b981","~45m","Per-framework scheduling: node-cron, APScheduler, Whenever (Rails), Spring @Scheduled.","scheduling,cron","intermediate"),
  P("rl-redis-streams","Redis Streams","⇶","#dc382d","~1h","XADD, XREAD, XREADGROUP, consumer groups, pending list, acknowledgments, trimming.","redis,streams","intermediate"),
  P("rl-mq-patterns","Messaging Patterns","◈","#10b981","~1h","Competing consumers, publish-subscribe, request-reply, priority queue, routing slip, scatter-gather.","messaging,patterns","intermediate"),
  P("rl-exactly-once","Exactly-Once Delivery","⎃","#10b981","~1h","Idempotent consumer, outbox pattern, transactional outbox, deduplication store, Kafka EOS.","messaging,exactly-once","advanced"),
  P("rl-dlq","Dead Letter Queue","☠","#dc3545","~45m","DLQ design, retry budget, alert thresholds, manual replay, analysis dashboard.","dlq,messaging","intermediate"),
  P("rl-backpressure","Backpressure Handling","⎚","#10b981","~45m","Bounded queues, 429 responses, circuit breaker, rate limit at source, load shedding.","backpressure,reliability","intermediate"),
  P("rl-event-ordering","Event Ordering Guarantees","⇶","#10b981","~45m","Partition keys, single producer per partition, timestamps, vector clocks, total order.","events,ordering","advanced"),
);

// CACHING / PERFORMANCE / RELIABILITY (30)
add.push(
  P("rl-cache-strategies","Caching Strategies","◈","#dc382d","~45m","Cache-aside, read-through, write-through, write-behind, refresh-ahead. Trade-offs.","cache,patterns","intermediate"),
  P("rl-cache-invalidation","Cache Invalidation","⌫","#dc382d","~45m","TTL, event-based invalidation, tag-based (Fastly surrogate keys), stampede prevention.","cache,invalidation","intermediate"),
  P("rl-cdn-strategies","CDN Strategies","⎔","#f38020","~45m","Static vs dynamic caching, cache-control headers, stale-while-revalidate, bypass rules.","cdn,cache","intermediate"),
  P("rl-http-cache","HTTP Caching Deep","⇄","#10b981","~45m","Cache-Control, ETag/If-None-Match, Last-Modified, Vary, stale-while-revalidate, immutable.","http,cache","intermediate"),
  P("rl-edge-cache","Edge Caching","⎚","#f38020","~45m","Cloudflare cache rules, Vercel edge cache, regional caching, cache purge API.","edge,cache","intermediate"),
  P("rl-db-query-cache","DB Query Cache","⎈","#10b981","~45m","Redis/Memcached перед DB, cache-aside с TTL, hit rate metric, jittered TTL.","cache,database","intermediate"),
  P("rl-cache-stampede","Cache Stampede Prevention","⎚","#dc382d","~30m","Singleflight/dogpile, probabilistic early expiration, lock-based refresh, stale-while-revalidate.","cache,stampede","advanced"),
  P("rl-perf-profiling","Performance Profiling","⎈","#ef4444","~1h","Node.js: clinic/0x. Python: py-spy/scalene. Go: pprof. JVM: async-profiler. Flamegraphs.","performance,profiling","advanced"),
  P("rl-memory-profiling","Memory Profiling","⎄","#ef4444","~1h","Heap snapshots (Node/Chrome), memray (Python), jmap (JVM). Detect leaks (3-snapshot).","memory,profiling","advanced"),
  P("rl-db-n-plus-one","N+1 Query Fix","◎","#10b981","~45m","Detect через monitor (django-debug-toolbar, Bullet, Laravel telescope). Fix: eager load, join, DataLoader.","orm,n-plus-one","intermediate"),
  P("rl-db-slow-queries","Slow Query Analysis","⎈","#10b981","~1h","pg_stat_statements, slow query log, EXPLAIN (ANALYZE, BUFFERS), index usage, query plan.","database,performance","intermediate"),
  P("rl-load-test-k6","Load Testing (k6)","⎚","#7d64ff","~1-2h","k6 scripts, VUs, stages, thresholds, scenarios, cloud/OSS, Grafana output.","load-testing,k6","intermediate"),
  P("rl-load-test-locust","Load Testing (Locust)","⎚","#10b981","~1h","Locust Python, users/tasks, ramp up, distributed mode, dashboard.","load-testing,locust","intermediate"),
  P("rl-circuit-breaker-impl","Circuit Breaker Implementation","⎔","#ef4444","~45m","States (closed/open/half-open), thresholds, timeout, fallback. Libs: opossum/resilience4j/polly.","resilience,circuit-breaker","intermediate"),
  P("rl-bulkhead-impl","Bulkhead Implementation","⎔","#ef4444","~45m","Thread pool isolation, connection pool limits, semaphores, separate deployments.","resilience,bulkhead","intermediate"),
  P("rl-graceful-shutdown","Graceful Shutdown","⎄","#10b981","~45m","SIGTERM handling, drain connections, finish in-flight jobs, close DB/Redis, K8s terminationGracePeriodSeconds.","shutdown,reliability","intermediate"),
  P("rl-health-checks","Health Checks","❤","#10b981","~45m","Liveness vs readiness vs startup probes, deep vs shallow, dependencies check, timeouts.","health,k8s","intermediate"),
  P("rl-timeouts","Timeout Strategy","⎄","#10b981","~45m","Client/server timeouts, connect/read/write/total, propagation, budgets, deadline headers.","timeouts,reliability","intermediate"),
  P("rl-retry-budget","Retry Budget","⟲","#10b981","~30m","Token bucket for retries, prevent retry storm, exponential backoff + jitter, circuit breaker.","retry,budget","intermediate"),
  P("rl-idempotency","Idempotency Deep","◎","#10b981","~45m","Idempotency keys, storage TTL, hash check, concurrent requests handling, consistency.","idempotency,api","intermediate"),
  P("rl-distributed-lock","Distributed Locks","⚿","#dc382d","~1h","Redlock pitfalls, ZooKeeper/etcd locks, fencing tokens, lease duration.","locking,distributed","advanced"),
  P("rl-saga-choreography","Saga Choreography","⇶","#10b981","~1-2h","Event-driven saga, services publish/subscribe, no central coordinator, compensating events.","saga,events","advanced"),
  P("rl-consistency-patterns","Consistency Patterns","⎈","#10b981","~1h","Eventual, read-your-writes, monotonic reads, causal, strong. Use cases per.","consistency,distributed","advanced"),
  P("rl-leader-election","Leader Election","⚑","#10b981","~1h","etcd/ZooKeeper lock, K8s lease object, Raft implementation understanding.","leader-election,distributed","advanced"),
  P("rl-gossip-protocol","Gossip Protocols","⇶","#10b981","~1h","SWIM, membership, failure detection, used in Consul/Cassandra/Serf.","gossip,distributed","advanced"),
  P("rl-crdt","CRDTs Intro","◆","#10b981","~1-2h","G-Counter, PN-Counter, G-Set, OR-Set, LWW, Y.js/Automerge для collab editing.","crdt,distributed","advanced"),
  P("rl-raft","Raft Consensus","⚑","#10b981","~1-2h","Leader election, log replication, safety, используется в etcd/Consul/CockroachDB.","raft,consensus","advanced"),
  P("rl-gossipsub","libp2p GossipSub","⇶","#10b981","~1h","P2P pubsub, mesh, score, mitigation spam, Ethereum/Filecoin usage.","p2p,pubsub","advanced"),
  P("rl-blue-green-deep","Blue-Green Advanced","◉","#10b981","~45m","Traffic switching ALB target groups, DB compatibility (dual-write), rollback instant.","deployment,blue-green","intermediate"),
  P("rl-feature-flags-adv","Feature Flags Advanced","⚑","#10b981","~1h","Multi-variant, targeting rules, gradual rollout, kill switch, dependency (flag ↔ flag).","feature-flags","intermediate"),
);

add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
if (toAdd.length !== add.length) console.error('Dup:', add.filter(p=>existingIds.has(p.id)).map(p=>p.id));
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, 'prompts. Total:', data.P.length);
