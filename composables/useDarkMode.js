import { ref, watch } from 'vue';

const isDarkMode = ref(convertStringToBoolean(localStorage.getItem('isDarkMode')) || false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
}

watch(isDarkMode, (newValue) => {
  if (newValue === true) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('isDarkMode', !!isDarkMode.value);
});

// Если сразу влючен темный режим, то добавляем body класс 'dark-mode'
if (isDarkMode.value === true && !document.body.classList.contains('dark-mode')) {
  document.body.classList.add('dark-mode');
}

// Читаем строку из LocalStorage и преобразуем ее в boolean
function convertStringToBoolean(str) {
  if (str === 'true') {
    return true;
  } else if (str === 'false') {
    return false;
  }
  return;
}

export default function useDarkMode() {
  return { isDarkMode, toggleDarkMode }
}
