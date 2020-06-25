<template>
<div class="control-flag">
  <input 
    :id="value" 
    class="control-flag__input" 
    type="checkbox" 
    :checked="modelValue.includes(value)" 
    :value="value"  
    @change="emitChange($event.target.checked)"
  >
  <label 
    :class="{'control-flag__label_exist-value': !!label}" 
    :for="value" 
    v-html="label" 
    class="control-flag__label"
  />
</div>  
</template>

<script lang="ts">
import {Prop, Emit, Component, Model, Vue} from 'vue-property-decorator';
import {modelValueValidator} from './@validators';

@Component
export default class Checkbox extends Vue {
  @Model('change', {required: true, type: Array, validator: modelValueValidator}) 
  readonly modelValue!: string[]

  @Prop({type: String, required: true})
  readonly value!: string;

  @Prop({type: String, default: ''})
  readonly label!: String

  @Emit('change')
  private emitChange(checked: boolean): string[] {
    let pushArray: string[] = this.modelValue.slice(0);
    if (checked) {
      !this.modelValue.includes(this.value) && pushArray.push(this.value);
    } else {
      pushArray = pushArray.filter(elem => !(elem === this.value));
    }    
    return pushArray;
  }
}
</script>

<style lang="scss">
@import './controls.scss';
</style>