<script setup lang="ts">
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { getToast } from "@/composables/useToastPage";


const { showToast } = getToast();
const route = useRoute();
const router = useRouter();
const roomId = route.params.roomId as string;
const prizeId = route.params.prizeId as string;

const playerStore = usePlayerStore();
const prizeStore = usePrizeStore();
const drawStore = useDrawConditionStore();

const filter_status = ref<string[]>(['not_received']);
const filter_position = ref<string[]>([]);
const filter_is_active = ref<boolean>(false);
const quantity = ref(1);

const roomData = storeToRefs(playerStore).rooms;
const playerData = storeToRefs(playerStore).players;
const { prize: prizeData } = storeToRefs(prizeStore);
const { isLoading, drawConditions } = storeToRefs(drawStore);
const isShowing = ref<boolean>(false);

const togglePlayer = () => {
    isShowing.value = !isShowing.value;
};

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

    filter_position.value = [...uniquePositions.value];
    console.log(drawConditions)
});

watch([filter_status, filter_position, filter_is_active], () => {
    if (filter_status.value.length > 0 && filter_position.value.length > 0) {
        drawStore.fetchDrawConditions(
            roomId,
            filter_status.value,
            filter_position.value,
            filter_is_active.value
        );
    } else {
        drawStore.drawConditions = [];
    }
});


const handleCreateCondition = async () => {
    try {
        if (!drawStore.drawConditions.length) {
            showToast("❌ ไม่พบผู้เล่นที่ตรงตามเงื่อนไข โปรดเลือกตำแหน่งอื่น", "alert-warning");
            return;
        }

        const currentPrizeQuantity = prizeData.value?.quantity || 0;
        const totalDrawQty = drawStore.drawConditions.reduce((sum, c) => sum + (c.quantity || 0), 0);

        if (quantity.value + totalDrawQty > currentPrizeQuantity) {
            showToast(`จำนวนเกินที่กำหนด`, "alert-error");
            return;
        }

        const createdCondition = await drawStore.createDrawCondition({
            room_id: roomId,
            prize_id: prizeId,
            filter_status: filter_status.value,
            filter_position: filter_position.value,
            filter_is_active: filter_is_active.value,
            quantity: quantity.value,
        });

        if (createdCondition.id) {
            showToast("เพิ่มเงื่อนไขสำเร็จแล้ว", "alert-success");

            // // รอ 1.5 วิ ให้ user ได้อ่าน toast ก่อนเปลี่ยนหน้า
            // await new Promise((resolve) => setTimeout(resolve, 1500));

            router.push(`/drawRoom/${createdCondition.id}`);
        }

    } catch {
        showToast("เกิดข้อผิดพลาดในการเพิ่มเงื่อนไข", "alert-error");
    }
};

const filteredDrawConditions = computed(() =>
    drawConditions.value.filter(player => Object.keys(player).length > 1)
);



</script>


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
                    <p class="font-medium mb-1">คนที่มีสิทธิ์</p>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex items-center gap-2">
                            <input type="checkbox" class="checkbox checkbox-primary" value="received"
                                v-model="filter_status" />
                            <label>ได้รับรางวัลแล้ว</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" class="checkbox checkbox-primary" value="waive"
                                v-model="filter_status" />
                            <label>สละสิทธิ์</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" class="checkbox checkbox-primary" value="no_show"
                                v-model="filter_status" />
                            <label>ไม่แสดงตน</label>
                        </div>
                    </div>
                </div>


                <!-- filter_is_active -->
                <div class="flex flex-col gap-2">
                    <p class="font-medium">ผู้เข้าร่วม</p>
                    <select v-model="filter_is_active" class="select select-bordered w-full lg:w-fit">
                        <option :value=false>ผู้เล่นทั้งหมด</option>
                        <option :value=true>เฉพาะผู้เข้าร่วม</option>
                    </select>
                </div>

                <!-- filter_position -->
                <div class="flex flex-col justify-center gap-2">
                    <p class="font-medium mb-1">ตำแหน่ง</p>

                    <!--  Multiselect พร้อม Search -->
                    <Multiselect v-model="filter_position" :options="uniquePositions" :multiple="true" :taggable="false"
                        placeholder="เลือกหรือลองค้นหาตำแหน่งผู้เล่น..." track-by="" label="" class="w-full lg:w-96" />
                </div>


                <!-- Button -->
                <div class="flex items-end pt-4">
                    <button :disabled="filter_position.length === 0 || filter_status.length === 0"
                        @click="handleCreateCondition" class="btn btn-primary w-full lg:w-fit">
                        ✅ สุ่มรางวัล
                    </button>
                </div>
            </div>
        </div>
    </div>


    <!-- 🔽 แสดงผู้เล่นที่ตรงตามเงื่อนไข -->
    <div v-if="drawConditions.length > 0" class="card bg-base-100 w-full shadow-xl mb-8">
        <div class="card-body">
            <div class="flex items-center justify-between mb-4">
                <h2 class="card-title">
                    🎯 ผู้เล่นที่ตรงตามเงื่อนไข ({{ drawConditions.length }} คน)
                </h2>
                <input type="checkbox" @click="togglePlayer" class="toggle toggle-accent" checked />
            </div>

            <div v-show="!isShowing" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div v-for="(player, index) in filteredDrawConditions" :key="player.member_id"
                    class="card bg-base-200 shadow-sm">

                    <div class="card-body p-3 text-center relative">
                        <div class="avatar mx-auto mb-2">
                            <div class="w-14 h-14 rounded-full">
                                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(player.first_name)}&background=random`"
                                    alt="รูปผู้เข้าร่วม" />
                            </div>
                        </div>

                        <div class="text-lg font-bold">{{ player.full_name }}</div>
                        <div class="text-sm text-gray-500">{{ player.position }}</div>

                        <!-- ✅ status circle -->
                        <div class="flex justify-center mt-2">
                            <div class="w-3 h-3 rounded-full"
                                :class="player.is_active === true ? 'bg-green-500' : player.is_active === false ? 'bg-red-500' : 'bg-gray-300'"
                                title="สถานะการเข้าร่วม"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
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

    <div v-if="isLoading">
        <LoadingPage />
    </div>
    <div class="toast toast-top toast-start fixed z-[9999]"></div>

</template>

<style scoped></style>