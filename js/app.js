/**
 * Splashy Bear Water Tracker - Main Application
 * Handles UI interactions and coordinates between storage and display
 */

class SplashyBearApp {
    constructor() {
        this.storage = new StorageManager();
        this.activeDrinker = null;
        this.celebrationTimeout = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadDrinkers();
        this.loadActiveDrinker();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        // Drinker management
        this.drinkerList = document.getElementById('drinkerList');
        this.addDrinkerBtn = document.getElementById('addDrinkerBtn');
        this.drinkerModal = document.getElementById('drinkerModal');
        this.closeModal = document.getElementById('closeModal');
        this.drinkerForm = document.getElementById('drinkerForm');
        
        // Active drinker section
        this.activeDrinkerSection = document.getElementById('activeDrinkerSection');
        this.activeDrinkerName = document.getElementById('activeDrinkerName');
        this.dailyGoal = document.getElementById('dailyGoal');
        this.currentIntake = document.getElementById('currentIntake');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        
        // Action buttons
        this.drinkBtn = document.getElementById('drinkBtn');
        this.resetDayBtn = document.getElementById('resetDayBtn');
        
        // Visual elements
        this.water = document.getElementById('water');
        this.bearContainer = document.getElementById('bearContainer');
        this.celebration = document.getElementById('celebration');
        this.confettiContainer = document.getElementById('confettiContainer');
        
        // History
        this.historyChart = document.getElementById('historyChart');
    }

    /**
     * Attach event listeners to UI elements
     */
    attachEventListeners() {
        // Modal controls
        this.addDrinkerBtn.addEventListener('click', () => this.openModal());
        this.closeModal.addEventListener('click', () => this.closeModalDialog());
        this.drinkerModal.addEventListener('click', (e) => {
            if (e.target === this.drinkerModal) {
                this.closeModalDialog();
            }
        });
        
        // Form submission
        this.drinkerForm.addEventListener('submit', (e) => this.handleAddDrinker(e));
        
        // Action buttons
        this.drinkBtn.addEventListener('click', () => this.handleDrink());
        this.resetDayBtn.addEventListener('click', () => this.handleResetDay());
    }

    /**
     * Open the add drinker modal
     */
    openModal() {
        this.drinkerModal.classList.add('show');
        this.drinkerForm.reset();
    }

    /**
     * Close the add drinker modal
     */
    closeModalDialog() {
        this.drinkerModal.classList.remove('show');
    }

    /**
     * Handle add drinker form submission
     */
    handleAddDrinker(e) {
        e.preventDefault();
        
        const name = document.getElementById('drinkerName').value.trim();
        const weight = parseFloat(document.getElementById('drinkerWeight').value);
        const height = parseFloat(document.getElementById('drinkerHeight').value);
        const age = parseInt(document.getElementById('drinkerAge').value);
        
        if (!name || !weight || !height || !age) {
            alert('Please fill in all fields! 🐻');
            return;
        }
        
        const newDrinker = this.storage.addDrinker({ name, weight, height, age });
        this.loadDrinkers();
        this.closeModalDialog();
        
        // Auto-select the new drinker
        this.selectDrinker(newDrinker.id);
    }

    /**
     * Load and display all drinkers
     */
    loadDrinkers() {
        const drinkers = this.storage.getDrinkers();
        this.drinkerList.innerHTML = '';
        
        if (drinkers.length === 0) {
            this.drinkerList.innerHTML = '<p style="text-align: center; color: #999;">No bear buddies yet! Add one to get started 🐻</p>';
            return;
        }
        
        drinkers.forEach(drinker => {
            const card = this.createDrinkerCard(drinker);
            this.drinkerList.appendChild(card);
        });
    }

    /**
     * Create a drinker card element
     */
    createDrinkerCard(drinker) {
        const card = document.createElement('div');
        card.className = 'drinker-card';
        card.dataset.drinkerId = drinker.id;
        
        if (this.activeDrinker && this.activeDrinker.id === drinker.id) {
            card.classList.add('active');
        }
        
        card.innerHTML = `
            <h3>${drinker.name}</h3>
            <p>🎯 ${drinker.dailyGoal} oz/day</p>
            <button class="delete-btn" onclick="event.stopPropagation()">🗑️ Delete</button>
        `;
        
        // Click to select
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                this.selectDrinker(drinker.id);
            }
        });
        
        // Delete button
        card.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm(`Remove ${drinker.name} from your bear buddies? 🐻`)) {
                this.storage.deleteDrinker(drinker.id);
                this.loadDrinkers();
                
                if (this.activeDrinker && this.activeDrinker.id === drinker.id) {
                    this.activeDrinker = null;
                    this.activeDrinkerSection.style.display = 'none';
                    this.updateWaterLevel(0);
                }
            }
        });
        
        return card;
    }

    /**
     * Select a drinker and load their data
     */
    selectDrinker(drinkerId) {
        this.storage.setActiveDrinkerId(drinkerId);
        this.loadActiveDrinker();
        this.loadDrinkers(); // Refresh to update active state
    }

    /**
     * Load active drinker and display their data
     */
    loadActiveDrinker() {
        this.activeDrinker = this.storage.getActiveDrinker();
        
        if (!this.activeDrinker) {
            this.activeDrinkerSection.style.display = 'none';
            this.updateWaterLevel(0);
            return;
        }
        
        this.activeDrinkerSection.style.display = 'block';
        this.activeDrinkerName.textContent = `${this.activeDrinker.name}'s Splash Zone`;
        this.dailyGoal.textContent = this.activeDrinker.dailyGoal;
        
        this.updateDisplay();
    }

    /**
     * Update all display elements for active drinker
     */
    updateDisplay() {
        if (!this.activeDrinker) return;
        
        const todayIntake = this.storage.getTodayIntake(this.activeDrinker.id);
        const goal = this.activeDrinker.dailyGoal;
        const progress = WaterCalculator.calculateProgress(todayIntake, goal);
        const waterLevel = WaterCalculator.calculateWaterLevel(todayIntake, goal);
        
        // Update intake display
        this.currentIntake.textContent = todayIntake.toFixed(1);
        
        // Update progress bar
        this.progressBar.style.width = `${progress}%`;
        this.progressText.textContent = `${progress}%`;
        
        // Update water level
        this.updateWaterLevel(waterLevel);
        
        // Update history chart
        this.updateHistoryChart();
        
        // Check for goal completion
        if (progress >= 100 && todayIntake > 0) {
            this.showCelebration();
        }
    }

    /**
     * Handle drink button click
     */
    handleDrink() {
        if (!this.activeDrinker) return;
        
        const amount = 16.9; // One water bottle
        this.storage.addIntake(this.activeDrinker.id, amount);
        
        // Add splash animation to button
        this.drinkBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.drinkBtn.style.transform = '';
        }, 100);
        
        // Create water droplet animation
        this.createWaterDroplet();
        
        this.updateDisplay();
    }

    /**
     * Create a water droplet animation
     */
    createWaterDroplet() {
        const droplet = document.createElement('div');
        droplet.textContent = '💧';
        droplet.style.position = 'fixed';
        droplet.style.fontSize = '30px';
        droplet.style.left = '50%';
        droplet.style.top = '50%';
        droplet.style.zIndex = '1000';
        droplet.style.pointerEvents = 'none';
        droplet.style.animation = 'dropletFall 1s ease-out forwards';
        
        document.body.appendChild(droplet);
        
        setTimeout(() => {
            droplet.remove();
        }, 1000);
        
        // Add animation
        if (!document.getElementById('droplet-animation')) {
            const style = document.createElement('style');
            style.id = 'droplet-animation';
            style.textContent = `
                @keyframes dropletFall {
                    0% {
                        transform: translate(-50%, -50%) translateY(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateY(200px) scale(0.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Handle reset day button click
     */
    handleResetDay() {
        if (!this.activeDrinker) return;
        
        if (confirm('Reset today\'s water intake? This cannot be undone! 🐻')) {
            this.storage.resetTodayIntake(this.activeDrinker.id);
            this.updateDisplay();
        }
    }

    /**
     * Update water level visual
     */
    updateWaterLevel(percentage) {
        this.water.style.height = `${percentage}%`;
        
        // Move bear up with water
        const bearBottom = 50 + (percentage * 3); // Bear rises with water
        this.bearContainer.style.bottom = `${bearBottom}px`;
    }

    /**
     * Update history chart
     */
    updateHistoryChart() {
        if (!this.activeDrinker) return;
        
        const last7Days = this.storage.getLast7Days(this.activeDrinker.id);
        const goal = this.activeDrinker.dailyGoal;
        
        this.historyChart.innerHTML = '';
        
        last7Days.forEach(day => {
            const barContainer = document.createElement('div');
            barContainer.style.flex = '1';
            barContainer.style.position = 'relative';
            barContainer.style.height = '100%';
            
            const percentage = (day.intake / goal) * 100;
            const barHeight = Math.min(100, percentage);
            
            const bar = document.createElement('div');
            bar.className = 'history-bar';
            bar.style.height = `${barHeight}%`;
            
            const label = document.createElement('div');
            label.className = 'history-bar-label';
            label.textContent = day.label;
            
            const value = document.createElement('div');
            value.className = 'history-bar-value';
            value.textContent = day.intake > 0 ? `${day.intake.toFixed(0)}oz` : '';
            
            bar.appendChild(value);
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            this.historyChart.appendChild(barContainer);
        });
    }

    /**
     * Show celebration animation
     */
    showCelebration() {
        // Only show once per day
        if (this.celebration.classList.contains('active')) return;
        
        this.celebration.classList.add('active');
        
        // Create confetti
        this.createConfetti();
        
        // Hide after 4 seconds
        this.celebrationTimeout = setTimeout(() => {
            this.celebration.classList.remove('active');
            this.confettiContainer.innerHTML = '';
        }, 4000);
    }

    /**
     * Create confetti animation
     */
    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#00b894'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
            
            this.confettiContainer.appendChild(confetti);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SplashyBearApp();
});
