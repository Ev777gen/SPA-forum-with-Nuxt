export default defineNuxtRouteMiddleware(async (to, from) => {
  const authId = useState("authId").value;
  const { initAuthentication } = useAuth();
  const { unsubscribeAllSnapshots } = useDatabase();

  await initAuthentication();
  unsubscribeAllSnapshots();

  /*if (to.meta.isAuthRequired && !authId.value) {
    return { name: 'SignIn', query: { redirectTo: to.path } };
  }
  if (to.meta.isForGuests && authId.value) {
    return { name: 'HomeView' };
  }*/
});
