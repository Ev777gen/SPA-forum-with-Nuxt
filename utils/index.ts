import { FieldValue } from 'firebase/firestore';

export interface ITimestamp extends FieldValue {
  seconds: number,
}

export const localeDate = (timestamp: number | ITimestamp): string => {
  // Конвертируем временную метку в строку:
  // toLocaleString() - дата + время
  // toLocaleDateString() - дата 
  // toLocaleTimeString() - время

  // Обрабатываем формат timestamp из Firebase
  if (typeof timestamp !== 'number') {
    timestamp = timestamp.seconds;
  }
  // Конвертируем в миллисекунды, если значение в секундах
  const isTimestampInSeconds = timestamp < 10000000000;
  if (isTimestampInSeconds) {
    timestamp *= 1000;
  }

  return (new Date(timestamp)).toLocaleDateString();
}

export const findItemById = (resources: Record<string, any>[] | unknown, id: string) => {
  if (!resources) return null;
  if (Array.isArray(resources)) {
    return resources.find(r => r.id === id);
  }
}

export const forumThreadsCountWording = (threadsCount: number): string => {
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

export const repliesCountWording = (repliesCount: number): string => {
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

export const userPostsCountWording = (postsCount: number): string => {
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

export const userThreadsCountWording = (threadsCount: number): string => {
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