import User from "@/types/User";
import Workspace from "@/types/Workspace";
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

type State = {
  firebaseUser: User | null;
  workspace: Workspace | null;
  workspaceCount: number;
  itemCount: number;
};

export default createStore<State>({
  state: {
    firebaseUser: null,
    workspace: null,
    workspaceCount: 0,
    itemCount: 0,
  },
  getters: {},
  mutations: {
    setFirebaseUser(state, user: User) {
      state.firebaseUser = user;
    },
    setWorkspace(state, workspace: Workspace) {
      state.workspace = workspace;
    },
    setWorkspaceCount(state, count: number) {
      state.workspaceCount = count;
    },
    setItemCount(state, count: number) {
      state.itemCount = count;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({ storage: window.localStorage })],
});
