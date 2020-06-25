<template>
<div class="simple-modal">
  <div @click="close()" class="simple-modal__background"></div> 
  <div class="simple-modal__window">
    <div class="simple-modal__header">
      <div class="simple-modal__close" @click="close()"></div>
    </div>
    <div class="simple-modal__text">
      {{ text }}
    </div>
  </div>
</div>  
</template>

<script lang="ts">
import {Component, Vue, Prop, Emit} from 'vue-property-decorator';

@Component
export default class SimpleModal extends Vue {

  @Prop({required: true, type: String})
  readonly text!: string;
  
  @Emit('close-window')
  close(): boolean {
    return true;
  }

}
</script>

<style lang="scss">
@import '~scss/fonts.scss';

.simple-modal {
  &__background {
    position: fixed;
    background-color:rgba(242, 242, 242, 0.5);
    height: 100vh;
    width: 100vw;
    left: 0px;
    top: 0px;
    z-index: 5;
  }

  &__window {
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 50%;
    background-color:white;
    box-shadow: 0px 4px 8px -2px rgba(0,0,0,0.61);
    z-index: 6;
    height: 300px;
    width: 500px;

    @media only screen and (min-width: 768px) and (max-width: 1199px) {
      height: 270px;
      width: 450px;      
    }
    @media only screen and (min-width: 480px) and (max-width: 767px) {
      height: 250px;
      width: 420px;   
    }
    @media only screen and (max-width: 479px) {
      height: 150px;
      width: 270px;  
    }
  }

  &__header {
    background-color: #8bc9f9;
    height: 50px;

    @media only screen and (min-width: 480px) and (max-width: 1199px) {
      height: 40px;
    }
    @media only screen and (max-width: 479px) {
      height: 30px;
    }
  }

  &__close {
    position: absolute;
    right: 5%;
    top: 5%;
    opacity: 1;
    cursor:pointer;
    width: 20px;
    height: 20px;

    @media only screen and (max-width: 767px) {
      width: 17px;
      height: 17px;
    }

    &:hover {
      opacity: 0.5;
    }

    &:before {
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
    }

    &:before, &:after {
      position: absolute;
      content: ' ';
      width: 2px;
      background-color: white;
      height: 20px;
      left: 15px;

      @media only screen and (max-width: 767px) {
        height: 17px;
        left: 15px;
      }      
    }
  }

  &__text {
    font-family: $calibri-light;
    text-align: center;  
    padding: 20px;
    @include title-size;  
  }
}
</style>