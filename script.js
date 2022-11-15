(function () {
  // STATE/VARIABLES

  let state = {
    history: [],
    result: '',
    currExp: [1, ' + ', 1],
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
    state.history.push(event.target.innerText);
    updateDisplay();
  }

  function handleOperator(event) {
    const operator = event.target.innerText;
    if (state.currExp.length === 2) state.currExp[1] = ` ${operator} `;
    state.history.push(` ${operator} `);
    updateDisplay();
  }

  function handleDel(event) {
    state.history.pop();
    updateDisplay();
  }

  function handleClear(event) {
    state.history = [];
    state.result = [];
    updateDisplay();
  }

  function handleEquals(event) {
    const str = state.currExp.join('');
    console.log(str);

    // WARNING: Using Function constructor like this does give user access to local scope. However, due to 
    // the limited nature of this app, it will be quite safe. If expanding, solutions include running
    // a regex to filter the 'str' to ensure no malicious code.
    const calculate = Function(`'use strict'; return (${str})`);

    state.result = calculate();
    updateDisplay();
  }
})();
