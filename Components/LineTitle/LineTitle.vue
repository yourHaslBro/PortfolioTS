<template functional>
  <div class="line-title" :class="`line-title_${props.color}-color`">
    <img :src="props.url" class="line-title__image">
    <span class="line-title__text">
      {{ props.text }}
    </span>
  </div>
</template>

<script lang="ts">
import {Prop, Component, Vue} from 'vue-property-decorator';

@Component
export default class LineTitle extends Vue {
  @Prop({required: true, type: String}) 
  readonly url!: string;

  @Prop({required: true, type: String}) 
  readonly text!: string;

  @Prop({required: true, type: String}) 
  readonly color!: string;
}
</script>

<style lang="scss">
@import '~scss/fonts.scss';
@import './scss/img-size.scss';
@import '~scss/colors.scss';

.line-title {
  position: relative;
  font-family: $calibri;
  margin-bottom: 20px;
  @include title-size;

  @media only screen and (max-width:767px) {
    padding: 10px 5px;
  }
  @media only screen and (min-width:768px) {
    padding: 5px 0px;
  }

  &_green-color {
    color: $greenColor;
    border-bottom: 1px solid $greenColor;    
  }
  &_sea-color {
    color: $seaColor;
    border-bottom: 1px solid $seaColor;    
  }
  &_griff-color {
    color: $griffColor;
    border-bottom: 1px solid $griffColor;    
  }

  &__text {
    margin: 0px 0px 0px 10px;
    vertical-align: 20%;      
  }

  &__image {
    height: auto;
    @include img-size;     
  }
}
</style>