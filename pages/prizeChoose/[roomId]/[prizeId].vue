<template>
    <div>
        hello prizeChoose
        {{ roomId }}
        {{ prizeId }}
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const roomId = route.params.roomId;
const prizeId = route.params.prizeId;

</script>

<style lang="scss" scoped>

</style>