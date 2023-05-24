<template>
  <router-view />
</template>

<script lang="ts" setup>
import { auth } from "@/firebase";
import router from "./router";

import { useStore } from "vuex";
import useOnAuthStateChanged from "./composables/useOnAuthStateChanged";

const store = useStore();

useOnAuthStateChanged(store, () => router.push("/workspaces"));
</script>
