import {selectOptions} from '../../Components/CustomSelect/@types';

export interface mainStore {
  eventsArray: fullEvent[],
  eventsFilter: selectOptions[],
  production: boolean,
  accsessObject: accsessMode
}

export interface accsessMode {
  mode: string,
  id: string
}

export interface fullEvent {
  startDate: string,
  endDate: string, 
  eventName: string,
  eventId: string, 
  eventHours: number,
  odoResponsibleFullname: string,
  odoResponsibleId: string,
  orpResponsibleFullname: string,
  orpResponsibleId: string,
  payment: string,
  category: string,
  collaboratorsCount: number,
  state: string,
  haveGroup: boolean,
  filter: string
}
