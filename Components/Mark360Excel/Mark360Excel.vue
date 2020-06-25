<template>
  <div class="mark-360">
    <PickWindow
      preview="Выбор группы"
      windowTitle="Группа"
      :pickItemArray="groupsArray"
      v-model="groupModel"
      class="mark-360__standart-block"
    />
    <PickWindow
      preview="Выбор слушателя"
      v-if="!!groupModel && !!collaboratorsArray[0]"
      windowTitle="Слушатель"
      :pickItemArray="collaboratorsArray"
      v-model="collaboratorModel"
      class="mark-360__standart-block"
    />
    <div 
      v-if="!!collaboratorModel && !!groupModel"
      class="save__button save__button_blue mark-360__standart-block" 
      @click="downloadExcel()"
    > Сформировать эксель </div>
    <SimpleModal v-if="!!modalText" @close-window="modalText = ''" :text="modalText"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Inject} from 'vue-property-decorator';
import SimpleModal from '../SimpleModal/SimpleModal.vue';
import RadioButton from '../Controls/RadioButton.vue';
import {pickWindowObject} from '../PickWindow/@types';
import PickWindow from '../PickWindow/PickWindow.vue';
import axios, {AxiosResponse} from 'axios';

@Component({
  components: {
    RadioButton,
    PickWindow,
    SimpleModal
  }
})
export default class markExcel extends Vue {
  @Inject() production!: boolean;
 
  private groupsArray: pickWindowObject[] = [];

  private collaboratorsArray: pickWindowObject[] = [];
  
  private groupModel: string = '';

  private collaboratorModel: string = '';
  
  private modalText: string = '';  

  private getGroups(): void {
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = 'custom_web_template.html?object_id=6782526606045022154&action=get_groups';
    } else {
      axiosUrl = '../json/pickExample.json';
    }
    axios.get(axiosUrl)
      .then((response: AxiosResponse) => {
        this.groupsArray = (<pickWindowObject[]>response.data)
      });
  }  
  
  private getCollaborators(): void {
    this.collaboratorModel = '';
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = `custom_web_template.html?object_id=6782526606045022154&action=get_collaborators&id=${this.groupModel}`;
    } else {
      axiosUrl = '../json/collaboratorList.json';
    }
    axios.get(axiosUrl)
      .then((response: AxiosResponse) => this.collaboratorsArray = (<pickWindowObject[]>response.data));
  }  

  
  private downloadExcel(): void {
    if (this.production) {
    axios.post(
      `custom_web_template.html?object_id=6782526606045022154&action=create_excel`, 
      JSON.stringify({groupId: this.groupModel, collaboratorId: this.collaboratorModel})
    )
      .then((response: AxiosResponse) => {
        if (response.data) {
          this.modalText = 'Excel успешно сформирован!';
        } else {
          this.modalText = 'При формировании Excel произошла ошибка!';
        }
        window.location.assign(`download_stuff\\mark\\360case.xlsx?${new Date().toUTCString()}`)
        this.collaboratorModel = '';
      });
    } else {
        this.collaboratorModel = ''; 
        this.modalText = 'Excel успешно сформирован!';     
    }
  }

  @Watch('groupModel')
  onGroupChanged(val: string): void {
    !!val && this.getCollaborators();
  }
  
  private beforeMount(): void {
    this.getGroups();
  }
}
</script>

<style lang="scss">
@import '~scss/element-size-mixins.scss';
@import '~scss/fonts.scss';
.mark-360 {
  &__standart-block {
    margin: 25px 0px;
  }
}

.save__button {
  cursor: pointer;
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  @include title-size;
  width: max-content;
  text-align: center;

  @media only screen and (min-width: 900px)  {
    width: 20%;
  }

  @media only screen and (max-width: 700px)  {
    width: 25%;
  }

  @media only screen and (max-width: 500px)  {
    width: 30%;
  }

  &_blue {
    background-color: #4184C5;

    &:hover {
      background-color: #8BC9F9;
    }
  }
}
</style>
