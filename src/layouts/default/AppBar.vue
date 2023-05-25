<template>
  <v-app-bar flat>
    <v-toolbar color="light-blue" dark>
      <v-toolbar-title>{{ appBarTitle }}</v-toolbar-title>

      <v-btn
        v-if="icon"
        density="default"
        :icon="String(icon)"
        @click="handleClick"
      ></v-btn>
    </v-toolbar>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "vuex";
import { computed } from "vue";
import route from "@/router";

const store = useStore();
const firebaseUser = store.state.firebaseUser;
const appBarTitle = computed(() => {
  switch (route.currentRoute.value.name) {
    case "Workspaces":
      return "Workspaces";
    case "Items":
      return `${store.state.workspace.title} Items`;
    default:
      return "ListSharing";
  }
});
const icon = computed(() => {
  switch (route.currentRoute.value.name) {
    case "Home":
      return null;
    default:
      return "add";
  }
});

const handleClick = () => {
  switch (route.currentRoute.value.name) {
    case "Workspaces":
      addWorkspace();
      break;
    case "Items":
      addItem();
      break;
    default:
      return "ListSharing";
  }
};

const addWorkspace = async () => {
  let workspaceName: string | null = prompt(`新しいworkspaceを作成します。`);
  if (workspaceName && firebaseUser) {
    await addDoc(collection(db, "workspaces"), {
      title: workspaceName,
      members: {
        [firebaseUser?.uid]: true,
      },
    });
  } else {
    alert("workspaceの作成に失敗しました。");
  }
};

const addItem = async () => {
  let itemName: string | null = prompt(`新しいitemを作成します。`);
  if (itemName && firebaseUser) {
    await addDoc(collection(db, "items"), {
      title: itemName,
      workspaceId: store.state.workspace.id,
      checked: false,
    });
  } else {
    alert("itemの作成に失敗しました。");
  }
};
</script>
