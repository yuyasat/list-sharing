import User from "@/types/User";
import Workspace from "@/types/Workspace";
import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate'

type State = {
  firebaseUser: User | null;
  workspace: Workspace | null;
}

export default createStore<State>({
  state: {
    firebaseUser: null,
    workspace: null,
  },
  getters: {},
  mutations: {
    setFirebaseUser(state, user: User) {
      state.firebaseUser = user;
    },
    setWorkspace(state, workspace: Workspace) {
      state.workspace = workspace;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({storage: window.localStorage})]
});
