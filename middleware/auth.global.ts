export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const authId = useState("authId");
  const { initAuthentication } = useAuth();
  const { unsubscribeAllSnapshots } = useDatabase();

  await initAuthentication();
  unsubscribeAllSnapshots();

  if (to.meta.isAuthRequired && !authId.value) {
    return navigateTo({
      path: "/user/signin",
      query: { redirectTo: to.path },
    });
  }

  if (to.meta.isForGuests && authId.value) {
    return navigateTo({ path: "/" });
  }
});
