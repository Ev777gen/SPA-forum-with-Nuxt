export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const forums = useState("forums");
  const { fetchForum } = useDatabase();

  await fetchForum({ id: to.params.forumId, once: true });
  // Проверяем, есть ли такая тема
  const forumExists = findItemById(forums.value, to.params.forumId);

  if (!forumExists) {
    return navigateTo("/error");
  }
});
