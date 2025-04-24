<template>
    <div class="p-4">
        <h2 class="text-xl font-bold">รางวัล: {{ prizeData?.name }}</h2>
        <p class="text-sm text-gray-500 mb-4">สำหรับห้อง: {{ roomData.name }}</p>

        <PrizeCard v-if="prizeData" :prize="prizeData" :handleEditPrize="() => { }" />

        <div class="mt-8">
            <h3 class="font-semibold mb-2">ตั้งเงื่อนไขผู้เล่น 🎯</h3>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <!-- filter_status -->
                <select v-model="filter_status" class="select select-bordered w-full max-w-xs">
                    <option disabled value="">เลือกสถานะ</option>
                    <option value="not_received">ยังไม่ได้รับรางวัล</option>
                    <option value="received">ได้รับรางวัลแล้ว</option>
                </select>

                <div class="flex flex-col gap-2">
                    <div>
                        <p class="font-medium">เลือกตำแหน่ง</p>
                    </div>

                    <div class="flex gap-2">
                        <div class="flex items-center gap-2 mb-1">
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

                <!-- quantity -->
                <input type="number" min="1" v-model.number="quantity" class="input input-bordered w-full max-w-xs"
                    placeholder="จำนวนที่ต้องการ" />

                <button :disabled="filter_position.length === 0 || !filter_status" @click="handleCreateCondition"
                    class="btn btn-primary">
                    ✅ ยืนยันเงื่อนไข
                </button>
            </div>
        </div>

        <div v-if="drawConditions.length > 0" class="mt-6">
            <h3 class="font-semibold mb-2">🎯 ผู้เล่นที่ตรงตามเงื่อนไข</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <li v-for="player in drawConditions" :key="player.member_id" class="p-4 border rounded-md shadow-sm">
                    <p><strong>{{ player.prefix }} {{ player.first_name }} {{ player.last_name }}</strong></p>
                    <p>รหัสสมาชิก: {{ player.member_id }}</p>
                    <p>ตำแหน่ง: {{ player.position }}</p>
                </li>
            </ul>
        </div>

        <!-- <div class="mt-6">
        <h3 class="font-semibold mb-2">👥 รายชื่อผู้เล่นในห้องนี้</h3>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <li
            v-for="player in playerData"
            :key="player.member_id"
            class="p-4 border rounded-md bg-base-100 shadow-sm"
          >
            <p><strong>{{ player.prefix }} {{ player.first_name }} {{ player.last_name }}</strong></p>
            <p>รหัสสมาชิก: {{ player.member_id }}</p>
            <p>ตำแหน่ง: {{ player.position }}</p>
          </li>
        </ul>
      </div> -->
    </div>
    <pre>{{ drawConditions }}</pre>
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

onMounted(async () => {
    await playerStore.fetchRoom(roomId);
    await playerStore.fetchPlayers(roomId);
    await prizeStore.getPrize(prizeId);
    
    filter_position.value = [...uniquePositions.value]
});

watch([filter_status, filter_position], () => {
    console.log("🧪 watch triggered:", filter_status.value, filter_position.value);
    if (filter_status.value && filter_position.value.length > 0) {
        drawStore.fetchDrawConditions(roomId, filter_status.value, filter_position.value)
    }
});

const handleCreateCondition = async () => {
    try {
        if (!drawStore.drawConditions.length) {
            alert("❌ ไม่พบผู้เล่นที่ตรงตามเงื่อนไข โปรดเลือกตำแหน่งอื่น");
            return;
        }

        await drawStore.createDrawCondition({
            room_id: roomId,
            prize_id: prizeId,
            filter_status: filter_status.value,
            filter_position: filter_position.value, // ✅ array
            quantity: quantity.value,
        });
        alert("✅ เพิ่มเงื่อนไขสำเร็จแล้ว");
    } catch {
        alert("❌ เกิดข้อผิดพลาดในการเพิ่มเงื่อนไข");
    }
};

const toggleAllPositions = () => {
    if (filter_position.value.length === uniquePositions.value.length) {
        filter_position.value = []
    } else {
        filter_position.value = [...uniquePositions.value]
    }
}

</script>

<style scoped>
.select {
    min-width: 200px;
}
</style>