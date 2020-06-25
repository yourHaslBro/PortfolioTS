import Vue from 'vue';
import Profiles from './App.vue';
import VueRouter from "vue-router";
import router from './vue-router.ts';
import store from './vuex/vuex.ts';

Vue.use(VueRouter);


class AppCore {
  private instance!: Vue;

  private init() {
    this.instance = new Vue({
      el: '#appContainer',
      router,
      store,
      render: h => h(Profiles),
    })
  }

  constructor() {
    this.init();
  }
}

new AppCore();
