import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import {mainStore, accsessMode, fullEvent} from './@types';
import axios, {AxiosResponse} from 'axios';

Vue.use(Vuex);

const store: StoreOptions<mainStore> = {
  state: {
    eventsArray: [],
    eventsFilter: [],
    production: process.env.NODE_ENV === 'production',
    accsessObject: {mode: '', id: ''}
  },
  mutations: {
    changeEventsArray(state, payload: fullEvent[]) {
      state.eventsArray = payload;
    },
    changeAccsessObject(state, payload: accsessMode) {
      state.accsessObject = payload;
    },
    changeEventsFilter(state) {
      let unqArray: string[] = [
        ...new Set(
          state.eventsArray
            .map(elem => elem.filter)
            .join(', ')
            .split(', ')
        )
      ]; 
      state.eventsFilter = [
        {value: 'Все', text: 'Все'}, 
        ...unqArray.map(elem => ({value: elem, text: elem}))
      ];
    }
  },
  getters: {
    accsessEvents({eventsArray, accsessObject}) {
      if (accsessObject.mode === 'admin') {
        return eventsArray;
      } else {
        return eventsArray.filter(elem => elem.orpResponsibleId === accsessObject.id);
      }
    }
  },
  actions: {
     async getEventsArray({state: {production}, commit}) {
      let axiosUrl: string = '';
      if (production) {
        axiosUrl = 'custom_web_template.html?object_id=6829217838551294370&action=get_events';
      } else {
        axiosUrl = '../../json/eventsArray.json';
      }
      let response: AxiosResponse = await axios.get(axiosUrl);
      commit('changeEventsArray', response.data); 
      commit('changeEventsFilter'); 
    },
    async getAccsessObject({state: {production}, commit}) {
      let accsessObject = {};
      let accsessObjectUrl = '';
      if (production) {
        accsessObjectUrl = 'custom_web_template.html?object_id=6829217838551294370&action=get_accsess_object';
      } else {
        accsessObjectUrl = '../../json/accsessObject.json';
      }
      let response = await axios.get(accsessObjectUrl);
      Object.defineProperties(accsessObject, {
        'mode': {
          value: response.data.mode
        },
        'id': {
          value: response.data.id
        }
      });
      commit('changeAccsessObject', accsessObject)
    }
  }
}

export default new Vuex.Store<mainStore>(store);