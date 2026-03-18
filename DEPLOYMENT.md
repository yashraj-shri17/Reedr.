# 🚀 Ultimate Step-by-Step Vercel Deployment Guide

This guide will walk you through the exact steps needed to deploy your **Reedr** system (Next.js frontend + backend) to Vercel and connect it with Supabase and Stripe.

---

## 🛠 Phase 1: Pre-Deployment (Github)

Before you start on Vercel, ensure your code is ready.

1.  **Create a Repository**: Go to [GitHub](https://github.com/new) and create a new repository (Public or Private).
2.  **Push your Code**:
    ```bash
    git init
    git add .
    git commit -m "Initialize project for deployment"
    git branch -M main
    git remote add origin YOUR_GITHUB_REPO_URL
    git push -u origin main
    ```
3.  **Check `.gitignore`**: Make sure your `.env` file is NOT being pushed to GitHub. This is critical for security.

---

## 🌐 Phase 2: Deployment on Vercel

1.  **Log in to Vercel**: Visit [vercel.com](https://vercel.com) and sign in with your GitHub account.
2.  **Start a New Project**:
    *   Click the **"Add New"** button on your dashboard.
    *   Select **"Project"**.
3.  **Import Repository**:
    *   Find your project in the list of GitHub repositories and click **"Import"**.
4.  **Configure Project Settings**:
    *   **Framework Preset**: Ensure "Next.js" is selected.
    *   **Root Directory**: Leave as `./` (default).
    *   **Build & Output Settings**: Leave as default.
5.  **Add Environment Variables**:
    *   Find the **"Environment Variables"** section.
    *   Open your local `.env` file and COPY the variable names and values into Vercel one by one.
    *   **Crucial Variables**:
        *   `NEXT_PUBLIC_SUPABASE_URL`: (e.g., `https://pgicjhiophbpkmkabagu.supabase.co`)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Copy from `.env`)
        *   `SUPABASE_SERVICE_ROLE_KEY`: (Keep secret, copy from `.env`)
        *   `GOOGLE_BOOKS_API_KEY`: (Copy from `.env`)
        *   `ANTHROPIC_API_KEY`: (Copy from `.env`)
        *   `GROQ_API_KEY`: (Copy from `.env`)
        *   `STRIPE_SECRET_KEY`: (Use your `sk_test_...` for testing or `sk_live_...` for production)
        *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: (Use your `pk_test_...` or `pk_live...`)
        *   `NEXT_PUBLIC_APP_URL`: Set this to `https://reedr-app.vercel.app` (or your actual domain).
6.  **Click Deploy**: Wait for the build process to finish. If everything is correct, you will get a "Congratulations!" message and a production URL.

---

## 🔗 Phase 3: Post-Deployment Configuration

After deployment, your system won't work completely until you update these third-party settings.

### 1. Update Supabase Authentication
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication** > **URL Configuration**.
3. **Site URL**: Paste your Vercel URL (e.g., `https://reedr-app.vercel.app`).
4. **Redirect URLs**: Add your domain here to allow users to log in after verifying their email.

### 2. Set Up Stripe Webhooks
1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks) (Use Test Mode for now).
2. Click **"Add Endpoint"**.
3. **Endpoint URL**: `https://your-vercel-domain.com/api/webhooks/stripe`.
4. **Select Events**: Choose at least `checkout.session.completed` and `customer.subscription.deleted`.
5. **Signing Secret**: After adding the endpoint, copy the "Signing Secret" (`whsec_...`).
6. **Go back to Vercel**: 
    *   Project Settings > Environment Variables.
    *   Update `STRIPE_WEBHOOK_SECRET` with the new value.
    *   **Re-deploy** your project in Vercel to apply the change.

---

## ✅ Phase 4: Testing

1.  **Verification**: Visit your production URL.
2.  **Sign Up**: Test if a new user can sign up with email and password.
3.  **Search & AI**: Try searching for a book and check if the AI features work as expected.
4.  **Payments**: Test the upgrade flow using Stripe's [test card numbers](https://stripe.com/docs/testing).

---

## ⚡ Quick Redeploy

Whenever you make changes to your code locally:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Vercel will automatically detect the push and start a new build!
