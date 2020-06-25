<template>
<div class="custom-select">
  <div
    class="custom-select__text-wrapper"
    :class="{'custom-select__text-wrapper_selected': showOption}"
    @click="showOption = !showOption"
  > {{ currentText }} </div>
  <div class="custom-select__option-body" v-show="showOption">
    <div
      v-for="option in optionArray"
      class="custom-select__option"
      :class="{'custom-select__option_selected': option.value === value}"
      @click="optionClick(option.value)"
      :key="option.value"
    > {{ option.text }} </div>
  </div>
</div>
</template>

<script lang="ts">
import {selectOptions} from './@types';
import {Prop, Ref, Emit, Component, Vue} from 'vue-property-decorator';
import {selectOptionsValidator} from './@validators';

@Component
export default class CustomSelect extends Vue {
  @Prop({type: String, required: true}) 
  readonly value!: string

  @Prop({type: Array, required: true, validator: selectOptionsValidator})
  readonly optionArray!: selectOptions[]

  private showOption: boolean = false;

  get currentText(): string {
    return this.optionArray.find(elem => elem.value === this.value)?.text ?? '';
  }
  
  @Emit('input')
  private optionClick(clickVal: string): string {
    this.showOption = false;
    return clickVal;
  }

  private outClick(event: MouseEvent): void {
    let findEl: boolean = !(<MouseEventPath>event).path.find(elem => elem === this.$el);
    if(findEl) this.showOption = false;
  }

  private mounted(): void {
    document.addEventListener('click', this.outClick);
  }

  private destroyed(): void {
    document.removeEventListener('click', this.outClick);
  }
};
</script>

<style lang="scss"> 
@import '~scss/fonts.scss';
@import '~scss/colors.scss';

@supports (-webkit-overflow-scrolling: touch) {
  @media screen and (max-width: 768px) {
  	body { 
  	  cursor: pointer; 
  	}
  }
}

.custom-select {
  position: relative;
  font-family: $calibri-light;  
  @include regular-size;

  &__text-wrapper {
    position: relative;
    display: block;
    padding: 6px 2px 6px 10px;
    background-color: white;
    outline: none;
    border: 1px solid $grayColor;
    border-radius: 3px 3px 0 0;
    text-decoration: none;
    white-space: nowrap;
    line-height: 19px;
    min-height: 19px;
    text-overflow: ellipsis;
    color: $griffColor;
    overflow: hidden;
    cursor: pointer;  

    &, &_selected {
      border-color: $griffColor;
    }

    &:before, &:after {
      position: absolute;
      background-color: $grayColor;
      width: 10px;
      height: 1px;
      display: block;
      content: '';
      top: 15px;    
    }

    &:before {
      transform: rotate(-45deg);
      right: 18px;    
    }

    &:after {
      transform: rotate(45deg);
      right: 25px;    
    }

    &:hover:before, &:hover:after,
    &_selected:before, &_selected:after {
      background-color: $griffColor !important;
    }
  }

  &__option-body {
    width: calc(100% - 2px);
    background-color: #fff;
    border: 1px solid $griffColor;
    border-radius: 0 0 3px 3px;
    z-index: 1;
    margin: 0;
    padding: 0;
    margin-top: -1px;
    max-height: 261px;
    position: absolute;
    overflow-y: auto; 
    
    &::-webkit-scrollbar-thumb {
      background-color: $griffColor;
      -webkit-overflow-scrolling: touch; 
      border-radius: 0px;     
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
      background-color: #F5F5F5;
      border-radius: 10px;      
    }

    &::-webkit-scrollbar {
      width: 8px;
      height: 7px;
      background-color: #F5F5F5;
    }
  }

  &__option {
    position: relative;
    display: block;
    padding: 9px 14px;
    color: $griffColor;
    background-color: #fff;
    line-height: 19px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;    

    &:hover, &_selected {
      background-color: rgba(65, 132, 197, 0.2);    
    }

  }
}
</style>