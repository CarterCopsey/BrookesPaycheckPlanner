// Application State
let paycheckData = {
    income: 0,
    housing: 0,
    utilities: 0,
    food: 0,
    transportation: 0,
    otherNeeds: 0,
    wants: 0,
    emergency: 0,
    debt: 0,
    goals: 0
};

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function parseAmount(value) {
    return parseFloat(value) || 0;
}

function calculateRemaining() {
    const allocated = paycheckData.housing +
                     paycheckData.utilities +
                     paycheckData.food +
                     paycheckData.transportation +
                     paycheckData.otherNeeds +
                     paycheckData.wants;
    return paycheckData.income - allocated;
}

// Page Navigation
function goToPage(pageId) {
    const currentPage = document.querySelector('.page.active');
    const nextPage = document.getElementById(pageId);

    if (currentPage) {
        currentPage.classList.add('exit');
        setTimeout(() => {
            currentPage.classList.remove('active', 'exit');
        }, 500);
    }

    setTimeout(() => {
        nextPage.classList.add('active');
        nextPage.classList.add('fade-in');

        // Update balance displays
        updateBalanceDisplays();

        // Initialize Feather icons for new page
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 250);
}

// Income Setting
function setIncome() {
    const incomeInput = document.getElementById('income-input');
    const income = parseAmount(incomeInput.value);

    if (income <= 0) {
        showValidationMessage(incomeInput, "Please enter a valid income amount. Every dollar matters! 💕");
        return;
    }

    paycheckData.income = income;
    goToPage('housing-page');
}

// Fixed Expense Allocation (for rent, groceries, transportation)
function allocateFixedExpense(category, amount, nextPageId) {
    // Map categories to the correct data fields
    const categoryMap = {
        'housing': ['housing', 'utilities'], // Rent + Utilities = $375
        'food': ['food'], // Groceries = $50
        'transportation': ['transportation'] // Insurance + Septa + Subscriptions = $174
    };

    // Allocate the fixed amount
    if (category === 'housing') {
        paycheckData.housing = 275;
        paycheckData.utilities = 100;
    } else if (category === 'food') {
        paycheckData.food = amount;
    } else if (category === 'transportation') {
        paycheckData.transportation = amount;
    }

    // Update wants page when going to it
    if (nextPageId === 'wants-page') {
        setTimeout(() => {
            updateWantsPage();
        }, 300);
    }

    goToPage(nextPageId);
}

// Expense Allocation (for wants and other user-input expenses)
function allocateExpense(category, nextPageId) {
    const input = document.getElementById(`${category}-input`);
    const amount = parseAmount(input.value);

    if (amount < 0) {
        showValidationMessage(input, "BAD GIRL! DO IT NOW");
        return;
    }

    const currentAllocated = paycheckData.housing +
                            paycheckData.utilities +
                            paycheckData.food +
                            paycheckData.transportation +
                            paycheckData.otherNeeds +
                            paycheckData.wants;

    const newTotal = currentAllocated - paycheckData[category] + amount;

    if (newTotal > paycheckData.income) {
        const available = paycheckData.income - (currentAllocated - paycheckData[category]);
        showValidationMessage(input, "BAD GIRL! DO IT NOW");
        return;
    }

    paycheckData[category] = amount;
    goToPage(nextPageId);
}

// Update Wants Page with remaining amount and 15% calculation
function updateWantsPage() {
    const remaining = calculateRemaining();
    const fifteenPercent = remaining * 0.15;
    
    document.getElementById('remaining-amount').textContent = remaining.toFixed(2);
    document.getElementById('fifteen-percent').textContent = fifteenPercent.toFixed(2);
}

// Update Balance Displays
function updateBalanceDisplays() {
    const remaining = calculateRemaining();

    // Update all balance displays
    const balanceElements = document.querySelectorAll('[id^="balance-"]');
    balanceElements.forEach(element => {
        element.textContent = remaining.toFixed(2);
    });

    // Update wants page if on that page
    if (document.getElementById('wants-page').classList.contains('active')) {
        updateWantsPage();
    }

    // Update final balance display for savings page
    if (document.getElementById('savings-page').classList.contains('active')) {
        const remainingAfterWants = remaining - paycheckData.wants;
        document.getElementById('balance-final').textContent = remainingAfterWants.toFixed(2);
    }
}

// Update Savings Message
function updateSavingsMessage(remaining) {
    const messageElement = document.getElementById('savings-message');

    if (remaining > 0) {
        messageElement.innerHTML = `Look at that! You have <strong>$${remaining.toFixed(2)}</strong> left to secure your beautiful future. 🌟`;
        messageElement.style.color = '#38a169';
    } else if (remaining === 0) {
        messageElement.innerHTML = 'Perfect! You\'ve allocated every dollar thoughtfully. You\'re already winning! 🎯';
        messageElement.style.color = '#805ad5';
    } else {
        messageElement.innerHTML = `Looks like you're a little over budget by <strong>$${Math.abs(remaining).toFixed(2)}</strong>. No worries - let's go back and adjust together! 💪`;
        messageElement.style.color = '#e53e3e';
    }
}

// Complete Planning
function completePlanning() {
    const debt = parseAmount(document.getElementById('debt-input').value);
    const goals = parseAmount(document.getElementById('goals-input').value);

    const remaining = calculateRemaining();
    const remainingAfterWants = remaining - paycheckData.wants;
    const savingsTotal = debt + goals;

    if (savingsTotal > remainingAfterWants) {
        alert("BAD GIRL! DO IT NOW");
        return;
    }

    paycheckData.emergency = 0;
    paycheckData.debt = debt;
    paycheckData.goals = goals;

    generateSummary();
    goToPage('summary-page');
}

// Generate Summary
function generateSummary() {
    const summaryContainer = document.getElementById('summary-details');
    const finalRemaining = calculateRemaining() - paycheckData.emergency - paycheckData.debt - paycheckData.goals;

    const summaryItems = [
        { label: '💰 Income', amount: paycheckData.income, category: 'income' },
        { label: '🏠 Housing', amount: paycheckData.housing, category: 'expense' },
        { label: '⚡ Utilities', amount: paycheckData.utilities, category: 'expense' },
        { label: '🥗 Food', amount: paycheckData.food, category: 'expense' },
        { label: '🚗 Transportation', amount: paycheckData.transportation, category: 'expense' },
        { label: '🧴 Other Needs', amount: paycheckData.otherNeeds, category: 'expense' },
        { label: '🌟 Wants', amount: paycheckData.wants, category: 'expense' },
        { label: '🛡️ Emergency Fund', amount: paycheckData.emergency, category: 'savings' },
        { label: '💪 Extra Debt Payment', amount: paycheckData.debt, category: 'savings' },
        { label: '🎯 Future Goals', amount: paycheckData.goals, category: 'savings' },
        { label: '💸 Unallocated', amount: finalRemaining, category: 'remaining' }
    ];

    summaryContainer.innerHTML = summaryItems
        .filter(item => item.amount > 0 || item.category === 'income')
        .map(item => `
            <div class="summary-item ${item.category}">
                <span class="summary-label">${item.label}</span>
                <span class="summary-amount">${formatCurrency(item.amount)}</span>
            </div>
        `).join('');
}

// Validation Message
function showValidationMessage(input, message) {
    // Remove existing validation message
    const existingMessage = input.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new validation message
    const messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    messageElement.style.cssText = `
        color: #e53e3e;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        padding: 0.75rem;
        background: rgba(229, 62, 62, 0.1);
        border-radius: 8px;
        border-left: 3px solid #e53e3e;
    `;
    messageElement.textContent = message;

    input.parentNode.appendChild(messageElement);
    input.focus();

    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Restart Function
function restart() {
    // Reset all data
    paycheckData = {
        income: 0,
        housing: 0,
        utilities: 0,
        food: 0,
        transportation: 0,
        otherNeeds: 0,
        wants: 0,
        emergency: 0,
        debt: 0,
        goals: 0
    };

    // Clear all inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = '';
    });

    // Remove any validation messages
    const validationMessages = document.querySelectorAll('.validation-message');
    validationMessages.forEach(msg => msg.remove());

    // Go back to welcome page
    goToPage('welcome-page');
}

// Auto-save input values as user types
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Add event listeners for real-time balance updates
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove validation messages when user starts typing
            const existingMessage = this.parentNode.querySelector('.validation-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Update balance displays for savings page
            if (document.getElementById('savings-page').classList.contains('active')) {
                updateBalanceDisplays();
            }
        });

        // Enter key to continue
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const currentPage = document.querySelector('.page.active');
                const button = currentPage.querySelector('.btn-primary');
                if (button) {
                    button.click();
                }
            }
        });
    });
});

// Prevent negative values
document.addEventListener('input', function(e) {
    if (e.target.type === 'number' && e.target.value < 0) {
        e.target.value = '';
    }
});

// Add smooth scrolling for mobile
document.addEventListener('touchstart', function() {}, { passive: true });