<template>
  <div>
    <v-container fluid class="mb-n10">
      <v-row>
        <v-row>
          <template v-for="(member, index) in members" :key="index">
            <v-col cols="10" class="mt-2 pl-5">{{ member.email }}</v-col>
            <v-col cols="2" align="center" class="mt-2">
              <v-menu bottom offset-y="true">
                <template v-slot:activator="{ props: menu }">
                  <v-icon
                    v-if="loginUser.uid !== member.uid"
                    :color="`${member.visible ? '' : 'white'}`"
                    icon="more_vert"
                    v-bind="mergeProps(menu)"
                  ></v-icon>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(list, index) in threeDotsMenuList"
                    :key="index"
                    @click="list.func(member)"
                  >
                    <v-list-item-title>{{ list.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-divider
              v-if="![members.length - 1, members.length - 2].includes(index)"
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
  doc,
  updateDoc,
  where,
  arrayRemove,
  getDocs,
  documentId,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { useStore } from "vuex";
import { watchEffect } from "vue";
import User from "@/types/User";
import router from "@/router";
import { computed } from "vue";
import checkValidWorkspace from "@/modules/checkValidWorkspace";

const store = useStore();
const loginUser = computed<User>(() => store.state.firebaseUser);
const members = ref<User[]>([]);
const workspaceId = computed(() =>
  String(
    store.state.workspace.id || router.currentRoute.value.params.workspaceId
  )
);

checkValidWorkspace(loginUser.value.uid, workspaceId.value);

const getUsers = async (_userUids: string[]): Promise<User[]> => {
  const q = query(
    collection(db, "users"),
    where(documentId(), "in", _userUids)
  );
  const snapshot = await getDocs(q);
  const _users: User[] = [];
  snapshot.forEach((doc) => {
    _users.push({
      uid: doc.id,
      displayName: doc.data().displayName,
      email: doc.data().email,
      visible: true,
    });
  });
  return _users;
};

watchEffect(() => {
  const docRef = doc(db, "workspaces", workspaceId.value);
  onSnapshot(docRef, (querySnapshot) => {
    const uids = querySnapshot.data()?.members;
    getUsers(uids).then((users) => {
      members.value = users;
    });
  });
});

const removeItem = async (user: User) => {
  if (!user.visible) return;
  const result = confirm("本当に削除しますか？");
  if (!result) return;
  console.log(workspaceId, user.uid);

  const docRef = doc(db, "workspaces", workspaceId.value);
  await updateDoc(docRef, {
    members: arrayRemove(user.uid),
  });
};

const threeDotsMenuList = [
  { label: "削除", action: "delete", func: removeItem },
];
</script>

<style scoped></style>
