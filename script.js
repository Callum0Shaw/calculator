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
    if(state.result !== '') {
      console.log('clear')
      handleClear()
    }
    state.history.push(event.target.innerText);
    state.currNum.push(event.target.innerText);
    updateDisplay();
    console.log(state);
  }

  // TODO: Break up function
  function handleOperator(event) {
    // Issue warning if no number before operator
    if (state.history.length === 0) return warning(event);
    // If there is a result, change history to new result
    if(state.result !== '') {
      state.history = []
      state.history.push(`${state.result}`) 
      state.currNum = state.result
    }
    
    const operator = event.target.innerText;

    state.currExp.push(currNum);
    state.currNum = [];
    state.currExp.push(operator);

    // if last input is operator, override
    const regex = /[^0-9]/
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
    if(state.currNum.length === 0) return warning(event)
    state.currExp.push(parseInt(state.currNum.join('')))
    state.currNum = []
    const str = state.currExp.join('');
    console.log(str);

    // WARNING: Using Function constructor like this does give user access to local scope. However, due to
    // the limited nature of this app, it will be quite safe. If expanding, solutions include running
    // a regex to filter the 'str' to ensure no malicious code.
    const calculate = Function(`'use strict'; return (${str})`);

    state.result = calculate();
    updateDisplay();
    console.log(state);
  }

  function warning(event) {
    event.target.classList.add('calc-button-warning')
    setTimeout(() => event.target.classList.remove('calc-button-warning'), 100)
  }
})()
