export class MathSystem {
  constructor() {
    this.maxNumber = 20;
  }

  generateProblem() {
    // Ensure 50/50 chance for addition and subtraction
    const isAddition = Math.random() < 0.5;
    let a, b, result, operator;

    if (isAddition) {
      // Limit addends so sum is mostly within 0-20, but strict 0-20 constraint according to PRD
      // PRD says random 0-20. Let's interpret "range 0-20" as the operands or the result.
      // Usually for grade 1, sum <= 20 is the key.
      a = Math.floor(Math.random() * 21); // 0-20
      b = Math.floor(Math.random() * (21 - a)); // Ensures a + b <= 20
      result = a + b;
      operator = '+';
    } else {
      // Subtraction: result >= 0
      a = Math.floor(Math.random() * 21); // 0-20
      b = Math.floor(Math.random() * (a + 1)); // 0 to a
      result = a - b;
      operator = '-';
    }

    const options = this.generateOptions(result);
    return {
      equation: `${a} ${operator} ${b} = ?`,
      answer: result,
      options: options
    };
  }

  generateOptions(correctValue) {
    const options = new Set([correctValue]);
    while (options.size < 3) {
      // Generate distractors close to the answer (+/- 1 to 3)
      const offset = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = correctValue + offset;

      // Ensure positive options and simple numbers
      if (val >= 0 && val <= 40) {
        options.add(val);
      } else {
        // Fallback random if offset pushes out of bounds (rare for 0-20)
        options.add(Math.floor(Math.random() * 20));
      }
    }
    // Shuffle options
    return Array.from(options).sort(() => Math.random() - 0.5);
  }
}
