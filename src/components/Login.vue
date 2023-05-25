<template>
  <v-container>
    <v-row justify="center" class="align-center flex-column home__center">
      <template v-if="isLoggedIn">
        <router-link to="/workspaces">
          <v-btn>Workspace一覧</v-btn>
        </router-link>
      </template>
      <template v-else>
        <v-btn @click="signIn" color="light-blue">ログイン</v-btn>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import router from "@/router";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const isLoggedIn = computed(() => !!store.state.firebaseUser);

const signIn = () => {
  signInWithPopup(auth, provider).then((result) => {
    router.push("/workspaces");
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
