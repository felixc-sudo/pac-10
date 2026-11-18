# CARBONCUT — DOM-Driven Carbon Footprint Tracking & Reduction Services

Static web application demonstrating **DOM Elements for User Interactions** (`getElementById`, `querySelector`, `addEventListener`) across an **Interactive Form** with input validation, a toggleable **Dropdown Menu**, a dynamic **Modal** certificate viewer, and a live JavaScript **CRUD** task checklist.

## Files Included
- `index.html` — Root HTML entry point for GitHub Pages and Vercel.
- `carboncut_dom_portal.css` — Responsive styles for the form, dropdown, modal, and CRUD checklist.
- `carboncut_dom_events.js` — DOM event listeners, form validation, dropdown toggle, modal controller, and CRUD task array (`addTask()`).
- `vercel.json` — Zero-config Vercel static deployment configuration.

## GitHub & Vercel Deployment Steps
1. Extract `carboncut_dom_interactions.zip` and open a terminal inside `carboncut_dom_interactions`.
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add CARBONCUT DOM interactions website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/carboncut-dom-interactions.git
   git push -u origin main
   ```
3. Open [vercel.com](https://vercel.com), click **Add New → Project**, import `carboncut-dom-interactions`, keep Framework Preset as **Other**, and click **Deploy**.
