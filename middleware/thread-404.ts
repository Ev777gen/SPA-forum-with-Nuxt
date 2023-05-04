export default defineNuxtRouteMiddleware(async (to) => {
  interface keyable {
    [key: string]: any  
  }

  if (process.server) return;

  const threads = useState<keyable[]>("threads");
  const { fetchThread } = useDatabase();

  await fetchThread({ id: to.params.threadId, once: true });
  // Проверяем, есть ли такая тема
  const threadExists = findItemById(threads.value, to.params.threadId?.toString());

  if (!threadExists) {
    return navigateTo("/error");
  }
});
