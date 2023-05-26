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
                    @click="list.func(workspace)"
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
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";
import Workspace from "@/types/Workspace";
import { useStore } from "vuex";
import { watchEffect } from "vue";
import router from "@/router";

const offset = true;

const store = useStore();
const firebaseUser = store.state.firebaseUser;
const workspaces = ref<Workspace[]>([]);

watchEffect(() => {
  const collectionRef: Query<DocumentData> = query(
    collection(db, "workspaces"),
    where("members", "array-contains", firebaseUser.uid)
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

const updateItem = (workspace: Workspace) => {
  if (!workspace.visible) return;

  const workspaceName: string | null = prompt(
    `workspace名を変更します。`,
    workspace.title
  );
  if (workspaceName) {
    const docRef = doc(db, "workspaces", String(workspace.id));
    updateDoc(docRef, {
      title: workspaceName,
    });
  }
};

const removeItem = async (workspace: Workspace) => {
  if (!workspace.visible) return;
  const result = confirm("本当に削除しますか？");
  if (!result) return;

  const docRef = doc(db, "workspaces", String(workspace.id));
  await deleteDoc(docRef);
};

const displayAndCopyInvitationUrl = (workspace: Workspace) => {
  const url = `${location.origin}/${workspace.id}/invitation`;
  if (!navigator.clipboard) return;

  navigator.clipboard.writeText(url).then(() => {
    alert(`以下の招待URLをコピーしました。共有してください。\n${url}`);
  });
};

const threeDotsMenuList = [
  { label: "編集", action: "update", func: updateItem },
  { label: "削除", action: "delete", func: removeItem },
  { label: "共有者追加", action: "update", func: displayAndCopyInvitationUrl },
  { label: "共有者管理", action: "update", func: () => {} },
];
</script>

<style scoped></style>
