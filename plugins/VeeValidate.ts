import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
import { required, email, min, url } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import { collection, getDocs, query, where } from "firebase/firestore";
// Импортируем типы
import { Firestore } from '@firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  //const { $firestore: db } = useNuxtApp();
  let db: Firestore;
  const { $firestore } = useNuxtApp();
  db = $firestore as Firestore;

  // Задаем правила валидации.
  // В качестве функций для этих правил берем
  // готовые правила из библиотеки @vee-validate/rules
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("url", url);
  // И пишем свое правило для полей username и email
  // на странице регистрации нового пользователя,
  // чтобы убедиться, что они еще не зарегистрированы
  defineRule("unique", async (value: string, args: any[] ) => {
    // На элементе AppFormField можно записать правила двумя способами:
    // - строкой: <AppFormField ... rules="...|unique:users,username" />
    // - объектом: <AppFormField ... rules="{..., unique: {coll: 'users', field: 'username'}}" />
    // Поэтому деструктурируем для обоих случаев: когда args - это:
    // - массив (в него собраны аргументы из строки после двоеточия)
    // - объект
    let coll, field, excluding;
    if (Array.isArray(args)) {
      [coll, field, excluding] = args;
    } else {
      ({ coll, field, excluding } = args);
    }
    // Переменная excluding используется при редактировании профиля.
    // В компоненте UserProfileCardEditor.vue пишем так:
    // <AppFormField ... :rules="`...|unique:users,username,${user.username}`"/>
    // А следующее условие позволяет не обращаться к БД,
    // если пользователь не менял username или email.
    if (value === excluding) return true;
    // В базе данных, в коллекции coll ищем документы,
    // у которых значение в поле field равно value
    const queryArgs = [collection(db, coll), where(field, "==", value)] as const;
    const fieldQuery = query(...queryArgs);
    const querySnapshot = await getDocs(fieldQuery);
    // Если совпадений в БД нет, возвращаем true
    return querySnapshot.empty;
  });

  // Задаем разные сообщения для разных правил валидации
  configure({
    generateMessage: localize("ru", {
      messages: {
        required: "Поле {field} обязательно для заполнения",
        email: "Поле {field} должно быть действительным электронным адресом",
        min: "{field} должен состоять минимум из 0:{length} символов",
        unique: "Такой {field} уже занят",
        url: "Поле {field} содержит ссылку в некорректном формате",
      },
    }),
  });

  // Регистрируем компоненты форм глобально в приложении
  nuxtApp.vueApp.component("VeeForm", Form);
  nuxtApp.vueApp.component("VeeField", Field);
  nuxtApp.vueApp.component("VeeErrorMessage", ErrorMessage);
});

// Примечание: здесь не реализована проверка уникальности логина
// В данном случае логин избыточный, т.к. регистрация производится
// по электронной почте и паролю.
