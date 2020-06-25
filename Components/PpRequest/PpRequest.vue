<template>
<div class="pp-request">
  <div class="regular-griff-text" v-if="!newListArray[0] && !rejectListArray[0]"> На данный момент заявки отсутствуют</div>
  <PickList 
    class="pp-request__pick-list" 
    :initialTitle="`Новые заявки`" 
    :multiplay="true"
    v-if="!!newListArray[0]"
    :listArray="newListArray" 
    v-model="newModel" 
  />
  <PickList 
    class="pp-request__pick-list" 
    :initialTitle="`Не согласованые заявки`" 
    :multiplay="true"
    v-if="!!rejectListArray[0]"
    :listArray="rejectListArray" 
    v-model="rejectModel" 
  />
  <VueButton class="pp-request__button" v-if="!!newModel[0] || !!rejectModel[0]" @click="sendResolve()"> Одобрить </VueButton>
  <VueButton class="pp-request__button" v-if="!!newModel[0]" @click="sendReject()"> Отклонить </VueButton>
  <SimpleModal 
    :text="modalText" 
    v-if="!!modalText" 
    @close-window="modalText = ''"  
  />
</div>
</template>

<script lang="ts">
import {Vue, Component, Inject} from 'vue-property-decorator';
import VueButton from '../Button/Button.vue';
import PickList from '../PickList/PickList.vue';
import SimpleModal from '../SimpleModal/SimpleModal.vue';
import axios, {AxiosResponse} from 'axios';

@Component({
  components: {
    VueButton,
    PickList,
    SimpleModal
  }
})
export default class PpRequest extends Vue {
  @Inject() production!: boolean;

  private newModel: string[] = [];

  private rejectModel: string[] = [];

  private newListArray: any[] = [
    {
      value: '6654470855330581761',
      label: 'Gjqnf <br> dsdfdsf <br>'
    }
  ];

  private rejectListArray: any[] = [
    {
      value: '66544sad70855330581761',
      label: '22Gjqnf <br> dsdfdsf <br>'
    }
  ];

  private modalText: string = '';

  private sendResolve(): void {
    if (this.production) {
      let axiosUrl = 'custom_web_template.html?object_id=6808482952036167914&action=resolve';
      axios.post(axiosUrl, JSON.stringify([...this.newModel, ...this.rejectModel]))
        .then((response: AxiosResponse) => {
          this.modalText = 'Заявки успешно согласованы';
          this.rejectModel = [];
          this.newModel = [];
          this.getRequests();
        });
    }    
  }

  private sendReject(): void {
    if (this.production) {
      let axiosUrl = 'custom_web_template.html?object_id=6808482952036167914&action=reject';
      axios.post(axiosUrl, JSON.stringify(this.newModel))
        .then((response: AxiosResponse) => {
          this.modalText = 'Заявки успешно отклонены';
          this.newModel = [];
          this.getRequests();
        });
    }    
  }

  private getRequests(): void {
    if (this.production) {
      let axiosUrl = 'custom_web_template.html?object_id=6808482952036167914&action=get_all_request';
      axios.get(axiosUrl)
        .then((response: AxiosResponse) => {
          this.newListArray = response.data.new;
          this.rejectListArray = response.data.reject;
        });
    }
  }

  private mounted(): void {
    this.getRequests();
  }
}
</script>

<style lang="scss">
@import '~scss/element-size-mixins.scss';
@import '~scss/regular-classes.scss';

.pp-request {

  &__button {
    margin: 45px 0px;
  }

  &__pick-list {
    width: 70%;
    margin: 15px 0px;

    @media screen and (max-width: 768px) {
      width: 90% !important;
    }
  }
  

}
</style>