//Kevin Simon i Eugeni Soto
const chipsDisplay = document.getElementById('chips');
const addChipsInput = document.getElementById('add-chips');
const addChipsBtn = document.getElementById('add-chips-btn');
const betInput = document.getElementById('bet');
const betTypeSelect = document.getElementById('bet-type');
const betNumberInput = document.getElementById('bet-number');
const betBtn = document.getElementById('bet-btn');
const resultDisplay = document.getElementById('result');
let chips = 0;

const gif = document.getElementById('gif');
const gifRuleta = document.getElementById('gif-ruleta');

betBtn.addEventListener('click', () => {
  const bet = parseInt(betInput.value, 10);
  const betType = betTypeSelect.value;
  const betNumber = parseInt(betNumberInput.value, 10);
  const randomNum = Math.floor(Math.random() * 37);
  resultDisplay.value = `Número aleatorio: ${randomNum}`;

  if (betNumber < 0 || betNumber > 36) {
    resultDisplay.value = 'Número de apuesta no válido';
    return;
  }

  if (bet > chips) {
    resultDisplay.value = 'La apuesta no puede ser mayor que tus fichas';
    return;
  }

  if (betType.trim() === '') {
    resultDisplay.value = 'Debes seleccionar un tipo de apuesta';
    return;
  }
  gifRuleta.style.display = 'block';
  gif.style.display = 'none';
});

function setCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
  const cname = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  const gifImage = document.getElementById('gif-ruleta');
  const playButton = document.getElementById('bet-btn');

  let isPlaying = false;

  playButton.addEventListener('click', () => {
    if (!isPlaying) {
      gifImage.src = './images/casino-gamble.gif';
      isPlaying = true;
    } else {
      gifImage.src = './images/statis_background.png';
      isPlaying = false;
    }
  });

  const savedChips = parseInt(getCookie('myChips'), 10);
  if (!Number.isNaN(savedChips) && savedChips >= 0) {
    chips = savedChips;
    chipsDisplay.textContent = chips;
  }
});

const play = (bet, betType, betNumber) => {
  let result = '';
  const randomNum = Math.floor(Math.random() * 37);

  if (betType === 'type') {
    if (betNumber === 0) {
      chips += bet * 0.5;
      result = `Has acertado el tipo ${betType}. Has ganado ${
        bet * 0.5
      } fichas`;
    } else if (betNumber === randomNum) {
      chips += bet * 0.5;
      result = `Has acertado el tipo ${betType}. Has ganado ${
        bet * 0.5
      } fichas`;
    } else {
      chips -= bet;
      result = `Has fallado. Has perdido ${bet} fichas`;
    }
  }
  if (bet < 0) {
    result = 'No se permiten apuestas negativas';
  } else if (bet > chips) {
    result = 'La apuesta no puede ser mayor que tus fichas';
    return result;
  } else if (betType.trim() === '') {
    result = 'Debes seleccionar un tipo de apuesta';
  } else if (betNumber < 0 || betNumber > 36) {
    result = 'Número de apuesta no válido';
    return result;
  } else if (betType === 'odd' && randomNum % 2 === 1) {
    result = `El numero era ${randomNum}. Has ganado ${bet} birutas!`;
    chips += bet;
  } else if (betType === 'even' && randomNum % 2 === 0) {
    result = `Ha salido ${betType}. El numero era ${randomNum}. Has ganado ${betNumber} birutas!`;
    chips += bet;
  } else if (betType === 'type') {
    result = 'Debes seleccionar un tipo de apuesta';
    return result;
  } else if (betType === 'number') {
    if (betNumber === randomNum) {
      chips += bet * 2;
      result = `Has acertado el número ${randomNum}. Has ganado ${
        bet * 2
      } fichas`;
    } else {
      chips -= bet;
      result = `Has fallado. Has perdido ${bet} fichas`;
    }
  } else {
    result = `Ha salido ${betType}. El numero era ${randomNum}. Has Perdido ${bet} birutas!`;
    chips -= bet;
  }

  chipsDisplay.textContent = chips;

  // Save chips to cookies
  setCookie('myChips', chips);

  return result;
};

addChipsBtn.addEventListener('click', () => {
  const addChips = parseInt(addChipsInput.value, 10);
  if (!Number.isNaN(addChips) && addChips > 0) {
    chips += addChips;
    chipsDisplay.textContent = chips;

    // Save chips to cookies
    setCookie('myChips', chips);

    addChipsInput.value = '';
  }
});

betBtn.addEventListener('click', () => {
  const bet = parseInt(betInput.value, 10);
  const betNumber = parseInt(betNumberInput.value, 10);
  if (bet < 0 || betNumber < 0) {
    resultDisplay.value = 'No se permiten apuestas negativas';
    return;
  }
  const result = play(bet, betTypeSelect.value, betNumber);
  resultDisplay.value = result;

  chipsDisplay.textContent = chips;
  betInput.value = '';
});
