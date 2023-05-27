<template>
  <v-container>
    <v-row justify="center" class="align-center flex-column home__center">
      <div class="mb-2">
        Workspace <strong>{{ workspaceTitle }}</strong> にログインしますか？
      </div>
      <v-btn @click="signIn" color="light-blue">
        ログインしてWorkspaceに参加する
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "@/firebase";
import router from "@/router";
import { arrayUnion, doc, getDoc, updateDoc } from "@firebase/firestore";
import { ref } from "vue";
import setUser from "@/modules/setUser";
import { useStore } from "vuex";

const store = useStore();
const workspaceId = String(router.currentRoute.value.params.workspaceId);
const workspaceTitle = ref<string | undefined>("");

const setWorkspaceTitle = async () => {
  const docRef = doc(db, "workspaces", workspaceId);
  const data = await getDoc(docRef);
  workspaceTitle.value = data.data()?.title;
};
setWorkspaceTitle();

const addUserToWorkspace = async (uid: string) => {
  const docRef = doc(db, "workspaces", workspaceId);
  await updateDoc(docRef, {
    members: arrayUnion(...[uid]),
  });
};

const signIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      setUser(store, result.user);
      addUserToWorkspace(result.user.uid);
      router.push("/workspaces");
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped>
.home__center {
  min-height: 100vh;
  display: flex;
  margin-top: -64px;
}
</style>
