import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    firebaseUser: null,
  },
  getters: {},
  mutations: {
    setFirebaseUser(state, user) {
      state.firebaseUser = user;
    }
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({storage: window.localStorage})]
});
