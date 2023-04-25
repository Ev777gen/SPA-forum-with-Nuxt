export default defineNuxtRouteMiddleware(async (to, from) => {
  const authId = useState("authId").value;
  const { initAuthentication } = useAuth();
  const { unsubscribeAllSnapshots } = useDatabase();

  await initAuthentication();
  unsubscribeAllSnapshots();

  if (to.meta.isAuthRequired && !authId) {
    return navigateTo({
      path: "/user/signin",
      query: { redirectTo: to.path },
    });
  }
  if (to.meta.isForGuests && authId) {
    return navigateTo({ path: "/" });
  }

  // if (to.meta.isAuthRequired && !authId) {
  //   return { name: "SignIn", query: { redirectTo: to.path } };
  // }
  // if (to.meta.isForGuests && authId) {
  //   return { name: "HomeView" };
  // }
});
