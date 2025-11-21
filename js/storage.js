/**
 * Storage Manager
 * Handles all localStorage operations for drinkers and daily water tracking
 */

class StorageManager {
    constructor() {
        this.DRINKERS_KEY = 'splashyBear_drinkers';
        this.DAILY_DATA_KEY = 'splashyBear_dailyData';
        this.ACTIVE_DRINKER_KEY = 'splashyBear_activeDrinker';
    }

    /**
     * Get all drinkers from localStorage
     * @returns {Array} Array of drinker objects
     */
    getDrinkers() {
        const data = localStorage.getItem(this.DRINKERS_KEY);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Save drinkers to localStorage
     * @param {Array} drinkers - Array of drinker objects
     */
    saveDrinkers(drinkers) {
        localStorage.setItem(this.DRINKERS_KEY, JSON.stringify(drinkers));
    }

    /**
     * Add a new drinker
     * @param {Object} drinker - Drinker object with name, weight, height, age
     * @returns {Object} The created drinker with id and dailyGoal
     */
    addDrinker(drinker) {
        const drinkers = this.getDrinkers();
        const newDrinker = {
            id: Date.now().toString(),
            name: drinker.name,
            weight: drinker.weight,
            height: drinker.height,
            age: drinker.age,
            dailyGoal: WaterCalculator.calculateDailyIntake(
                drinker.weight,
                drinker.height,
                drinker.age
            ),
            createdAt: new Date().toISOString()
        };
        drinkers.push(newDrinker);
        this.saveDrinkers(drinkers);
        return newDrinker;
    }

    /**
     * Delete a drinker
     * @param {string} drinkerId - ID of drinker to delete
     */
    deleteDrinker(drinkerId) {
        let drinkers = this.getDrinkers();
        drinkers = drinkers.filter(d => d.id !== drinkerId);
        this.saveDrinkers(drinkers);
        
        // Also clear their daily data
        this.clearDrinkerData(drinkerId);
        
        // Clear active drinker if it was deleted
        if (this.getActiveDrinkerId() === drinkerId) {
            this.setActiveDrinkerId(null);
        }
    }

    /**
     * Get active drinker ID
     * @returns {string|null} Active drinker ID
     */
    getActiveDrinkerId() {
        return localStorage.getItem(this.ACTIVE_DRINKER_KEY);
    }

    /**
     * Set active drinker ID
     * @param {string|null} drinkerId - Drinker ID to set as active
     */
    setActiveDrinkerId(drinkerId) {
        if (drinkerId) {
            localStorage.setItem(this.ACTIVE_DRINKER_KEY, drinkerId);
        } else {
            localStorage.removeItem(this.ACTIVE_DRINKER_KEY);
        }
    }

    /**
     * Get active drinker object
     * @returns {Object|null} Active drinker object
     */
    getActiveDrinker() {
        const drinkerId = this.getActiveDrinkerId();
        if (!drinkerId) return null;
        
        const drinkers = this.getDrinkers();
        return drinkers.find(d => d.id === drinkerId) || null;
    }

    /**
     * Get today's date string (YYYY-MM-DD)
     * @returns {string} Date string
     */
    getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    /**
     * Get all daily data from localStorage
     * @returns {Object} Object with drinkerId as keys
     */
    getAllDailyData() {
        const data = localStorage.getItem(this.DAILY_DATA_KEY);
        return data ? JSON.parse(data) : {};
    }

    /**
     * Save all daily data to localStorage
     * @param {Object} dailyData - Daily data object
     */
    saveAllDailyData(dailyData) {
        localStorage.setItem(this.DAILY_DATA_KEY, JSON.stringify(dailyData));
    }

    /**
     * Get daily data for a specific drinker
     * @param {string} drinkerId - Drinker ID
     * @returns {Object} Object with dates as keys and intake values
     */
    getDrinkerDailyData(drinkerId) {
        const allData = this.getAllDailyData();
        return allData[drinkerId] || {};
    }

    /**
     * Get today's intake for a drinker
     * @param {string} drinkerId - Drinker ID
     * @returns {number} Today's intake in oz
     */
    getTodayIntake(drinkerId) {
        const dailyData = this.getDrinkerDailyData(drinkerId);
        const today = this.getTodayString();
        return dailyData[today] || 0;
    }

    /**
     * Add water intake for a drinker
     * @param {string} drinkerId - Drinker ID
     * @param {number} amount - Amount to add in oz
     * @returns {number} New total for today
     */
    addIntake(drinkerId, amount) {
        const allData = this.getAllDailyData();
        const today = this.getTodayString();
        
        if (!allData[drinkerId]) {
            allData[drinkerId] = {};
        }
        
        const currentIntake = allData[drinkerId][today] || 0;
        allData[drinkerId][today] = currentIntake + amount;
        
        this.saveAllDailyData(allData);
        this.cleanOldData(drinkerId); // Clean up old data
        
        return allData[drinkerId][today];
    }

    /**
     * Reset today's intake for a drinker
     * @param {string} drinkerId - Drinker ID
     */
    resetTodayIntake(drinkerId) {
        const allData = this.getAllDailyData();
        const today = this.getTodayString();
        
        if (allData[drinkerId]) {
            allData[drinkerId][today] = 0;
            this.saveAllDailyData(allData);
        }
    }

    /**
     * Get last 7 days of data for a drinker
     * @param {string} drinkerId - Drinker ID
     * @returns {Array} Array of {date, intake, label} objects
     */
    getLast7Days(drinkerId) {
        const dailyData = this.getDrinkerDailyData(drinkerId);
        const result = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            // Format label (e.g., "Mon", "Tue")
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const label = i === 0 ? 'Today' : dayNames[date.getDay()];
            
            result.push({
                date: dateString,
                intake: dailyData[dateString] || 0,
                label: label
            });
        }
        
        return result;
    }

    /**
     * Clean data older than 7 days for a drinker
     * @param {string} drinkerId - Drinker ID
     */
    cleanOldData(drinkerId) {
        const allData = this.getAllDailyData();
        const drinkerData = allData[drinkerId];
        
        if (!drinkerData) return;
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];
        
        // Remove dates older than 7 days
        for (const date in drinkerData) {
            if (date < cutoffDate) {
                delete drinkerData[date];
            }
        }
        
        this.saveAllDailyData(allData);
    }

    /**
     * Clear all data for a drinker
     * @param {string} drinkerId - Drinker ID
     */
    clearDrinkerData(drinkerId) {
        const allData = this.getAllDailyData();
        delete allData[drinkerId];
        this.saveAllDailyData(allData);
    }

    /**
     * Clear all data (for testing/reset purposes)
     */
    clearAllData() {
        localStorage.removeItem(this.DRINKERS_KEY);
        localStorage.removeItem(this.DAILY_DATA_KEY);
        localStorage.removeItem(this.ACTIVE_DRINKER_KEY);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
