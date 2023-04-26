<template>
    
  <div class="about">
    
    <h2 class="about__title subtitle">Привет! Меня зовут Женя!</h2>

    <!---->

    <div class="about__topic">
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_01.jpg?alt=media&token=a965404b-999a-4433-8466-bab220bcb3ab" alt="Work-Konsom-main">
      </div>
      <div class="about__text">
        Расскажу немного о себе...
        Начнем с релевантного. 
        Во первых, я участвовал в разработке системы диагностики промышленного оборудования 
        (электродвигателей, подшипников, редукторов, вентиляторов).
        Система состоит из двух частей: 
        <ol>
          <li>первая &mdash; локальная, доступ к ней возможен только внутри предприятия (на основе SVG-мнемосхемы)</li>
          <li>вторая &mdash; удаленная, с веб-интерфейсом (в качестве сервера использовали IIS)</li>
        </ol>
        Frontend-часть проекта выполнена на HTML, CSS и чистом JavaScript. 
        Сейчас занимаюсь настройкой системы под конкретные объекты и установкой по месту. 
        Иногда приходится даже рисовать чертежи переходников для крепления датчиков, 
        а токарь потом их вытачивает из стали.
      </div>
    </div>

    <div class="about__between desktop-only">
      <div></div>
    </div>

    <div class="about__topic">
      <div class="about__text">
        Еще один интересный проект, с которым я столкнулся - 
        автоматический расчет объема металлолома в совке 
        в Кислородно-конвертерном цехе с использованием 3D-видеокамеры.
        Здесь пришлось решить ряд задач:
        <ol>
          <li>собственно сам расчет объема лома;</li>
          <li>автоматически отличать борта совка от металлолома;</li>
          <li>
            сделать корректировку на большое количество углеродной пыли, 
            летающей в водухе и искажающей расчеты;
          </li>
          <li>
            автоматическая перенастройка системы при
            изменении угла наклона камеры.
          </li>
        </ol>
      </div>
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_02.jpg?alt=media&token=0e255e7f-b7d1-40d5-91cb-6f8b784e1e01" alt="Work-Konsom-3D-camera">
      </div>
    </div>

    <div class="about__between about__between_backward desktop-only">
      <div></div>
    </div>

    <!---->

    <div class="about__topic">
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_03.jpg?alt=media&token=5ff1f264-47ab-4c2f-8b88-66e786d2fb13" alt="Work-Konsom-BELAZ">
      </div>
      <div class="about__text">
        Еще из интересного: система диагностики редукторов, 
        которые стоят в задних колесах БелАЗа. 
        Здесь надо было настроить систему, описанную в пункте 1, 
        под геометрию планетарного редуктора БелАЗа. 
        Для проведения экспериментов использовали подсистему с веб-интерфейсом.
        Человек с ноутбуком сидел в кабине и записывал нужные данные, 
        пока БелАЗ ездил по карьеру. 
        А затем, уже в офисе вручную анализировали полученные данные.
      </div>
    </div>

    <div class="about__between desktop-only">
      <div></div>
    </div>

    <div class="about__topic">
      <div class="about__text">
        У меня опубликовано несколько книг. 
        Но тут особо нечем гордиться - работа обязывает. 
      </div>
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_04.jpg?alt=media&token=0c295840-84b1-451d-a1c5-7e8adff509c9" alt="Books">
      </div>
    </div>

    <div class="about__between about__between_backward desktop-only">
      <div></div>
    </div>

    <!---->

    <div class="about__topic">
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_05.jpg?alt=media&token=0ffe860d-0aab-4f66-acb3-e5cf5f7c70dc" alt="Panting">
      </div>
      <div class="about__text">
        Теперь о личном. 
        В свободное время занимаюсь живописью. 
        Рисую маслом, акварелью и на планшете в Photoshop.
      </div>
    </div>

    <div class="about__between desktop-only">
      <div></div>
    </div>

    <div class="about__topic">
      <div class="about__text">
        Самая сложная из задач, которую приходилось решать в живописи - 
        это портрет бабушке на 80-летний юбилей.
        Учитывая, что до этого я ни разу в жизни портрет не рисовал, 
        я подошел к этой задаче как к проекту:
        <ol>
          <li>
            первым делом посмотрел видео, как это делается;
          </li>
          <li>
            выявил самые сложные места в портрете (руки, уголки губ), 
            чтобы уделить им особое внимание;
          </li>
          <li>
            разделил задачу на несколько более простых шагов, первый из которых - рисунок карандашом;
          </li>
          <li>
            второй шаг - полностью написал картину краской, но в черно белых тонах, 
            чтобы не отвлекаться на выбор цвета, а только передавать форму;
          </li>
          <li>
            и третий шаг - имея готовую форму просто добавил цвет.
          </li>
        </ol>
        По-моему, это чем-то похоже на процесс написания кода.
        
        <!--<p>Интересный факт: у всех нас лица несимметричные, 
        но на портрете обязательно надо исказить лицо в обратную сторону,
        чтобы оно сделалось симметричным. Иначе оно будет казаться кривым.</p>-->
      </div>
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_06.jpg?alt=media&token=f5450b9b-3dfd-4c61-ba89-d121ce60b5b3" alt="Portret">
      </div>
    </div>

    <div class="about__between about__between_backward desktop-only">
      <div></div>
    </div>

    <!---->

    <div class="about__topic">
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_07.jpg?alt=media&token=8ae2e8b4-ffcc-4b44-ac0b-d0fb5ef9560e" alt="Sport">
      </div>
      <div class="about__text">
        350 дней в году я бегаю 3 км по утрам. 
        Ну хорошо, не ровно 350 дней, но около того. 
        А еще увлекаюсь велосипедом, плаваньем, лыжами и пинг-понгом.
      </div>
    </div>

    <div class="about__between desktop-only">
      <div></div>
    </div>

    <div class="about__topic">
      <div class="about__text">
        А это моя семья.
      </div>
      <div class="about__image">
        <img src="https://firebasestorage.googleapis.com/v0/b/spa-blog-c7ad9.appspot.com/o/images%2Fimg_08.jpg?alt=media&token=ccc6db87-8fd3-4d38-8e6b-4e5d431d635a" alt="Family">
      </div>
    </div>

    <!--<div class="about__between about__between_backward desktop-only">
      <div></div>
    </div>

    

    <div class="about__topic">
      <div class="about__image">
        <video></video>
      </div>
      <div class="about__text">
        И последнее: мы с сестрой сняли архаус-фильм бюджетом 7000 руб.
        Здесь основная заслуга принадлежит сестре. Я только держал камеру. 
        <p>
          Наверное, самая большая сложность, которая была на съемках - 
          это собрать несколько человек в одном месте в одно время.
          По сути, это задача руководителя проектов.
        </p>
      </div>
    </div>-->

  </div>

</template>

<style lang="scss" scoped>
$orange: #ff9d4e;
$middle-color: #e2edf3;
$green: #5bc4ad;

.about {
  font-size: 16px;
  margin-bottom: 20px;

  &__title {
    margin: 30px 0;
  }

  &__topic {
    display: flex;
    justify-content: space-between;
  }
  
  &__image {
    flex: 0 1 47%;
    border: 5px solid $orange;
    border-radius: 20px;
    & img {
      max-width: 400px;
      border-radius: 15px;
    }
  }
  
  &__topic:nth-child(4n) &__image {
    border: 5px solid $green;
  }

  &__text {
    flex: 0 1 47%;
    text-align: justify;
    & ol {
      margin: 10px 0;
      margin-left: 40px;
    }
  }

  &__between {
    & div {
      position: relative;
      margin: 30px auto;
      width: 52.5%;
      height: 5px;
      background: $orange;
      background: -moz-linear-gradient(left,  $orange 0%, $middle-color 50%, $green 100%);
      background: -webkit-linear-gradient(left,  $orange 0%, $middle-color 50%, $green 100%);
      background: linear-gradient(to right,  $orange 0%, $middle-color 50%, $green 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=$orange, endColorstr=$green, GradientType=1 );

      &::before {
        position: absolute;
        content: "";
        bottom: 0;
        left: 0;
        width: 5px;
        height: 35px;
        background-color: $orange;
      }

      &::after {
        position: absolute;
        content: "";
        top: 0;
        right: 0;
        width: 5px;
        height: 35px;
        background-color: $green;
      }
    }
  }
  
  &__between_backward {
    transform: scale(1, -1);
  }

  @media (max-width: 720px) {
    &__topic {
      flex-wrap: wrap;
    }
    &__image {
      order: 1;
      flex: 0 1 100%;
      & img {
        max-width: 100%;
      }
    }
    &__text {
      order: 2;
      flex: 0 1 100%;
      margin-top: 5px;
      margin-bottom: 40px;
    }
  }
}
</style>