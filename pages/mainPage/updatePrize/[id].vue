<template>
    <div class="w-full h-screen flex justify-center items-center flex-col gap-4">
        <PrizeField :handleEditPrize="handleEditPrize" />
        <div>
            <NuxtLink :to="`/mainPage/${route.params.id}`">
                <button
                    class="btn h-fit bg-gradient-to-t from-[#3fc028] to-[#5ee746] p-1 px-2 border-0 rounded-[2rem]  text-white shadow-black shadow-sm mt-4">
                    <div
                        class="bg-[#3fc028] rounded-[2rem] p-1 px-4 text-sm md:text-lg font-medium flex items-center gap-1">
                        <p class="drop-shadow-lg">กลับสู่หน้าหลัก</p>
                    </div>
                </button>
            </NuxtLink>
        </div>
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