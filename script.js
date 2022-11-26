(function () {
  /* APP STATE */

  const state = {
    result: '',
    currExp: [],
    currNum: '',
    showMore: false,
  };

  /* SELECTORS/VARIABLES */

  let history = document.querySelector('.calc__history');
  let result = document.querySelector('.calc__result');
  let numberButtons = document.querySelectorAll('.calc__number');
  let operatorButtons = document.querySelectorAll('.calc__operator');
  let AcButton = document.querySelector('.calc__AC');
  let DelButton = document.querySelector('.calc__Del');
  let equalsButton = document.querySelector('.calc__equals');
  let toggleNegativeButton = document.querySelector('.calc__negative');
  let showMoreButton = document.querySelector('.calc__more');
  let powerButton = document.querySelector('.calc__power');
  let rootButton = document.querySelector('.calc__root');

  /* EVENT LISTENERS */

  document.addEventListener('keydown', handleKeyboard);
  numberButtons.forEach((el) => el.addEventListener('click', handleNumber));
  operatorButtons.forEach((el) => el.addEventListener('click', handleOperator));
  AcButton.addEventListener('click', handleClear);
  DelButton.addEventListener('click', handleDel);
  equalsButton.addEventListener('click', handleEquals);
  toggleNegativeButton.addEventListener('click', toggleNegative);
  showMoreButton.addEventListener('click', toggleShowMore);

  /* EVENT HANDLERS */

  function handleKeyboard(event) {
    const key = event.key;
    if (key === 'Enter') {
      event.preventDefault();
      return equalsButton.click();
    }
    if (key === 'Backspace') {
      event.preventDefault();
      return DelButton.click();
    }
    if (key === 'Delete') {
      event.preventDefault();
      return AcButton.click();
    }
    for (const x of numberButtons) {
      if (x.innerText === key) return x.click();
    }
    for (const y of operatorButtons) {
      if (y.innerText === key) return y.click();
    }
  }

  function handleNumber(event) {
    if (state.result !== '') {
      handleClear();
    }
    if (state.currNum.split('.').join('').length > 9) {
      state.currNum = `${state.currNum.slice(0, -1)}${event.target.innerText}`;
      return updateDisplay();
    }
    if (event.target.innerText === '.' && state.currNum.includes('.'))
      return warning(event);

    state.currNum = `${state.currNum}${event.target.innerText}`;
    console.log(state.currExp, state.currNum);
    return updateDisplay();
  }

  function handleOperator(event) {
    const operator = event.target.innerText;
    if (operator === '√') return handleRoot(event);
    if (isAnOperator(state.currExp.at(-1)) && !state.currNum) {
      state.currExp.splice(-1, 1, operator);
      return updateDisplay();
    }
    
    if (!state.currNum && !state.result) return warning(event);
    
    if (state.result) {
      state.currNum = state.result;
      state.currExp = [];
      state.result = '';
    }
    state.currExp.push(state.currNum);
    console.log(state.currExp, state.currNum);
    state.currNum = '';

    // If second operator, resolve current expression and set result of that as first number in a new expression
    if (state.currExp.length > 2) state.currExp = [calculate(state.currExp)];

    state.currExp.push(operator);
    console.log(state.currExp, state.currNum);
    return updateDisplay();
  }

  function handleDel(event) {
    if (state.result) handleClear();
    if (state.currNum) {
      state.currNum = state.currNum.slice(0, -1);
      return updateDisplay();
    }
    if ((state.currExp = [])) return updateDisplay();
    state.currNum = state.currExp.at(-2);
    state.currExp = [];
    return updateDisplay();
  }

  function handleClear(event) {
    state.result = '';
    state.currExp = [];
    state.currNum = '';
    return updateDisplay();
  }

  function handleEquals(event) {
    if (state.currNum === '') return warning(event);
    state.currExp.push(state.currNum);
    state.currNum = '';

    let answer = calculate(state.currExp);
    checkIfValidAnswer(answer)
      ? (state.result = 'MATHS IS HARD')
      : (state.result = formatNumber(answer));

    return updateDisplay();
  }

  function toggleNegative(event) {
    if (state.result) handleClear();
    state.currNum = state.currNum ? `-${state.currNum}` : '-';
    return updateDisplay();
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

  function handleRoot(event) {
    if (state.result) handleClear();
    if (state.currExp.at(-1) === '√') return warning(event);
    state.currExp.push('√');
    state.currNum = '';
    updateDisplay();
  }

  /* HELPER FUNCTIONS */

  function updateDisplay() {
    history.innerText = `${state.currExp.join(' ')} ${state.currNum}`;
    result.innerText = state.result;
  }

  function warning(event) {
    event.target.classList.add('calc__button__warning');
    setTimeout(
      () => event.target.classList.remove('calc__button__warning'),
      100
    );
  }

  function calculate(exp) {
    if (exp.includes('√')) state.currExp = calculateRootInArr(exp);
    if (exp.length === 1) return exp[0];

    let firstNum = parseFloat(exp[0]);
    let secondNum = parseFloat(exp[2]);

    let maxDecimal = Math.max(
      decimalPlaces(firstNum),
      decimalPlaces(secondNum)
    );
    if (maxDecimal) {
      firstNum = firstNum * maxDecimal * 10;
      secondNum = secondNum * maxDecimal * 10;
    }

    switch (exp[1]) {
      case '+':
        return maxDecimal
          ? (firstNum + secondNum) / (maxDecimal * 10)
          : firstNum + secondNum;
      case '-':
        return maxDecimal
          ? (firstNum - secondNum) / (maxDecimal * 10)
          : firstNum - secondNum;
      case '/':
        return maxDecimal ? firstNum / secondNum : firstNum / secondNum;
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

  function calculateRootInArr(arr) {
    if (!arr.includes('√')) returnArr;
    const indexOfRoot = arr.indexOf('√');
    arr.splice(
      indexOfRoot,
      2,
      roundToTenDigits(Math.sqrt(arr[indexOfRoot + 1]).toString())
    );
    return arr;
  }

  function decimalPlaces(num) {
    if (Number.isInteger(num)) return 0;
    return num.toString().split('.')[1].length;
  }

  function roundToTenDigits(num) {
    let arr = num.toString().split('');
    if (arr.includes('.')) return arr.slice(0, 10).join('');
    return parseInt(arr.slice(0, 10).join(''));
  }

  function formatNumber(num) {
    if (num >= 1000000000) return num.toExponential(2);
    const rounded = roundToTenDigits(num);

    return rounded.toLocaleString();
  }
  function isAnOperator(str) {
    if (!str) return false;
    const operators = {
      '+': true,
      '-': true,
      '*': true,
      '/': true,
      '^': true,
      '√': true,
    };
    return operators[str] || false;
  }

  function checkIfValidAnswer(answer) {
    return isNaN(answer) || answer === Infinity || answer === -Infinity;
  }
})();
