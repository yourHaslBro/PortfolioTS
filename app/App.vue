<template>
<div class="profiles">
  <LineTitle url="images/diploma.png" :text="title || `Профили`" color="griff"/>
  <Navigation :pathArray="navigationArray"/>
  <router-view/>
</div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Provide} from 'vue-property-decorator';
import {Route} from 'vue-router';
import axios, {AxiosResponse} from 'axios';
import {Action} from 'vuex-class';
import LineTitle from '@c/LineTitle/LineTitle.vue';
import Navigation from '@c/Navigation/Navigation.vue';
import {navigationObject} from '@c/Navigation/@types';

@Component({
  components: {
    LineTitle,
    Navigation
  }
})
export default class Profiles extends Vue {
  @Provide() production: boolean = process.env.NODE_ENV === 'production';

  @Action getEventsArray!: voidWithoutParametrs;

  @Action getEventsFilter!: voidWithoutParametrs;

  @Action getAccsessObject!: voidWithoutParametrs;

  private map: navigationObject[] = [];

  private title: string = '';

  private navigationArray: navigationObject[] = [];

  private navFallback: navigationObject = {text: '-', href: '-'};

  private async getMap(): Promise<boolean> {
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = 'custom_web_template.html?object_id=6785042060701800787&map_type=map';
    } else {
      axiosUrl = '../json/profilesMap.json';
    }
    let response: AxiosResponse = await axios.get(axiosUrl);
    this.map = <navigationObject[]>response.data;
    return !!this.map[0];
  }

  private beforeMount(): void {
    this.getEventsArray();
    this.getAccsessObject();
  }

  @Watch('$route', {immediate: true})
  async routerChange(to: Route, from: Route): Promise<void> {
    let correctResponse: boolean = await this.getMap();
    if (!correctResponse) return;
    let pathArray: string[] = to.path.slice(1).split('/');
    let findMapArray: navigationObject[] = pathArray.map((elem):  navigationObject => {
      return this.map.find(findElem => {
        return findElem.href.slice(1) === elem;
      }) ?? this.navFallback;
    });
    this.navigationArray = findMapArray.map((elem, index, arr): navigationObject => {
      let obj: navigationObject = {text: '', href: ''};
      obj.href = arr.slice(0, index + 1).map(elem => elem.href).join(''); 
      obj.text = elem.text;
      return obj;
    });
    this.title = findMapArray[findMapArray.length - 1].text;
  }
}
</script>

<style lang="scss">
@import '~scss/element-size-mixins.scss';

.profiles {
  @include safe-zone;
}
</style>
