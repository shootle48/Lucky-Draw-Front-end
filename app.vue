<script setup lang="ts">
const route = useRoute();
const shouldShowLayout = computed(() => {
  return route.path !== '/' && !route.path.startsWith('/room');
});
</script>
<template>
  <div>
    <UApp>
      <template v-if="shouldShowLayout">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </template>
      <template v-else>
        <NuxtPage />
      </template>
    </UApp>
  </div>
</template>
