# 🐻💧 Splashy Bear Water Tracker

An adorable, interactive water intake tracker that helps you stay hydrated with a cute bear companion in a forest lake environment!

## ✨ Features

### 🐻 Cute Bear Character
- Adorable CSS-based bear that sits in a forest lake
- Bear bobs gently and its eyes look around
- Bear rises with the water level as you drink more

### 💧 Water Tracking
- Background fills with animated water as you track your intake
- Beautiful wave animations and water shine effects
- Visual progress representation

### 👥 Multiple Users
- Create profiles for multiple users (family members, roommates, etc.)
- Each profile calculates personalized daily water goals
- Uses weight, height, and age to determine optimal hydration

### 🎯 Smart Goal Calculation
- Automatic daily water intake calculation based on user metrics
- Formula: (Weight × 0.5) + (Height × 0.1) - (Age × 0.2)
- Minimum 64 oz, maximum 128 oz

### 🎉 Celebration Animations
- Rubber ducky appears when you reach your goal
- Colorful confetti explosion
- Fun congratulatory message

### 📊 Progress Tracking
- Real-time progress bar
- 7-day history chart
- Daily intake automatically saved

### 🎨 Beautiful Design
- Colorful gradient backgrounds
- Forest environment with trees, clouds, and mountains
- Smooth animations throughout
- Fully responsive design

## 🚀 Quick Start

### Running Locally

1. **Download the project files**
```bash
   # If you have git installed
   git clone <your-repo-url>
   cd splashy-bear-water-tracker
```

2. **Open in browser**
   - Simply double-click `index.html`, OR
   - Use a local server (recommended):
```bash
     # If you have Python 3 installed
     python -m http.server 8000
```
   - Then open `http://localhost:8000` in your browser

3. **Start tracking!**
   - Click "Add New Bear Buddy" to create your profile
   - Enter your name, weight, height, and age
   - Click "Make a Splash!" to add 16.9 oz (one water bottle) to your daily intake
   - Watch the water rise and your bear buddy float up!

### Deploying to GitHub Pages

1. **Create a GitHub repository**
   - Go to [GitHub](https://github.com)
   - Click "New Repository"
   - Name it (e.g., "splashy-bear-tracker")
   - Make it public
   - Don't initialize with README (we already have one)

2. **Upload your files**
```bash
   git init
   git add .
   git commit -m "Initial commit - Splashy Bear Water Tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings"
   - Scroll to "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

4. **Access your site**
   - Wait 1-2 minutes for deployment
   - Visit your GitHub Pages URL
   - Bookmark it on your phone for easy access!

## 📱 Usage Tips

### Creating Profiles
- Add separate profiles for each person who wants to track their water intake
- The app remembers all profiles even after you close the browser
- Delete profiles you no longer need with the delete button

### Tracking Water
- Each "Make a Splash!" button click adds 16.9 oz (one standard water bottle)
- Progress is automatically saved
- Reset today's progress with the "Reset Today" button

### Viewing History
- Scroll down to see your last 7 days of water intake
- Green bars show how much you drank each day
- "Today" is always the rightmost bar

### Daily Goals
- Your personalized goal is calculated automatically
- Reach 100% to see the celebration animation!
- Goals are based on scientific hydration recommendations

## 🛠️ Technical Details

### Built With
- **HTML5** - Structure
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - Functionality
- **LocalStorage** - Data persistence

### Browser Support
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

### Data Storage
- All data is stored locally in your browser
- No server required
- Data persists between sessions
- Privacy-friendly - nothing leaves your device

### File Structure
````
splashy-bear-water-tracker/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles and animations
├── js/
│   ├── app.js              # Main application logic
│   ├── storage.js          # LocalStorage management
│   └── waterCalculator.js  # Water intake calculations
├── assets/
│   └── README.md           # Asset folder info
└── README.md               # This file
