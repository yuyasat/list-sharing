<template>
  <v-footer app class="mb-2">
    <v-btn
      color="light-blue"
      density="default"
      icon="chevron_left"
      @click="handleClick"
    ></v-btn>
  </v-footer>
</template>

<script lang="ts" setup>
import router from "@/router";
import route from "@/router";

const handleClick = () => {
  switch (route.currentRoute.value.name) {
    case "Workspaces":
      router.push("/");
      break;
    case "Items":
      router.push("/workspaces");
      break;
    default:
  }
};
</script>

<style scoped>
footer {
  background-color: transparent;
}
</style>
