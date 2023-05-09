const isDarkMode: Ref<boolean> = ref(false);

const toggleDarkMode = (): void => {
  isDarkMode.value = !isDarkMode.value;
};

watch(isDarkMode, (newValue: boolean): void => {
  if (newValue === true) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});

// Если сразу включен темный режим, то добавляем body класс 'dark-mode'
if (
  isDarkMode.value === true &&
  !document.body.classList.contains("dark-mode")
) {
  document.body.classList.add("dark-mode");
}

// function convertStringToBoolean(str: string): boolean | undefined {
//   if (str === "true") {
//     return true;
//   } else if (str === "false") {
//     return false;
//   }
//   return;
// }

export default function useDarkMode() {
  return { isDarkMode, toggleDarkMode };
}

/////////////////////////////////////////////////

/*let isDarkMode, toggleDarkMode;

if (process.client) {
  isDarkMode = ref(
    convertStringToBoolean(localStorage.getItem("isDarkMode")) || false
  );

  toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  watch(isDarkMode, (newValue) => {
    if (newValue === true) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("isDarkMode", !!isDarkMode.value);
  });

  // Если сразу включен темный режим, то добавляем body класс 'dark-mode'
  if (
    isDarkMode.value === true &&
    !document.body.classList.contains("dark-mode")
  ) {
    document.body.classList.add("dark-mode");
  }

  function convertStringToBoolean(str) {
    if (str === "true") {
      return true;
    } else if (str === "false") {
      return false;
    }
    return;
  }
}

export default function useDarkMode() {
  return { isDarkMode, toggleDarkMode };
}
*/

/////////////////////////////////////////////////

/*
let savedIsDarkModeValue = false;

if (process.client) {
  savedIsDarkModeValue = convertStringToBoolean(
    localStorage.getItem("isDarkMode")
  );
}

const isDarkMode = ref(savedIsDarkModeValue || false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

watch(isDarkMode, (newValue) => {
  if (newValue === true) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  localStorage.setItem("isDarkMode", !!isDarkMode.value);
});

// Если сразу включен темный режим, то добавляем body класс 'dark-mode'
if (
  isDarkMode.value === true &&
  !document.body.classList.contains("dark-mode")
) {
  document.body.classList.add("dark-mode");
}

function convertStringToBoolean(str) {
  if (str === "true") {
    return true;
  } else if (str === "false") {
    return false;
  }
  return;
}

export default function useDarkMode() {
  return { isDarkMode, toggleDarkMode };
}
*/
