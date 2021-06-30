'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

let timer;

//Date format
const optionsDate = {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

//Logout function
const logout = function () {
  clearInterval(timer);
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
};

//Date formatting
const dateString = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

//Starting countdown
const startLogOutTimer = function () {
  const tick = function () {
    min = Math.floor(time / 60)
      .toString()
      .padStart(2, 0);
    sec = (time % 60).toString().padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time-- === 0) {
      logout();
    }
  };
  let time = 10;
  let min = Math.floor(time / 60);
  let sec = time % 60;

  tick();
  timer = setInterval(tick, 1000);
};

createUsername(accounts);

//event handler
let currentAccount;
let sorted = false;

let compareFunction = (a, b) => a - b;

//Currency format
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//display transactions
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort(compareFunction)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${dateString(
        new Date(acc.movementsDates[i]),
        currentAccount.locale
      )}</div>
      <div class="movements__value">${formatCur(
        mov,
        acc.locale,
        acc.currency
      )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//display total
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

//display summary
const calcDisplaySummary = function (acc) {
  const movements = acc.movements;
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);

  const outcome = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCur(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  );

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const reloadDisplay = function () {
  //Refresh date
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    optionsDate
  ).format(new Date());

  //Display movements
  displayMovements(currentAccount);

  //Display balance
  calcDisplayBalance(currentAccount);

  //Display summary
  calcDisplaySummary(currentAccount);
};

const transfer = function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const recipient = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  //do nothing if amount is less than 0 or sending to himself
  if (
    recipient == undefined ||
    amount <= 0 ||
    currentAccount.username === recipient.username ||
    amount > currentAccount.balance
  )
    return;

  const now = new Date().toISOString();
  recipient.movements.push(amount);
  recipient.movementsDates.push(now);

  currentAccount.movements.push(amount * -1);
  currentAccount.movementsDates.push(now);

  reloadDisplay();
  clearInterval(timer);
  timer = startLogOutTimer();
};

const login = function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    sorted = false;
    reloadDisplay();

    if (timer) clearInterval(timer);
    startLogOutTimer();
  }
};

const closeAccount = function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentAccount.username),
      1
    );
    logout();
  }

  inputClosePin.value = inputCloseUsername.value = '';
};

const loan = function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    reloadDisplay();
  }

  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
};

//when clicking sort
const sortBalance = function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
};

//event listeners
btnLogin.addEventListener('click', login);
btnTransfer.addEventListener('click', transfer);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', loan);
btnSort.addEventListener('click', sortBalance);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//new Date(year, month, day, hour, minute, second)
//month starts from 0, the only one
//new Date(x) => x is seconds elapsed from 1970
