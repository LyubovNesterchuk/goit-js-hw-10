
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const input = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;


startBtn.disabled = true;


flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: handleDateSelect,
});


startBtn.addEventListener('click', handleStartClick);


function handleDateSelect(selectedDates) {
  const pickedDate = selectedDates[0];

  if (pickedDate.getTime() <= Date.now()) {
    startBtn.disabled = true;
    iziToast.error({
      title: 'Помилка',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
  } else {
    userSelectedDate = pickedDate;
    startBtn.disabled = false;
  }
}


function handleStartClick() {
  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const now = Date.now();
    const delta = userSelectedDate.getTime() - now;

    if (delta <= 0) {
      clearInterval(timerId);
      updateTimer(convertMs(0));
      input.disabled = false;
      return;
    }

    updateTimer(convertMs(delta));
  }, 1000);
}



  function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }
  

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


function updateTimer({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}