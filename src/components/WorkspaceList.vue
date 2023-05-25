<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-row no-gutters>
          <template v-for="(workspace, index) in workspaces" :key="index">
            <v-col cols="8" @click="clickItem(workspace)">{{
              workspace.title
            }}</v-col>
            <v-col
              cols="4"
              @click="clickItem(workspace)"
              align="center"
              class="mt-2"
              >{{ firebaseUser?.uid }}</v-col
            >
          </template>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  collection,
  onSnapshot,
  query,
  DocumentData,
  Query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";
import Workspace from "@/types/Workspace";
import { storeKey, useStore } from "vuex";
import { watchEffect } from "vue";
import router from "@/router";

const store = useStore();
const firebaseUser = store.state.firebaseUser;
const workspaces = ref<Workspace[]>([]);

watchEffect(() => {
  const collectionRef: Query<DocumentData> = query(
    collection(db, "workspaces"),
    where(`members.${firebaseUser.uid}`, "==", true)
  );
  onSnapshot(collectionRef, (querySnapshot) => {
    const _workspaces: Workspace[] = [];
    querySnapshot.forEach((doc) => {
      console.log(doc);
      _workspaces.push({
        id: doc.id,
        title: doc.data().title,
      });
    });
    workspaces.value = _workspaces;
  });
});

const clickItem = (workspace: Workspace) => {
  store.commit("setWorkspace", workspace);
  router.push(`/${workspace.id}/items`);
};
</script>

<style scoped></style>
