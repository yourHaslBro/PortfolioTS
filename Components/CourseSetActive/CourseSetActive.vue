<template>
<div class="course-active">
  <div class="standart-block">
    <RadioButton 
      v-for="item in checkRadio"
      v-model="radioModel" 
      :value="item.value" 
      :label="item.label" 
      :key="item.value"
    />
  </div>
  <PickWindow
    preview="Выбор программы"
    windowTitle="Программы"
    :pickItemArray="coursePickArray"
    :searchOptions="eventsFilter"
    v-model="pickModel"
    :multiplay="true"
    class="standart-block"
  />
  <VueButton
    v-if="!!pickModel[0]"
    class="standart-block" 
    @click="activeRequest()"      
  >
    {{ buttonText }}
  </VueButton>
  <SimpleModal v-if="!!modelChoose" @close-window="modelChoose = ''" :text="modelChoose"/>
</div>
</template>

<script lang="ts">
import {Component, Vue, Inject} from 'vue-property-decorator';
import {Getter, State} from 'vuex-class';
import {fullEvent} from '../../app/vuex/@types';
import SimpleModal from '../SimpleModal/SimpleModal.vue';
import RadioButton from '../Controls/RadioButton.vue';
import {radioButtonObject} from '../Controls/@types';
import {pickWindowObject} from '../PickWindow/@types';
import PickWindow from '../PickWindow/PickWindow.vue';
import {selectOptions} from '../CustomSelect/@types';
import axios, {AxiosResponse} from 'axios';
import VueButton from '../Button/Button.vue';

interface radioWithButtonContext extends radioButtonObject {
  button: string;
}

@Component({
  components: {
    RadioButton,
    PickWindow,
    SimpleModal,
    VueButton
  }
})
export default class CourseSetActive extends Vue {

  @Inject() production!: boolean;

  @Getter accsessEvents!: fullEvent[];

  @State eventsFilter!: selectOptions[];
 
  private pickArray: pickWindowObject[] = [];
  
  private pickModel: string[] = [];
  
  private radioModel: string = 'set_active';
  
  private modelChoose: string = '';
  
  private checkRadio: radioWithButtonContext[] = [
    {
      value: 'set_active', 
      label: 'Активировать итоговый тест и анкету', 
      button: 'Активировать'
    },
    {
      value: 'set_deactive', 
      label: 'Закрыть итоговый тест и анкету', 
      button: 'Закрыть'
    },
  ];

  get coursePickArray(): pickWindowObject[] {
    return this.accsessEvents.filter(elem => {
      let startDate = new Date();
      startDate.setDate(new Date().getDate() - 2);
      let finishDate = new Date();
      finishDate.setDate(new Date().getDate() + 2);
      let sepDate = new Date(elem.endDate?.split('.').reverse().join('-'));
      return sepDate > startDate && sepDate < finishDate;
    }).map(elem => {
      return {value: elem.eventName, id: elem.eventId, sort: elem.filter};
    })
  }

  private getCourse(): void {
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = 'custom_web_template.html?object_id=6780228137188491150&action=get_course';
    } else {
      axiosUrl = '../json/pickExample.json';
    }
    axios.get(axiosUrl)
      .then((response: AxiosResponse) => this.pickArray = (<pickWindowObject[]>response.data));
  }    

  get buttonText(): string {
    return this.checkRadio.find(elem => elem.value === this.radioModel)?.button ?? '';
  }
  
  private activeRequest(): void {
    if (this.production) {
    axios.post(
      `custom_web_template.html?object_id=6780228137188491150&action=${this.radioModel}`, 
      JSON.stringify({courses: this.pickModel})
    )
      .then((response: AxiosResponse) => {
        this.modelChoose = (<string>response.data)
      });
    } else {
      this.modelChoose = 'Статус тестов успешно изменён';      
    }
    this.pickModel = [];
  }
  
  private beforeMount(): void {
    this.getCourse();
  }
}
</script>

<style lang="scss">
@import '~scss/element-size-mixins.scss';
</style>
