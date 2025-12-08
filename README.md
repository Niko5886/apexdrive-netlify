# Apex Drive - Car Management SPA

A modern Single Page Application for car management built with vanilla JavaScript ES6 modules.

## 🚀 Live Demo

**[View Live Demo →](https://apexdrivee.netlify.app/#/cars)**

Experience the application in action. Browse our car catalog, search for vehicles, and manage your car listings!

## Features

- 🏠 Home page with hero section
- 🚗 Car catalog with search functionality
- ➕ Add new cars
- ✏️ Edit existing cars
- 🔐 User authentication (Login/Register)
- 📱 Responsive design

## Tech Stack

- **Frontend:** Vanilla JavaScript ES6 Modules
- **Routing:** Custom hash-based router
- **Styling:** CSS with custom properties
- **API:** REST API integration
- **Deployment:** Netlify (static hosting)

## Local Development

1. Clone or download the project
2. Open `index.html` in a modern browser
3. Or use a local server:
   ```bash
   npx http-server -p 3000
   ```

## Deployment to Netlify

### Option 1: Drag & Drop
1. Go to [netlify.com](https://netlify.com)
2. Login to your account
3. Drag the entire `apexdrive-netlify` folder to the deployment area
4. Wait for deployment to complete
5. Your site will be live!

### Option 2: Git Integration
1. Push this code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Netlify will automatically deploy on every push

## API Configuration

The app connects to a REST API at `http://localhost:3030` for local development.
For production, you may need to configure CORS or use a different API endpoint.

## Judge System Results

✅ **115/115 points** - All tests passed!

## Project Structure

```
apexdrive-netlify/
├── index.html          # Main HTML file
├── app.js             # Application entry point
├── _redirects         # SPA routing for Netlify
├── netlify.toml       # Netlify configuration
├── images/            # Static assets
├── styles/            # CSS files
├── views/             # Page components
├── services/          # API services
└── utils/             # Helper utilities
```