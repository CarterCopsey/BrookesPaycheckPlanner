// Application State
let paycheckData = {
    income: 0,
    housing: 0,
    utilities: 0,
    food: 0,
    transportation: 0,
    wants: 0
};

// ===== UTILITY FUNCTIONS =====
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
                     paycheckData.wants;
    return paycheckData.income - allocated;
}

// ===== PAGE NAVIGATION =====
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

// ===== INCOME SETTING =====
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

// ===== FIXED EXPENSE ALLOCATION =====
function allocateFixedExpense(category, amount, nextPageId) {
    // Map categories to the correct data fields
    if (category === 'housing') {
        paycheckData.housing = 275;
        paycheckData.utilities = 100;
    } else if (category === 'food') {
        paycheckData.food = amount;
    } else if (category === 'transportation') {
        paycheckData.transportation = amount;
    }

    // Update savings page when going to it
    if (nextPageId === 'savings-page') {
        setTimeout(() => {
            updateWantMoneyPage();
        }, 300);
    }

    goToPage(nextPageId);
}

// ===== WANTS ALLOCATION =====
function allocateFinalWants() {
    const input = document.getElementById('final-wants-input');
    const amount = parseAmount(input.value);
    const remaining = calculateRemaining();

    if (amount < 0) {
        showValidationMessage(input, "BAD GIRL! DO IT NOW");
        return;
    }

    if (amount > remaining) {
        showValidationMessage(input, "BAD GIRL! DO IT NOW");
        return;
    }

    paycheckData.wants += amount;

    // Update final page
    const finalRemaining = remaining - amount;
    document.getElementById('final-remaining').textContent = finalRemaining.toFixed(2);

    goToPage('final-page');
}

// ===== BALANCE UPDATES =====
function updateBalanceDisplays() {
    const remaining = calculateRemaining();

    // Update all balance displays
    const balanceElements = document.querySelectorAll('[id^="balance-"]');
    balanceElements.forEach(element => {
        element.textContent = remaining.toFixed(2);
    });

    // Update wants page if on that page
    if (document.getElementById('savings-page').classList.contains('active')) {
        updateWantMoneyPage();
    }
}

function updateWantMoneyPage() {
    const remaining = calculateRemaining();
    const fifteenPercent = remaining * 0.15;

    document.getElementById('remaining-for-wants').textContent = remaining.toFixed(2);
    document.getElementById('fifteen-percent-calc').textContent = fifteenPercent.toFixed(2);
}

// ===== VALIDATION =====
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

// ===== RESTART FUNCTION =====
function restart() {
    // Reset all data
    paycheckData = {
        income: 0,
        housing: 0,
        utilities: 0,
        food: 0,
        transportation: 0,
        wants: 0
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

// ===== EVENT LISTENERS =====
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