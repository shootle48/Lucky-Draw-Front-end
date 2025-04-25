<template>
    <div class="p-4">
        <h2 class="text-2xl text-center font-bold mb-4">ห้อง {{ roomData.name }}</h2>

        <PrizeCard v-if="prizeData" :prize="prizeData" :handleEditPrize="() => { }" class="w-fit mx-auto" />

        <div class="flex flex-col mt-8">
            <h3 class="font-semibold mb-2">ตั้งเงื่อนไขผู้เล่น 🎯</h3>
            <div class="flex flex-col lg:flex-row gap-4">
                <!-- quantity -->
                <div class="flex flex-col gap-2">
                    <p class="font-medium">จำนวนรางวัลที่สุ่ม</p>
                    <input type="number" min="1" v-model.number="quantity" class="input input-bordered w-full lg:w-fit"
                        placeholder="จำนวนที่ต้องการ" />
                </div>
                <!-- filter_status -->
                <div class="flex flex-col gap-2">
                    <p class="font-medium">เลือกจาก</p>
                    <select v-model="filter_status" class="select select-bordered w-full lg:w-fit">
                        <option value="not_received">ยังไม่ได้รับรางวัล</option>
                        <option value="received">ได้รับรางวัลแล้ว</option>
                    </select>
                </div>

                <!-- filter_position -->
                <div class="flex flex-col justify-center gap-2">
                    <p class="font-medium">ตำแหน่ง</p>
                    <div class="grid grid-cols-2 lg:flex lg:flex-row gap-2">
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="selectAll"
                                :checked="filter_position.length === uniquePositions.length"
                                @change="toggleAllPositions" class="checkbox checkbox-secondary" />
                            <label for="selectAll" class="font-medium">เลือกทั้งหมด</label>
                        </div>
                        <div v-for="position in uniquePositions" :key="position" class="flex items-center gap-2">
                            <input type="checkbox" :value="position" v-model="filter_position"
                                class="checkbox checkbox-primary" :id="`pos-${position}`" />
                            <label :for="`pos-${position}`" class="text-sm">
                                {{ position }}
                            </label>
                        </div>
                    </div>
                </div>


                <!-- Button -->
                <div class="flex items-end pt-4">
                    <button :disabled="filter_position.length === 0 || !filter_status" @click="handleCreateCondition"
                        class="btn btn-primary w-full lg:w-fit">
                        ✅ ยืนยันเงื่อนไข
                    </button>
                </div>
            </div>
        </div>
    </div>


    <!-- 🔽 แสดงเมื่อมี drawConditions -->
    <div v-if="drawConditions.length > 0" class="mt-6">
        <h3 class="font-semibold mb-2">🎯 ผู้เล่นที่ตรงตามเงื่อนไข</h3>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <li v-for="player in drawConditions" :key="player.member_id"
                class="p-4 border rounded-md shadow-sm bg-white">
                <p class="text-gray-600"><strong>{{ player.prefix }} {{ player.first_name }} {{ player.last_name
                        }}</strong></p>
                <p class="text-sm text-gray-600">รหัสสมาชิก: {{ player.member_id }}</p>
                <p class="text-sm text-gray-600">ตำแหน่ง: {{ player.position }}</p>
            </li>
        </ul>
    </div>

    <!-- 🟡 เมื่อมีการเลือกแต่ไม่พบข้อมูล -->
    <div v-else-if="shouldShowEmptyMessage" class="mt-6 text-center text-warning">
        <div class="inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current w-6 h-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-lg font-medium">ไม่พบผู้เล่นที่ตรงตามเงื่อนไขที่เลือก</span>
        </div>
    </div>
    <!-- <PlayerField :players="drawConditions" v-if="drawConditions.length > 0" class="mt-6" /> -->
</template>


<script setup lang="ts">

const route = useRoute();
const roomId = route.params.roomId as string;
const prizeId = route.params.prizeId as string;

const playerStore = usePlayerStore();
const prizeStore = usePrizeStore();
const drawStore = useDrawConditionStore();

const filter_status = ref("not_received");
const filter_position = ref<string[]>([]); // ✅ รองรับหลายตำแหน่ง
const quantity = ref(1);

const roomData = storeToRefs(playerStore).rooms;
const playerData = storeToRefs(playerStore).players;
const { prize: prizeData } = storeToRefs(prizeStore);
const { drawConditions } = storeToRefs(drawStore); // ⭐ เพิ่ม

const uniquePositions = computed(() =>
    [...new Set(playerData.value.map(p => p.position))].filter(Boolean)
);

const shouldShowEmptyMessage = computed(() => {
    return drawConditions.value.length === 0 && (filter_position.value.length > 0 && filter_status.value);
});


onMounted(async () => {
    await playerStore.fetchRoom(roomId);
    await playerStore.fetchPlayers(roomId);
    await prizeStore.getPrize(prizeId);

    filter_position.value = [...uniquePositions.value]
});

watch([filter_status, filter_position], () => {
    if (filter_status.value && filter_position.value.length > 0) {
        drawStore.fetchDrawConditions(roomId, filter_status.value, filter_position.value);
    } else {
        drawStore.drawConditions = []; // 👈 รีเซตตรงนี้
    }
});


const handleCreateCondition = async () => {
    try {
        if (!drawStore.drawConditions.length) {
            alert("❌ ไม่พบผู้เล่นที่ตรงตามเงื่อนไข โปรดเลือกตำแหน่งอื่น");
            return;
        }

        const currentPrizeQuantity = prizeData.value?.quantity || 0;
        const totalDrawQty = drawStore.drawConditions.reduce((sum, c) => sum + (c.quantity || 0), 0);

        if (quantity.value + totalDrawQty > currentPrizeQuantity) {
            alert(`❌ จำนวนเกินจำนวนรางวัลที่กำหนด(${currentPrizeQuantity})`);
            return;
        }

        await drawStore.createDrawCondition({
            room_id: roomId,
            prize_id: prizeId,
            filter_status: filter_status.value,
            filter_position: filter_position.value,
            quantity: quantity.value,
        });

        alert("✅ เพิ่มเงื่อนไขสำเร็จแล้ว");

    } catch {
        alert("❌ เกิดข้อผิดพลาดในการเพิ่มเงื่อนไข");
    }
};

const filteredPlayers = computed(() => {
    if (!filter_status.value || filter_position.value.length === 0) return [];

    // ใช้ข้อมูลจาก playerStore.players → ทำให้ reusable ได้
    return playerData.value.filter(player =>
        filter_position.value.includes(player.position) &&
        (filter_status.value === 'received'
            ? player.has_received
            : !player.has_received)
    );
});


const toggleAllPositions = () => {
    if (filter_position.value.length === uniquePositions.value.length) {
        filter_position.value = []
        console.log(filter_position.value.length)
    } else {
        filter_position.value = [...uniquePositions.value]
        console.log(filter_position.value.length)
    }
}

</script>

<style scoped></style>