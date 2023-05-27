<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { auth } from "./firebase";
import router from "./router";

const store = useStore();

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const _user = {
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
    };
    store.commit("setFirebaseUser", _user);

    return user;
  } else {
    router.push("/");
  }
});
</script>
