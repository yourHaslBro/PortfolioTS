<template>
<div class="hierarchical-menu">
  <div v-if="structure.hasOwnProperty('a')">
    <a class="hierarchical-menu__a" v-if="!structure.hasOwnProperty('router')" :target="structure.target || '_self'" :href='structure.a'>
      <div 
        class="hierarchical-menu__title"
        :class="`hierarchical-menu__title_${structure.color}`"
      > {{ structure.title }} </div>
    </a>
    <router-link v-else class="hierarchical-menu__a" :to='structure.a'>
      <div 
        class="hierarchical-menu__title"
        :class="`hierarchical-menu__title_${structure.color}`"
      > {{ structure.title }} </div>
    </router-link>
  </div>
  <div v-else>
    <div
      list
      :list-open="String(show)"
      class="hierarchical-menu__title"
      :class="`hierarchical-menu__title_${structure.color}`"
      @click="show = !show"
    > {{ structure.title }} </div>
    <div class="hierarchical-menu__options-wrapper" v-if="show">
      <div v-for="r in structure.array" :key="r.hasOwnProperty('val')? r.val : `noVal - ${Math.random()}`">
        <div v-if="r.hasOwnProperty('val')">
          <a v-if="r.hasOwnProperty('a')" :target="r.target || '_self'" :href="r.a">
            <div 
              class="hierarchical-menu__option"
              :class="`hierarchical-menu__option_${structure.color}`"
            > {{ r.val }} </div>
          </a>
          <router-link :to="r.link" v-else>
            <div 
              class="hierarchical-menu__option"
              :class="`hierarchical-menu__option_${structure.color}`"
            > {{ r.val }} </div>
          </router-link>
        </div>
        <hierarchicalMenu v-else :structure="r"/>
      </div>
    </div>
  </div>
</div>  
</template>

<script lang="ts">
import {Prop, Component, Vue} from 'vue-property-decorator';
import {hierarchicalDeepObject} from "./@types";

@Component({
  name: 'hierarchicalMenu'
})
export default class HierarchicalMenu extends Vue {
  @Prop({required: true, type: Object})
  readonly structure!: hierarchicalDeepObject;

  private show: boolean = false;
}
</script>

<style lang="scss">
@import '~scss/fonts.scss';
@import './scss/local-colors.scss';
@import '~scss/colors.scss';

.hierarchical-menu {
  font-family: $calibri-light;

  &__a {
    text-decoration: none;
  }

  &__title {
    position: relative;
    cursor: pointer;
    margin-left: 12px;
    color: $griffColor;  
    @include title-size;

    &[list-open="false"]:after {
      transform: translateY(-42%) rotate(-90deg);
    }
    &[list-open="true"]:after {
      transform: translateY(-42%);
    }

    &:before {
      content: '';
      height: 12px;
      position: absolute;
      top: 50%;
      left: -10px;
      border-left-width: 2px;
      border-left-style: solid;
      display: inline-block;
      transform: translateY(-50%);
    }
    
    &[list]:after {
      background-image: url(./image/grif.png);
      background-size: 13px;
      display: inline-block;
      width: 13px;
      height: 13px;
      content: "";
      top: 50%;
      position: absolute;
      margin-left: 5px;  
      @media only screen and (max-width: 768px) {
        display: none;
      }    
    }
    @include title-color;
  }

  &__options-wrapper {
    margin-left: 10px;
    display: inline-block;    
  }

  &__option {
    position: relative;
    color: rgb(157, 157, 157);
    margin: 2px 0px 2px 12px;
    display: inline-block; 
    @include regular-size;   

    &:after {
      top: 7px;
      transform: rotate(45deg);      
    }
    &:before {
      top: 12px;
      transform: rotate(-45deg);      
    }
    &:after, &:before {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.4);
      width: 8px;
      height: 1px;
      display: block;
      content: '';      
      left: -10px;
    }
    @include option-color;
  }
}


</style>