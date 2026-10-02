# SPI-KIU - Campus Security & Student ID Verification Portal

Official campus checkpoint identification and verification system for Kampala International University (KIU). Scans student IDs via barcode or camera QR auto-capture, validates enrollment and card validity against the student registry, flags expired or unauthorized credentials with immediate visual and audio alerts, and records gate access metrics.

---

## Deploying to Vercel

This project is fully configured for zero-config deployment on [Vercel](https://vercel.com).

### Option 1: Deploy via GitHub / Git Repository (Recommended)
1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the repository.
4. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Your SPI-KIU portal will be live on a secure HTTPS domain within seconds.

### Option 2: Deploy via Vercel CLI
If you have the Vercel CLI installed:
```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Features
- **Barcode & QR Optical Scanner**: Real-time camera viewfinder with automatic QR code detection (`jsQR`) and instant camera snapshot.
- **Student Name Search with Disambiguation**: Autocomplete name search with multiple-candidate selection modal when students share the same first or last name.
- **Instant Security Verdict**:
  - **Access Granted (GREEN)**: Verified active KIU student with photo, course, faculty, campus, and validity details.
  - **Access Denied (RED)**: Immediate warning prompt with explicit denial reason (Expired card, Unregistered/Alien ID, Disciplinary suspension).
- **Officer Authentication**: Checkpoint guard login with PIN/password, gate selection, and shift logging.
- **SQL / Audit Trail Data Collection**: Live security log with CSV export capability and real-time shift counters.
