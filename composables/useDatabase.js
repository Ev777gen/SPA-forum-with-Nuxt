/*import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
//import { getAuth } from "firebase/auth";
//import { getStorage } from 'firebase/storage';

// Initializing Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDrneVPNzmr8y5EraatCBjTIM4UIf563xs",
  authDomain: "spa-blog-c7ad9.firebaseapp.com",
  projectId: "spa-blog-c7ad9",
  storageBucket: "spa-blog-c7ad9.appspot.com",
  messagingSenderId: "965165354166",
  appId: "1:965165354166:web:8683642d1540a64df6ea17"
}
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
//export const auth = getAuth(firebaseApp);
//export const storage = getStorage(firebaseApp);
*/

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  serverTimestamp,
  increment,
  onSnapshot,
} from "firebase/firestore";
import chunk from "lodash/chunk";

export default function () {
  const { $firestore: db } = useNuxtApp();

  let categories = useState("categories", () => []);
  let forums = useState("forums", () => []);
  let threads = useState("threads", () => []);
  let posts = useState("posts", () => []);
  let users = useState("users", () => []);
  let unsubscribes = useState("unsubscribes", () => []);
  let isAsyncDataLoaded = useState("isAsyncDataLoaded", () => true);
  /*
  const user = (id) => {
    const user = findItemById(users.value, id);
    //const user = users.value.find(user => user.id === id);
    if (!user) return null;
    return {
      ...user,
      get posts () {
        return posts.value.filter(post => post.userId === user.id);
      },
      get postsCount () {
        return user.postsCount || 0;
      },
      get threads () {
        return threads.value.filter(post => post.userId === user.id);
      },
      get threadsCount () {
        return user.threadsStarted?.length || 0;
      }
    }
  }
  */
  const user = computed(() => {
    return (id) => {
      //const user = findItemById(users.value, id);
      const user = users.value.find((user) => user.id === id);
      if (!user) return null;
      return {
        ...user,
        get posts() {
          return posts.value.filter((post) => post.userId === user.id);
        },
        get postsCount() {
          return user.postsCount || 0;
        },
        get threads() {
          return threads.value.filter((post) => post.userId === user.id);
        },
        get threadsCount() {
          return user.threadsStarted?.length || 0;
        },
      };
    };
  });

  const thread = computed(() => {
    return (id) => {
      //const thread = findItemById(state.threads, id);
      const thread = threads.value.find((thread) => thread.id === id);
      if (!thread) return {};
      return {
        ...thread,
        get author() {
          //return findItemById(state.users, thread.userId);
          return users.value.find((user) => user.id === thread.userId);
        },
        get repliesCount() {
          return thread.postIds.length - 1;
        },
        get contributorsCount() {
          if (!thread.contributorIds) return 0;
          return thread.contributorIds.length;
        },
      };
    };
  });

  //------------------------------------------------------------
  // Чтение из БД Cloud Firestore
  //------------------------------------------------------------
  // Создаем два универсальных метода для чтения из базы данных:
  function fetchItem({
    resource,
    id,
    handleUnsubscribe = null,
    once = false,
    callBack = null,
  }) {
    return new Promise((resolve) => {
      const docRef = doc(db, resource, id);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (once) unsubscribe();

        if (doc.exists()) {
          const item = { ...doc.data(), id: doc.id };
          let previousItem = findItemById(useState(resource).value, id);
          previousItem = previousItem ? { ...previousItem } : null;
          pushItemToStore(resource, item);
          if (typeof callBack === "function") {
            const isLocal = doc.metadata.hasPendingWrites;
            callBack({ item: { ...item }, previousItem, isLocal });
          }
          resolve(item);
        } else {
          resolve(null);
        }
      });
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe);
      } else {
        unsubscribes.value.push(unsubscribe);
      }
    });
  }

  function fetchItems({ ids, resource, callBack = null }) {
    ids = ids || [];
    return Promise.all(ids.map((id) => fetchItem({ id, resource, callBack })));
  }

  async function unsubscribeAllSnapshots() {
    unsubscribes.value.forEach((unsubscribe) => unsubscribe());
    unsubscribes.value = [];
  }

  // Создаем на их основе методы чтения из базы данных
  // Для одного item
  function fetchCategory({ id }) {
    return fetchItem({ resource: "categories", id });
  }

  function fetchForum({ id }) {
    return fetchItem({ resource: "forums", id });
  }

  function fetchThread({ id }) {
    return fetchItem({ resource: "threads", id });
  }

  function fetchPost({ id }) {
    return fetchItem({ resource: "posts", id });
  }

  function fetchUser({ id }) {
    return fetchItem({ resource: "users", id });
  }

  // Для нескольких items
  async function fetchAllCategories() {
    let categories = [];
    const querySnapshot = await getDocs(collection(db, "categories"));
    querySnapshot.forEach((doc) => {
      const item = { ...doc.data(), id: doc.id };
      categories.push(item);
      pushItemToStore("categories", item);
    });
    return Promise.resolve(categories);
  }

  function fetchForums({ ids }) {
    return fetchItems({ resource: "forums", ids });
  }

  function fetchThreads({ ids }) {
    return fetchItems({ resource: "threads", ids });
  }

  function fetchThreadsByPage({ ids = [], page, threadsPerPage = 10 }) {
    if (ids.length === 0) return [];
    threads.value = [];
    const chunks = chunk(ids, threadsPerPage);
    const limitedIds = chunks[page - 1];
    return fetchThreads({ ids: limitedIds });
  }

  function fetchPosts({ ids }) {
    return fetchItems({ resource: "posts", ids });
  }

  function fetchUsers({ ids }) {
    return fetchItems({ resource: "users", ids });
  }

  //------------------------------------------------------------
  // Запись в БД Cloud Firestore
  //------------------------------------------------------------
  async function createThread({ text, title, forumId }) {
    // Подготавливаем данные для отправки
    const auth = useAuth();
    const userId = auth.authId;
    const publishedAt = serverTimestamp();
    const threadRef = doc(collection(db, "threads"));
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id };
    const userRef = doc(db, "users", userId);
    const forumRef = doc(db, "forums", forumId);
    const batch = writeBatch(db);
    // Добавляем thread в базу данных Cloud Firestore:
    // - сам thread добавляем в коллекцию threads
    // - его id добавляем в соответствующий форум
    // - его id добавляем пользователю, который его создал
    batch.set(threadRef, thread);
    batch.update(userRef, {
      threadsStarted: arrayUnion(threadRef.id),
    });
    batch.update(forumRef, {
      threadIds: arrayUnion(threadRef.id),
    });
    await batch.commit();
    // Делаем то же самое в store, чтобы сразу отобразить на странице
    const newThread = await getDoc(threadRef);
    pushItemToStore("threads", { ...newThread.data(), id: newThread.id });

    //commit('appendThreadToUser', { parentId: userId, childId: threadRef.id });
    appendChildToParent({ child: "threadsStarted", parent: "users" })(
      users.value,
      { parentId: userId, childId: threadRef.id }
    ); // !!!!!!!!!!!!!!!!
    //commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id });
    appendChildToParent({ child: "threadIds", parent: "forums" })(
      forums.value,
      { parentId: forumId, childId: threadRef.id }
    ); // !!!!!!!!!!!!!!!!!!!!

    // Создаем первый пост в теме
    await createPost({ text, threadId: threadRef.id, firstInThread: true });
    // Возвращаем новую thread
    return findItemById(threads, threadRef.id);
  }

  async function updateThread({ title, text, id }) {
    // Подготавливаем данные
    const thread = findItemById(threads.value, id);
    const post = findItemById(posts.value, thread.postIds[0]);
    let newThread = { ...thread, title };
    let newPost = { ...post, text };
    const threadRef = doc(db, "threads", id);
    const postRef = doc(db, "posts", post.id);
    const batch = writeBatch(db);
    // Изменяем thread в базе данных Cloud Firestore:
    batch.update(threadRef, newThread);
    batch.update(postRef, newPost);
    await batch.commit();
    // Делаем то же самое в store, чтобы сразу отобразить на странице
    newThread = await getDoc(threadRef);
    newPost = await getDoc(postRef);
    pushItemToStore("threads", newThread.data());
    pushItemToStore("posts", newPost.data());
    // Возвращаем обновленную thread
    console.log("updateThread", "8", threads.value, posts.value);
    return makeResourceFromDoc(newThread);
  }

  async function createPost(post) {
    // Подготавливаем данные
    const auth = useAuth();
    post.userId = auth.authId;
    post.publishedAt = serverTimestamp();
    post.firstInThread = post.firstInThread || false;
    const batch = writeBatch(db);
    const postRef = doc(collection(db, "posts"));
    const threadRef = doc(db, "threads", post.threadId);
    const userRef = doc(db, "users", auth.authId);
    // Добавляем пост в базу данных Cloud Firebase:
    // - сам пост добавляем в коллекцию постов posts
    // - id поста добавляем в соответствующий thread
    // - id пользователя, написавшего пост, тоже добавлям в этот же thread
    batch.set(postRef, post);
    const threadUpdates = {
      postIds: arrayUnion(postRef.id),
    };
    if (!post.firstInThread) {
      threadUpdates.contributorIds = arrayUnion(auth.authId);
    }
    batch.update(threadRef, threadUpdates);
    batch.update(userRef, {
      postsCount: increment(1),
    });
    await batch.commit();
    // Делаем то же самое в store, чтобы сразу отобразить на странице
    const newPost = await getDoc(postRef);
    pushItemToStore("posts", { ...newPost.data(), id: newPost.id });
    appendChildToParent({ child: "postIds", parent: "threads" })(
      threads.value,
      { childId: newPost.id, parentId: post.threadId }
    );
    if (!post.firstInThread) {
      appendChildToParent({ child: "contributorIds", parent: "threads" })(
        threads.value,
        { childId: auth.authId, parentId: post.threadId }
      );
    }
  }

  async function updatePost({ text, id }) {
    const auth = useAuth();
    const post = {
      text,
      edited: {
        at: serverTimestamp(),
        by: auth.authId,
        moderated: false,
      },
    };
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, post);
    const updatedPost = await getDoc(postRef);
    pushItemToStore("posts", updatedPost);
  }

  async function createUser({ id, email, name, username }) {
    const registeredAt = serverTimestamp();
    const usernameLower = username.toLowerCase();
    email = email.toLowerCase();
    const user = {
      email,
      name,
      username,
      usernameLower,
      registeredAt,
    };
    const userRef = doc(db, "users", id);
    await setDoc(userRef, user);
    const newUser = await getDoc(userRef);
    pushItemToStore("users", newUser);
    return makeResourceFromDoc(newUser);
  }

  async function updateUser(user) {
    const userUpdates = {
      avatar: user.avatar || null,
      username: user.username || null,
      name: user.name || null,
      bio: user.bio || null,
      website: user.website || null,
      email: user.email || null,
    };
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, userUpdates);
    pushItemToStore("users", user);
  }

  //------------------------------------------------------------
  // Другие методы
  //------------------------------------------------------------
  // Установка и сброс переменной для индикатора загрузки
  function startLoadingIndicator() {
    isAsyncDataLoaded.value = false;
  }

  function stopLoadingIndicator() {
    isAsyncDataLoaded.value = true;
  }

  // Вспомогательные функции
  function appendChildToParent({ child, parent }) {
    return (parentResource, { childId, parentId }) => {
      const resource = parentResource.find((r) => r.id === parentId);
      if (!resource) {
        console.warn(
          `Не удалось добавить ${child} ${childId} к ${parent} ${parentId} т.к. родитель не существует.`
        );
        return;
      }
      resource[child] = resource[child] || [];
      if (!resource[child].includes(childId)) {
        // Чтобы добавить пользователя в список только один раз
        resource[child].push(childId);
      }
    };
  }
  function pushItemToStore(resource, item) {
    const resourceArray = useState(resource).value;
    const index = resourceArray.findIndex((r) => r.id === item.id);
    if (item.id && index !== -1) {
      resourceArray[index] = item;
    } else {
      resourceArray.push(item);
    }
  }
  /*
  function pushItemToStore(resource, item) {
    //console.log("pushItemToStore", "1");
    const index = resource.findIndex((r) => r.id === item.id);
    //console.log("pushItemToStore", "2", index);
    if (item.id && index !== -1) {
      resource[index] = item;
    } else {
      resource.push(item);
    }
    //console.log("pushItemToStore", "3", resourceArray);
  }
  */
  function makeResourceFromDoc(doc) {
    if (typeof doc?.data !== "function") return doc;
    return { ...doc.data(), id: doc.id };
  }

  return {
    user,
    thread,
    unsubscribeAllSnapshots,
    fetchItem,
    fetchItems,
    fetchCategory,
    fetchForum,
    fetchThread,
    fetchPost,
    fetchUser,
    fetchAllCategories,
    fetchForums,
    fetchThreads,
    fetchThreadsByPage,
    fetchPosts,
    fetchUsers,
    createThread,
    updateThread,
    createPost,
    updatePost,
    createUser,
    updateUser,
    startLoadingIndicator,
    stopLoadingIndicator,
  };
}
