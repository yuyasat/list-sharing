<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-row no-gutters>
          <template v-for="(item, index) in items" :key="index">
            <v-col cols="8" align="center">
              <v-checkbox
                hide-details
                color="secondary"
                :model-value="item.checked"
                density="compact"
              >
                <template v-slot:label>
                  <span :class="{ done: item.checked }">{{ item.title }}</span>
                </template></v-checkbox
              ></v-col
            >
            <v-col cols="4" align="center" class="mt-2">セル2-3</v-col>
          </template>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const items = ref([
  { title: "オリーブオイル", checked: true, lastUpdated: "2021/10/01" },
  { title: "クレラップ", checked: false, lastUpdated: "2021/10/01" },
  { title: "ハンドソープ", checked: false, lastUpdated: "2021/10/01" },
  { title: "黒ニンニク", checked: true, lastUpdated: "2021/10/01" },
]);
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>
