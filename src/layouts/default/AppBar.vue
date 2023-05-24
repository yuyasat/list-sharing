<template>
  <v-app-bar flat>
    <v-toolbar color="light-blue" dark>
      <v-toolbar-title>ListSharing</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        density="default"
        icon="mdi-open-in-new"
        @click="addWorkspace"
      ></v-btn>
    </v-toolbar>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "vuex";

const store = useStore();
const firebaseUser = store.state.firebaseUser;

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
</script>
