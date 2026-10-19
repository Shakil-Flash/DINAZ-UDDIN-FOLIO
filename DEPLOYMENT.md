# Production Deployment Guide — Dinaz Uddin Portfolio

**Target Platform:** Vercel (Optimized for Next.js App Router, React Server Components, and Turbopack)  
**Primary Domain:** `https://dinazuddin.dev`  
**Secondary Domain:** `https://www.dinazuddin.dev` (Configured with automatic 308 permanent redirect to apex)

---

## 1. Prerequisites

Before deploying to production, ensure you have:
- A GitHub repository with this codebase pushed to the `main` branch.
- A [Vercel account](https://vercel.com) linked to your GitHub account.
- Access to your domain registrar dashboard for `dinazuddin.dev`.
- A free [Resend account](https://resend.com) for production email transmission.
- *(Optional)* An [Upstash account](https://upstash.com) for distributed Redis rate limiting across multi-region serverless edges.
- *(Optional)* An OpenAI API key or compatible provider if enabling the live AI chat assistant.

---

## 2. Local Production Verification

Always run full local verification before pushing changes to production:

```bash
# 1. Verify zero type errors
npm run type-check

# 2. Verify ESLint compliance
npm run lint

# 3. Execute automated test suite (11+ unit & security tests)
npm test

# 4. Generate local production build
npm run build

# 5. Test production runtime locally
npm run start
```

Visit `http://localhost:3000` to verify:
- Prerendered homepage and case study loads instantly.
- Single-Line Diagram (SLD) Explorer and Star-Delta schematic respond to interaction.
- `/sitemap.xml` and `/robots.txt` render valid XML and text.
- Contact form validates fields and behaves gracefully in demonstration mode if keys are absent.

---

## 3. Vercel Repository Import & Deployment

1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository (`Dinaz-Uddin` or `dinaz-uddin-portfolio`).
4. In the **Configure Project** screen:
   - **Framework Preset**: `Next.js` (automatically detected).
   - **Root Directory**: `./`
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).
   - **Install Command**: `npm install` (default).
5. Expand the **Environment Variables** section and configure the variables detailed in Section 4.
6. Click **Deploy**. Vercel will build and assign an initial `*.vercel.app` preview URL.

---

## 4. Environment Variables Configuration

Configure these environment variables in **Vercel Dashboard > Project Settings > Environment Variables**:

| Variable Name | Required? | Exposed to Client? | Purpose & Recommended Value |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Recommended** | Yes (`NEXT_PUBLIC_`) | Canonical site origin: `https://dinazuddin.dev` |
| `RESEND_API_KEY` | Optional | **No (Server-Only)** | Resend API key (`re_...`). If omitted, contact form safely runs in demonstration mode (503). |
| `CONTACT_EMAIL_TO` | Optional | **No (Server-Only)** | Destination inbox: `contact@dinazuddin.dev` |
| `CONTACT_EMAIL_FROM` | Optional | **No (Server-Only)** | Verified sender: `Dinaz Portfolio <onboarding@resend.dev>` or custom domain sender once verified. |
| `AI_API_KEY` | Optional | **No (Server-Only)** | LLM API key. If omitted, AI assistant displays transparent offline notice. |
| `AI_MODEL` | Optional | **No (Server-Only)** | Model ID (defaults to `gpt-4o-mini`). |
| `AI_BASE_URL` | Optional | **No (Server-Only)** | Custom provider base URL if using Groq, DeepSeek, or OpenRouter. |
| `UPSTASH_REDIS_REST_URL` | Optional | **No (Server-Only)** | Upstash REST URL for shared serverless rate limiting. If omitted, in-memory limiter is used. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | **No (Server-Only)** | Upstash REST Bearer token. |

> **Security Guardrail:** Never check real keys or `.env.local` into version control. Ensure all secrets are kept strictly server-side.

---

## 5. Email Delivery Provider (Resend) Setup

To receive real inquiries submitted through the contact form:

1. Sign up at [Resend](https://resend.com) and create an API key in **API Keys > Create API Key**.
2. Add `RESEND_API_KEY` to Vercel Environment Variables.
3. **Sender Domain Verification:**
   - In Resend, go to **Domains > Add Domain** and enter `dinazuddin.dev`.
   - Resend will output 3 DNS records:
     - 1 MX record (for receiving bounce notifications).
     - 2 TXT records (SPF and DKIM for sender authentication).
   - Add these exact records in your domain registrar's DNS management panel.
   - Once verified in Resend (typically 5–15 minutes), update `CONTACT_EMAIL_FROM` to:
     `CONTACT_EMAIL_FROM=Dinaz Uddin <contact@dinazuddin.dev>`
   - Until domain verification is complete, messages can be sent via `onboarding@resend.dev` to the email address registered with your Resend account.

---

## 6. Shared Rate Limiting (Upstash Redis) & Production Fallback Policy

Next.js route handlers on Vercel execute as isolated serverless micro-containers. An in-memory store in an ephemeral container cannot defend against distributed traffic across multiple lambdas. Therefore, the application strictly distinguishes between local development and production environments.

### Production Fallback Policies

1. **Standard Production Operation (Shared Redis):**
   - Configured via `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
   - Executes atomic sorted-set pipelines (`ZREMRANGEBYSCORE`, `ZADD`, `ZCARD`, `EXPIRE`) over HTTP REST with a 2-second timeout.
   - Shares rate-limit counters instantaneously across all edge regions and serverless instances.

2. **Policy When Redis Is Unconfigured or Temporarily Down in Production:**
   - **Emergency Bounded Fallback (Default Production Resilience):**
     - Requests are **never** given unmetered access or treated as if per-process memory was a full shared limiter.
     - Per-instance quotas are immediately **curtailed by 60–75%** (e.g., maximum 2 submissions per instance for `/api/contact`, 5 messages for `/api/chat`).
     - Injects response header `X-RateLimit-Degraded: true` and logs a structured warning.
     - Prevents runaway cloud costs and flood attacks while maintaining basic availability for legitimate users.
   - **Fail-Closed Mode (`RATE_LIMIT_STRICT=true`):**
     - If strict compliance is required, setting `RATE_LIMIT_STRICT=true` in Vercel Environment Variables causes API endpoints to immediately reject unmetered requests with `HTTP 503 Service Unavailable` whenever Redis credentials are absent.

3. **Local Development & Testing (`NODE_ENV !== "production"`):**
   - Automatically uses the local sliding-window in-memory limiter without external network dependencies or credentials.

### Setup Steps:
1. Create a free serverless Redis database at [Upstash Console](https://console.upstash.com).
2. Under **REST API**, copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Add both to Vercel Environment Variables.

---

## 7. Connecting Custom Domain: `dinazuddin.dev`

1. Go to **Vercel Dashboard > Project Settings > Domains**.
2. Enter `dinazuddin.dev` and click **Add**.
3. Vercel will recommend adding both:
   - `dinazuddin.dev`
   - `www.dinazuddin.dev` (Redirect to `dinazuddin.dev`)
4. **Copy the exact DNS records shown in the Vercel Dashboard.**
   > **Important:** DNS records must be copied directly from your Vercel Project Settings screen. Do not guess DNS IP addresses.
   - Typically, Vercel requires:
     - **A Record**: Host `@` pointing to Vercel's Anycast IP (displayed in dashboard).
     - **CNAME Record**: Host `www` pointing to `cname.vercel-dns.com`.
5. Enter these records in your domain registrar (e.g., Namecheap, Cloudflare, Google Domains, GoDaddy).
6. Once DNS propagates (1–60 minutes), Vercel will automatically provision a free Let's Encrypt SSL/TLS certificate.
7. Confirm that visiting `http://dinazuddin.dev` or `https://www.dinazuddin.dev` redirects cleanly to `https://dinazuddin.dev`.

---

## 8. Post-Deployment Smoke Tests

Execute these verification checks after the deployment finishes:

1. **Homepage & Visuals**:
   - Verify hero text, Star-Delta schematic, and Single-Line Diagram load without horizontal overflow or console errors.
   - Test node inspection in the Single-Line Diagram Explorer (e.g. click "11kV Incomer", "11kV/415V Transformer").
2. **Case Study Routing**:
   - Click on the verified case study (`/projects/portfolio-architecture`).
   - Try navigating to an unverified draft slug (e.g. `/projects/power-distribution-case-study`). Confirm that it displays the custom 404 page stating that draft projects are withheld from public view.
3. **SEO Assets**:
   - Open `https://dinazuddin.dev/sitemap.xml` in browser. Verify both `/` and `/projects/portfolio-architecture` are present.
   - Open `https://dinazuddin.dev/robots.txt`. Verify it allows `/` and disallows `/api/`.
   - Open `https://dinazuddin.dev/opengraph-image`. Verify the generated 1200x630 technical branding card renders cleanly.
4. **Contact Form Endpoint (`/api/contact`)**:
   - Submit a test inquiry with valid fields.
   - Verify transparent status response (success if `RESEND_API_KEY` is active, or clear demonstration mode notice if unconfigured).
   - Confirm honeypot rejection and empty field validation errors.
5. **AI Assistant (`/api/chat`)**:
   - Open the floating assistant.
   - Send a message. Confirm response streams if API key is active, or displays transparent offline notice if unconfigured.

---

## 9. Rollback & Troubleshooting

- **Instant Rollback**: In Vercel Dashboard > **Deployments**, locate the last known working deployment, click `...` and choose **Promote to Production**. Rollbacks take less than 2 seconds with zero downtime.
- **Viewing Real-Time Logs**:
  - In Vercel Dashboard > **Logs**, filter by `/api/contact` or `/api/chat` to diagnose runtime status codes.
  - Notice that API routes do not log email bodies or private tokens.
- **Cache Invalidation**: Vercel automatically invalidates static caches on new deployments. If needed, trigger **Redeploy > Clear build cache**.

---

## 10. Actionable Launch Checklist

### Category A: Verified Complete (Automated & Tested in Repository)
- [x] Full build verification passing with zero TypeScript and ESLint errors (`npm run build`).
- [x] 28/28 unit and integration tests passing (`npm test`).
- [x] Draft case-study publication isolation (`notFound()` for draft slugs).
- [x] Dynamic `/sitemap.xml` strictly indexes published work with canonical URLs.
- [x] Validated `/robots.txt` disallows `/api/` endpoints from web indexing.
- [x] Social preview image (`public/images/og-image.png`) generated at 1200×630 with verified identity.
- [x] Vercel security headers configured in `vercel.json` (HSTS, nosniff, frame denial).
- [x] Rate limiter supports Upstash Redis REST and graceful emergency-bounded fallback with degraded headers.
- [x] Contact delivery deduplication and safe error masking.

### Category B: Requires External Account or Credential
- [ ] **Resend API Key (`RESEND_API_KEY`)**: Create key at [resend.com](https://resend.com) to activate inbox delivery. *(If omitted: form operates in safe demonstration mode).*
- [ ] **AI Assistant Key (`AI_API_KEY`)**: Add OpenAI/OpenRouter key to activate live assistant responses. *(If omitted: UI displays transparent offline notice).*
- [ ] **Upstash Redis (`UPSTASH_REDIS_REST_URL` & `TOKEN`)**: Create free database at [upstash.com](https://upstash.com) to synchronize rate limits across distributed serverless regions. *(If omitted: emergency bounded limiter protects instances).*

### Category C: Requires DNS / Domain-Owner Action
- [ ] In domain registrar, configure apex (`@`) A record to Vercel IP and `www` CNAME to `cname.vercel-dns.com`.
- [ ] In Resend dashboard, add `dinazuddin.dev` and enter the 3 verification DNS records (1 MX, 2 TXT) into registrar DNS.
- [ ] Once Resend verifies domain, update `CONTACT_EMAIL_FROM="Dinaz Uddin <contact@dinazuddin.dev>"`.

### Category D: Not Tested or Still Blocked
- [ ] **Live End-to-End Inbox Receipt**: Cannot be verified until a real `RESEND_API_KEY` is provided. Tested via unconfigured/simulated 503 fallback.
- [ ] **Headless Browser Automation (Playwright)**: Blocked in this local environment due to upstream download mirror 404 on Windows. Verified via 28 automated unit tests and manual curl/PowerShell HTTP checks.

