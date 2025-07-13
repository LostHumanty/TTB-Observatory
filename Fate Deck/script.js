const suits = ['bj', 'rj', 'r', 'c', 't', 'm'];
const cardImages = [
  'bj.png', '1c.png', '1t.png', '1m.png', '1r.png',
  '2c.png', '2t.png', '2m.png', '2r.png',
  '3c.png', '3t.png', '3m.png', '3r.png',
  '4c.png', '4t.png', '4m.png', '4r.png',
  '5c.png', '5t.png', '5m.png', '5r.png',
  '6c.png', '6t.png', '6m.png', '6r.png',
  '7c.png', '7t.png', '7m.png', '7r.png',
  '8c.png', '8t.png', '8m.png', '8r.png',
  '9c.png', '9t.png', '9m.png', '9r.png',
  '10c.png', '10t.png', '10m.png', '10r.png',
  '11c.png', '11t.png', '11m.png', '11r.png',
  '12c.png', '12t.png', '12m.png', '12r.png',
  '13c.png', '13t.png', '13m.png', '13r.png', 'rj.png'
];

let deck = [...cardImages];
let discardPile = [];
let drawnCards = [];

const deckEl = document.getElementById('deck');
const drawnEl = document.getElementById('drawn-cards');
const discardEl = document.getElementById('discard-pile');
const discardPopup = document.getElementById('discard-popup');
const discardCardsEl = document.getElementById('discard-cards');
const closePopupBtn = document.getElementById('close-popup');
const shuffleBtn = document.getElementById('shuffle-btn');
const drawCountInput = document.getElementById('draw-count');
const drawCountValue = document.getElementById('draw-count-value');

drawCountInput.addEventListener('input', () => {
  drawCountValue.textContent = drawCountInput.value;
});

drawCountInput.addEventListener('click', (e) => {
  e.stopPropagation();
});

deckEl.addEventListener('click', () => {
  const count = parseInt(drawCountInput.value);
  let cardsToDraw = [];

  // 1. Если есть выложенные карты — сбрасываем их
  if (drawnCards.length > 0) {
    discardPile.push(...drawnCards);
    drawnCards = [];
    drawnEl.innerHTML = '';
  }

  if (deck.length >= count) {
    // 2. Если в колоде достаточно — тянем как обычно
    for (let i = 0; i < count; i++) {
      const card = deck.pop();
      cardsToDraw.push(card);
    }
  } else {
    // 3. Если не хватает — тянем сколько есть
    const remaining = deck.splice(0);
    cardsToDraw.push(...remaining);

    // 4. Перетасовываем discard + drawn + старый deck, исключая уже вытянутые
    const excluded = new Set(cardsToDraw);
    const newDeck = [...deck, ...drawnCards, ...discardPile].filter(c => !excluded.has(c));
    shuffle(newDeck);
    deck = newDeck;
    discardPile = [];
    drawnCards = [];

    // 5. Добираем недостающее
    const stillNeeded = count - cardsToDraw.length;
    for (let i = 0; i < stillNeeded && deck.length > 0; i++) {
      cardsToDraw.push(deck.pop());
    }

    // 6. Показать попап о перетасовке
    document.getElementById('reshuffle-popup').style.display = 'flex';
  }

  // 7. Отрисовать итог
  cardsToDraw.forEach(card => {
    drawnCards.push(card);
    const img = document.createElement('img');
    img.src = `../assets/images/cards/${card}`;
    drawnEl.appendChild(img);
  });
});


// При клике на сброс — показываем поп-ап
discardEl.addEventListener('click', (event) => {
  if (event.target === shuffleBtn) return; // Не открываем, если клик по Shuffle

  discardCardsEl.innerHTML = '';
  discardPile.forEach(card => {
    const img = document.createElement('img');
    img.src = `../assets/images/cards/${card}`;
    img.style.width = '50px';
    discardCardsEl.appendChild(img);
  });
  discardPopup.style.display = 'block';
});

// Закрыть поп-ап
closePopupBtn.addEventListener('click', () => {
  discardPopup.style.display = 'none';
});

discardPopup.addEventListener('click', (e) => {
  if (e.target === discardPopup) {
    discardPopup.style.display = 'none';
  }
});

// Перетасовать колоду
shuffleBtn.addEventListener('click', () => {
  // Все карты обратно в колоду
  deck = [...deck, ...drawnCards, ...discardPile];
  drawnCards = [];
  discardPile = [];
  drawnEl.innerHTML = '';
  shuffle(deck);
});

// Функция тасовки
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(deck);

const burgerMenu = document.getElementById('burgerMenu');
const headerNav = document.getElementById('headerNav');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Открыть / закрыть бургер
burgerMenu.addEventListener('click', () => {
  headerNav.classList.toggle('active');
});

// Переключить тему
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  // Можно сохранить выбор в localStorage, если хочешь
});

const peekBtn = document.getElementById('peek-btn');
const peekPopup = document.getElementById('peek-popup');
const peekCardsContainer = document.getElementById('peek-cards');
const confirmPeek = document.getElementById('confirm-peek');
const closePeek = document.getElementById('close-peek');

peekBtn.addEventListener('click', () => {
  peekCardsContainer.innerHTML = '';
  const nextThree = deck.slice(-3); // последние = первые сверху

  // отрисовать в обратном порядке, как в игре
  [...nextThree].reverse().forEach(card => {
    const img = document.createElement('img');
    img.src = `../assets/images/cards/${card}`;
    img.classList.add('peek-card');
    img.dataset.card = card;
    peekCardsContainer.appendChild(img);
  });

  peekPopup.style.display = 'block';
});

new Sortable(peekCardsContainer, {
  animation: 150,
  direction: 'horizontal',
});

confirmPeek.addEventListener('click', () => {
  const newOrder = Array.from(peekCardsContainer.children).map(el => el.dataset.card);
  // Поменять порядок в deck (заменить последние 3 карты)
  for (let i = 0; i < newOrder.length; i++) {
    deck[deck.length - 1 - i] = newOrder[i];
  }
  peekPopup.style.display = 'none';
});

const discardPeekBtn = document.getElementById('discard-peek');

discardPeekBtn.addEventListener('click', () => {
  const cardsToDiscard = Array.from(peekCardsContainer.children).map(el => el.dataset.card);

  // Удалить эти карты из deck (верхние карты — последние в массиве)
  deck.splice(deck.length - cardsToDiscard.length, cardsToDiscard.length);

  // Добавить в discardPile
  discardPile.push(...cardsToDiscard);

  // Очистить визуально
  peekCardsContainer.innerHTML = '';
  peekPopup.style.display = 'none';
});

closePeek.addEventListener('click', () => {
  peekPopup.style.display = 'none';
});

const reshufflePopup = document.getElementById('reshuffle-popup');

reshufflePopup.addEventListener('click', () => {
  reshufflePopup.style.display = 'none';
});