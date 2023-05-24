<template>
  <WorkspaceList :firebaseUser="firebaseUser" />
</template>

<script lang="ts" setup>
import WorkspaceList from "@/components/WorkspaceList.vue";
const { firebaseUser } = defineProps({
  firebaseUser: {
    type: Array,
    required: true,
  },
});
</script>
