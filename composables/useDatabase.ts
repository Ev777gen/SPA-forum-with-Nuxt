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

interface ICategory {
  name: string,
  slug: string,
  id: string,
  forumIds: string[],
}

interface IForum {
  name: string,
  slug: string,
  description: string,
  id: string,
  categoryId: string,
  threadIds: string[],
  lastPostId: string,
}

interface IThread {
  title: string,
  slug: string,
  id: string,
  forumId: string,
  userId: string,
  firstPostId: string,
  publishedAt: number | object,
  lastPostAt: number | object,
  lastPostId: string,
  postIds: string[],
  contributorIds?: string[],
}

interface IThreadComputed extends IThread {
  author: string,
  repliesCount: number,
  contributorsCount: number,
}

interface IPost {
  text: string,
  publishedAt: number | object,
  id: string,
  threadId: string,
  userId: string,
  edited?: {
    at: number | object,
    by: string,
    moderated: boolean,
  },
  firstInThread?: boolean,
}

interface IUserCreated {
  email: string,
  name: string,
  username: string,
  id: string,
}

interface IUser extends IUserCreated {
  avatar: string,
  usernameLower: string,
  bio: string,
  registeredAt: number | object,
  lastVisitAt: number | object,
  postsCount: number,
  threadsStarted: string[],
  website?: string,
}

interface IUserModerator extends IUser {
  isModerator: boolean,
}

interface IUserComputed extends IUser {
  posts: IPost[],
  postsCount: number,
  threads: IThread[],
  threadsCount: number,
}

interface IItem {
  resource: string,
  id: string,
  handleUnsubscribe?: Function | null,
  once?: boolean,
  callBack?: Function | null,
}

interface IItems {
  resource: string,
  ids: string[],
  callBack?: Function | null,
}


export default function () {
  const { $firestore: db } = useNuxtApp();

  let categories = useState<ICategory[]>("categories", () => []);
  let forums = useState<IForum[]>("forums", () => []);
  let threads = useState<IThread[]>("threads", () => []);
  let posts = useState<IPost[]>("posts", () => []);
  let users = useState<IUser[]>("users", () => []);
  let unsubscribes = useState("unsubscribes", () => []);
  let isAsyncDataLoaded = useState<boolean>("isAsyncDataLoaded", () => true);

  const user = computed(() => {
    return (id: string): IUserComputed | null => {
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
    return (id: string): IThreadComputed | object => {
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
  }: IItem): Promise<IItem | null>{
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

  function fetchItems({ ids, resource, callBack = null }: IItems): Promise<(IItem | null)[]> {
    const itemIds: string[] = ids || [];
    return Promise.all(itemIds.map((id: string) => fetchItem({ id, resource, callBack })));
  }

  async function unsubscribeAllSnapshots(): Promise<void> {
    unsubscribes.value.forEach((unsubscribe: Function) => unsubscribe());
    unsubscribes.value = [];
  }

  // Создаем на их основе методы чтения из базы данных
  // Для одного item
  function fetchCategory({ id }: {id: string}): Promise<IItem | null> {
    return fetchItem({ resource: "categories", id });
  }

  function fetchForum({ id, once }: {id: string, once: boolean}): Promise<IItem | null> {
    return fetchItem({ resource: "forums", id, once });
  }

  function fetchThread({ id, once }: {id: string, once: boolean}): Promise<IItem | null> {
    return fetchItem({ resource: "threads", id, once });
  }

  function fetchPost({ id }: {id: string}): Promise<IItem | null> {
    return fetchItem({ resource: "posts", id });
  }

  function fetchUser({ id }: {id: string}): Promise<IItem | null> {
    return fetchItem({ resource: "users", id });
  }

  // Для нескольких items
  async function fetchAllCategories(): Promise<ICategory[]> {
    let categories: ICategory[] = [];
    const querySnapshot = await getDocs(collection(db, "categories"));
    querySnapshot.forEach((doc) => {
      const item = { ...doc.data(), id: doc.id };
      categories.push(item);
      pushItemToStore("categories", item);
    });
    return Promise.resolve(categories);
  }

  function fetchForums({ ids }: {ids: string[]}): Promise<(IItem | null)[]> {
    return fetchItems({ resource: "forums", ids });
  }

  function fetchThreads({ ids }: {ids: string[]}): Promise<(IItem | null)[]> {
    return fetchItems({ resource: "threads", ids });
  }

  function fetchThreadsByPage(
    { ids = [], page, threadsPerPage = 10 }: 
    { ids: [], page: number, threadsPerPage: number }): Promise<(IItem | null)[]> {
    if (ids.length === 0) return [];
    threads.value = [];
    const chunks = chunk(ids, threadsPerPage);
    const limitedIds = chunks[page - 1];
    return fetchThreads({ ids: limitedIds });
  }

  function fetchPosts({ ids }: {ids: string[]}): Promise<(IItem | null)[]> {
    return fetchItems({ resource: "posts", ids });
  }

  function fetchUsers({ ids }: {ids: string[]}): Promise<(IItem | null)[]> {
    return fetchItems({ resource: "users", ids });
  }

  //------------------------------------------------------------
  // Запись в БД Cloud Firestore
  //------------------------------------------------------------
  async function createThread(
    { text, title, forumId }: IThread & IPost
    ): Promise<IThread> {
    // Подготавливаем данные для отправки
    const authId: Ref<string> = useState('authId');
    const userId = authId.value;
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

  async function updateThread(
    { title, text, id }: IThread & IPost
    ): Promise<IThread> {
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

  async function createPost(post: IPost): Promise<void> {
    // Подготавливаем данные
    const authId: Ref<string> = useState('authId');
    post.userId = authId.value;
    post.publishedAt = serverTimestamp();
    post.firstInThread = post.firstInThread || false;
    const batch = writeBatch(db);
    const postRef = doc(collection(db, "posts"));
    const threadRef = doc(db, "threads", post.threadId);
    const userRef = doc(db, "users", authId.value);
    // Добавляем пост в базу данных Cloud Firebase:
    // - сам пост добавляем в коллекцию постов posts
    // - id поста добавляем в соответствующий thread
    // - id пользователя, написавшего пост, тоже добавлям в этот же thread
    batch.set(postRef, post);
    const threadUpdates = {
      postIds: arrayUnion(postRef.id),
    };
    if (!post.firstInThread) {
      threadUpdates.contributorIds = arrayUnion(authId.value);
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
        { childId: authId.value, parentId: post.threadId }
      );
    }
  }

  async function updatePost({ text, id }: IPost): Promise<void> {
    const authId: Ref<string> = useState('authId');
    const post = {
      text,
      edited: {
        at: serverTimestamp(),
        by: authId.value,
        moderated: false,
      },
    };
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, post);
    const updatedPost = await getDoc(postRef);
    pushItemToStore("posts", updatedPost);
  }

  async function createUser({ id, email, name, username }: IUserCreated): Promise<IUser> {
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

  async function updateUser(user: IUser): Promise<void> {
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
  function startLoadingIndicator(): void {
    isAsyncDataLoaded.value = false;
  }

  function stopLoadingIndicator(): void {
    isAsyncDataLoaded.value = true;
  }

  // Вспомогательные функции
  function appendChildToParent({ child, parent }: { child: string, parent: string }) {
    return (parentResource: any[], { childId, parentId }: { childId: string, parentId: string }): void => {
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

  function pushItemToStore(resource: string, item: IItem): void {
    const resourceArray = useState(resource).value as IItem[];
    const index = resourceArray.findIndex((r) => r.id === item.id);
    if (item.id && index !== -1) {
      resourceArray[index] = item;
    } else {
      resourceArray.push(item);
    }
  }

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
