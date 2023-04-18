import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateEmail, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential } from 'firebase/auth';

export default function() {

  const { $auth: auth, $storage: storage } = useNuxtApp();

  let authId = useState("auth", () => null);
  const authUserUnsubscribe = ref(null);
  const authObserverUnsubscribe = ref(null);

  const authUser = computed(() => {
    const { user } = useDatabase(); // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    return user.value(authId.value);
  });

  async function registerUserWithEmailAndPassword({ name, username, email, password }) {
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
  }

  async function fetchAuthUser() {
    const { fetchItem } = useDatabase();
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    await fetchItem({
        resource: 'users',
        id: userId,
        handleUnsubscribe: (unsubscribe) => {
          authUserUnsubscribe.value = unsubscribe;
        }
      });
    authId.value = userId;
  }

  function initAuthentication() {
    if (authObserverUnsubscribe.value) authObserverUnsubscribe.value();
    return new Promise(resolve => {
      const unsubscribe = auth.onAuthStateChanged(async user => {
        unsubscribeAuthUserSnapshot();
        if (user) {
          await fetchAuthUser();
          resolve(user);
        } else {
          resolve(null);
        }
      })
      authObserverUnsubscribe.value = unsubscribe;
    })
  }

  async function uploadAvatar({ file, filename }) {
    if (!file) return null;
    const authId = authId.value;
    filename = filename || file.name;
    try {
      const storageRef = ref(
        storage,
        `uploads/${authId}/images/${Date.now()}-${filename}`
      )
      return uploadBytes(storageRef, file).then(() => {
        return getDownloadURL(storageRef);
      })
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
  }
}
