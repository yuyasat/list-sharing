<template>
  <v-app>
    <default-bar />

    <default-view />

    <footer-bar />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import FooterBar from "./FooterBar.vue";
</script>
