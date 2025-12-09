# Exercises: The Basics

Practice the fundamental concepts you've learned.

---

## Exercise 1: Variables

**Question:** What's the difference between `let`, `const`, and `var`?

**Answer:**
- `let` - Block-scoped, can be reassigned
- `const` - Block-scoped, cannot be reassigned
- `var` - Function-scoped (older syntax, generally avoided)

---

## Exercise 2: Data Types

**Question:** Identify the data type of each value:

1. `"Hello World"`
2. `42`
3. `true`
4. `[1, 2, 3]`
5. `{ name: "Alice" }`

**Answer:**
1. String
2. Number
3. Boolean
4. Array
5. Object

---

## Exercise 3: Functions

**Question:** Convert this function to arrow function syntax:

```javascript
function multiply(a, b) {
  return a * b;
}
```

**Answer:**

```javascript
const multiply = (a, b) => a * b;
```

---

## Exercise 4: Coding Challenge

**Task:** Write a function that takes an array of numbers and returns their sum.

```javascript
// Your code here
function sumArray(numbers) {
  // ???
}
```

**Answer:**

```javascript
function sumArray(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// Or with a loop:
function sumArray(numbers) {
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum;
}
```

---

## Great Job!

You've completed the basics exercises. Move on to explore more advanced topics!
