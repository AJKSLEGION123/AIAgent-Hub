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

// E-COMMERCE — 30
add.push(
  P("fd-ecom-product","Product Catalog","🛍","#10b981","~2h","Products grid: filters (category/price/brand), sort, search, faceted filters, pagination, SEO.","ecommerce,catalog","intermediate"),
  P("fd-ecom-pdp","Product Detail Page","◈","#10b981","~1-2h","PDP: gallery, variants (size/color), reviews, Q&A, recommendations, schema.org Product.","ecommerce,pdp","intermediate"),
  P("fd-ecom-cart","Shopping Cart","🛒","#10b981","~1-2h","Cart: add/update/remove, persistent (localStorage + DB sync), coupon, tax/shipping estimate.","ecommerce,cart","intermediate"),
  P("fd-ecom-checkout","Checkout Flow","◈","#10b981","~2-3h","Multi-step checkout: shipping, payment, review. Guest checkout, address validation, saved methods.","ecommerce,checkout","advanced"),
  P("fd-ecom-stripe","Stripe Integration","💳","#635bff","~1-2h","Stripe Checkout / Elements / Payment Intents, webhooks, SCA (3DS), dispute handling.","stripe,payments","intermediate"),
  P("fd-ecom-stripe-sub","Stripe Subscriptions","💳","#635bff","~2h","Stripe Billing: products/prices, subscription states, webhooks (renewal/cancel), usage-based, proration.","stripe,subscriptions","intermediate"),
  P("fd-ecom-paypal","PayPal Integration","💳","#003087","~1h","PayPal SDK, checkout, Smart Buttons, IPN/webhooks, dispute handling.","paypal,payments","intermediate"),
  P("fd-ecom-crypto","Crypto Payments","₿","#f7931a","~1h","BitPay, Coinbase Commerce, Web3 wallet (MetaMask), confirmations, exchange rate.","crypto,payments","advanced"),
  P("fd-ecom-tax","Tax Calculation","📜","#10b981","~1h","TaxJar / Stripe Tax / Avalara integration, VAT handling, nexus rules, invoices compliance.","tax,ecommerce","intermediate"),
  P("fd-ecom-shipping","Shipping Rates","📦","#10b981","~1h","ShipEngine / EasyPost, real-time rates (UPS/USPS/FedEx), zones, free shipping rules.","shipping,ecommerce","intermediate"),
  P("fd-ecom-inventory","Inventory Management","📦","#10b981","~1-2h","Stock tracking, reservations (in cart), oversell prevention, low-stock alerts, multi-warehouse.","inventory","intermediate"),
  P("fd-ecom-orders","Order Management","◎","#10b981","~1-2h","Order states (pending/paid/shipped/delivered/refunded), admin UI, bulk actions, search.","ecommerce,orders","intermediate"),
  P("fd-ecom-refund","Refund Flow","⟲","#10b981","~1h","Partial/full refunds, restock, tax refund, Stripe refund API, customer notification.","ecommerce,refunds","intermediate"),
  P("fd-ecom-reviews","Product Reviews","⭐","#10b981","~1-2h","Star rating, verified purchase, photos/videos, moderation, helpful votes, filter.","reviews,ecommerce","intermediate"),
  P("fd-ecom-wishlist","Wishlist","❤","#10b981","~45m","Add/remove, sharing (public URL), notify price drop, move to cart.","wishlist,ecommerce","beginner"),
  P("fd-ecom-coupons","Coupon System","🎟","#10b981","~1h","Types (percent/fixed/BOGO), conditions, codes generation, usage limits, expiry.","coupons,ecommerce","intermediate"),
  P("fd-ecom-gift-card","Gift Cards","🎁","#10b981","~1h","Purchase, send by email, redeem, balance, partial use, expiry, fraud prevention.","gift-cards,ecommerce","intermediate"),
  P("fd-ecom-loyalty","Loyalty Program","🏆","#10b981","~1-2h","Points earning/redemption, tiers (bronze/silver/gold), rewards catalog, referral.","loyalty,ecommerce","intermediate"),
  P("fd-ecom-abandoned","Abandoned Cart Recovery","📧","#10b981","~1h","Detect abandonment, email sequence (1h/24h/72h), discount offer, analytics.","cart,email","intermediate"),
  P("fd-ecom-recommend","Product Recommendations","◈","#10b981","~1-2h","Collaborative filtering, related items, recently viewed, bought together, AI-powered.","recommendations,ml","intermediate"),
  P("fd-ecom-search","Product Search (Algolia)","⌕","#10b981","~1h","Algolia/Meilisearch/Typesense: instant search, typo-tolerance, facets, synonyms.","search,algolia","intermediate"),
  P("fd-ecom-shopify","Shopify Integration","🛍","#96bf48","~1-2h","Shopify API: products, orders, customers, webhooks, GraphQL Admin API, themes.","shopify,ecommerce","intermediate"),
  P("fd-ecom-medusa","Medusa.js Backend","🛍","#10b981","~2h","Medusa v2: products/orders/customers, plugins, Admin UI, headless ecommerce.","medusa,headless","intermediate"),
  P("fd-ecom-swell","Swell Ecommerce","🛍","#10b981","~1h","Swell.is API, products, carts, checkout, webhooks, storefront SDK.","swell,headless","intermediate"),
  P("fd-ecom-multi-currency","Multi-Currency","💱","#10b981","~1h","Currency detection (geolocation), conversion rates (ECB/fixer.io), display/storage.","currency,ecommerce","intermediate"),
  P("fd-ecom-b2b","B2B Commerce","⎈","#10b981","~2h","Company accounts, approval workflows, custom pricing, net terms, quotes, PO.","b2b,ecommerce","advanced"),
  P("fd-ecom-marketplace","Marketplace (multi-vendor)","◈","#10b981","~3h","Vendor onboarding, split payments (Stripe Connect), commission, vendor dashboards.","marketplace","advanced"),
  P("fd-ecom-pim","PIM Setup","◈","#10b981","~1-2h","Product Information Management: attributes, variants, channels, translations, assets.","pim,ecommerce","intermediate"),
  P("fd-ecom-analytics","Ecom Analytics","◈","#10b981","~1h","GA4 Enhanced Ecommerce, Mixpanel funnels, Pinterest/Meta pixel, server-side tracking.","analytics,ecommerce","intermediate"),
  P("fd-ecom-a-b-pricing","Price A/B Testing","◈","#10b981","~1h","Test different prices: cohort splitting, statistical significance, revenue metrics.","ab-testing,pricing","advanced"),
);

// SAAS PATTERNS — 25
add.push(
  P("fd-saas-signup","SaaS Signup Flow","◎","#8b5cf6","~1h","Email + password/Google, email verification, onboarding redirect, first-org creation.","saas,onboarding","intermediate"),
  P("fd-saas-multi-tenant","Multi-Tenancy","🏢","#8b5cf6","~2h","Row-level (tenant_id), schema-per-tenant, database-per-tenant. Trade-offs.","multi-tenant,saas","advanced"),
  P("fd-saas-org","Organization Management","🏢","#8b5cf6","~1-2h","Orgs/workspaces, members, roles (owner/admin/member), invites, transfers.","org,saas","intermediate"),
  P("fd-saas-invite","Invite System","✉","#8b5cf6","~1h","Email invite, token link, role assignment, expiry, resend, bulk invite.","invites,saas","intermediate"),
  P("fd-saas-billing","SaaS Billing","💳","#8b5cf6","~2-3h","Plans, seats, usage-based, metered billing, Stripe Billing / Paddle, invoice.","billing,saas","advanced"),
  P("fd-saas-paddle","Paddle Integration","💳","#000000","~1-2h","Paddle Classic/Billing, webhooks, merchant-of-record (tax handled), subscription states.","paddle,payments","intermediate"),
  P("fd-saas-lemon","LemonSqueezy","🍋","#ffc233","~1-2h","LemonSqueezy: products, variants, checkout, license keys, usage-based, webhooks.","lemonsqueezy,payments","intermediate"),
  P("fd-saas-plan-limits","Plan Limits Enforcement","⚿","#8b5cf6","~1h","Feature flags per plan, usage counters, Redis INCR + check, upgrade prompts.","saas,limits","intermediate"),
  P("fd-saas-trial","Free Trial","🎁","#8b5cf6","~45m","14-day trial, no credit card, reminder emails, conversion tracking, expiry enforcement.","trial,saas","intermediate"),
  P("fd-saas-upgrade","Upgrade/Downgrade","⇶","#8b5cf6","~1h","Stripe proration, immediate vs end-of-period, feature lockdown on downgrade.","saas,billing","intermediate"),
  P("fd-saas-cancel","Cancellation Flow","◈","#8b5cf6","~45m","Retention surveys, offer discount, downgrade alternative, confirm, data retention policy.","saas,churn","intermediate"),
  P("fd-saas-affiliate","Affiliate Program","🎯","#8b5cf6","~1-2h","Affiliate signup, referral links, tracking, commissions, payouts (Stripe Connect).","affiliate,saas","intermediate"),
  P("fd-saas-white-label","White Label","🎨","#8b5cf6","~2h","Custom domain, logo/color branding, templates, CSS vars, subdomain routing.","white-label,saas","advanced"),
  P("fd-saas-audit","SaaS Audit Log","📝","#8b5cf6","~1h","User/org actions, who/what/when, filtering UI, export CSV, retention policy.","audit,saas","intermediate"),
  P("fd-saas-sso-enterprise","Enterprise SSO","⚿","#8b5cf6","~2h","SAML/OIDC per org (Okta/Google/Azure), JIT provisioning, SCIM, WorkOS integration.","sso,saas","advanced"),
  P("fd-saas-scim","SCIM Provisioning","⇶","#8b5cf6","~1-2h","SCIM 2.0 users/groups endpoints, automatic provisioning/deprovisioning, Azure AD integration.","scim,provisioning","advanced"),
  P("fd-saas-data-export","Data Export","⇩","#8b5cf6","~45m","Full export in JSON/CSV, async generation, signed URL download, GDPR compliance.","export,saas","intermediate"),
  P("fd-saas-data-import","Data Import","⇧","#8b5cf6","~1h","CSV upload, preview, mapping columns, validation, background processing, progress UI.","import,saas","intermediate"),
  P("fd-saas-api-keys","API Key Management","⚿","#8b5cf6","~1h","Generate/revoke keys, last-used tracking, IP restrictions, scopes, hashed storage.","api-keys,saas","intermediate"),
  P("fd-saas-webhook-mgmt","Webhook Management UI","⎘","#8b5cf6","~1h","User-configured webhooks, endpoint test, event selection, delivery log, replay.","webhooks,saas","intermediate"),
  P("fd-saas-activity","Activity Feed","🕒","#8b5cf6","~1h","Team activity stream, filter by user/type, real-time updates, notifications.","activity,saas","intermediate"),
  P("fd-saas-kb","Knowledge Base","📚","#8b5cf6","~1-2h","Categories, search, SEO, feedback (yes/no), version history, analytics.","kb,docs","intermediate"),
  P("fd-saas-changelog","Product Changelog","📋","#8b5cf6","~45m","Version entries, categories (feature/fix/breaking), RSS feed, email subscribers.","changelog,saas","beginner"),
  P("fd-saas-roadmap","Public Roadmap","⎚","#8b5cf6","~1h","Cards (planned/in-progress/shipped), voting, comments, Canny.io alternative.","roadmap,feedback","intermediate"),
  P("fd-saas-feedback-widget","Feedback Widget","◈","#8b5cf6","~45m","In-app widget: bug/feature request, screenshot attach, repro steps, webhook to tracker.","feedback,widget","intermediate"),
);

// ANALYTICS — 20
add.push(
  P("fd-analytics-ga4","Google Analytics 4","◈","#ff9800","~1h","GA4 setup, events model, enhanced measurement, Data Streams, BigQuery export.","ga4,analytics","intermediate"),
  P("fd-analytics-posthog","PostHog Setup","◈","#1d4aff","~1h","PostHog: events, feature flags, session recording, funnels, A/B tests, self-hosted/cloud.","posthog,analytics","intermediate"),
  P("fd-analytics-mixpanel","Mixpanel Setup","◈","#7856ff","~45m","Mixpanel events, user profiles, cohorts, funnels, retention, JQL.","mixpanel,analytics","intermediate"),
  P("fd-analytics-amplitude","Amplitude Setup","◈","#1e61f0","~45m","Amplitude events, user properties, behavioral cohorts, retention charts, Pathfinder.","amplitude,analytics","intermediate"),
  P("fd-analytics-plausible","Plausible (privacy)","◈","#5850ec","~30m","Plausible self-host/cloud, no cookies, event tracking, custom dimensions, GDPR-friendly.","plausible,privacy","beginner"),
  P("fd-analytics-umami","Umami Analytics","◈","#000000","~45m","Umami self-hosted, Postgres/MySQL, privacy-friendly, event tracking, embeds.","umami,analytics","intermediate"),
  P("fd-analytics-cloudflare","Cloudflare Analytics","◈","#f38020","~30m","Web Analytics, cookieless, zone analytics, Workers tracking.","cloudflare,analytics","beginner"),
  P("fd-funnel-analysis","Funnel Analysis","◈","#8b5cf6","~1h","Track conversion через multi-step funnel, drop-off per step, segmentation.","funnel,analytics","intermediate"),
  P("fd-cohort-analysis","Cohort Analysis","◈","#8b5cf6","~1h","Retention cohorts, weekly/monthly, heatmap visualization, segment comparison.","cohort,retention","intermediate"),
  P("fd-ab-test-framework","A/B Test Framework","◈","#8b5cf6","~1-2h","Experiment assignment (deterministic hash), metrics, CUPED variance reduction, sequential testing.","ab-test,experiments","advanced"),
  P("fd-feature-flag-split","Split.io Integration","⚑","#f6ac17","~1h","Split.io feature flags, targeting rules, treatments, metrics monitoring.","split,feature-flags","intermediate"),
  P("fd-launchdarkly","LaunchDarkly","⚑","#405bff","~1h","LaunchDarkly flags, segments, variations, prerequisites, experimentation.","launchdarkly","intermediate"),
  P("fd-growthbook","GrowthBook","⚑","#6366f1","~45m","GrowthBook OSS, feature flags + A/B tests, visual editor, Bayesian stats.","growthbook,feature-flags","intermediate"),
  P("fd-segment","Segment CDP","◈","#52bd95","~1h","Segment Sources/Destinations, tracking plan, Protocols (governance), Personas.","segment,cdp","intermediate"),
  P("fd-rudder","RudderStack CDP","◈","#de286f","~1h","RudderStack OSS CDP, sources/destinations, transformations, self-host.","rudderstack,cdp","intermediate"),
  P("fd-mx-metrics","Business Metrics Dashboard","◈","#10b981","~1-2h","MRR/ARR, churn rate, LTV, CAC, NPS, DAU/MAU. Grafana/Metabase dashboards.","metrics,business","intermediate"),
  P("fd-event-schema","Event Schema Design","⎘","#10b981","~45m","Standardized event schema (object/action/context), naming conventions, evolution.","events,schema","intermediate"),
  P("fd-server-side-track","Server-Side Tracking","◈","#10b981","~1h","First-party tracking, ad blocker bypass, Conversion API (Meta), GTM server container.","tracking,server-side","intermediate"),
  P("fd-privacy-consent","Cookie Consent (GDPR)","🍪","#10b981","~1h","Consent banner, categories (necessary/analytics/marketing), opt-in первый, Consent Mode v2.","gdpr,cookies","intermediate"),
  P("fd-consent-mode","Google Consent Mode v2","◈","#4285f4","~45m","ads_user_data, ads_personalization, analytics_storage, ad_storage consent types.","consent-mode,gdpr","intermediate"),
);

// CMS / CONTENT — 20
add.push(
  P("fd-cms-sanity","Sanity.io Setup","◆","#f03e2f","~1-2h","Sanity Studio v3, schemas, references, localized fields, Portable Text, preview, CDN.","sanity,cms","intermediate"),
  P("fd-cms-contentful","Contentful Setup","◆","#2478cc","~1h","Contentful: content models, references, locales, webhooks, CDA vs CPA, Delivery API.","contentful,cms","intermediate"),
  P("fd-cms-strapi","Strapi CMS","◆","#4945ff","~1-2h","Strapi v5: content types builder, plugins, roles, media library, i18n, self-hosted.","strapi,cms","intermediate"),
  P("fd-cms-payload","Payload CMS","◆","#000000","~1-2h","Payload 3 (Next.js-native): collections, globals, access control, admin UI, TypeScript.","payload,cms","intermediate"),
  P("fd-cms-directus","Directus CMS","◆","#263238","~1-2h","Directus: database-first CMS, REST/GraphQL auto, flows, extensions.","directus,cms","intermediate"),
  P("fd-cms-keystatic","Keystatic (git-based)","◆","#000000","~1h","Keystatic: git-based CMS, GitHub storage, Next.js/Astro, markdown collections.","keystatic,cms","intermediate"),
  P("fd-cms-ghost","Ghost Blog","◆","#15171a","~1h","Ghost CMS: themes, members/subscriptions, newsletters, API, migration.","ghost,cms","intermediate"),
  P("fd-cms-hashnode","Hashnode Headless","◆","#2962ff","~45m","Hashnode API: posts, series, newsletters, custom domain, SEO.","hashnode,blog","beginner"),
  P("fd-cms-notion","Notion as CMS","◆","#000000","~1h","Notion API: databases queries, blocks, publishing pipeline, caching, static generation.","notion,cms","intermediate"),
  P("fd-cms-markdown","Markdown Content Pipeline","◆","#10b981","~1h","Markdown files + MDX, frontmatter, remark/rehype plugins, code highlight, TOC.","markdown,mdx","intermediate"),
  P("fd-content-taxonomy","Content Taxonomy","◈","#10b981","~45m","Categories, tags, series, authors, facets, hierarchy, SEO-friendly URLs.","taxonomy,content","intermediate"),
  P("fd-content-versioning","Content Versioning","◇","#10b981","~1h","Draft/published/scheduled, revision history, diff, restore, review workflow.","versioning,content","intermediate"),
  P("fd-media-upload","Media Upload Pipeline","⇧","#10b981","~1-2h","Direct-to-S3 presigned URL, multipart upload, image processing (Sharp/ImageMagick), thumbnails.","media,upload","intermediate"),
  P("fd-image-resize","On-Demand Image Resize","◐","#10b981","~1h","imgproxy / Cloudinary / Cloudflare Images / Vercel Image Optimization. Formats, sizes, WebP/AVIF.","images,resize","intermediate"),
  P("fd-video-transcoding","Video Transcoding","▷","#10b981","~1-2h","AWS MediaConvert / Mux / Cloudflare Stream, HLS/DASH output, thumbnails, captions.","video,transcoding","advanced"),
  P("fd-audio-transcription","Audio Transcription","🎙","#10b981","~1h","Whisper API, diarization, timestamps, SRT/VTT output, searchable transcripts.","audio,transcription","intermediate"),
  P("fd-comments-system","Comments System","💬","#10b981","~1-2h","Threaded comments, moderation, mentions (@user), reactions, sort (newest/popular).","comments,social","intermediate"),
  P("fd-moderation","Content Moderation","⚠","#10b981","~1h","Auto (OpenAI Moderation, Perspective API) + manual queue, user reports, trust scores.","moderation,safety","intermediate"),
  P("fd-spam-protection","Spam Protection","🚫","#10b981","~45m","reCAPTCHA v3, Cloudflare Turnstile, honeypot, rate limit, Akismet.","spam,security","beginner"),
  P("fd-full-text-search","Full-Text Search","⌕","#10b981","~1h","PostgreSQL tsvector + GIN, или Meilisearch/Typesense/Algolia, sync pipeline, faceted.","search,fts","intermediate"),
);

// AUTH / IDENTITY — 15
add.push(
  P("fd-auth-clerk","Clerk Auth","⚿","#000000","~1h","Clerk setup, sign-in/up components, organization support, webhooks, middleware.","clerk,auth","intermediate"),
  P("fd-auth-supabase","Supabase Auth","⚿","#3ecf8e","~45m","Supabase Auth: email/OAuth/magic link, RLS integration, server-side session.","supabase,auth","intermediate"),
  P("fd-auth-workos","WorkOS Auth","⚿","#6363f1","~1h","WorkOS AuthKit, SSO, Directory Sync (SCIM), Admin Portal, FGA.","workos,auth","intermediate"),
  P("fd-auth-kinde","Kinde Auth","⚿","#36a173","~45m","Kinde setup, orgs, feature flags, billing integration, roles.","kinde,auth","intermediate"),
  P("fd-auth-firebase","Firebase Auth","⚿","#ffca28","~45m","Firebase Auth providers, custom claims, security rules integration, email templates.","firebase,auth","intermediate"),
  P("fd-auth-ory","Ory Kratos/Hydra","⚿","#5528ff","~1-2h","Ory OSS stack: Kratos (identity), Hydra (OAuth2), Keto (permissions), Oathkeeper (gateway).","ory,auth","advanced"),
  P("fd-auth-keycloak","Keycloak Setup","⚿","#4d4d4d","~1-2h","Keycloak realms, clients, users, roles, identity providers, themes customization.","keycloak,auth","advanced"),
  P("fd-auth-lucia","Lucia Auth","⚿","#5793f3","~45m","Lucia v3 sessions, adapters (Drizzle/Prisma), password auth, OAuth2 core.","lucia,auth","intermediate"),
  P("fd-auth-better-auth","Better Auth","⚿","#000000","~45m","Better Auth: TypeScript-first, OAuth, email, 2FA, organizations, plugins.","better-auth","intermediate"),
  P("fd-auth-hanko","Hanko Passkeys","🔑","#0ea5e9","~1h","Hanko OSS auth with passwordless + passkeys primary, email verification, elements.","hanko,passkeys","intermediate"),
  P("fd-impersonation","User Impersonation","👤","#dc2626","~45m","Admin login-as-user для support, audit log, session marker, exit impersonation.","impersonation,admin","intermediate"),
  P("fd-session-mgmt","Session Management UI","◈","#dc2626","~45m","Active sessions list, device info, location, revoke specific/all, last seen.","sessions,security","intermediate"),
  P("fd-password-reset","Password Reset Flow","🔑","#dc2626","~45m","Token-based, TTL, one-use, email enumeration protection, rate limit, success confirmation.","password-reset,auth","beginner"),
  P("fd-email-verify","Email Verification","✉","#dc2626","~30m","Signup + verification email, token, click-to-verify, resend, expiry.","email,verification","beginner"),
  P("fd-account-recovery","Account Recovery","🔑","#dc2626","~1h","Recovery codes, security questions (avoid), trusted contacts, support flow.","recovery,auth","intermediate"),
);

// COMMUNICATION — 20
add.push(
  P("fd-email-resend","Resend Email API","✉","#000000","~45m","Resend API, React Email templates, domains, webhooks (delivered/bounced/clicked).","resend,email","beginner"),
  P("fd-email-sendgrid","SendGrid Setup","✉","#1a82e2","~1h","SendGrid API, dynamic templates, suppressions, webhooks, deliverability.","sendgrid,email","intermediate"),
  P("fd-email-ses","AWS SES","✉","#ff9900","~1h","SES: verified identities, sending reputation, SES v2 API, bounce/complaint handling.","aws,ses,email","intermediate"),
  P("fd-email-postmark","Postmark Transactional","✉","#ffcc00","~45m","Postmark: transactional-only, templates, streams, bounce/spam webhooks, message events.","postmark,email","intermediate"),
  P("fd-email-mailgun","Mailgun Setup","✉","#c0204a","~1h","Mailgun API, domains, routes, webhooks, EU region, suppressions.","mailgun,email","intermediate"),
  P("fd-email-reactemail","React Email Templates","✉","#000000","~1h","React Email components, preview, export HTML, compatibility matrix, internationalization.","react-email,templates","intermediate"),
  P("fd-email-mjml","MJML Responsive Emails","✉","#000000","~1h","MJML markup, responsive по умолчанию, compile to HTML, MJML v5, i18n.","mjml,email","intermediate"),
  P("fd-email-deliverability","Email Deliverability","◈","#10b981","~1h","SPF, DKIM, DMARC, BIMI, warming up, bounce/complaint rate monitoring.","email,deliverability","intermediate"),
  P("fd-sms-twilio","Twilio SMS","📱","#f22f46","~1h","Twilio Programmable SMS, verify service (OTP), delivery receipts, country codes.","twilio,sms","intermediate"),
  P("fd-sms-vonage","Vonage SMS","📱","#871fff","~45m","Vonage SMS API, verification, number insight, receiving SMS.","vonage,sms","intermediate"),
  P("fd-sms-messagebird","MessageBird SMS","📱","#2481d7","~45m","MessageBird API, Verify, Conversations, WhatsApp Business API.","messagebird,sms","intermediate"),
  P("fd-push-expo","Expo Push","🔔","#000020","~45m","Expo Push API, push tokens, channels (Android), rich notifications, receipts.","expo,push","intermediate"),
  P("fd-push-fcm","FCM Push","🔔","#ffca28","~1h","FCM admin SDK, topic/token send, batch, error codes, APNs certificate/key.","fcm,push","intermediate"),
  P("fd-push-web","Web Push Notifications","🔔","#4285f4","~1h","Service Worker + Push Manager, VAPID keys, subscription management, payload.","web-push,pwa","intermediate"),
  P("fd-chat-messaging","In-App Messaging","💬","#10b981","~1-2h","Sendbird / Stream Chat / Pusher Chatkit или custom WebSocket: channels, typing, read receipts.","chat,messaging","intermediate"),
  P("fd-video-twilio","Twilio Video","📹","#f22f46","~1-2h","Twilio Video: rooms, tracks (audio/video/data), recordings, compositions.","twilio,video","intermediate"),
  P("fd-video-livekit","LiveKit Video","📹","#06d5b9","~1h","LiveKit WebRTC: rooms, participants, publish/subscribe tracks, egress.","livekit,webrtc","intermediate"),
  P("fd-video-daily","Daily.co Video","📹","#000000","~45m","Daily.co prebuilt UI или custom, rooms, recordings, streaming, Interactive Live Streams.","daily,webrtc","intermediate"),
  P("fd-video-agora","Agora Video","📹","#099dfd","~1h","Agora SDK: channels, tokens, recordings, cloud recording, broadcasting.","agora,webrtc","intermediate"),
  P("fd-support-crisp","Crisp Chat","💬","#1972f5","~30m","Crisp live chat widget, chatbots, knowledge base, integrations.","crisp,support","beginner"),
);

// DEV TOOLS / DX — 20
add.push(
  P("rl-dx-prettier","Prettier Config","◇","#f7b93e","~30m","Prettier 3: config, plugins (tailwindcss), prettierignore, CI check, pre-commit.","prettier,formatting","beginner"),
  P("rl-dx-eslint","ESLint Flat Config","◇","#4b32c3","~45m","ESLint 9 flat config, typescript-eslint, import sort, unused-imports, CI report.","eslint,linting","intermediate"),
  P("rl-dx-biome","Biome Linter","⎈","#60a5fa","~30m","Biome (замена ESLint+Prettier), biome check/format, LSP, ~10x faster.","biome,linting","intermediate"),
  P("rl-dx-husky","Husky Git Hooks","🐶","#000000","~30m","Husky 9 hooks, lint-staged, pre-commit, pre-push, commit-msg с commitlint.","husky,git","beginner"),
  P("rl-dx-commitlint","Conventional Commits","◎","#000000","~30m","commitlint + Conventional Commits, semantic-release, CHANGELOG.md generation.","commits,semver","intermediate"),
  P("rl-dx-typedoc","TypeDoc Documentation","📚","#3178c6","~45m","TypeDoc from JSDoc, themes, markdown output, CI publish.","typedoc,docs","intermediate"),
  P("rl-dx-docusaurus","Docusaurus Docs","📚","#25c2a0","~1h","Docusaurus 3: docs/blog, versioning, i18n, Algolia DocSearch, custom theme.","docusaurus,docs","intermediate"),
  P("rl-dx-mintlify","Mintlify Docs","📚","#000000","~45m","Mintlify docs hosting, openapi.json integration, API playground, search.","mintlify,docs","intermediate"),
  P("rl-dx-starlight","Astro Starlight","📚","#ff5d01","~1h","Starlight: sidebar, search (Pagefind), i18n, components, docs theme на Astro.","starlight,docs","intermediate"),
  P("rl-dx-readme","README Template","📖","#10b981","~30m","Badges, description, quickstart, usage, config, contributing, license, logo.","readme,docs","beginner"),
  P("rl-dx-contributing","CONTRIBUTING.md","◈","#10b981","~30m","Dev setup, branching strategy, PR template, commit convention, code of conduct.","docs,contributing","beginner"),
  P("rl-dx-codeowners","CODEOWNERS File","◈","#10b981","~20m","CODEOWNERS syntax, path patterns, team vs user, required reviews.","codeowners,github","beginner"),
  P("rl-dx-gh-templates","GitHub Templates","◈","#10b981","~30m","Issue templates (YAML форма), PR template, PULL_REQUEST_TEMPLATE, labels.","github,templates","beginner"),
  P("rl-dx-renovate","Renovate Config","◈","#10b981","~45m","renovate.json, package rules, schedule, automerge, grouping, Dependabot alternative.","renovate,deps","intermediate"),
  P("rl-dx-devcontainer","Dev Containers","🐳","#0078d4","~45m","devcontainer.json, features, VS Code integration, Docker-in-Docker, lifecycle scripts.","devcontainer,docker","intermediate"),
  P("rl-dx-gitpod","Gitpod Setup","🐙","#ff8a00","~30m",".gitpod.yml, workspaces, prebuilds, VS Code integration, ports.","gitpod","beginner"),
  P("rl-dx-codespaces","GitHub Codespaces","🐙","#000000","~30m","devcontainer.json + codespaces, port forwarding, secrets, dotfiles.","codespaces,github","beginner"),
  P("rl-dx-nix","Nix Dev Environments","◆","#5277c3","~1-2h","flake.nix, devShell, direnv integration, reproducible environments.","nix,reproducible","advanced"),
  P("rl-dx-mise","mise (asdf replacement)","⎈","#3b82f6","~30m","mise .tool-versions, python/node/ruby versions, tasks runner, env vars.","mise,asdf","beginner"),
  P("rl-dx-just","Just Command Runner","⎈","#a26be3","~30m","justfile recipes, dependencies, args, parameter parsing, cross-platform.","just,makefile","beginner"),
);

add.forEach(p => { p.compact = (p.text||"").slice(0,400); });
const existingIds = new Set(data.P.map(p=>p.id));
const toAdd = add.filter(p => !existingIds.has(p.id));
if (toAdd.length !== add.length) console.error('Dup:', add.filter(p=>existingIds.has(p.id)).map(p=>p.id));
data.P = [...data.P, ...toAdd];

const newZ = Buffer.from(deflateSync(Buffer.from(JSON.stringify(data)))).toString('base64');
fs.writeFileSync('src/App.jsx', src.replace(/const Z = "[^"]+"/, `const Z = "${newZ}"`));
console.log('✓ Added', toAdd.length, 'prompts. Total:', data.P.length);
