<template>
  <v-app-bar flat>
    <v-toolbar color="light-blue" dark>
      <v-toolbar-title>{{ appBarTitle }}</v-toolbar-title>
      <v-btn
        v-if="icon"
        density="default"
        :icon="icon"
        @click="handleClick"
      ></v-btn>
    </v-toolbar>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useStore } from "vuex";
import { computed } from "vue";
import route from "@/router";
import Workspace from "@/types/Workspace";

const store = useStore();
const loginUser = store.state.firebaseUser;
const appBarTitle = computed(() => {
  switch (route.currentRoute.value.name) {
    case "Workspaces":
      return "Workspaces";
    case "Items":
      return `Items / ${store.state.workspace.title}`;
    case "Members":
      return `Members / ${store.state.workspace.title}`;
    default:
      return "ListSharing";
  }
});

const isLoggedIn = computed(() => !!store.state.firebaseUser);

const icon = computed(() => {
  switch (route.currentRoute.value.name) {
    case "Home":
      return isLoggedIn.value ? "logout" : null;
    default:
      return "add";
  }
});

const handleClick = () => {
  switch (route.currentRoute.value.name) {
    case "Home":
      logout();
      break;
    case "Workspaces":
      addWorkspace();
      break;
    case "Items":
      addItem();
      break;
    case "Members":
      displayAndCopyInvitationUrl();
      break;
    default:
      return "ListSharing";
  }
};

const addWorkspace = async () => {
  let workspaceName: string | null = prompt(`新しいWorkspaceを作成します。`);
  if (!workspaceName || !loginUser) return;

  await addDoc(collection(db, "workspaces"), {
    title: workspaceName,
    members: [...[loginUser?.uid]],
    visible: true,
  });
};

const addItem = async () => {
  let itemName: string | null = prompt(`新しいItemを作成します。`);
  if (!itemName || !loginUser) return;

  await addDoc(collection(db, "items"), {
    title: itemName,
    workspaceId: store.state.workspace.id,
    checked: false,
  });
};

const displayAndCopyInvitationUrl = () => {
  const workspace: Workspace = store.state.workspace;
  const url = `${location.origin}/${workspace.id}/invitation`;
  if (!navigator.clipboard) return;

  navigator.clipboard.writeText(url).then(() => {
    alert(`以下の招待URLをコピーしました。共有してください。\n${url}`);
  });
};

const logout = () => {
  store.commit("setFirebaseUser", null);
  route.push("/");

  auth.signOut().then(() => {
    console.log("logout");
  });
};
</script>
