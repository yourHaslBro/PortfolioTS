<template>
<div class="button button_blue" @click="clickHandler()"> 
  <slot/> 
</div>
</template>

<script lang="ts">
import {Component, Vue, Emit} from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Emit('click')
  private clickHandler(): boolean {
    return true;
  }
}
</script>

<style lang="scss">
@import '~scss/fonts.scss';

.button {
  cursor: pointer;
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  @include title-size;
  width: max-content;
  text-align: center;

  @media only screen and (min-width: 900px)  {
    width: 20%;
  }

  @media only screen and (max-width: 700px)  {
    width: 25%;
  }

  @media only screen and (max-width: 500px)  {
    width: 30%;
  }

  &_blue {
    background-color: #4184C5;

    &:hover {
      background-color: #8BC9F9;
    }
  }
}
</style>
