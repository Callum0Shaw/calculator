(function () {
  /* APP STATE */

  const state = {
    result: '',
    currExp: [],
    currNum: '',
    showMore: false,
    negative: false,
    root: false,
  };

  /* SELECTORS/VARIABLES */

  let history = document.querySelector('.calc-history');
  let result = document.querySelector('.calc-result');
  let numberButtons = document.querySelectorAll('.calc-number');
  let functionButtons = document.querySelectorAll('.calc-function');
  let AcButton = document.querySelector('.calc-AC');
  let DelButton = document.querySelector('.calc-Del');
  let equalsButton = document.querySelector('.calc-equals');
  let toggleNegativeButton = document.querySelector('.calc-negative');
  let showMoreButton = document.querySelector('.calc-more');
  let powerButton = document.querySelector('.calc-power');
  let rootButton = document.querySelector('.calc-root');

  /* EVENT LISTENERS */

  numberButtons.forEach((el) => el.addEventListener('click', handleNumber));
  functionButtons.forEach((el) => el.addEventListener('click', handleOperator));
  AcButton.addEventListener('click', handleClear);
  DelButton.addEventListener('click', handleDel);
  equalsButton.addEventListener('click', handleEquals);
  toggleNegativeButton.addEventListener('click', toggleNegative);
  showMoreButton.addEventListener('click', toggleShowMore);

  /* EVENT HANDLERS */

  // Number stored as a string to ensure '.' works
  function handleNumber(event) {
    // Clear display if after previous expression resolves
    if (state.currExp.length === 0 && state.result !== '') {
      handleClear();
    }
    if (state.negative) {
      state.currNum = `-${state.currNum}${event.target.innerText}`;
      state.negative = false;
    } else state.currNum = `${state.currNum}${event.target.innerText}`;

    if (isNaN(state.currExp.at(-1))) state.currExp.push(state.currNum);
    else state.currExp.splice(-1, 1, state.currNum);

    updateDisplay();
  }

  function handleOperator(event) {
    if (state.result !== '') {
      state.currNum = state.result;
      state.currExp.push(state.currNum);
    }

    if (state.currExp.length === 0) return warning(event);

    const operator = event.target.innerText;

    state.currNum = '';

    // If second operator, resolve current expression and set result of that as first number in a new expression
    if (state.currExp.length > 2) {
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
    if (isNaN(state.currExp.at(-1)) || state.currNum < 10) {
      state.currExp.pop();
      state.currNum = '';
    } else {
      state.currNum = Math.floor(state.currNum / 10);
      state.currExp.splice(-1, 1, state.currNum);
    }
    updateDisplay();
    console.log(state);
  }

  function handleClear(event) {
    state.result = '';
    state.currExp = [];
    state.currNum = '';
    updateDisplay();
  }

  function handleEquals(event) {
    if (state.currNum === '') return warning(event);
    if (state.currExp.at(-1) === '√') {
      return (result.innerText = "Can't sqrt nothing!");
    }

    let answer = calculate(state.currExp.join(''));
    isNaN(answer) || answer === Infinity || answer === -Infinity
      ? (state.result = 'MATHS IS HARD')
      : (state.result = formatNumber(answer));

    updateDisplay();

    state.currNum = '';
    state.currExp = [];
  }

  function toggleNegative(event) {
    if (isNaN(state.currExp.at(-1))) state.negative = true;
    else state.currExp.splice(-1, 1, 0 - state.currExp.at(-1));
    updateDisplay();
  }

  function toggleShowMore(event) {
    if (!state.showMore) {
      rootButton.innerText = '√';
      powerButton.innerText = '^';
    } else {
      rootButton.innerText = '/';
      powerButton.innerText = '*';
    }
    state.showMore = !state.showMore;
  }

  function handleRoot(event) {}
  /* HELPER FUNCTIONS */

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
    let firstNum = parseFloat(state.currExp[0]);
    let secondNum = parseFloat(state.currExp[2]);

    let maxDecimal = Math.max(
      decimalPlaces(firstNum),
      decimalPlaces(secondNum)
    );

    if (maxDecimal) {
      firstNum = firstNum * maxDecimal * 10;
      secondNum = secondNum * maxDecimal * 10;
    }

    switch (state.currExp[1].trim()) {
      case '+':
        return maxDecimal
          ? (firstNum + secondNum) / (maxDecimal * 10)
          : firstNum + secondNum;
      case '-':
        return maxDecimal
          ? (firstNum - secondNum) / (maxDecimal * 10)
          : firstNum - secondNum;
      case '/':
        return maxDecimal
          ? firstNum / secondNum / (maxDecimal * 100)
          : firstNum / secondNum;
      case '*':
        return maxDecimal
          ? (firstNum * secondNum) / (maxDecimal * 100)
          : firstNum * secondNum;
      case '^':
        return maxDecimal
          ? Math.pow(firstNum, secondNum) / (maxDecimal * 100)
          : Math.pow(firstNum, secondNum);
      default:
        return 'ERROR';
    }
  }

  function decimalPlaces(num) {
    if (Number.isInteger(num)) return 1;
    return num.toString().split('.')[1].length;
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
