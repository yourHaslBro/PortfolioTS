<template>
<div class="navigation">
  <router-link 
    class="navigation__link" 
    tag="span" 
    v-for="path in pathArray" 
    :key="path.href" 
    :to="path.href"
  >
    {{ path.text + ' /' }} 
  </router-link>
</div>  
</template>

<script lang="ts">
import {Prop, Component, Vue} from 'vue-property-decorator';
import {navigationObject} from "./@types";
import {navigationValidator} from "./@validators";

@Component
export default class Navigation extends Vue {
  @Prop({required: true, type: Array, validator: navigationValidator})
  readonly pathArray!: navigationObject[];
}
</script>

<style lang="scss">
@import '~scss/fonts.scss';
@import '~scss/colors.scss';

.navigation {
  @include small-size;
  color: $darkGreyColor;
  cursor: pointer;
  margin: 15px 0px;

  &__link {
    &:hover {
      color: $seaColor;
    }
  }
}
</style>