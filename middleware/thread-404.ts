export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const threads = useState("threads");
  const { fetchThread } = useDatabase();

  await fetchThread({ id: to.params.threadId?.toString(), once: true });
  // Проверяем, есть ли такая тема
  const threadExists = findItemById(threads.value, to.params.threadId?.toString());

  if (!threadExists) {
    return navigateTo("/error");
  }
});
