<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import useOnAuthStateChanged from "./composables/useOnAuthStateChanged";

const store = useStore();

useOnAuthStateChanged(store, () => {});
</script>
