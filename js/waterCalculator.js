/**
 * Water Calculator
 * Calculates recommended daily water intake based on weight, height, and age
 */
class WaterCalculator {
    /**
     * Calculate daily water intake in fluid ounces
     * Formula: (Weight in lbs × 0.5) + (Height in inches × 0.1) - (Age × 0.2)
     * Minimum 64 oz, Maximum 128 oz
     * 
     * @param {number} weight - Weight in pounds
     * @param {number} height - Height in inches
     * @param {number} age - Age in years
     * @returns {number} Recommended daily water intake in fluid ounces
     */
    static calculateDailyIntake(weight, height, age) {
        // Base calculation
        let intake = (weight * 0.5) + (height * 0.1) - (age * 0.2);
        
        // Ensure minimum of 64 oz and maximum of 128 oz
        intake = Math.max(64, Math.min(128, intake));
        
        // Round to nearest 0.1
        return Math.round(intake * 10) / 10;
    }

    /**
     * Calculate percentage of goal achieved
     * @param {number} current - Current intake in oz
     * @param {number} goal - Daily goal in oz
     * @returns {number} Percentage (0-100)
     */
    static calculateProgress(current, goal) {
        if (goal === 0) return 0;
        const percentage = (current / goal) * 100;
        return Math.min(100, Math.round(percentage));
    }

    /**
     * Calculate water level height for visual display (0-100)
     * @param {number} current - Current intake in oz
     * @param {number} goal - Daily goal in oz
     * @returns {number} Height percentage (0-100)
     */
    static calculateWaterLevel(current, goal) {
        if (goal === 0) return 0;
        const level = (current / goal) * 100;
        return Math.min(100, Math.max(0, level));
    }

    /**
     * Get motivational message based on progress
     * @param {number} percentage - Progress percentage
     * @returns {string} Motivational message
     */
    static getMotivationalMessage(percentage) {
        if (percentage >= 100) {
            return "🎉 Amazing! You've reached your goal!";
        } else if (percentage >= 75) {
            return "🌟 Almost there! Keep splashing!";
        } else if (percentage >= 50) {
            return "💪 Halfway to hydration heaven!";
        } else if (percentage >= 25) {
            return "🐻 Great start! Keep it up!";
        } else {
            return "💧 Let's make some splashes today!";
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaterCalculator;
}
