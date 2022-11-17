(function () {
  // STATE/VARIABLES
  let state = {
    history: [],
    result: '',
    currExp: [],
    currNum: '',
    more: false
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
  let moreButton = document.querySelector('.calc-more')
  let powerButton = document.querySelector('.calc-power')
  let rootButton = document.querySelector('.calc-root')

  // EVENT LISTENERS
  numberButtons.forEach((el) => el.addEventListener('click', handleNumber));
  functionButtons.forEach((el) => el.addEventListener('click', handleOperator));
  AcButton.addEventListener('click', handleClear);
  DelButton.addEventListener('click', handleDel);
  equalsButton.addEventListener('click', handleEquals);
  negButton.addEventListener('click', handleNegative);
  moreButton.addEventListener('click', toggleMore)

  // EVENT FUNCTIONS
  function updateDisplay() {
    history.innerText = state.history.join('');
    result.innerText = state.result;
  }

  function handleNumber(event) {
    // clear display if new expression
    if (state.currExp.length === 0 && state.result !== '') {
      handleClear();
    }
    state.currNum = parseInt(`${state.currNum}${event.target.innerText}`);
    state.history.push(event.target.innerText);
    updateDisplay();
  }

  // TODO: Break up/simplify function
  function handleOperator(event) {
    // Issue warning if no number before operator
    if (state.currNum === '') return warning(event);

    // If there is a result, change currNum to new result
    if (state.result !== '') state.currNum = state.result;

    const operator = event.target.innerText;

    state.currExp.push(parseInt(state.currNum));
    state.currNum = '';

    // If if second operator, resolve current expression and set result of that as first number in a new expression - update history
    if (state.currExp.length === 3) {
      const answer = calculate(state.currExp.join(''));
      state.history = [answer];
      state.currExp = [answer];
    }

    state.currExp.push(operator);

    // if last input is operator, override
    const regex = /[^0-9]/;
    if (regex.test(state.history.at(-1))) {
      state.history.splice(-1, 1, ` ${operator} `);
    } else {
      state.history.push(` ${operator} `);
    }
    updateDisplay();
    console.log(state);
  }

  function handleDel(event) {
    state.history.pop();
    updateDisplay();
  }

  function handleClear(event) {
    state.history = [];
    state.result = '';
    state.currExp = [];
    state.currNum = [];
    updateDisplay();
  }

  function handleEquals(event) {
    if (state.currNum === '') return warning(event);

    state.currExp.push(state.currNum);
    state.currNum = '';

    let answer = calculate(state.currExp.join(''));
    if (isNaN(answer) || answer === Infinity || answer === -Infinity)
    state.result = 'ERROR';
    else state.result = formatNumber(answer);
    
    updateDisplay();
    state.currExp = [];
    console.log(state);
  }

  function handleNegative(event) {
    if (state.currNum[0] === '-') state.currNum.shift();
    else state.currNum.unshift('-');
    updateDisplay;
  }

  function toggleMore(event) {
    if(!state.more) {
      rootButton.innerText = '√'
      powerButton.innerText = '^'
    }
    else {
      rootButton.innerText = '/'
      powerButton.innerText = '*'
    }
    state.more = !state.more
  }

  // HELPER FUNCTION

  function warning(event) {
    event.target.classList.add('calc-button-warning');
    setTimeout(() => event.target.classList.remove('calc-button-warning'), 100);
  }

  function calculate() {
    if(state.currExp.length === 1) return state.currExp[1]
    if(state.currExp.length === 2) return "ERROR"
    const firstNum = state.currExp[0];
    const secondNum = state.currExp[2];
    switch (state.currExp[1]) {
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
        return Math.pow(firstNum, secondNum)
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
