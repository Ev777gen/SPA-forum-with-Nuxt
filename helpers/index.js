export const localeDate = (timestamp) => {
  // Конвертируем временную метку в строку:
  // toLocaleString() - дата + время
  // toLocaleDateString() - дата 
  // toLocaleTimeString() - время
  // Обрабатываем формат timestamp из Firebase
  if (timestamp.seconds) {
    timestamp = timestamp.seconds;
  }
  // Обрабатываем наш формат даты
  const isTimestampInSeconds = timestamp < 10000000000;
  if (isTimestampInSeconds) {
    timestamp *= 1000;
  }
  return (new Date(timestamp)).toLocaleDateString();
}

export const findItemById = (resources, id) => {
  if (!resources) return null
  return resources.find(r => r.id === id)
}

export const forumThreadsCountWording = (threadsCount) => {
  if (threadsCount) {
    if (threadsCount === 1) {
      return ' тема';
    } else if (threadsCount > 1 && threadsCount < 5) {
      return ' темы';
    } else {
      return ' тем';
    }
  }
  return 'нет тем';
}

export const repliesCountWording = (repliesCount) => {
  if (repliesCount) {
    if (repliesCount === 1) {
      return ' ответ';
    } else if (repliesCount > 1 && repliesCount < 5) {
      return ' ответа';
    } else {
      return ' ответов';
    }
  }
  return 'нет ответов';
}

export const userPostsCountWording = (postsCount) => {
  if (postsCount) {
    if (postsCount === 1) {
      return ' пост';
    } else if (postsCount > 1 && postsCount < 5) {
      return ' поста';
    } else {
      return ' постов';
    }
  }
  return 'нет постов';
}

export const userThreadsCountWording = (threadsCount) => {
  if (threadsCount) {
    if (threadsCount === 1) {
      return ' начатая тема';
    } else if (threadsCount > 1 && threadsCount < 5) {
      return ' начатых темы';
    } else {
      return ' начатых тем';
    }
  }
  return 'нет начатых тем';
}