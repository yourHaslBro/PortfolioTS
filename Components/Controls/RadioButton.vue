<template>
<div class="control-flag">
  <input 
    :id="value" 
    class="control-flag__input" 
    type="radio" 
    :checked="modelValue === value" 
    :value="value"  
    @change="emitChange()"
  >
  <label 
    :class="{'control-flag__label_exist-value': !!label}" 
    :for="value" v-html="label" 
    class="control-flag__label control-flag__label_radio"
  />
</div>  
</template>

<script lang="ts">
import {Prop, Emit, Component, Model, Vue} from 'vue-property-decorator';

@Component
export default class RadioButton extends Vue {
  @Model('change', {required: true, type: String}) 
  readonly modelValue!: string  
  
  @Prop({type: String, required: true})
  readonly value!: string

  @Prop({type: String, default: ''})
  readonly label!: String

  @Emit('change')
  private emitChange(): string {
    return this.value;
  }
}
</script>

<style lang="scss">
@import './controls.scss';
</style>