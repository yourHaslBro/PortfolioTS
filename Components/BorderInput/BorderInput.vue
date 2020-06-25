<template>
  <div class="border-input" :class="{'border-input_error': errorClass}">
    <div 
      v-if="search" 
      @click="inputField.focus()" 
      class="border-input__search-img"
    > </div>
    <input
      v-bind="$attrs"
      ref="input"
      type="text"
      :value="value"
      @input="input($event.target.value)"
      @blur="blur($event.target.value)"
      class="border-input__input-field border-input__input-field_white-outline"
    >
    <div @click="input('')" class="border-input__clear-img"></div>
  </div>
</template>

<script lang="ts">
import {Prop, Ref, Emit, Component, Vue} from 'vue-property-decorator';

@Component({
  inheritAttrs: false
})
export default class BorderInput extends Vue {
  @Prop({type: String, required: true})
  readonly value!: string;

  @Prop({type: Boolean, default: false})
  readonly search!: boolean;

  @Prop({type: Boolean, default: false})
  readonly incorrectEmpty!: boolean;

  @Ref('input') 
  readonly inputField!: HTMLInputElement;

  private errorClass: boolean = false;
  
  private blur(value: string): void {
    if (!value && this.incorrectEmpty && !this.errorClass) this.errorClass = true;
  }

  @Emit() 
  input(value: string): string {
    if (!!value && this.errorClass) this.errorClass = false;
    return value;
  }
}
</script>

<style lang="scss"> 
@import '~scss/fonts.scss';
@import '~scss/colors.scss';

.border-input {
  $root-block: &;
  color: $grayColor;
  border-bottom: 1px solid $grayColor;
  position: relative;

  &:hover, &:focus-within {
    border-bottom: 1px solid $griffColor;
  }

  &_error {
    border-bottom: 1px solid $errorColor;
  }

  &__input-field {
    width: calc(100% - 25px);
    margin: 5px 0px;
    padding: 0px 0px 0px 25px;
    color: $grayColor;   
    text-overflow: ellipsis;
    font-family: $calibri-light;
    @include regular-size;

    &:focus {
      text-overflow: unset;
    }

    &:hover, &:focus, #{$root-block}:hover & {
      color: $griffColor;
    }

    &_white-outline {
      outline: 1px solid white;
      outline-offset: -1px;
      border: 1px;      
    }     
  }
  
  &__search-img {
    background: url('./images/m_focus.png');
    cursor: text;
  }

  &__clear-img {
    background: url('./images/cross.png');   
    cursor: pointer;
    right: 0%; 
  }

  &__search-img, &__clear-img {
    opacity: 0.4;
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);
    @media only screen and (max-width:479px) {
      background-size: 14px;
      height: 14px;
      width: 14px;
    }
    @media only screen and (min-width:480px) and (max-width:767px) {
      background-size: 16px;
      height: 16px;
      width: 16px;
    }
    @media only screen and (min-width:768px) and (max-width:1199px) {
      background-size: 18px;
      height: 18px;
      width: 18px;
    }
    @media only screen and (min-width:1200px) {
      background-size: 20px;
      height: 20px;
      width: 20px;
    } 
  }

  &:hover &__search-img, &:hover &__clear-img, 
  &:focus-within &__search-img, &:focus-within &__clear-img {
    opacity: 1;
  }
}
</style>