(function () {
  // STATE/VARIABLES
  let state = {
    history: [],
    result: '',
    currExp: [],
    currNum: [],
  };

  // SELECTORS/VARIABLES
  let history = document.querySelector('.calc-history');
  let result = document.querySelector('.calc-result');
  let numberButtons = document.querySelectorAll('.calc-number');
  let functionButtons = document.querySelectorAll('.calc-function');
  let AcButton = document.querySelector('.calc-AC');
  let DelButton = document.querySelector('.calc-Del');
  let equalsButton = document.querySelector('.calc-equals');

  // EVENT LISTENERS
  numberButtons.forEach((el) => el.addEventListener('click', handleNumber));
  functionButtons.forEach((el) => el.addEventListener('click', handleOperator));
  AcButton.addEventListener('click', handleClear);
  DelButton.addEventListener('click', handleDel);
  equalsButton.addEventListener('click', handleEquals);

  // FUNCTIONS
  function updateDisplay() {
    history.innerText = state.history.join('');
    result.innerText = state.result;
  }

  function handleNumber(event) {
    // if there is a result, clear history/result
    console.log(state);
    if (state.currExp.length === 0 && state.result !== '') {
      handleClear();
    }
    state.history.push(event.target.innerText);
    state.currNum.push(event.target.innerText);
    updateDisplay();
  }

  // TODO: Break up/simplify function
  function handleOperator(event) {
    // Issue warning if no number before operator
    if (state.history.length === 0) return warning(event);

    // If there is a result, change history to new result
    if (state.result !== '') {
      state.history = [];
      state.history.push(`${state.result}`);
      state.currNum = [state.result];
    }
    const operator = event.target.innerText;

    state.currExp.push(parseInt(state.currNum.join('')));
    state.currNum = [];

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
    if (state.currNum.length === 0) return warning(event);
    state.currExp.push(parseInt(state.currNum.join('')));
    state.currNum = [];

    state.result = calculate(state.currExp.join(''));
    updateDisplay();
    state.currExp = []
    console.log(state);
  }

  function warning(event) {
    event.target.classList.add('calc-button-warning');
    setTimeout(() => event.target.classList.remove('calc-button-warning'), 100);
  }

  // WARNING: Using Function constructor like this does give user access to local scope. However, due to
  // the limited nature of this app, it will be quite safe. If expanding, solutions include running
  // a regex to filter the 'str' to ensure no malicious code.
  function calculate(str) {
    return Function(`'use strict'; return (${str})`)();
  }
})();
