<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-row no-gutters>
          <template v-for="(workspace, index) in workspaces" :key="index">
            <v-col cols="8">{{ workspace.title }}</v-col>
            <v-col cols="4" align="center" class="mt-2">{{
              firebaseUser?.uid
            }}</v-col>
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
import { useStore } from "vuex";
import { watchEffect } from "vue";

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
</script>

<style scoped></style>
