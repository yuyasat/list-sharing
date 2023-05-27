<template>
  <div>
    <v-container fluid class="mb-n10">
      <draggable
        v-model="items"
        item-key="id"
        tag="div"
        class="v-row"
        @end="onEnd"
        :disabled="!isDraggable"
        animation="200"
      >
        <template #item="{ element, index }">
          <v-row class="row__item my-0 list">
            <v-col cols="10" align="center" class="py-0">
              <v-checkbox
                hide-details
                color="secondary"
                :model-value="element.checked"
                @click="checkItem(element)"
                density="compact"
                v-show="element.visible"
              >
                <template v-slot:label>
                  <span :class="{ done: element.checked }">{{
                    element.title
                  }}</span>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="2" align="center" class="mt-n">
              <v-menu bottom offset-y="true">
                <template v-slot:activator="{ props: menu }">
                  <v-icon
                    icon="more_vert"
                    v-bind="mergeProps(menu)"
                    :color="`${element.visible ? '' : 'white'}`"
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
          </v-row>
        </template>
      </draggable>
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
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";
import Item from "@/types/Item";
import { useStore } from "vuex";
import { watchEffect, mergeProps } from "vue";
import router from "@/router";
import User from "@/types/User";
import checkValidWorkspace from "@/modules/checkValidWorkspace";
import draggable from "vuedraggable";

const store = useStore();
const loginUser = computed<User>(() => store.state.firebaseUser);
const isDraggable = ref<boolean>(false);
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
    where("workspaceId", "==", workspaceId.value),
    orderBy("order", "desc")
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
    items.value = _items;
    store.commit("setItemCount", _items.length);
  });
});

const onEnd = () => {
  items.value.forEach(async (item, index) => {
    const docRef = doc(db, "items", String(item.id));
    await updateDoc(docRef, {
      order: items.value.length - index,
    });
  });
};

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
  {
    label: `${isDraggable.value ? "並び替え終了" : "並び替え"}`,
    func: () => (isDraggable.value = !isDraggable.value),
  },
];
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
.row__item {
  width: 100vh;
}
.list:last-child::after {
  content: "";
  display: block;
  width: 100%;
  height: 50px;
  top: 0;
  left: 0;
}
</style>
