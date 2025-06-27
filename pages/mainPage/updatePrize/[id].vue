<template>
    <div class="w-full mt-20 flex justify-center items-center flex-col gap-4">
        <div class="bg-[#ffffff69] rounded-box  max-w-md shadow-lg py-4 px-6 sm:px-10 mb-4 text-center mx-4 md:mx-auto">
            <h1 class="text-black text-xl md:text-2xl font-bold drop-shadow-lg">จัดการรางวัล</h1>
        </div>
        <PrizeField :handleEditPrize="handleEditPrize" />
        <NuxtLink :to="`/mainPage/${route.params.id}/`">
            <button
                class="btn h-fit bg-gradient-to-t from-[#00B2FF] to-[#88E2FF] p-1 px-2 border-0 rounded-[2rem]  text-white shadow-black shadow-sm mt-4">
                <div
                    class="bg-[#00B2FF] rounded-[2rem] p-1 px-4 text-sm md:text-lg font-medium flex items-center gap-1">
                    <p class="drop-shadow-lg">กลับสู่หน้าหลัก</p>
                </div>
            </button>
        </NuxtLink>
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