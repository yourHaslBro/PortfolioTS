<template>
  <div>
    <hierarchicalMenu 
      class="opr-project__hierarchical-menu" 
      v-for="structure in (structures[$route.params.profile] || structures.choice)" 
      :structure="structure" 
      :key="structure.title"
    />
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Inject} from 'vue-property-decorator';
import hierarchicalMenu from '../HierarchicalMenu/HierarchicalMenu.vue';
import {hierarchicalDeepObject} from '../HierarchicalMenu/@types';
import {Route} from 'vue-router';
import axios, {AxiosResponse} from 'axios';

@Component({
  components: {
    hierarchicalMenu
  }
})
export default class routerMenu extends Vue {
  @Inject() production!: boolean;

  private structures: any = {};

  private mounted() {
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = 'custom_web_template.html?object_id=6785042060701800787&map_type=structure';
    } else {
      axiosUrl = '../json/profilesStructure.json';
    }
    axios.get(axiosUrl)
      .then((response: AxiosResponse) => {
        this.structures = response.data;
      });    
  }
}
</script>

<style lang="scss">
@import '~scss/element-size-mixins.scss';
.opr-project {
  @include safe-zone;

  &__hierarchical-menu {
    margin: 10px 0px;
  }
}
</style>
