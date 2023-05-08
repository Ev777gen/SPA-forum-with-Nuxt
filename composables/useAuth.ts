import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Auth, UserCredential } from "firebase/auth";
import { FirebaseStorage } from "firebase/storage";

interface ISignInData {
  email: string,
  password: string,
}

interface IUserToRegister extends ISignInData {
  name: string,
  username: string,
}

interface IUser {
  email: string,
  name: string,
  username: string,
  id: string,
  avatar: string,
  usernameLower: string,
  bio: string,
  registeredAt: number | object,
  lastVisitAt: number | object,
  postsCount: number,
  threadsStarted: string[],
  website?: string,
}

type FileType = (Blob | Uint8Array | ArrayBuffer) & {
  name: string,
}

export default function () {
  // const { $auth: auth, $storage: storage } = useNuxtApp();

  let auth: Auth;
  let storage: FirebaseStorage;
  const { $auth, $storage } = useNuxtApp();
  auth = $auth as Auth;
  storage = $storage as FirebaseStorage;


  let authId = useState<string | null>("authId", () => null);
  const authUserUnsubscribe = ref([]);
  const authObserverUnsubscribe = ref([]);

  const authUser = computed(() => {
    const { user } = useDatabase();
    if (authId.value) {
      return user.value(authId.value);
    }
  });

  async function registerUserWithEmailAndPassword({
    name,
    username,
    email,
    password,
  }: IUserToRegister): Promise<void> {
    const { createUser } = useDatabase();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUser({ id: result.user.uid, name, username, email });
  }

  function signInUserWithEmailAndPassword({ email, password }: ISignInData): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signOutUser(): Promise<void> {
    await auth.signOut();
    authId.value = null;
  }

  async function fetchAuthUser(): Promise<void> {
    const { fetchItem } = useDatabase();
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const fetchedAuthUser = await fetchItem({
      resource: "users",
      id: userId,
      handleUnsubscribe: (unsubscribe: Function): void => {
        authUserUnsubscribe.value = unsubscribe;
      },
    });
    authId.value = userId;
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

  async function uploadAvatar({ file, filename }: { file: FileType, filename: string }): Promise<string | null | undefined> {
    if (!file) return null;
    filename = filename || file.name;
    try {
      const storageRef = ref(
        storage,
        `uploads/${authId.value}/images/${Date.now()}-${filename}`
      );
      return uploadBytes(storageRef, file).then(() => {
        return getDownloadURL(storageRef);
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  // Методы для смены e-mail
  async function updateUserEmail({ email }: { email: string }): Promise<void> {
    if (auth.currentUser) {
      return updateEmail(auth.currentUser, email);
    }
  }

  async function updateUserPassword({ password }: { password: string }): Promise<void> {
    if (auth.currentUser) {
      return updatePassword(auth.currentUser, password);
    }
  }

  async function reauthenticate({ email, password }: { email: string, password: string }): Promise<void> {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      const user = auth.currentUser;
      if (user) {
        await reauthenticateWithCredential(user, credential);
      } else {
        throw new Error('Сначала необходимо авторизоваться.')
      }
    } catch (error) {
      console.log({ error });
    }
  }

  // Отписываемся от слушателей
  async function unsubscribeAuthUserSnapshot(): Promise<void> {
    if (authUserUnsubscribe.value) {
      authUserUnsubscribe.value();
      authUserUnsubscribe.value = null;
    }
  }

  return {
    authUser,
    registerUserWithEmailAndPassword,
    signInUserWithEmailAndPassword,
    signOutUser,
    fetchAuthUser,
    initAuthentication,
    uploadAvatar,
    updateUserEmail,
    updateUserPassword,
    reauthenticate,
    unsubscribeAuthUserSnapshot,
  };
}
