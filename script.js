(function () {
  // STATE/VARIABLES
  let state = {
    result: '',
    currExp: [],
    currNum: '',
    more: false,
    negative: false,
  };

  // SELECTORS/VARIABLES
  let history = document.querySelector('.calc-history');
  let result = document.querySelector('.calc-result');
  let numberButtons = document.querySelectorAll('.calc-number');
  let functionButtons = document.querySelectorAll('.calc-function');
  let AcButton = document.querySelector('.calc-AC');
  let DelButton = document.querySelector('.calc-Del');
  let equalsButton = document.querySelector('.calc-equals');
  let negButton = document.querySelector('.calc-negative');
  let moreButton = document.querySelector('.calc-more');
  let powerButton = document.querySelector('.calc-power');
  let rootButton = document.querySelector('.calc-root');

  // EVENT LISTENERS
  numberButtons.forEach((el) => el.addEventListener('click', handleNumber));
  functionButtons.forEach((el) => el.addEventListener('click', handleOperator));
  AcButton.addEventListener('click', handleClear);
  DelButton.addEventListener('click', handleDel);
  equalsButton.addEventListener('click', handleEquals);
  negButton.addEventListener('click', handleNegative);
  moreButton.addEventListener('click', toggleMore);

  // EVENT FUNCTIONS

  function handleNumber(event) {
    // Clear display if new expression
    if (state.currExp.length === 0 && state.result !== '') {
      handleClear();
    }
    if (state.negative) {
      state.currNum = parseInt(`-${state.currNum}${event.target.innerText}`);
      state.negative = false;
    } else
      state.currNum = parseInt(`${state.currNum}${event.target.innerText}`);

    if (isNaN(state.currExp.at(-1))) state.currExp.push(state.currNum);
    else state.currExp.splice(-1, 1, state.currNum);

    updateDisplay();
  }

  // TODO: Break up/simplify function
  function handleOperator(event) {
    if (event.target.innerText === '√') return handleRoot(event);
    // If there is a result, change currNum to new result
    if (state.result !== '') {
      state.currNum = parseInt(state.result);
      state.currExp.push(state.currNum);
    }

    // Issue warning if no number before operator
    if (state.currExp.length === 0) return warning(event);

    const operator = event.target.innerText;

    state.currNum = '';

    // If second operator, resolve current expression and set result of that as first number in a new expression - update history
    if (state.currExp.length === 3) {
      const answer = calculate();
      state.currExp = [answer];
    }
    // if last input is operator, override
    isNaN(state.currExp.at(-1))
      ? state.currExp.splice(-1, 1, ` ${operator} `)
      : state.currExp.push(` ${operator} `);

    updateDisplay();
  }

  function handleDel(event) {
    if (isNaN(state.currExp.at(-1))) state.currExp.pop();
    else {
      state.currNum = Math.floor(state.currNum / 10);
      state.currExp.splice(-1, 1, state.currNum);
    }
    updateDisplay();
  }

  function handleClear(event) {
    state.result = '';
    state.currExp = [];
    state.currNum = '';
    updateDisplay();
  }

  function handleEquals(event) {
    if (state.currNum === '') return warning(event);

    let answer = calculate(state.currExp.join(''));
    isNaN(answer) || answer === Infinity || answer === -Infinity
      ? (state.result = 'MATHS IS HARD')
      : (state.result = formatNumber(answer));

    updateDisplay();

    state.currNum = '';
    state.currExp = [];
  }

  function handleNegative(event) {
    if (isNaN(state.currExp.at(-1))) state.negative = true;
    else state.currExp.splice(-1, 1, 0 - state.currExp.at(-1));
    updateDisplay();
  }

  function toggleMore(event) {
    if (!state.more) {
      rootButton.innerText = '√';
      powerButton.innerText = '^';
    } else {
      rootButton.innerText = '/';
      powerButton.innerText = '*';
    }
    state.more = !state.more;
  }

  function handleRoot(event) {
    console.log('root');
  }
  // HELPER FUNCTION
  function updateDisplay() {
    history.innerText = state.currExp.join(' ');
    result.innerText = state.result;
  }

  function warning(event) {
    event.target.classList.add('calc-button-warning');
    setTimeout(() => event.target.classList.remove('calc-button-warning'), 100);
  }

  function calculate() {
    if (state.currExp.length === 1) return state.currExp[0];
    const firstNum = state.currExp[0];
    const secondNum = state.currExp[2];
    switch (state.currExp[1].trim()) {
      case '+':
        return firstNum + secondNum;
      case '-':
        return firstNum - secondNum;
      case '/':
        return firstNum / secondNum;
      case '*':
        return firstNum * secondNum;
      case '+':
        return firstNum + secondNum;
      case '^':
        return Math.pow(firstNum, secondNum);
      default:
        return 'ERROR';
    }
  }

  function roundToTenDigits(num) {
    let arr = num.toString().split('');
    if (arr.includes('.')) return arr.slice(0, 10).join('');
    return parseInt(arr.slice(0, 10).join(''));
  }

  function formatNumber(num) {
    const rounded = roundToTenDigits(num);
    return rounded.toLocaleString();
  }
})();
