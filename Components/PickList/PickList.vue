<template>
<div class="pick-list">
  <div 
    class="pick-list__title" 
    :class="{'pick-list__title_empty': incorrectEmpty && !multiplayValue[0] && !singleValue}" 
    @click="openList = !openList"
  > 
    <span class="pick-list__com-text">
      {{ currentTitle + ' ' + valueShortcut }}
    </span> 
  </div>
  <div class="pick-list__list" v-if="openList"> 
    <div class="pick-list__item" v-for="item in listArray" :key="item.value">
      <CheckBox v-if="multiplay" :label="item.label" :value="item.value" v-model="multiplayValue"/>
      <RadioButton v-else :label="item.label" :value="item.value" v-model="singleValue"/>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Prop, Vue, Component, Model, Emit, Watch} from 'vue-property-decorator';
import CheckBox from '../Controls/Checkbox.vue';
import RadioButton from '../Controls/RadioButton.vue';
import {pickListObject} from './@types';

@Component({
  components: {
    CheckBox,
    RadioButton
  }
})
export default class PickList extends Vue {
  @Prop({type: String,  required: true})
  readonly initialTitle!: string;

  @Prop({type: Boolean,  default: false})
  readonly incorrectEmpty!: boolean;

  @Prop({type: Boolean,  default: false})
  readonly multiplay!: boolean;

  @Prop({type: Array, required: true})
  readonly listArray!: any[];

  @Model('pick', {type: [Array, String], required: true})
  readonly value!: string[] | string;

  @Emit()
  private pick(val: string | string[]): string | string[] {
    return val;
  }

  private multiplayValue: string[] = [];

  private singleValue: string = '';

  private openList: boolean = false;

  get currentTitle(): string {
    return this.initialTitle;
  }

  get valueShortcut(): string {
    if (this.multiplay) {
      if (!!this.multiplayValue[0]) {
        return `(${this.multiplayValue.length})`;
      }
    } else {
      if (!!this.singleValue) {
        let currElem: pickListObject = this.listArray.find(elem => elem.value === this.singleValue);
        if (!!currElem.value) {
          return `(${currElem?.pickTitle || currElem.value})`;
        }
      }
    }
    return '';
  }

  private beforeMount(): void {
    if (this.multiplay) {
      this.multiplayValue = (<string[]>this.value);
    } else {
      this.singleValue = (<string>this.value);
    }
  }

  @Watch('multiplayValue') 
  private multiplayChange(val: string[]): void {
    this.pick(val);
    if (val.length === this.listArray.length) this.openList = false;
  }

  @Watch('singleValue') 
  private singleChange(val: string): void {
    this.pick(val);
    this.openList = false;
  }
}
</script>

<style lang="scss">
@import '~scss/fonts.scss';
@import '~scss/colors.scss';

.pick-list {
  font-family: $calibri-light;
  $root: &;

  &__title {
    @include title-size;
    cursor: pointer;
    color: $griffColor;
    padding: 10px 0px;
    border-bottom: 1px solid $griffColor;

    &_empty {
      border-bottom: 1px solid $errorColor;
    }

    &:hover {
      border-bottom: 1px solid $seaColor;
    }
  }

  &__com-text {
    position: relative;

    &:after {
      top: 9px;
      transform: rotate(45deg);      
    }

    &:before {
      top: 14px;
      transform: rotate(-45deg);      
    }

    &:after, &:before {
      position: absolute;
      background-color: $griffColor;
      width: 8px;
      height: 1px;
      display: block;
      content: '';      
      left: -10px;
    }

    #{$root}__title:hover &, 
    &:hover {
      color: $seaColor;
    }
    #{$root}__title:hover &:after,
    #{$root}__title:hover &:before,
    &:hover:after,
    &:hover:before {
      background-color: $seaColor;
    }
  }

  &__item {
    margin: 15px 0px;
  }
}
</style>