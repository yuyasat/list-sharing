<template>
  <div>
    <v-container fluid class="mb-n10">
      <draggable
        v-model="workspaces"
        item-key="id"
        tag="div"
        class="v-row"
        @end="onEnd"
        :disabled="!isDraggable"
        animation="200"
      >
        <template #item="{ element, index }">
          <v-row style="width: 100vh">
            <v-col
              cols="10"
              class="mt-2 pl-5"
              @click="clickWorkspace(element)"
              >{{ element.title }}</v-col
            >
            <v-col cols="2" align="center" class="mt-2 list">
              <v-menu bottom offset-y="true">
                <template v-slot:activator="{ props: menu }">
                  <v-icon
                    :color="`${element.visible ? '' : 'white'}`"
                    icon="more_vert"
                    v-bind="mergeProps(menu)"
                  ></v-icon>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(list, index) in threeDotsMenuList"
                    :key="index"
                    @click="list.func(element)"
                  >
                    <v-list-item-title>{{ list.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-divider
              v-if="![workspaces.length - 1].includes(index)"
            ></v-divider>
          </v-row>
        </template>
      </draggable>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, mergeProps, computed } from "vue";
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
  QuerySnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";
import Workspace from "@/types/Workspace";
import { useStore } from "vuex";
import { watchEffect } from "vue";
import router from "@/router";
import User from "@/types/User";
import draggable from "vuedraggable";

const store = useStore();
const loginUser = computed<User>(() => store.state.firebaseUser);
const isDraggable = ref<boolean>(false);
const workspaces = ref<Workspace[]>([]);

watchEffect(() => {
  const collectionRef: Query<DocumentData> = query(
    collection(db, "workspaces"),
    where("members", "array-contains", loginUser.value.uid),
    orderBy("order", "asc")
  );
  onSnapshot(collectionRef, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const _workspaces: Workspace[] = [];
    querySnapshot.forEach((doc) => {
      _workspaces.push({
        id: doc.id,
        title: doc.data().title,
        visible: true,
        order: doc.data().order,
      });
    });
    workspaces.value = _workspaces;
    store.commit("setWorkspaceCount", _workspaces.length);
  });
});

const onEnd = (e: any) => {
  workspaces.value.forEach(async (workspace, index) => {
    const docRef = doc(db, "workspaces", String(workspace.id));
    await updateDoc(docRef, {
      order: index,
    });
  });
};

const clickWorkspace = (workspace: Workspace) => {
  if (!workspace.visible) return;

  store.commit("setWorkspace", workspace);
  router.push(`/${workspace.id}/items`);
};

const updateWorkspace = (workspace: Workspace) => {
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

const removeWorkspace = async (workspace: Workspace) => {
  if (!workspace.visible) return;
  const result = confirm("本当に削除しますか？");
  if (!result) return;

  const docRef = doc(db, "workspaces", String(workspace.id));
  await deleteDoc(docRef);
};

const threeDotsMenuList = computed(() => [
  { label: "編集", func: updateWorkspace },
  { label: "削除", func: removeWorkspace },
  {
    label: "共有者管理",
    func: (workspace: Workspace) => {
      router.push(`/${workspace.id}/members`);
    },
  },
  {
    label: `${isDraggable.value ? "並び替え終了" : "並び替え"}`,
    func: () => {
      isDraggable.value = !isDraggable.value;
    },
  },
]);
</script>

<style scoped>
.list:last-child::after {
  content: "";
  display: block;
  width: 100%;
  height: 50px;
  top: 0;
  left: 0;
}
</style>
