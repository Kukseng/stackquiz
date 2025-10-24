# Deployment Guide for stackquiz-two.vercel.app

## 🎯 Pre-Deployment Checklist

- [x] Updated all production URLs to `https://stackquiz-two.vercel.app`
- [x] Updated metadata configuration (`src/config/metadata.ts`)
- [x] Updated server layout (`src/app/layout.tsx`)
- [x] Updated environment template (`.env.example`)
- [x] Updated sitemaps and robots.txt
- [x] Build verified and working
- [ ] Environment variables set in Vercel dashboard
- [ ] Deploy to Vercel
- [ ] Verify in Search Consoles

---

## 📝 Environment Variables to Set in Vercel

In your Vercel project settings, add these environment variables:

```env
# Core Application
NEXT_PUBLIC_APP_URL=https://stackquiz-two.vercel.app
NEXT_PUBLIC_API_URL=https://api.stackquiz.me

# NextAuth Configuration
NEXTAUTH_SECRET=your_secure_secret_here
NEXTAUTH_URL=https://stackquiz-two.vercel.app

# OAuth Providers (if using)
GOOGLE_ID=your_google_id
GOOGLE_SECRET=your_google_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
FACEBOOK_ID=your_facebook_id
FACEBOOK_SECRET=your_facebook_secret

# API Configuration
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_API_TIMEOUT=30000

# SEO & Analytics
NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_ID=your_google_verification_code
NEXT_PUBLIC_BING_WEBMASTER_ID=your_bing_verification_code
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G_your_ga_id

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
NODE_ENV=production
```

---

## 🚀 Deployment Steps

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "chore: update production URLs to stackquiz-two.vercel.app"
git push origin main
```

### Step 2: Deploy via Vercel
**Option A: Automatic (Recommended)**
- Push to main branch → Vercel auto-deploys
- Monitor deployment progress in Vercel Dashboard

**Option B: Manual**
```bash
npm install -g vercel
vercel --prod
```

### Step 3: Verify Deployment
```bash
# Check if site is live
curl -I https://stackquiz-two.vercel.app

# Check metadata in page
curl -s https://stackquiz-two.vercel.app | grep -A 2 '<meta name="description"'

# Check robots.txt
curl https://www.stackquiz.me/robots.txt

# Check sitemap.xml
curl https://www.stackquiz.me/sitemap.xml
```

---

## 🔍 Post-Deployment Verification

### 1. Check Site Functionality
- [ ] Homepage loads: https://stackquiz-two.vercel.app
- [ ] No console errors in browser
- [ ] Navigation works correctly
- [ ] Images load properly
- [ ] API calls work (check network tab)

### 2. Check Metadata
**In Browser DevTools:**
```javascript
// Check meta tags
document.head.innerHTML

// Check specific meta tags
document.querySelector('meta[name="description"]').content
document.querySelector('meta[property="og:url"]').content

// Check JSON-LD schemas
document.querySelectorAll('script[type="application/ld+json"]')
```

### 3. Check SEO Files
- [ ] Robots.txt: https://www.stackquiz.me/robots.txt
- [ ] Sitemap: https://www.stackquiz.me/sitemap.xml
- [ ] Favicon: https://www.stackquiz.me/favicon.ico

### 4. Validate Metadata
- [ ] Use Google Rich Results Test: https://search.google.com/test/rich-results?url=https://stackquiz-two.vercel.app
- [ ] Use Open Graph Debugger: https://developers.facebook.com/tools/debug/og/object?url=https://stackquiz-two.vercel.app

---

## 📊 Google Search Console Setup

### 1. Add Property
1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Enter: `https://stackquiz-two.vercel.app`
4. Click "Continue"

### 2. Verify Ownership
**Method 1: HTML File (Easiest)**
1. Download verification HTML file
2. Add to `public/` folder in project
3. Re-deploy
4. Click "Verify" in Search Console

**Method 2: HTML Tag**
1. Copy meta tag from Search Console
2. Already added to `src/app/layout.tsx` (line 119)
3. Update with verification code
4. Deploy
5. Click "Verify"

**Method 3: DNS Record**
1. Add TXT record to your DNS provider
2. Wait for DNS propagation (up to 48 hours)
3. Click "Verify"

### 3. Submit Sitemap
1. After verification, go to Sitemaps section
2. Click "Add/test sitemap"
3. Enter: `https://www.stackquiz.me/sitemap.xml`
4. Click "Submit"

### 4. Request Indexing
1. In Search Console, enter URL: `https://stackquiz-two.vercel.app`
2. Click "Inspect URL"
3. Click "Request indexing"
4. Google will crawl and index within 24-48 hours

---

## 🔗 Bing Webmaster Tools Setup

### 1. Add Site
1. Go to https://www.bing.com/webmaster
2. Click "Add site"
3. Enter: `https://stackquiz-two.vercel.app`

### 2. Verify Ownership
1. Choose verification method (meta tag recommended)
2. Copy meta tag
3. Already added to `src/app/layout.tsx`
4. Deploy and verify

### 3. Submit Sitemap
1. Go to Sitemaps section
2. Click "Submit sitemap"
3. Enter: `https://www.stackquiz.me/sitemap.xml`

---

## 📈 Monitoring After Deployment

### Daily (First Week)
- [ ] Check Search Console for new indexing
- [ ] Monitor for crawl errors
- [ ] Check site accessibility
- [ ] Test core features

### Weekly
- [ ] Review Search Console data
- [ ] Check keyword impressions
- [ ] Monitor click-through rates
- [ ] Verify all pages indexed

### Monthly
- [ ] Analyze organic traffic trends
- [ ] Monitor keyword rankings
- [ ] Check Core Web Vitals
- [ ] Review user engagement metrics

---

## ⏱️ Expected Timeline

| Timeline | Expected Action |
|----------|-----------------|
| Hour 1 | Site deployed and live at stackquiz-two.vercel.app |
| Hour 2-24 | Verify in Search Consoles |
| Day 1 | Submit sitemaps |
| Day 2-5 | Google crawls site |
| Week 1 | Homepage indexed and appearing in search |
| Week 2-4 | Key pages indexed |
| Month 1 | First keywords showing in search results |
| Month 2-3 | More keywords ranking, organic traffic visible |

---

## 🆘 Troubleshooting

### Issue: Site not accessible
**Solution:**
- Verify Vercel deployment succeeded
- Check domain DNS settings
- Clear browser cache and reload

### Issue: Metadata not showing
**Solution:**
- Verify environment variables set in Vercel
- Run `npm run build` locally to check for errors
- Check browser DevTools → Network → check response headers
- Wait for Vercel rebuild to complete

### Issue: Search Console shows errors
**Solution:**
- Check robots.txt isn't blocking crawlers
- Verify URLs are correct in sitemap
- Use GSC URL Inspector to debug
- Re-request indexing after fixes

### Issue: Images not loading
**Solution:**
- Verify image URLs use `NEXT_PUBLIC_APP_URL` environment variable
- Check if images are in `public/` folder
- Verify CORS settings if using external CDN

### Issue: API calls failing
**Solution:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS headers from backend
- Test API endpoint in Postman
- Check network tab in DevTools for 401/403 errors

---

## 🎯 Success Indicators

After deployment, you'll know everything is working when:

✅ **Site is live**
- Site loads at https://stackquiz-two.vercel.app
- No errors in browser console
- All pages accessible

✅ **Metadata is correct**
- Meta tags visible in page source
- JSON-LD schemas validate
- Open Graph preview works

✅ **Search engines can crawl**
- Robots.txt is accessible
- Sitemap is accessible
- Search Console shows no errors

✅ **Indexing starts**
- Homepage indexed within 48 hours
- Sitemap processed in Search Console
- First keywords showing impressions

---

## 📞 Support Resources

**Vercel Documentation:**
- Deployment Guide: https://vercel.com/docs
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables

**Google Search Console:**
- Getting Started: https://support.google.com/webmasters/answer/9128669
- Optimize Your Site: https://support.google.com/webmasters/answer/7451184

**Bing Webmaster Tools:**
- Getting Started: https://www.bing.com/webmasters/help/webmaster-guidelines-31e61b03

**Our Documentation:**
- SEO Implementation: `SEO_IMPLEMENTATION.md`
- Deployment Checklist: `SEO_DEPLOYMENT_CHECKLIST.md`
- URL Update Summary: `URL_UPDATE_SUMMARY.md`

---

## ✅ Final Checklist Before Going Live

- [ ] All environment variables configured in Vercel
- [ ] Build passes locally (`npm run build`)
- [ ] Deployment successful on Vercel
- [ ] Site loads at https://stackquiz-two.vercel.app
- [ ] Metadata visible in page source
- [ ] robots.txt and sitemap.xml accessible
- [ ] Search Console property added and verified
- [ ] Bing Webmaster property added and verified
- [ ] Sitemap submitted to both search engines
- [ ] No errors in Search Console
- [ ] API calls working correctly
- [ ] Images loading properly
- [ ] Mobile responsive and functional

---

**Status:** Ready for Production Deployment ✅  
**Product URL:** https://stackquiz-two.vercel.app  
**API URL:** https://api.stackquiz.me  
**Date:** October 20, 2025
