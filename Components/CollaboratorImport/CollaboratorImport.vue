<template>
<div class="collaborator-import">
  <PickWindow 
    preview="Выберите мероприятие"
    windowTitle="Мероприятия"
    class="collaborator-import__pick-window"
    :searchOptions="eventsFilter"
    :pickItemArray="pickEvent"
    v-model="eventId"
  />
  <input type="file" @change="dropExcel($event)" hidden ref="fileInput">
  <div 
    v-if="!fileName" 
    class="collaborator-import__file collaborator-import__file_load" 
    @click="fileInput.click()" 
    @drop.prevent="dropExcel($event)" 
    @dragover.prevent
  > Нажмите или перетащите файл на зону для загрузки </div>
  <div 
    v-else 
    @click="fileInput.click()" 
    class="collaborator-import__file collaborator-import__file_have-file"
  > Загружен {{ fileName }}. Нажмите, чтобы изменить файл. </div>
  <div class="regular-griff-text"> Выберите критерии поиска сотрудников: </div>
  <div class="collaborator-import__flags-wrapper">
    <Checkbox 
      v-for="control in searchControls" 
      :key="control.value" 
      v-bind="control" 
      v-model="searchFlags"
    />
  </div>
  <div v-if="!!searchFlags[0] && !!fileName && !!eventId">
    <VueButton class="collaborator-import__button" @click="sendExcel()"> 
      Начать поиск сотрудников 
    </VueButton>
    <PickList 
      v-if="!!foundCollaboratorsList[0]" 
      initialTitle="Сотрудники в системе"
      class="collaborator-import__pick-list" 
      :multiplay="true" 
      :listArray="foundCollaboratorsList" 
      v-model="foundModel"
    />
    <PickList 
      v-if="!!missingCollaboratorsList[0]" 
      initialTitle="Отсутствующие сотрудники"
      class="collaborator-import__pick-list" 
      :multiplay="true" 
      :listArray="missingCollaboratorsList" 
      v-model="missingModel"
    />
    <VueButton 
      class="collaborator-import__button" 
      v-if="!!missingModel[0] || !!foundModel[0]" 
      @click="createGroup()"
    > Создать группу </VueButton>
  </div>
  <SimpleNodal v-if="!!modalText" :text="modalText" @close-window="closeModal()"/>
</div>
</template>

<script lang="ts">
import {Component, Vue, Inject, Ref} from 'vue-property-decorator';
import axios, {AxiosResponse} from 'axios';
import Checkbox from '../Controls/Checkbox.vue';
import {radioButtonObject} from '../Controls/@types';
import VueButton from '../Button/Button.vue';
import PickList from '../PickList/PickList.vue';
import {pickListObject} from '../PickList/@types';
import {Getter, State, Action} from 'vuex-class';
import {pickWindowObject} from '../PickWindow/@types';
import PickWindow from '../PickWindow/PickWindow.vue';
import {selectOptions} from '../CustomSelect/@types';
import {fullEvent} from '../../app/vuex/@types';
import SimpleNodal from '../SimpleModal/SimpleModal.vue';

type searchFlagsVariant = 'fullname' | 'email' | 'subdivision';

type searchFlagsAxios = Record<searchFlagsVariant, boolean>;

@Component({
  components: {
    Checkbox,
    VueButton,
    PickList,
    PickWindow,
    SimpleNodal
  }
})
export default class CollaboratorImport extends Vue {
  private fileName: string = '';

  @Inject() production!: boolean;

  @Ref() fileInput!: HTMLElement; 

  @Action getEventsArray!: voidWithoutParametrs;

  @State eventsArray!: fullEvent[];

  @State eventsFilter!: selectOptions[];

  private eventId: string = '';

  private modalText: string = '';

  private searchFlags: searchFlagsVariant[] = ['fullname'];

  private searchControls: radioButtonObject[] = [
    {
      value: 'fullname',
      label: 'ФИО'
    },
    {
      value: 'email',
      label: 'Электронная почта'
    },
    /*{
      value: 'subdivision',
      label: 'ИОГВ'
    },*/
  ];

  private foundCollaboratorsList: pickListObject[] = [];

  private missingCollaboratorsList: pickListObject[] = [];

  private fileLoad: FormData = new FormData();

  private foundModel: string[] = [];

  private missingModel: string[] = [];

  get pickEvent(): pickWindowObject[] {
    return this.eventsArray.filter(elem => !elem.haveGroup).map((elem): pickWindowObject => (
      {
        value: elem.eventName, 
        id: elem.eventId, 
        sort: elem.filter
      }
    ))
  } 

  private dropExcel(event: any): void {
    if (!!this.fileName) {
      this.foundModel = [];
      this.missingModel = [];
      this.foundCollaboratorsList = [];
      this.missingCollaboratorsList = [];
      this.fileName = '';
    }
    let file: File;
    if (event.type === 'change') {
      file = event.target.files[0];
    } else {
      file = event.dataTransfer.files[0];
    }
    this.fileName = file.name;
    this.fileLoad.append('excel', file);
  }

  private closeModal(): void {
    this.modalText = '';
    this.foundModel = [];
    this.missingModel = [];
    this.foundCollaboratorsList = [];
    this.missingCollaboratorsList = [];
    this.eventId = '';
    this.fileLoad = new FormData();    
    this.fileName = '';
  }

  private async createGroup(): Promise<void> {
    if (this.production) {
      let {data} = (<AxiosResponse>await axios.post('custom_web_template.html?object_id=6829217838551294370&action=create_group', JSON.stringify({
        id: this.eventId,
        found: this.foundModel,
        missing: this.missingModel
      })).catch(e => console.log(e)));
      this.getEventsArray();
      if (data === 'succsess') {
        this.modalText = 'Создание группы успешно завершено.';
      } else {
        this.modalText = 'При создании группы произошла ошибка.';
      }
    } else {
      this.modalText = 'Создание группы успешно завершено.';
    } 
 
  }

  private async sendExcel(): Promise<void> {
    let payload: searchFlagsAxios = {
      fullname: this.searchFlags.includes('fullname'),
      email: this.searchFlags.includes('email'),
      subdivision: this.searchFlags.includes('subdivision')
    };
    this.fileLoad.append('payload', JSON.stringify(payload));
    if (this.production) {
      let {data} = (<AxiosResponse>await axios.post('custom_web_template.html?object_id=6829217838551294370&action=load_import_excel', this.fileLoad, {
        headers: {'Content-Type': 'multipart/form-data'}     
      }).catch(e => console.log(e)));
      //
      this.foundCollaboratorsList = data.found;
      this.missingCollaboratorsList = data.missing;
    } else {
      this.foundCollaboratorsList = [
        {
          value: '12',
          label: 'Петров<br>pertof@mail.ru'
        },
        {
          value: '1d',
          label: 'Сидоров<br>sidorod@mail.ru'
        }
      ];
      this.missingCollaboratorsList = [
        {
          value: '12ds',
          label: 'Ивачов<br>ivachov@mail.ru'
        },
        {
          value: '1da',
          label: 'Готов<br>gotov@mail.ru'
        }
      ];
    }
    this.foundModel = this.foundCollaboratorsList.map(elem => elem.value);
    this.missingModel = this.missingCollaboratorsList.map(elem => elem.value);
  }
}
</script>

<style lang="scss">
@import '~scss/regular-classes.scss';

.collaborator-import {

  &__pick-window, &__pick-list {
    width: 70%;
  }

  &__flags-wrapper, &__button, &__file {
    margin: 20px 0px;
  }
  
  &__file {
    width: 50%;
    font-family: $calibri-light;
    @include regular-size;
    color: $griffColor;
    cursor: pointer;

    &_load {
      padding: 30px;
      border: 1px $griffColor solid;
    }

    &_have-file {
      color: $seaColor;
    }
  }
}
</style>