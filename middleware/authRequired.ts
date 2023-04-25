export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const authId = useState("authId");

  if (!authId.value) {
    return navigateTo({
      path: "/user/signin",
      query: { redirectTo: to.path },
    });
  } else {
    return;
  }
});
