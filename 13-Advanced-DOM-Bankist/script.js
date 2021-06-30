'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const allSections = document.querySelectorAll('.section');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//learn more
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1coords.left,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  //same as this
  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(function (x) {
//   x.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//section selection
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  //anything not on the tab itself will return null
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  // console.log(clicked.getAttribute('data-tab'));

  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');
});

//highlighting nav choice
//mouseover even bubbles while mouseenter doesn't
nav.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
});

nav.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.target
      .closest('.nav')
      .querySelectorAll('.nav__link')
      .forEach(el => {
        el.style.opacity = 1;
        e.target.closest('.nav').querySelector('img').style.opacity = 1;
      });
  }
});

//good way sticky navigation: intersection observer API
const header = document.querySelector('.header');

const stickyNav = function ([entry]) {
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
  // console.log(entry);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
});
headerObserver.observe(header);

//section slide up effect
const revealSection = function ([entry], observer) {
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function ([entry], observer) {
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

//sliders
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const dotContainer = document.querySelector('.dots');

let currSlide = 0;
let maxSlide = slides.length;

// slider.style.transform = 'scale(0.4)';
// slider.style.overflow = 'visible';

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function () {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
    if (dot.getAttribute('data-slide') == currSlide)
      dot.classList.add('dots__dot--active');
  });
};

const gotoSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
  currSlide = slide;
  activateDot();
};

//initialise
createDots();
gotoSlide(0);

btnRight.addEventListener('click', function () {
  if (currSlide == maxSlide - 1) gotoSlide(0);
  else gotoSlide(++currSlide);
});

btnLeft.addEventListener('click', function () {
  if (currSlide == 0) gotoSlide(maxSlide - 1);
  else gotoSlide(--currSlide);
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    gotoSlide(slide);
  }
});

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

//bad way sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

/*
//Selecting elements
const allSections = document.querySelectorAll('.section');
const header = document.querySelector('.header');

document.getElementById('section==1'); //no need # if specified in the function
const allButtons = document.getElementsByTagName('button'); //returns HTML collection
document.getElementsByClassName('btn'); //no need . if specified in the function

//Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'EAT COOKIES BITCH'; same as bottom one
message.innerHTML =
  'EAT COOKIES BITCH <button class="btn btn--close-cookie">GOT IT!</button>';

// header.prepend(message);
//a DOM object is unique, can't put at 2 places at once
// header.append(message.cloneNode(true));
header.append(message);

//Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

  */
