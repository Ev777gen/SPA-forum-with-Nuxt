import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export default function () {
  const { $auth: auth, $storage: storage } = useNuxtApp();

  let authId = useState("authId", () => null);
  const authUserUnsubscribe = ref([]);
  const authObserverUnsubscribe = ref([]);

  //const authUser = useState("authUser", () => "hello authUser");

  const authUser = computed(() => {
    const { user } = useDatabase(); // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //console.log('inside authUser, user(authId.value)', user.value(authId.value))
    return user.value(authId.value);
  });

  async function registerUserWithEmailAndPassword({
    name,
    username,
    email,
    password,
  }) {
    const { createUser } = useDatabase();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUser({ id: result.user.uid, name, username, email });
  }

  function signInUserWithEmailAndPassword({ email, password }) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signOutUser() {
    await auth.signOut();
    authId.value = null;
    //authUser.value = null; // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //console.log("signOut auth.currentUser", auth.currentUser);
    //console.log("signOut authId", authId.value);
  }

  async function fetchAuthUser() {
    //console.log("fetchAuthUser", "1");
    const { fetchItem } = useDatabase();
    //console.log("fetchAuthUser", "2");
    //console.log("auth", auth);
    const userId = auth.currentUser?.uid;
    //console.log("fetchAuthUser", "3");
    if (!userId) return;
    //console.log("fetchAuthUser", "4");
    //console.log(useState('users').value)
    const fetchedAuthUser = await fetchItem({
      resource: "users",
      id: userId,
      handleUnsubscribe: (unsubscribe) => {
        authUserUnsubscribe.value = unsubscribe;
      },
    });
    authId.value = userId;
    //authUser.value = fetchedAuthUser; // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //console.log("fetchAuthUser", "5", "userId", userId);
    //console.log("fetchAuthUser", "6", "fetchedAuthUser", fetchedAuthUser);
    //console.log("fetchAuthUser", "7", "authUser.value", authUser.value);

    //console.log('useAuth fetchAuthUser uid', auth.currentUser?.uid)
    //console.log('useAuth fetchAuthUser authId.value', authId.value)
  }

  function initAuthentication() {
    if (authObserverUnsubscribe.value) authObserverUnsubscribe.value();
    if (auth) {
      return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          unsubscribeAuthUserSnapshot();
          if (user) {
            await fetchAuthUser();
            resolve(user);
          } else {
            resolve(null);
          }
        });
        authObserverUnsubscribe.value = unsubscribe;
      });
    } else {
      return;
    }
  }

  async function uploadAvatar({ file, filename }) {
    if (!file) return null;
    const authId = authId.value;
    filename = filename || file.name;
    try {
      const storageRef = ref(
        storage,
        `uploads/${authId}/images/${Date.now()}-${filename}`
      );
      return uploadBytes(storageRef, file).then(() => {
        return getDownloadURL(storageRef);
      });
    } catch (error) {
      alert(error.message);
    }
  }

  // Методы для смены e-mail
  async function updateEmail({ email }) {
    return updateEmail(auth.currentUser, email);
  }

  async function updatePassword({ password }) {
    return updatePassword(auth.currentUser, password);
  }

  async function reauthenticate({ email, password }) {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      const user = auth.currentUser;
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.log({ error });
    }
  }

  // Отписываемся от слушателей
  async function unsubscribeAuthUserSnapshot() {
    if (authUserUnsubscribe.value) {
      authUserUnsubscribe.value();
      authUserUnsubscribe.value = null;
    }
  }

  return {
    authId,
    authUser,
    registerUserWithEmailAndPassword,
    signInUserWithEmailAndPassword,
    signOutUser,
    fetchAuthUser,
    initAuthentication,
    uploadAvatar,
    updateEmail,
    updatePassword,
    reauthenticate,
    unsubscribeAuthUserSnapshot,
  };
}
