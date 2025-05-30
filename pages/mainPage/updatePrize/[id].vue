<template>
    <div class="w-full h-screen flex justify-center items-center flex-col gap-4">
        <div class="bg-[#ffffff69] rounded-box  max-w-md shadow-lg py-4 px-6 sm:px-10 mb-4 text-center mx-4 md:mx-auto">
            <h1 class="text-black text-xl md:text-2xl font-bold drop-shadow-lg">จัดการรางวัล</h1>
        </div>
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