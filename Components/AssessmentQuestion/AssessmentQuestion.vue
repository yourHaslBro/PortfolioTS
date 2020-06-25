<template>
<div class="assessment-question">
  <PickWindow
    preview="Нажмите, чтобы выбрать тест"
    windowTitle="Выбор теста"
    v-if="!!pickArray[0]"
    :pickItemArray="pickArray"
    :searchOptions="selectConfig"
    v-model="pickModel"
    class="standart-block"
  />
  <VueButton
    v-if="!!pickModel"
    class="standart-block" 
    @click="getReport()"      
  >
    Выгрузить в Excel
  </VueButton>
  <SimpleModal 
    v-if="!!modelChoose" 
    @close-window="modelChoose = ''" 
    :text="modelChoose"
  />
</div>
</template>

<script lang="ts">
import {Component, Vue, Inject} from 'vue-property-decorator';
import axios, {AxiosResponse} from 'axios';
import SimpleModal from '@c/SimpleModal/SimpleModal.vue';
import PickWindow from '@c/PickWindow/PickWindow.vue';
import {pickWindowObject} from '@c/PickWindow/@types';
import VueButton from '@c/Button/Button.vue';
import {selectOptions} from '@c/CustomSelect/@types';

@Component({
  components: {
    PickWindow,
    SimpleModal,
    VueButton
  }
})
export default class AssessmentQuestion extends Vue {

  @Inject() production!: boolean;
 
  private pickArray: pickWindowObject[] = [];
  
  private pickModel: string = '';
  
  private modelChoose: string = '';

  private selectConfig: selectOptions[] = [];

  private getAssessments(): void {
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = 'custom_web_template.html?object_id=6739831855738608037';
    } else {
      axiosUrl = '../json/assessmentQuestion.json';
    }
    axios.get(axiosUrl)
      .then((response: AxiosResponse) => {
        let {arr, obj} = response.data;
        this.pickArray = (<pickWindowObject[]>arr);
        this.selectConfig = (<selectOptions[]>obj);
      });
  }    
  
  private getReport(): void {
    if (this.production) {
      window.open(
        `/view_doc.html?mode=doc_type&custom_web_template_id=6739831855738608037&id=${this.pickModel}`, 
        undefined, 
        'width=300,height=300'
      );
    }
      this.pickModel = '';
      this.modelChoose = 'Отчёт был успешно сформирован!'
  }
  
  private beforeMount(): void {
    this.getAssessments();
  }
}
</script>

<style lang="scss">
@import '~scss/element-size-mixins.scss';
</style>
