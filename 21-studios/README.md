# 21 Studios — Photography Website + CMS

A premium photography portfolio with a full content management system. Built for photographers — no coding required to update your site.

---

## ⚡ Quick Start (5 minutes)

```bash
# 1. Install dependencies
cd 21-studios
npm install

# 2. Generate database client
npx prisma generate

# 3. Create database tables
npx prisma db push

# 4. Start the development server
npm run dev
```

**5. Open your browser:**
- **Website:** http://localhost:3000
- **Admin CMS:** http://localhost:3000/admin

**6. Seed sample content** (first time only):
Visit http://localhost:3000/api/seed in your browser.

**Default login:**
- Email: `admin@21studios.com`
- Password: `admin123`

---

## 🗂 Project Structure

```
21-studios/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data seeder
├── public/
│   └── uploads/             # Uploaded photos saved here
│       └── thumbs/          # Auto-generated thumbnails
├── src/
│   ├── app/
│   │   ├── page.tsx         # Homepage (reads from CMS)
│   │   ├── about/           # About page (reads from CMS)
│   │   ├── booking/         # Booking + sessions from DB
│   │   ├── portfolio/       # Gallery page from DB photos
│   │   ├── gallery/         # Password-protected client portal
│   │   ├── admin/           # ← CMS admin panel
│   │   │   ├── page.tsx     # Dashboard
│   │   │   ├── galleries/   # Manage photo galleries
│   │   │   ├── photos/      # Upload & organise photos
│   │   │   ├── sessions/    # Packages & pricing
│   │   │   ├── content/     # Edit all site text
│   │   │   ├── sections/    # Reorder homepage sections
│   │   │   └── settings/    # Logo & account settings
│   │   └── api/             # REST API routes
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ImageCropper.tsx   # Browser-side image cropping
│   │   │   ├── GalleryPreview.tsx # Live gallery preview
│   │   │   ├── InlineEdit.tsx     # Click-to-edit text
│   │   │   └── ui.tsx             # Shared admin components
│   │   ├── Hero.tsx         # CMS-driven hero
│   │   ├── CTASection.tsx   # CMS-driven CTA
│   │   ├── Footer.tsx       # CMS-driven footer
│   │   └── Navigation.tsx   # CMS-driven logo + nav
│   └── lib/
│       ├── cms.ts           # Server-side CMS data fetcher
│       ├── auth.ts          # NextAuth configuration
│       ├── prisma.ts        # Database client singleton
│       └── upload.ts        # Image upload + thumbnail generator
```

---

## 🎛 Admin CMS Guide

### Dashboard (`/admin`)
- See photo, gallery, and session counts
- One-click database seed for first-time setup
- Quick links to all management areas

### Photos (`/admin/photos`)
- **Drag photos from your computer** directly onto the page
- **Crop before uploading** — hover any queued photo → click Crop → choose ratio (1:1, 4:3, 16:9, etc.) → Apply
- Assign photos to a gallery using the dropdown
- Switch to **Library** to see all uploaded photos
- **Drag to reorder** photos in the library

### Galleries (`/admin/galleries`)
- Create galleries to group your photos (Weddings, Portraits, etc.)
- **Preview button** on each gallery — see exactly how it looks on desktop and mobile before publishing
- ⭐ Star a gallery to feature it on your homepage
- 👁 Toggle galleries visible/hidden without deleting them

### Sessions (`/admin/sessions`)
- Add photography packages with name, price, duration, and includes list
- Toggle sessions on/off to show or hide them on the booking page
- Session types appear as options in the booking form dropdown

### Content (`/admin/content`)
- Edit every word on your site without touching code
- **Click any text field** to edit it inline — press Enter to save
- Sections: Hero, About Page, Call to Action, Contact Info, Brand & Logo
- Image URL fields show a live preview

### Sections (`/admin/sections`)
- **Drag rows** to reorder your homepage sections
- Toggle any section visible/hidden

### Settings (`/admin/settings`)
- Upload your logo — appears in nav, footer, and browser tab
- Change your admin password

---

## 🔑 Environment Variables

The `.env.local` file is included with development defaults. For production:

```bash
# Required — change this to a long random string in production!
NEXTAUTH_SECRET="your-long-random-secret-here"

# Your production URL
NEXTAUTH_URL="https://yourdomain.com"

# Database (SQLite for local, PostgreSQL for production)
DATABASE_URL="file:./dev.db"
# For production: DATABASE_URL="postgresql://user:pass@host:5432/21studios"
```

---

## 🚀 Deploy to Vercel

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "21 Studios CMS"
git push
```

### Step 2 — Deploy on Vercel
1. Go to vercel.com → Add New Project → Import your repo
2. Set **Root Directory** to `21-studios`
3. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `NEXTAUTH_SECRET` — a long random string (generate at randomkeygen.com)
   - `NEXTAUTH_URL` — your Vercel deployment URL
4. Click Deploy

### Step 3 — Set up PostgreSQL on Vercel
1. In your Vercel project → **Storage** → **Create Database** → **Postgres**
2. Copy the `DATABASE_URL` from the Postgres dashboard
3. Add it to your project's Environment Variables
4. Redeploy — your tables are created automatically

### Step 4 — Seed production database
Visit `https://yoursite.vercel.app/api/seed` once to create the admin account.

**⚠️ Security:** Delete or protect the `/api/seed` route after seeding in production!

---

## 🖼 Image Storage

By default, images are saved to `public/uploads/` on the server.

**For production on Vercel** (servers are ephemeral — files don't persist):

Swap to AWS S3 by editing `src/lib/upload.ts`:
```bash
# Add to .env.local
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=21-studios-photos
```

Then uncomment the S3 upload function in `src/lib/upload.ts`.

---

## 🛠 Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npx prisma studio    # Visual database browser
npx prisma db push   # Push schema changes to database
npx prisma generate  # Regenerate Prisma client after schema changes
```

---

## 🎨 Customisation

### Change colours
Edit `src/app/globals.css` — look for `:root` CSS variables:
```css
:root {
  --gold: #b8975a;   /* ← change accent colour */
  --void: #050505;   /* ← change background */
}
```

### Change fonts
Edit `src/app/globals.css` and `src/app/layout.tsx` — swap the Google Fonts URL for any fonts you prefer.

### Add a new admin page
1. Create `src/app/admin/yourpage/page.tsx`
2. Add it to the nav array in `src/app/admin/layout.tsx`

---

*Built with Next.js 15 · Prisma · NextAuth · Framer Motion · TailwindCSS*
