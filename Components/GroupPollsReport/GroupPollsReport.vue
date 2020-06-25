<template>
  <div class="group-polls-report">
    <div class="regular-griff-text group-polls-report__standart-block"> Выберите категорию, для перехода к выбору групп и опросов: </div>
    <customSelect 
      v-if="!!rolesArray[0]" 
      :optionArray="rolesArray" 
      v-model="roleModel"
      class="group-polls-report__custom-select"
    />
    <pickWindow
      preview="Нажмите, чтобы выбрать опрос"
      windowTitle="Выбор опроса"
      v-if="!!roleModel"
      :pickItemArray="pollArray"
      v-model="pollModel"
      class="group-polls-report__standart-block"
    />
    <pickWindow
      preview="Нажмите, чтобы выбрать группу"
      windowTitle="Выбор группы"
      v-if="!!pollModel"
      :pickItemArray="groupArray"
      v-model="groupModel"
      class="group-polls-report__standart-block"
    />
    <div 
      v-if="!!roleModel && !!pollModel"
      class="save__button save__button_blue group-polls-report__standart-block" 
      @click="getReport()"
    > Сформировать Excel </div>
    <simpleModal v-if="!!modelChoose" @close-window="modelChoose = ''" :text="modelChoose"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Inject} from 'vue-property-decorator';
import SimpleModal from '../SimpleModal/SimpleModal.vue';
import PickWindow from '../PickWindow/PickWindow.vue';
import CustomSelect from "../CustomSelect/CustomSelect.vue";
import axios, {AxiosResponse} from 'axios';
import {selectOptions} from '../CustomSelect/@types';
import {pickWindowObject} from '../PickWindow/@types';

@Component({
  components: {
    PickWindow,
    SimpleModal,
    CustomSelect
  }
})
export default class GroupPollsReport extends Vue {
  @Inject() production!: boolean;
 
  private groupArray: pickWindowObject[] = [];

  private rolesArray: selectOptions[] = [];

  private pollArray: pickWindowObject[] = [];
  
  private groupModel: string = '';

  private pollModel: string = '';
  
  private roleModel: string = '';

  private modelChoose: string = '';

  private getRoles(): void {
    let axiosUrl: string;
    if (this.production) {
      axiosUrl = 'custom_web_template.html?object_id=6786966708783702803&action=get_roles';
    } else {
      axiosUrl = '../json/groupRoles.json';
    }
    axios.get(axiosUrl)
      .then((response: AxiosResponse) => {
        this.rolesArray = response.data;
      });
  }    
  
  private getReport(): void {
    if (this.production) {
      window.open(
        `/view_doc.html?mode=doc_type&custom_web_template_id=6786966708783702803&action=create_excel&poll=${this.pollModel}&group=${this.groupModel}`, 
        undefined, 
        'width= 300,height=300');
    }  
    this.roleModel = '';
    this.pollModel = '';
    this.groupModel = '';
    this.modelChoose = 'Отчёт был успешно сформирован!'
  }

  private getGroupsPolls() {
    let groupUrl: string, pollUrl: string;
    if (this.production) {
      groupUrl = `custom_web_template.html?object_id=6786966708783702803&action=get_group&role=${this.roleModel}`;
      pollUrl = `custom_web_template.html?object_id=6786966708783702803&action=get_polls&role=${this.roleModel}`;
    } else {
      groupUrl = '../json/groupList.json';
      pollUrl = '../json/pollList.json';
    }
    axios.all([axios.get(groupUrl), axios.get(pollUrl)])
      .then(axios.spread((groupResponse: AxiosResponse, pollResponse: AxiosResponse) => {
        this.groupArray = groupResponse.data;
        this.pollArray = pollResponse.data;
      }));  
  }

  @Watch('roleModel')
  changeRole(role: string): void {
    if (!role) return;
    this.getGroupsPolls();
  }

  @Watch('pollModel')
  changePoll(poll: string): void {
    if(!poll) this.groupModel = '';
  }
  
  private beforeMount(): void {
    this.getRoles();
  }
}
</script>

<style lang="scss">
@import '~scss/regular-classes.scss';
@import '~scss/element-size-mixins.scss';
@import '~scss/fonts.scss';

.group-polls-report {
  &__standart-block {
    margin: 25px 0px;
  }

  &__custom-select {
    width: 40%;
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
