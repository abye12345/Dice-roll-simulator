// Dice Roll Simulator - Enhanced Version
class DiceRollSimulator {
  constructor() {
    this.diceContainer = document.getElementById("diceContainer");
    this.rollBtn = document.getElementById("rollBtn");
    this.autoRollBtn = document.getElementById("autoRollBtn");
    this.stopAutoBtn = document.getElementById("stopAutoBtn");
    this.diceCountSelect = document.getElementById("diceCount");
    this.rollResult = document.getElementById("rollResult");
    this.rollTotal = document.getElementById("rollTotal");
    this.clearHistoryBtn = document.getElementById("clearHistory");
    this.historyList = document.getElementById("historyList");

    // Statistics elements
    this.totalRollsEl = document.getElementById("totalRolls");
    this.averageRollEl = document.getElementById("averageRoll");
    this.highestRollEl = document.getElementById("highestRoll");
    this.lowestRollEl = document.getElementById("lowestRoll");

    // State management
    this.diceElements = [];
    this.rollHistory = [];
    this.autoRollInterval = null;
    this.isAutoRolling = false;
    this.statistics = {
      totalRolls: 0,
      totalSum: 0,
      highestRoll: 0,
      lowestRoll: Infinity,
      averageRoll: 0,
    };

    this.initializeEventListeners();
    this.generateDice();
  }

  initializeEventListeners() {
    this.rollBtn.addEventListener("click", () => this.rollDice());
    this.autoRollBtn.addEventListener("click", () => this.toggleAutoRoll());
    this.stopAutoBtn.addEventListener("click", () => this.stopAutoRoll());
    this.diceCountSelect.addEventListener("change", () => this.generateDice());
    this.clearHistoryBtn.addEventListener("click", () => this.clearHistory());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.rollDice();
      }
    });
  }

  generateDice() {
    const diceCount = parseInt(this.diceCountSelect.value);
    this.diceContainer.innerHTML = "";
    this.diceElements = [];

    for (let i = 0; i < diceCount; i++) {
      const dice = document.createElement("div");
      dice.className = "dice";
      dice.textContent = "?";
      dice.dataset.index = i;
      this.diceContainer.appendChild(dice);
      this.diceElements.push(dice);
    }
  }

  async rollDice() {
    if (this.isRolling) return;

    this.isRolling = true;
    this.rollBtn.disabled = true;

    // Clear previous results
    this.rollResult.textContent = "-";
    this.rollTotal.textContent = "Total: -";

    // Start rolling animation for all dice
    this.diceElements.forEach((dice) => {
      dice.textContent = "";
      dice.classList.add("rolling");
    });

    // Wait for animation
    await this.wait(1000);

    // Generate random numbers
    const results = this.diceElements.map(
      () => Math.floor(Math.random() * 6) + 1
    );
    const total = results.reduce((sum, num) => sum + num, 0);

    // Display results
    this.diceElements.forEach((dice, index) => {
      dice.textContent = results[index];
      dice.classList.remove("rolling");
    });

    // Update display
    this.rollResult.textContent = results.join(", ");
    this.rollTotal.textContent = `Total: ${total}`;

    // Update statistics
    this.updateStatistics(total);

    // Add to history
    this.addToHistory(results, total);

    // Re-enable button
    this.isRolling = false;
    this.rollBtn.disabled = false;

    // Add success animation
    this.addSuccessAnimation();
  }

  toggleAutoRoll() {
    if (this.isAutoRolling) {
      this.stopAutoRoll();
    } else {
      this.startAutoRoll();
    }
  }

  startAutoRoll() {
    this.isAutoRolling = true;
    this.autoRollBtn.style.display = "none";
    this.stopAutoBtn.style.display = "inline-flex";
    this.rollBtn.disabled = true;

    this.autoRollInterval = setInterval(() => {
      this.rollDice();
    }, 2000);
  }

  stopAutoRoll() {
    this.isAutoRolling = false;
    this.autoRollBtn.style.display = "inline-flex";
    this.stopAutoBtn.style.display = "none";
    this.rollBtn.disabled = false;

    if (this.autoRollInterval) {
      clearInterval(this.autoRollInterval);
      this.autoRollInterval = null;
    }
  }

  updateStatistics(total) {
    this.statistics.totalRolls++;
    this.statistics.totalSum += total;
    this.statistics.highestRoll = Math.max(this.statistics.highestRoll, total);
    this.statistics.lowestRoll = Math.min(this.statistics.lowestRoll, total);
    this.statistics.averageRoll =
      this.statistics.totalSum / this.statistics.totalRolls;

    // Update display
    this.totalRollsEl.textContent = this.statistics.totalRolls;
    this.averageRollEl.textContent = this.statistics.averageRoll.toFixed(1);
    this.highestRollEl.textContent = this.statistics.highestRoll;
    this.lowestRollEl.textContent =
      this.statistics.lowestRoll === Infinity ? 0 : this.statistics.lowestRoll;
  }

  addToHistory(results, total) {
    const timestamp = new Date();
    const historyItem = {
      results,
      total,
      timestamp,
    };

    this.rollHistory.unshift(historyItem);

    // Keep only last 50 rolls
    if (this.rollHistory.length > 50) {
      this.rollHistory.pop();
    }

    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    this.historyList.innerHTML = "";

    this.rollHistory.forEach((item) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      const rollText = document.createElement("span");
      rollText.className = "history-roll";
      rollText.textContent = `${item.results.join(", ")} (Total: ${
        item.total
      })`;

      const timeText = document.createElement("span");
      timeText.className = "history-time";
      timeText.textContent = item.timestamp.toLocaleTimeString();

      historyItem.appendChild(rollText);
      historyItem.appendChild(timeText);
      this.historyList.appendChild(historyItem);
    });
  }

  clearHistory() {
    this.rollHistory = [];
    this.updateHistoryDisplay();

    // Reset statistics
    this.statistics = {
      totalRolls: 0,
      totalSum: 0,
      highestRoll: 0,
      lowestRoll: Infinity,
      averageRoll: 0,
    };

    // Update display
    this.totalRollsEl.textContent = "0";
    this.averageRollEl.textContent = "0";
    this.highestRollEl.textContent = "0";
    this.lowestRollEl.textContent = "0";

    // Clear current roll
    this.rollResult.textContent = "-";
    this.rollTotal.textContent = "Total: -";
    this.diceElements.forEach((dice) => {
      dice.textContent = "?";
    });
  }

  addSuccessAnimation() {
    // Add a subtle success animation to the dice container
    this.diceContainer.style.transform = "scale(1.02)";
    setTimeout(() => {
      this.diceContainer.style.transform = "scale(1)";
    }, 200);
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize the simulator when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DiceRollSimulator();

  // Add some fun loading animation
  const container = document.querySelector(".container");
  container.style.opacity = "0";
  container.style.transform = "translateY(20px)";

  setTimeout(() => {
    container.style.transition = "all 0.6s ease";
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";
  }, 100);
});

// Add some fun easter eggs
document.addEventListener("keydown", (e) => {
  // Konami code easter egg
  if (e.code === "ArrowUp" && e.ctrlKey) {
    document.body.style.background =
      "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)";
    setTimeout(() => {
      document.body.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }, 2000);
  }
});
