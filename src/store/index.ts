import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    firebaseUser: null,
    workspace: null,
  },
  getters: {},
  mutations: {
    setFirebaseUser(state, user) {
      state.firebaseUser = user;
    },
    setWorkspace(state, workspace) {
      state.workspace = workspace;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({storage: window.localStorage})]
});
