<script setup lang="ts">
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { getToast } from "@/composables/useToastPage";
import logo from '@/assets/logo.png';


const { showToast } = getToast();
const route = useRoute();
const router = useRouter();
const roomId = route.params.roomId as string;
const prizeId = route.params.id as string;

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
const isDropdownOpen = ref<boolean>(false);

const togglePlayer = () => {
    isShowing.value = !isShowing.value;
};

const uniquePositions = computed(() =>
    [...new Set(playerData.value.map(p => p.position))].filter(Boolean)
);

const handleDropdown = (status: boolean) => {
    isDropdownOpen.value = status;
};

// ฟังก์ชันสร้างข้อความแสดงเมื่อเกินจำนวน
const getLimitText = (count: number) => {
    const hiddenTags = filter_position.value.slice(3).join(", ");
    return isDropdownOpen.value ? '' : `+ ${count} more`;
};

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

            // รอ 1.5 วิ ให้ user ได้อ่าน toast ก่อนเปลี่ยนหน้า
            await new Promise((resolve) => setTimeout(resolve, 1500));

            router.push(`/drawRoom/${createdCondition.id}`);
        }

    } catch {
        showToast("เกิดข้อผิดพลาดในการเพิ่มเงื่อนไข", "alert-error");
    }
};

const filteredDrawConditions = computed(() =>
    drawConditions.value.filter(player => Object.keys(player).length > 1)
);

// ✅ สร้าง hash จาก string
const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // แปลงเป็น 32bit int
    }
    return Math.abs(hash);
};
const imageCache = new Map<string, string>();
const getProfileImage = (memberId: string): string => {
    if (imageCache.has(memberId)) return imageCache.get(memberId)!;

    const hash = hashString(memberId);
    const imageIndex = (hash % 10) + 1;
    const imagePath = new URL(`/assets/Image_profile/default_${imageIndex}.png`, import.meta.url).href;

    imageCache.set(memberId, imagePath);
    return imagePath;
};



const bgColors = [
    '#F44336', // red
    '#E91E63', // pink
    '#9C27B0', // purple
    '#3F51B5', // indigo
    '#2196F3', // blue
    '#009688', // teal
    '#4CAF50', // green
    '#FF9800', // orange
    '#795548', // brown
    '#607D8B'  // blue gray
]

const getRandomBgColor = (index: number): string => {
    return bgColors[index % bgColors.length]
}

</script>

<template>
    <div class="flex flex-col items-center">


        <div class="p-4 text-black flex flex-col mt-20 items-center">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-0 relative">
                <div>
                    <div class="flex flex-col lg:fixed top-50 left-15 z-999 justify-center items-center">
                        <PrizeCard v-if="prizeData" :prize="prizeData" :handleEditPrize="() => { }" />
                        <div>
                            <button :disabled="filter_position.length === 0 || filter_status.length === 0"
                                @click="handleCreateCondition"
                                class="btn h-fit bg-gradient-to-t from-[#ff8f00] to-[#ffd902] p-2 mt-4 border-0 rounded-[2rem] w-fit shadow-xl/30 shadow-black text-white ">
                                <div class="bg-[#ffae02] px-6 py-3 rounded-[2rem] text-lg font-semibold">
                                    <p class="drop-shadow-lg">สุ่มรางวัล</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="bg-[#ffffff69] col-span-1 lg:col-span-2 p-6 rounded-lg shadow-lg w-full mb-4">
                    <h3 class="font-semibold my-4">ตั้งเงื่อนไขผู้เล่น</h3>
                    <div class="flex flex-col justify-center items-center lg:mr-10 ">
                        <div class="flex flex-col lg:flex-row gap-4">
                            <!-- quantity -->
                            <div class="flex flex-col items-center gap-2">
                                <p class="font-medium underline">จำนวนรางวัลที่สุ่ม</p>

                                <div
                                    class="flex  min-w-full justify-between items-center bg-gradient-to-t from-[#3fc028] to-[#5ee746] rounded-full px-2 py-1 shadow-xl/30 shadow-black">
                                    <!-- ปุ่มลบ -->
                                    <button @click="quantity = Math.max(1, quantity - 1)"
                                        class="text-white text-xl font-bold px-3 py-1 hover:scale-105 transition-transform cursor-pointer">
                                        -
                                    </button>

                                    <!-- เส้นแบ่ง -->
                                    <div class="w-px h-6 bg-black mx-1 opacity-40 text-white"></div>

                                    <!-- จำนวน -->
                                    <input type="number" v-model.number="quantity" min="1"
                                        class="no-spinner w-12 text-center bg-transparent text-white text-lg font-semibold outline-none" />

                                    <!-- เส้นแบ่ง -->
                                    <div class="w-px h-6 bg-black mx-1 opacity-40"></div>

                                    <!-- ปุ่มบวก -->
                                    <button @click="quantity++"
                                        class="text-white text-xl font-bold px-3 py-1 hover:scale-105 transition-transform cursor-pointer">
                                        +
                                    </button>
                                </div>
                            </div>
                            <!-- filter_status -->
                            <div class="flex flex-col gap-2 items-center">
                                <p class="font-medium">คนที่มีสิทธิ์</p>
                                <div
                                    class="flex justify-center min-w-full bg-gradient-to-t from-[#FFD900] to-[#FBFF27] rounded-full px-4 py-2.5 shadow-xl/30 shadow-black">
                                    <div class="flex gap-4">
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
                                    </div>
                                </div>
                            </div>


                            <!-- filter_is_active -->
                            <div class="flex flex-col gap-2 items-center">
                                <!-- Heading -->
                                <p class="font-medium text-lg text-gray-800">ผู้เข้าร่วม</p>

                                <!-- Participant Filter Dropdown -->
                                <select v-model="filter_is_active" class="w-full lg:w-auto bg-gradient-to-t from-red-600 to-red-400 
             rounded-full text-white px-4 py-2 shadow-xl/30 shadow-black 
               cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300 
               transition-all duration-200 ease-in-out">
                                    <option :value="false">ผู้เล่นทั้งหมด</option>
                                    <option :value="true">เฉพาะผู้เข้าร่วม</option>
                                </select>
                            </div>


                            <!-- filter_position -->
                            <div class="flex flex-col gap-2 items-center relative">
                                <p class="font-medium">ตำแหน่ง</p>
                                <div class="relative w-full">
                                    <Multiselect v-model="filter_position" :options="uniquePositions" :multiple="true"
                                        :taggable="false" :limit="isDropdownOpen ? 9999 : 3" :limitText="getLimitText"
                                        placeholder="เลือกหรือลองค้นหาตำแหน่งผู้เล่น..." @open="handleDropdown(true)"
                                        @close="handleDropdown(false)"
                                        class="shadow-xl/30 shadow-black rounded-full max-w-100 relative" />
                                </div>
                            </div>


                        </div>
                    </div>
                    <!-- 🔽 แสดงผู้เล่นที่ตรงตามเงื่อนไข -->
                    <div class="bg-[#ffffff]/80 shadow-xl mb-8 mx-4 md:mx-0 mt-10 rounded-lg">
                        <div v-if="drawConditions.length > 0">
                            <div class="card-body">
                                <div class="flex items-center justify-between mb-2 md:min-w-[850px]">
                                    <h2 class="card-title text-black pr-10">ผู้เล่นที่ตรงตามเงื่อนไข ({{
                                        drawConditions.length
                                    }}
                                        คน)
                                    </h2>
                                    <input type="checkbox" @click="togglePlayer" class="toggle toggle-accent bg-black"
                                        checked />
                                </div>

                                <div v-show="!isShowing"
                                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div v-for="(player, index) in filteredDrawConditions" :key="player.member_id"
                                        class="card shadow-sm relative bg-white/70 rounded-lg backdrop-blur-md">
                                        <div class="absolute top-3 right-3 w-3 h-3 rounded-full shadow"
                                            :class="player.is_active === true ? 'bg-green-500' : player.is_active === false ? 'bg-red-500' : 'bg-gray-300'"
                                            title="สถานะการเข้าร่วม"></div>

                                        <div class="card-body p-3 text-center text-black">
                                            <div class="avatar mx-auto mb-2">
                                                <div class="w-20 h-20 rounded-full overflow-hidden"
                                                    :style="{ backgroundColor: getRandomBgColor(index) }">
                                                    <img :src="getProfileImage(player.member_id ?? '')"
                                                        alt="รูปผู้เข้าร่วม" class="w-full h-full object-cover" />
                                                </div>
                                            </div>

                                            <div class="text-lg font-bold">{{ player.full_name }}</div>
                                            <div class="text-sm text-gray-500">{{ player.position }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 🟡 เมื่อมีการเลือกแต่ไม่พบข้อมูล -->
                        <div v-else-if="shouldShowEmptyMessage" class="mt-6 text-center py-4 px-12 lg:py-4 lg:px-80">
                            <div class="inline-flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current w-6 h-6 text-yellow-500"
                                    fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span
                                    class="text-lg font-medium text-yellow-500">ไม่พบผู้เล่นที่ตรงตามเงื่อนไขที่เลือก</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="isLoading">
            <LoadingPage />
        </div>
        <div class="toast toast-top toast-start fixed z-[9999]"></div>
    </div>
    ```

</template>

<style scoped>
select option {
    background-color: #FFFFFF !important;
    /* พื้นหลังสีขาว */
    color: #333333 !important;
    /* ข้อความสีเทาเข้ม */
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

::v-deep(.multiselect) {
    background-color: transparent;
    color: black;
}

::v-deep(.multiselect__tags) {
    background-image: linear-gradient(to top, #00B2FF, #88E2FF);
    border: none;
    padding-top: 10px;
}

::v-deep(.multiselect__tag) {
    background-image: linear-gradient(to top, #ffffff, #ecfaff);
    border-radius: 10px;
    color: black;
    box-shadow: black 0px 0px 5px;
    line-height: 1.5;
}

::v-deep(.multiselect__tag:hover) {
    background-image: linear-gradient(to top, #cacaca, #d6d6d6);
}

::v-deep(.multiselect__tag-icon:hover::after) {
    color: #ff0000;
}

::v-deep(.multiselect__input) {
    background-color: transparent;
    color: #000000;
    /* สีข้อความที่เข้มขึ้น */
    font-weight: 600;
    border: none;
    outline: none;
}

::v-deep(.multiselect__content-wrapper) {
    position: absolute !important;
    z-index: 50;
    /* เพื่อให้ dropdown ซ้อนอยู่ด้านบน */
    top: 100%;
    /* ทำให้ dropdown อยู่ใต้ input */
    left: 0;
    right: 0;
    max-height: 200px;
    /* คุณสามารถปรับขนาดได้ */
    overflow-y: auto;
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
</style>
