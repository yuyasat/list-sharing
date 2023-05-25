<template>
  <div>
    <v-container fluid class="mb-n10">
      <v-row>
        <v-row>
          <template v-for="(workspace, index) in workspaces" :key="index">
            <v-col cols="10" class="mt-2 pl-5" @click="clickItem(workspace)">{{
              workspace.title
            }}</v-col>
            <v-col cols="2" align="center" class="mt-2">
              <v-menu bottom :offset-y="offset">
                <template v-slot:activator="{ props: menu }">
                  <v-icon
                    :color="`${workspace.visible ? '' : 'white'}`"
                    icon="more_vert"
                    v-bind="mergeProps(menu)"
                  ></v-icon>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(list, index) in threeDotsMenuList"
                    :key="index"
                    @click="removeItem(workspace)"
                  >
                    <v-list-item-title>{{ list.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-divider
              v-if="
                ![workspaces.length - 1, workspaces.length - 2].includes(index)
              "
            ></v-divider>
          </template>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, mergeProps } from "vue";
import {
  collection,
  onSnapshot,
  query,
  DocumentData,
  Query,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";
import Workspace from "@/types/Workspace";
import { useStore } from "vuex";
import { watchEffect } from "vue";
import router from "@/router";

const offset = true;
const threeDotsMenuList = [{ label: "削除", action: "delete" }];

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
      _workspaces.push({
        id: doc.id,
        title: doc.data().title,
        visible: true,
      });
    });
    _workspaces.push({
      id: undefined,
      title: "",
      visible: false,
    });
    workspaces.value = _workspaces;
  });
});

const clickItem = (workspace: Workspace) => {
  if (!workspace.visible) return;

  store.commit("setWorkspace", workspace);
  router.push(`/${workspace.id}/items`);
};
const removeItem = async (workspace: Workspace) => {
  if (!workspace.visible) return;

  const docRef = doc(db, "workspaces", String(workspace.id));
  await deleteDoc(docRef);
};
</script>

<style scoped></style>
