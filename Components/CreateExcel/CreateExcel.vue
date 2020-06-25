<template>
<div class="custom-polls-result">
  <div class="regular-griff-text standart-block"> Выберите тип выгрузки: </div>
  <CustomSelect 
    class="standart-block custom-polls-result__custom-select" 
    v-if="!!pollTypes[0]" 
    :optionArray="pollTypes" 
    v-model="typeModel"
  />
  <PickWindow
    preview="Выбор программы"
    windowTitle="Программы"
    :pickItemArray="pickArray"
    v-model="frdoModel"
    v-if="!!pickArray[0] && typeModel === 'frdo'"
    class="standart-block"
  />
  <VueButton 
    class="standart-block" 
    v-if="(!!typeModel && typeModel !== 'frdo') || (!!frdoModel && typeModel === 'frdo')" 
    @click="getResults()"
  > 
    Сформировать Excel 
  </VueButton>
  <SimpleModal v-if="!!modelChoose" @close-window="modelChoose = ''" :text="modelChoose"/>
</div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Inject} from 'vue-property-decorator';
import VueButton from '../Button/Button.vue';
import CustomSelect from '../CustomSelect/CustomSelect.vue';
import SimpleModal from '../SimpleModal/SimpleModal.vue';
import {pickWindowObject} from '../PickWindow/@types';
import PickWindow from '../PickWindow/PickWindow.vue';
import axios, {AxiosResponse} from 'axios';
import {selectOptions} from "../CustomSelect/@types";

@Component({
  components: {
    VueButton,
    CustomSelect,
    SimpleModal,
    PickWindow
  }
})
export default class CreateExcel extends Vue {
  @Inject() production!: boolean;

  private pollTypes: selectOptions[] = [];

  private typeModel: string = '';
  
  private pickArray: pickWindowObject[] = [];

  private modelChoose: string = '';

  private frdoModel: string = '';

  private getResults(): void {
    if (this.production) {
      window.open(
        `/view_doc.html?mode=doc_type&custom_web_template_id=6792903130445212493&action=create_excel&type=${this.typeModel}&frdo=${this.frdoModel}`, 
        undefined, 
        'width= 300,height=300'
      );
    }
    this.typeModel = '';
    this.modelChoose = 'Отчёт был успешно сформирован!'    
  }  

  private mounted(): void {
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = 'custom_web_template.html?object_id=6792903130445212493&action=get_types';
    } else {
      axiosUrl = '../json/pollListSelect.json';
    }
    axios.get(axiosUrl)
      .then((response: AxiosResponse) => {
        this.pollTypes = response.data;
      });    
    let axiosUrlP: string;
    if (this.production) {
      axiosUrlP = 'custom_web_template.html?object_id=6792903130445212493&action=get_prog';
    } else {
      axiosUrlP = '../json/pickExample.json';
    }
    axios.get(axiosUrlP)
      .then((response: AxiosResponse) => this.pickArray = (<pickWindowObject[]>response.data));
  }
}
</script>

<style lang="scss">
@import '~scss/fonts.scss';
@import '~scss/element-size-mixins.scss';

.custom-polls-result {
  &__custom-select {
    width: 40%;
  }
}
</style>
