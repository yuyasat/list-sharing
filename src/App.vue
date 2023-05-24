<template>
  <router-view />
</template>

<script lang="ts" setup>
import { auth } from "@/firebase";
import router from "./router";

auth.onAuthStateChanged((user) => {
  if (user) {
    // ログイン時に行いたい処理などをここに書く
    console.log(user);
    router.push("/workspaces");
  }
});
</script>
