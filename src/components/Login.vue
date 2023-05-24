<template>
  <div>
    <v-btn @click="signIn">ログイン</v-btn>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import router from "@/router";

const signIn = () => {
  signInWithPopup(auth, provider).then((result) => {
    localStorage.setItem("userUuid", result.user.uid);
    router.push("/workspaces");
  });
};
</script>

<style scoped></style>
