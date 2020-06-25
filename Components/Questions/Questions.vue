<template>
<div class="questions">
  <div class="questions__menu-wrapper">
    Вопросы:
    <div class="questions__link" @click="scrollTo('web-accsess-problems')"> Под учетными данными слушателя невозможно попасть на учебный портал </div>
    <div class="questions__link" @click="scrollTo('footer-problems')"> У пользователя на странице отображается только «подвал» </div>
    <div class="questions__link" @click="scrollTo('cookies-problems')"> После захода на портал пользователя «выкидывает» при попытке перейти на любую страницу </div>
    <div class="questions__link" @click="scrollTo('cert-download')"> Скачать сертификат пользователя </div>
  </div>
  <div class="questions__answers-wrapper">
    Ответы:
    <div class="questions__answer" id="web-accsess-problems">
      <div class="questions__answer-title">Под учетными данными слушателя невозможно попасть на учебный портал</div>
      <div class="questions__keys"> Ключевые слова: портал, доступ, организация </div>
      Возможность зайти под пользователем на портал определяется его попаданием под условия доступа и отсутствием флага в карточке пользователя, запрещающей доступ. 
      <div>
        Условия доступа отражены в разделе <span class="questions__green-notification">Портал -> Сайты -> Необходимый сайт -> Владельцы</span>.
      </div>
      <div>
        Флаг запрета доступа находится в карточке слушателя, в разделе <span class="questions__green-notification">Права доступа</span>.
      </div>
      <div class="questions__red-notification">
        Наиболее распостранённой проблемой является отсутствие необходимой для доступа организации в карточке слушателя.
      </div>
      <img class="questions__img" src="/images/questions/web-accsess-problems-01.png">
    </div>
    <div class="questions__answer" id="footer-problems">
      <div class="questions__answer-title">У пользователя на странице отображается только «подвал»</div>
      <div class="questions__keys"> Ключевые слова: портал, доступ, подвал, логин </div>
      Пользователь пытается попасть на портал <span class="questions__red-notification">минуя страницу авторизации</span>. <span class="questions__green-notification">Необходимо залогиниться на странице авторизации</span> и далее снова перейти на страницу.
      <img class="questions__img" src="/images/questions/footer-problems-01.png">
    </div>
    <div class="questions__answer" id="cookies-problems">
      <div class="questions__answer-title">После захода на портал пользователя «выкидывает» при попытке перейти на любую страницу</div>
      <div class="questions__keys"> Ключевые слова: портал, доступ, авторизация, cookies </div>
      У пользователя <span class="questions__red-notification">запрещены использование сайтами cookies</span> в используемом браузере, либо же они очищаются сторонней программой.
    </div>
    <div class="questions__answer" id="cert-download">
      <div class="questions__answer-title">Скачать сертификат пользователя</div>
      <div class="questions__keys"> Ключевые слова: скачать, сертификат </div>
      Необходимо перейти по ссылке, подстави вместо имеющегося object_id уникальный id сертификата. 
      <div class="questions__green-notification">Посмотреть его можно в карточке сертификата, Сервис -> Копировать ID документа.</div>
      <div>
        http://espbmrc.ru/view_print_form_cust1.html?print_form_id=6680412249939198445&<span class="questions__yellow-notification">object_id=6807283171589575035</span>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class Questions extends Vue {
  private scrollTo(id: string): void {
    document?.getElementById(id)?.scrollIntoView();
  }
}

</script>

<style lang="scss">
@import '~scss/colors.scss';
@import '~scss/fonts.scss';

.questions {
  &__menu-wrapper, &__answers-wrapper {
    font-family: $calibri;
    color: $griffColor;
    @include title-size;
  }

  &__answers-wrapper {
    margin: 30px 0px 150px;
  }

  &__link, &__answer-title {
    font-family: $calibri;
    margin: 3px 0px;
    color: $seaColor;
    @include title-size;
  }

  &__link {
    cursor: pointer;
    margin: 0px 0px 10px;
    
    &:hover {
      color: $yellowColor;
    }
  }

  &__keys {
    @include small-size;
    font-style: italic;
    margin: 5px 0px;
  }

  &__answer {
    @include regular-size;
    margin: 0px 0px 30px;
  }

  &__img {
    width: 96%;
    margin: 10px 2%;
    height: auto;
    border: 1px solid $seaColor;
  }

  &__yellow-notification {
    color: $yellowColor;
  }

  &__green-notification {
    color: $greenColor;
  }

  &__red-notification {
    color: $errorColor;
  }

}
</style>