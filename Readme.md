## Calculator

A simple calculator using **Vanilla JS** for the RS School from EPAM

#### Scoring
**Basic functionality +60 points**
The calculator performs mathematical operations: **addition, subtraction, multiplication, division**. 
It is necessary to have a *decimal point, actions with multi-digit numbers, the ability to perform several actions in a row, to clear the result*
- Basic operations (+ - *) with positive integers (2 + 2 = 4) **+15 points**
- Division (/) with positive integers (the result might be a float) (3 / 2 = 1.5) **+5 points**
- If the result has more than 10 digits, it must be rounded down to show only the first 10 digits in total at all times **+5 points for integers, +5 points for floats**
- Chaining operations (2 + 2 + (displays 4) + 2 + (displays 6) + 2 = 8 ...) **+10 points**
- Result clear button **+10 points**
- Error message for invalid operations (10 / 0 = Error) **+10 points**

**Additional math operations (+20 points)**
- Square root (25 √ = 5) **+10 points**
- Exponentation (15 ^ 3 = 3375) **+10 points**

**Actions with negative numbers (+10 points)**
*(You get points only if **ALL** of the operations work with negative numbers, for example, if there is no square root implemented, you won't be penalized, but if it is implemented and it is not working correctly with handling negative numbers, you don't get any points for this requirement at all)*

The calculator can work with both positive and negative numbers. For example, you can divide -9 by -3. When you enter a negative number, a minus sign appears in front of it. 
If you have a square root operation, consider how you will handle trying to find the square root of *a negative number*.

2 + -2 = 0\
-9 ^ 3  = -729\
-9 √  = error

**Actions with decimals (+10 points)**
Decimal operations have it's quirks in most programming languages, you can read about it [here](https://betterprogramming.pub/why-is-0-1-0-2-not-equal-to-0-3-in-most-programming-languages-99432310d476). Teach your calculator to do this.\
0.1 + 0.2 = 0.3\
0.4 - 0.1 = 0.3\
-0.1 * 0.2 = -0.02
