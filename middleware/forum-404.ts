export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const forums = useState("forums");
  const { fetchForum } = useDatabase();

  const forumId: string = to.params.forumId?.toString();

  await fetchForum({ id: forumId, once: true });
  // Проверяем, есть ли такая тема
  const forumExists = findItemById(forums.value, forumId);

  if (!forumExists) {
    return navigateTo("/error");
  }
});
