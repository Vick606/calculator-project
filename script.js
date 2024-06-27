let displayValue = '0';
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const decimalButton = document.querySelector('.decimal');
const backspaceButton = document.querySelector('.backspace');

function updateDisplay() {
    if (displayValue.length > 12) {
        displayValue = parseFloat(displayValue).toExponential(5);
    }
    display.textContent = displayValue;
    decimalButton.disabled = displayValue.includes('.');
}

function inputNumber(number) {
    if (waitingForSecondNumber) {
        displayValue = number;
        waitingForSecondNumber = false;
    } else {
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
}

function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondNumber) {
        operator = nextOperator;
        return;
    }

    if (firstNumber === null && !isNaN(inputValue)) {
        firstNumber = inputValue;
    } else if (operator) {
        const result = operate(operator, firstNumber, inputValue);
        if (result === "Error: Division by zero") {
            displayValue = result;
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;
            updateDisplay();
            return;
        }
        displayValue = String(result);
        firstNumber = result;
    }

    waitingForSecondNumber = true;
    operator = nextOperator;
}

function clear() {
    displayValue = '0';
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
}

function backspace() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
}

// Event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        inputNumber(button.textContent);
        updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.dataset.operator);
        updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    if (operator && !waitingForSecondNumber) {
        const secondNumber = parseFloat(displayValue);
        displayValue = operate(operator, firstNumber, secondNumber);
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        updateDisplay();
    }
});

clearButton.addEventListener('click', () => {
    clear();
    updateDisplay();
});

decimalButton.addEventListener('click', () => {
    inputDecimal();
    updateDisplay();
});

backspaceButton.addEventListener('click', () => {
    backspace();
    updateDisplay();
});

// Basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return b === 0 ? "Error: Division by zero" : a / b;
}

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        case '%':
            return (a / 100) * b; 
            return null;
    }
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') inputNumber(event.key);
    if (event.key === '.') inputDecimal();
    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') handleOperator(event.key);
    if (event.key === 'Enter' || event.key === '=') equalsButton.click();
    if (event.key === 'Backspace') backspace();
    if (event.key === 'Escape') clear();
    updateDisplay();
});

updateDisplay();