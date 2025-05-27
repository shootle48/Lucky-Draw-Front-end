<template>
    <div class="w-full h-screen flex justify-center items-center flex-col gap-4">
        <PrizeField :handleEditPrize="handleEditPrize" />
    </div>
    <!-- นำเข้า component PrizeModals -->
    <PrizeModals ref="prizeModalsRef" />
</template>

<script lang="ts" setup>
import PrizeModals from '@/components/prize/prizeModal.vue';
import type { prizeType } from '~/types/prize';
const route = useRoute();
const prizeModalsRef = ref<InstanceType<typeof PrizeModals> | null>(null);
const handleEditPrize = (prize: prizeType) => {
    if (prizeModalsRef.value) {
        prizeModalsRef.value.openEditModal(prize);
    }
};
</script>

<style scoped></style>