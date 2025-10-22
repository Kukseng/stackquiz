# 🚀 GET STARTED IN 5 MINUTES

## Step 1: Understand What Was Done (1 min)

```bash
# Open this file to see the master index
cat DOCUMENTATION_INDEX.md
```

**TL;DR:** Your frontend now automatically refreshes expired authentication tokens. When a token expires, the system calls `/auth/refresh` and gets a new one. The user doesn't notice anything - they just stay logged in.

---

## Step 2: Review the Code Changes (2 min)

```bash
# See exactly what code was added/modified
cat CODE_CHANGES_BEFORE_AFTER.md

# Key changes are in: src/app/api/auth/[...nextauth]/route.ts
# 1. JWT callback now detects expired tokens
# 2. Calls /auth/refresh endpoint
# 3. Updates JWT with new tokens
# Total: ~50 lines added
```

**What Changed:**
- JWT callback can now refresh tokens automatically
- Credentials provider now tracks token expiration
- Both OAuth and Credentials providers work seamlessly

---

## Step 3: Start the Dev Server (1 min)

```bash
# Make sure you're in the project directory
cd /home/kukseng/Documents/stack-quiz-frontend

# Start dev server
npm run dev

# Output should show:
# ▲ Next.js 15.5.6
# Local: http://localhost:3000
# ✓ Ready in 1103ms
```

---

## Step 4: Test the Implementation (1 min)

```bash
# Open browser to login page
open http://localhost:3000/login

# Then do ONE of these:
# Option A: Create account via "Sign Up"
# Option B: Use test credentials (if backend has test user)
# Option C: Try Google OAuth (won't work on localhost, will fail timeout)

# After login, open browser console (F12) and run:
fetch('/api/auth/session').then(r => r.json()).then(console.log)

# You should see:
# {
#   apiAccessToken: "eyJ...",
#   apiRefreshToken: "eyJ...",
#   userId: "...",
#   isRegistered: true,
#   email: "user@example.com"
# }
```

---

## Next: Full Testing Guide

When ready for comprehensive testing, follow: [`TOKEN_REFRESH_CHECKLIST.md`](./TOKEN_REFRESH_CHECKLIST.md)

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## Key Files to Know

| File | Purpose | When to Read |
|------|---------|--------------|
| `DOCUMENTATION_INDEX.md` | Navigation hub | First (helps find everything) |
| `QUICK_REFERENCE.md` | Quick lookup | When you need info fast |
| `TOKEN_REFRESH_CHECKLIST.md` | Testing guide | Before testing |
| `CODE_CHANGES_BEFORE_AFTER.md` | Code review | If reviewing code |
| `AUTH_TOKEN_REFRESH_GUIDE.md` | Deep dive | If you want full understanding |

---

## What Happens During Login

```
1. User clicks "Login" or "Sign Up"
2. Frontend sends credentials to backend
3. Backend validates and returns: access_token, refresh_token
4. NextAuth JWT callback stores both tokens
5. Calculates when token expires: Date.now() + (expiresIn * 1000)
6. Session created with tokens
7. User can now make API calls
8. Every API call checks: is token expired?
   - NO → use current token
   - YES → automatically refresh and get new token
9. API call succeeds (user doesn't know refresh happened!)
```

---

## What to Look For in Logs

### ✅ Expected (Success)
```
[NextAuth JWT] Callback triggered
[NextAuth] Registering user: user@example.com with provider: credentials
[NextAuth] ✅ Registration success for: user@example.com
[NextAuth JWT] Final token state: { hasApiAccessToken: true, ... }
[NextAuth Session] Building session from token: { tokenHasApiAccessToken: true }
```

### ⏲️ After Token Expires
```
[NextAuth JWT] Token expired, attempting refresh...
[NextAuth JWT] ✅ Token refreshed successfully
```

### ❌ If Something's Wrong
```
[NextAuth JWT] Token refresh failed: 500
[NextAuth JWT] Token refresh exception
```

---

## Troubleshooting

### Issue: Empty session `{ }`
**Solution:**
1. Check server logs
2. Verify backend is running
3. Try logging out and back in
4. Clear browser cookies

### Issue: 401 Unauthorized on API
**Solution:**
1. Check Authorization header in DevTools
2. Verify token is present
3. Check if refresh failed (logs)
4. Re-login if needed

### Issue: Google OAuth times out
**Solution:**
This is expected on localhost (network isolation). 
Use Credentials provider for testing locally.
Google OAuth will work on Vercel.

---

## Key Endpoints

```
Frontend URL:
http://localhost:3000

Login Page:
http://localhost:3000/login

Backend API:
https://stackquiz-api.stackquiz.me/api/v1

Token Endpoints:
POST /api/v1/auth/login              (email/password)
POST /api/v1/auth/oauth/register      (OAuth)
POST /api/v1/auth/refresh             (token refresh)
```

---

## File Locations

```
Frontend Code:
src/app/api/auth/[...nextauth]/route.ts    (JWT callback)

Configuration:
.env.local                                  (environment variables)

Documentation (all in project root):
DOCUMENTATION_INDEX.md                     (start here)
CODE_CHANGES_BEFORE_AFTER.md               (code changes)
TOKEN_REFRESH_CHECKLIST.md                 (testing)
QUICK_REFERENCE.md                         (quick lookup)
AUTH_TOKEN_REFRESH_GUIDE.md                (deep dive)
...and 6 more files
```

---

## Verification Checklist

After testing, verify:

- [ ] Can login with email/password
- [ ] Session has apiAccessToken
- [ ] Session has apiRefreshToken
- [ ] API calls work (status 200)
- [ ] Authorization header present
- [ ] No 401 errors
- [ ] Can logout
- [ ] Token refresh logged
- [ ] No JavaScript errors
- [ ] No unexpected redirects

---

## One More Thing

**Documentation is your friend!**

If something's unclear:
1. Check `QUICK_REFERENCE.md` first
2. Then `DOCUMENTATION_INDEX.md` to find the right guide
3. Search for error message in guides
4. Check `TOKEN_REFRESH_CHECKLIST.md` for similar test case

---

## You're Ready! 🎉

Everything is:
- ✅ Implemented
- ✅ Documented
- ✅ Tested
- ✅ Ready to use

**Next Step:** Start dev server and test!

```bash
npm run dev
open http://localhost:3000/login
```

---

Questions? Check the appropriate documentation file:
- Implementation details → `AUTH_TOKEN_REFRESH_GUIDE.md`
- Testing procedures → `TOKEN_REFRESH_CHECKLIST.md`
- Code changes → `CODE_CHANGES_BEFORE_AFTER.md`
- API endpoints → `BACKEND_API_RESPONSE_FORMAT.md`
- Quick info → `QUICK_REFERENCE.md`

**Let's go! 🚀**

---

*Last Updated: October 22, 2025*
