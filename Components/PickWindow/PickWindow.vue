<template>
<div class="pick-window">

  <!--Open-modal-window-div-->
  <div 
    @click="showPickWindow = true" 
    class="text-size-from-contex-window-vue pick-window__show-window"
    v-html="preview"
  /> 
  <!--/Open-modal-window-div-->

  <!--Show-pick-elems-->
  <div class="pick-window__blocks-v-model-wrapper" v-if="multiplay? !!value[0] : !!value">
    <div 
      v-for="(value, index) in valuesForShow" 
      class="pick-window__blocks-v-model-items text-size-from-contex-window-vue" 
      :key="value"
    > 
      {{ value }} 
      <img @click="removeModalValue(index)" class="pick-window__blocks-v-model-img" src="./images/close.png">
    </div>
  </div>
  <!--/Show-pick-elems-->

  <!--Black-background-layer-->
  <transition-group name="window-fade">
    <div 
      class="pick-window__black-layot" 
      ref="layot" 
      @click="showPickWindow = false"
      key="back"
      v-if="showPickWindow"
    />
  </transition-group> 
  <!--/Black-background-layer-->

  <!--Window-body-->
  <transition-group name="window-slide">
    <div 
      v-if="showPickWindow" 
      key="window" 
      class="pick-window__window-main-wrapper window-main-wrapper"
    >
      <!--Title-part-->
      <div class="window-main-wrapper__title" v-html="windowTitle"/> 
      <!--/Title-part-->
      <div class="window-main-wrapper__elements window-main-wrapper__elements_scroll">
        <div class="content-part window-main-wrapper__content-part">      
          <!--Sort-part-->
          <div class="content-part__sort">
            <borderInput 
              class="content-part__border-input-component" 
              placeholder="поиск" 
              :search="true" 
              v-model="searchInputModel"
            />  
            <customSelect 
              class="content-part__custom-select" 
              :optionArray="searchOptions" 
              v-if="!!searchOptions" 
              v-model="searchSelectModel"
            />
          </div>
          <!--/Sort-part-->
          <!--Controls-->
          <div v-if="pickChunkArray.length" class="content-part__controls-wrapper">
            <div v-if="multiplay">
              <checkbox 
                value="all" 
                label="Выбрать все" 
                v-model="allCheckbox"
                v-if="!searchSelectModel && !searchInputModel"
                class="content-part__control-flag"
                @change="selectAllCheckbox($event[0])"
              />   
              <checkbox 
                v-for="pickArrayItem in currentForArray"
                v-model="checkboxModel" 
                :value="pickArrayItem.id" 
                :label="pickArrayItem.value" 
                :key="pickArrayItem.value"
                @change="checkAllCheckbox()"
                class="content-part__control-flag"
              />     
            </div>
            <div v-else>
              <radioButton 
                v-for="pickArrayItem in currentForArray"
                v-model="radioModel" 
                :value="pickArrayItem.id" 
                :label="pickArrayItem.value" 
                :key="pickArrayItem.value"
                class="content-part__control-flag"
              />        
            </div>
          </div>
          <div class="content-part__controls-wrapper content-part__control-flag" v-else>
            Данные отсутствуют.
          </div>
          <!--/Controls-->
        </div>
        <!--page-and-close-->
        <div class="buttons-wrapper">
          <div 
            class="buttons-wrapper__pages" 
            ref="pageWindow" 
            v-if="pageCount !== 1 && pageCount !== 0"
          >
            <span class="buttons-wrapper__page">Страница:</span> 
            <span 
              class="buttons-wrapper__page buttons-wrapper__page_numbers" 
              :class="{'buttons-wrapper__page_active': n === currentPage}"
              v-for="n in pageArray" 
              @click="currentPage = n"
              :key="n"
            > {{ n }} </span>
          </div>
          <div class="buttons-wrapper__buttons-wrapper">
            <div 
              class="buttons-wrapper__button buttons-wrapper__button_blue" 
              @click="changeModel()"
            > Сохранить </div>
            <div 
              class="buttons-wrapper__button buttons-wrapper__button_gray" 
              @click="showPickWindow = false"
            > Отменить </div>
          </div>
        </div>
        <!--/page-and-close-->  
      </div>
    </div>
  </transition-group>
  <!--/Window-body-->
</div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import BorderInput from '../BorderInput/BorderInput.vue';
import CustomSelect from '../CustomSelect/CustomSelect.vue';
import RadioButton from '../Controls/RadioButton.vue';
import Checkbox from '../Controls/Checkbox.vue';
import {selectOptions} from '../CustomSelect/@types';
import {pickWindowObject} from './@types';
import {modelValueValidator, selectValidator, pickWindowValidator} from './@validators';

@Component({
  components: {
    BorderInput,
    CustomSelect,
    RadioButton,
    Checkbox
  }
})
export default class PickWindow extends Vue {
  @Model('pick', {type: [String, Array], required: true, validator: modelValueValidator}) 
  readonly value!: string | string[]

  @Prop({required: true, type: String})
  readonly preview!: string;

  @Prop({default: false, type: Boolean})
  readonly multiplay!: boolean;

  @Prop({required: true, type: String})
  readonly windowTitle!: string;

  @Prop({type: Array, validator: selectValidator})
  readonly searchOptions?: selectOptions[];

  @Prop({type: Number, default: 10})
  readonly elemsOnpage!: number;

  @Prop({required: true, type: Array, validator: pickWindowValidator})
  readonly pickItemArray!: pickWindowObject[];  
  
  @Emit('pick')
  private changeModel(): string | string[] {
    this.showPickWindow = false;
    if(this.multiplay) {
      return this.checkboxModel; 
    } else {
      return this.radioModel;
    }
  }

  private searchSelectModel: string = '';

  private showPickWindow: boolean = false;

  private allCheckbox: [string] | [] = [];

  private searchInputModel: string = '';

  private currentPage: number = 1;

  private radioModel: string = '';

  private checkboxModel: string[] = [];

  private checkAllCheckbox(): void {
    if (this.pickItemArray.every(elem => this.checkboxModel.includes(elem.id))) {
      this.allCheckbox = ['all'];
    } else {
      this.allCheckbox = [];
    }
  }

  private removeModalValue(index: number): void {
    if (this.multiplay) {
      this.checkboxModel.splice(index, 1);
    } else {
      this.radioModel = '';
    }
    this.changeModel();
  }

  private selectAllCheckbox(ident?: string): void {
    if (!!ident) {
      this.pickItemArray.forEach(elem => {
        !this.checkboxModel.includes(elem.id) && this.checkboxModel.push(elem.id);
      });
    } else {
      this.checkboxModel = [];
    }
  }

  private searchChange(): void {
    Vue.nextTick().then(() => this.checkAllCheckbox());
    this.currentPage = 1;    
  }

  get valuesForShow(): string[] {
    let idsValues: string[];
    if (this.multiplay) {
      idsValues = (<string[]>this.value).slice(0);
    } else {
      idsValues = [];
      idsValues.push(<string>this.value);
    }
    return idsValues.map((mapElem: string): string => {
      let findObj = this.pickItemArray.find(findElem => findElem.id === mapElem);
      return findObj?.value ?? '';
    });
  }

  get pageArray(): number[] {
      let current: number = this.currentPage;
      if (this.pageCount < 3) {
        let arr = Array.from(new Array(this.pageCount + 1).keys());
        arr.shift()
        return arr;
      }
      if (1 < current && current < this.pageCount) {
        return [current - 1, current, current + 1];
      }
      if (current === 1) {
        return [1, 2, 3];
      }
      if (current === this.pageCount) {
        return [current - 2, current - 1, current];
      }
      return [];
  }

  get pageCount(): number {
    return Math.ceil(this.pickArrayBeforeSelect.length / this.elemsOnpage);
  }

  get pickArrayBeforeInput(): pickWindowObject[] {
    return this.pickItemArray.filter(elem => elem.value.toLowerCase().includes(this.searchInputModel.toLowerCase()));
  }

  get pickArrayBeforeSelect(): pickWindowObject[] {
    return this.pickArrayBeforeInput.filter(elem => {
      if (!!this.searchSelectModel && this.searchSelectModel !== 'Все') {
        return elem.sort === this.searchSelectModel;
      } else {
        return true;
      }
    });
  }

  get currentForArray(): pickWindowObject[] {
    return this.pickChunkArray[this.currentPage - 1].map((elem: pickWindowObject): pickWindowObject => {
      if (!this.searchInputModel) return elem;
      let cloneObject: pickWindowObject = Object.assign({}, elem);
      let escape = (str: string): string => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      let regexp: RegExp = new RegExp('(' + escape(this.searchInputModel) + ')', 'gmi');
      cloneObject.value = (<string>cloneObject.value).replace(regexp, '<span class="pick-window__search">$1</span>');
      return cloneObject;
    });
  } 

  get pickChunkArray(): pickWindowObject[][] {
    let chunkArray: undefined[] = (<undefined[]>Array.apply(null, new Array(this.pageCount)));
    return chunkArray.map((elem: undefined, index: number): pickWindowObject[] => {
      let start: number = index * this.elemsOnpage;
      return this.pickArrayBeforeSelect.slice(start, start + this.elemsOnpage);
    });
  }

  @Watch('showPickWindow')
  reloadModel(val: boolean): void {
    if (this.multiplay) {
      this.checkboxModel = (<string[]>this.value).slice(0);
      this.checkAllCheckbox();
    } else {
      this.radioModel = (<string>this.value);
    }
    this.searchInputModel = '';
    this.searchSelectModel = '';
  }

  @Watch('searchInputModel')
  onInputChange(): void {
    this.searchChange();
  }

  @Watch('searchSelectModel')
  onSelectChange(): void {
    this.searchChange();
  }  
}
</script>

<style lang="scss">
@import '~scss/fonts.scss';
@import '~scss/element-size-mixins.scss';
@import '~scss/colors.scss';

.pick-window {
  font-family: $calibri-light;

  &__search {
    background-color: $grayColor;
  }

  &__show-window {
    cursor: pointer;
    font-style: italic;
    color: $seaColor;   
    @include title-size;
    
    &:hover {
      color: $griffColor; 
    }
  }

  &__blocks-v-model-wrapper {
    margin: 15px 0px;
  }

  &__blocks-v-model-items {
    margin: 5px 0px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #DCEFFD;
    color: $griffColor;    
    padding: 5px 15px;
    @include regular-size;
  }

  &__blocks-v-model-img {
    @include regular-max-height-size;
  }

  &__black-layot {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 4;    
  }

  &__window-main-wrapper {
    height: 100vh;
    @media only screen and (min-width:1400px) {
        right: 0%;
        top: 0%;
        width: 50vw;
    }
    
    @media only screen and (min-width:1200px) and (max-width:1399px) {
        right: 0%;
        top: 0%;
        width: 60vw;
    }
    
    @media only screen and (min-width:768px) and (max-width:1199px) {
        right: 0%;
        top: 0%;
        width: 70vw;
    }
    
    @media only screen and (max-width:767px) {
        right: 2%;
        top: 5%;
        height: 90%;
        width: 96vw;
    }    
  }
}

.window-main-wrapper {
  position: fixed;
  background-color: white;
  display: flex;
  flex-direction: column;
  z-index: 5;
  font-family: $calibri-light;

  &__title {
    text-align: center;
    padding: 15px 0px;
    font-family: 'Calibri Light';
    color: white;
    background-color: $seaColor;
    @include title-size;
  }

  &__elements {
    display: flex;
    flex-direction: column;  
    height: 95%;

    &_scroll {
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar-thumb {
        background-color: $seaColor;
        -webkit-overflow-scrolling: touch;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
        background-color: #F5F5F5;
        border-radius: 10px;
      }

      &::-webkit-scrollbar {
        width: 10px;
        height: 7px;
        background-color: #F5F5F5;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
      }
    }  
  }

  &__content-part {
    flex: 1 0 auto;    
  }
}

.content-part {
  &__sort {
    margin: 15px 0px 0px 0px;
    flex-shrink: 0;
  }

  &__border-input-component, &__custom-select {
    width: 90%;
    margin: 15px auto;
  }

  &__controls-wrapper {
    display: flex;
    flex-direction: column;
    padding: 0px 5px;
  }

  &__control-flag {
    width: 90%;
    margin: 5px 5%;
  }
}

.buttons-wrapper {
  &__pages {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;  
    @include regular-size;
  }

  &__page {
    padding: 2px 10px;
    $root-page: &;

    &_numbers {
      cursor: pointer;      

      &:hover, #{$root-page} {
        color: $seaColor;
      }
    }

    &_active {
      color: $seaColor;
    }
  }

  &__buttons-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 20px 0px;
    flex-shrink: 0;
    align-items: baseline;
    width: 90%;
    margin: 0px 5%;  
    @include title-size;
  }

  &__button {
    cursor: pointer;
    color: white;
    border-radius: 10px;
    padding: 10px 20px;

    &_gray {
      background-color: #C4C4C4;  

      &:hover {
        background-color: #E5E5E5;
      }
    }

    &_blue {
      background-color: #4184C5;

      &:hover {
        background-color: #8BC9F9;
      }
    }
  }
}

/*transition*/
.window-slide-leave-active,
.window-slide-enter-active {
  transition: 0.5s;
}
.window-slide-enter,
.window-slide-leave-to {
  transform: translate(100%, 0);
}
.window-fade-enter-active, 
.window-fade-leave-active {
  transition: opacity 0.5s;
}
.window-fade-enter, 
.window-fade-leave-to {
  opacity: 0;
}
</style>
