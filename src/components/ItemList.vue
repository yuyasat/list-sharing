<template>
  <div>
    <v-container fluid class="mb-n10">
      <v-row>
        <v-row no-gutters>
          <template v-for="(item, index) in items" :key="index">
            <v-col cols="10" align="center">
              <v-checkbox
                hide-details
                color="secondary"
                :model-value="item.checked"
                @click="checkItem(item)"
                density="compact"
                v-show="item.visible"
              >
                <template v-slot:label>
                  <span :class="{ done: item.checked }">{{ item.title }}</span>
                </template></v-checkbox
              ></v-col
            >
            <v-col cols="2" align="center" class="mt-2 pl-2">
              <v-menu bottom offset-y="true">
                <template v-slot:activator="{ props: menu }">
                  <v-icon
                    icon="more_vert"
                    v-bind="mergeProps(menu)"
                    :color="`${item.visible ? '' : 'white'}`"
                  ></v-icon>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(list, index) in threeDotsMenuList"
                    :key="index"
                    @click="list.func(item)"
                  >
                    <v-list-item-title>{{ list.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </template>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  collection,
  onSnapshot,
  query,
  DocumentData,
  Query,
  doc,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import Item from "@/types/Item";
import { useStore } from "vuex";
import { watchEffect, mergeProps } from "vue";
import router from "@/router";
import User from "@/types/User";
import checkValidWorkspace from "@/modules/checkValidWorkspace";

const store = useStore();
const loginUser = computed<User>(() => store.state.firebaseUser);
const workspaceId = computed<string>(() =>
  String(
    store.state.workspace.id || router.currentRoute.value.params.workspaceId
  )
);
const items = ref<Item[]>([]);

checkValidWorkspace(loginUser.value.uid, workspaceId.value);

watchEffect(() => {
  const collectionRef: Query<DocumentData> = query(
    collection(db, "items"),
    where("workspaceId", "==", workspaceId.value)
  );
  onSnapshot(collectionRef, (querySnapshot) => {
    const _items: Item[] = [];
    querySnapshot.forEach((doc) => {
      _items.push({
        id: doc.id,
        title: doc.data().title,
        checked: doc.data().checked,
        visible: true,
      });
    });
    _items.push({
      id: undefined,
      title: "",
      checked: false,
      visible: false,
    });
    items.value = _items;
  });
});
const checkItem = (item: Item) => {
  if (!item.visible) return;

  const docRef = doc(db, "items", String(item.id));
  updateDoc(docRef, {
    checked: !item.checked,
  });
};

const updateItem = (item: Item) => {
  if (!item.visible) return;

  const itemName: string | null = prompt(`item名を変更します。`, item.title);
  if (!itemName) return;

  const docRef = doc(db, "items", String(item.id));
  updateDoc(docRef, {
    title: itemName,
  });
};

const removeItem = async (item: Item) => {
  if (!item.visible) return;
  const result = confirm("本当に削除しますか？");
  if (!result) return;

  const docRef = doc(db, "items", String(item.id));
  await deleteDoc(docRef);
};

const threeDotsMenuList = [
  { label: "編集", func: updateItem },
  { label: "削除", func: removeItem },
];
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>
