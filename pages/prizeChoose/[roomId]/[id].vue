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
const { isLoading, prize: prizeData } = storeToRefs(prizeStore);
const { drawConditions } = storeToRefs(drawStore);
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
            showToast("ไม่พบผู้เล่นที่ตรงตามเงื่อนไข โปรดเลือกตำแหน่งอื่น", "alert-warning");
            return;
        }

        const currentPrizeQuantity = prizeData.value?.quantity || 0;
        const totalDrawQty = drawStore.drawConditions.reduce((sum, c) => sum + (c.quantity || 0), 0);

        const filteredPlayersCount = drawStore.drawConditions.length;
        if (quantity.value > filteredPlayersCount) {
            showToast("จำนวของรางวัลมากกว่าจำนวนผู้เล่นไม่ได้", "alert-error");
            return;
        }

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
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push(`/drawRoom/${createdCondition.id}`);
        }

    } catch {
        showToast("❌ เกิดข้อผิดพลาดในการเพิ่มเงื่อนไข", "alert-error");
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

const screenLimit = ref(2);

const updateLimitByScreenSize = () => {
    const width = window.innerWidth;
    if (width >= 1550) {
        screenLimit.value = 3;
    } else {
        screenLimit.value = 2;
    }
};

onMounted(() => {
    updateLimitByScreenSize();
    window.addEventListener('resize', updateLimitByScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateLimitByScreenSize);
});

const dropdownLimit = computed(() => isDropdownOpen.value ? 9999 : screenLimit.value);

</script>

<template>
    <div class="flex flex-col items-center">

        <div class="p-4 text-black flex flex-col mt-20 items-center">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-0 relative">
                <div class="col-span-1 lg:col-span-1 flex justify-center items-center">
                    <div class="flex flex-col lg:fixed top-50 z-40 justify-center items-center">
                        <div
                            class="bg-[#ffffff69] rounded-box  max-w-md shadow-lg py-4 px-6 sm:px-10 mb-4 text-center mx-4 md:mx-auto">
                            <h1 class="text-black text-xl md:text-2xl font-bold drop-shadow-lg">{{ roomData.name }}</h1>
                        </div>
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
                <!-- filter_field -->
                <div
                    class="bg-[#ffffff69] col-span-1 lg:col-span-2 p-6 rounded-lg shadow-lg w-full lg:min-w-[1115px] mb-4">
                    <h3 class="font-semibold my-4 text-xl">ตั้งเงื่อนไขผู้เล่น</h3>
                    <div class="flex flex-col justify-center">
                        <div class="flex flex-col lg:flex-row gap-4">

                            <!-- จำนวนรางวัล -->
                            <div class="flex flex-col gap-2 col-span-1">
                                <p class="font-medium ">จำนวนรางวัลที่สุ่ม</p>
                                <div
                                    class="flex justify-between items-center mt-2 bg-gradient-to-t from-[#3fc028] to-[#5ee746] rounded-full px-2 py-1.75 shadow-xl/30 shadow-black">
                                    <button @click="quantity = Math.max(1, quantity - 1)"
                                        class="text-black font-bold px-2 sm:px-3 py-1 hover:scale-105 transition-transform cursor-pointer">-</button>
                                    <div class="w-px h-4 sm:h-6 bg-black mx-1 opacity-40 text-white"></div>
                                    <input type="number" v-model.number="quantity" min="1"
                                        class="no-spinner w-8 sm:w-12 text-center bg-transparent text-black font-semibold outline-none" />
                                    <div class="w-px h-4 sm:h-6 bg-black mx-1 opacity-40"></div>
                                    <button @click="quantity++"
                                        class="text-black font-bold px-2 sm:px-3 py-1 hover:scale-105 transition-transform cursor-pointer">+</button>
                                </div>
                            </div>

                            <!-- ผู้ที่มีสิทธิ์เล่น -->
                            <div class="flex flex-col gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
                                <p class="font-medium">ผู้ที่มีสิทธิ์เล่น</p>
                                <div
                                    class="flex justify-center mt-2 min-w-full bg-gradient-to-t from-[#FFD900] to-[#FBFF27] rounded-full px-4 py-2.5 shadow-xl/30 shadow-black">
                                    <div class="flex gap-4">
                                        <div class="flex items-center gap-2">
                                            <input type="checkbox"
                                                class="checkbox checkbox-primary checkbox-xs sm:checkbox-sm"
                                                value="received" v-model="filter_status" />
                                            <label>ได้รับรางวัลแล้ว</label>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <input type="checkbox"
                                                class="checkbox checkbox-primary checkbox-xs sm:checkbox-sm"
                                                value="waive" v-model="filter_status" />
                                            <label>สละสิทธิ์</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ผู้เข้าร่วม -->
                            <div class="flex flex-col gap-2 col-span-1">
                                <p class="font-medium">ผู้เข้าร่วม</p>
                                <select v-model="filter_is_active"
                                    class="w-full mt-2 bg-gradient-to-t from-[#e64a4a] to-[#ffaac3] rounded-full text-black px-2 sm:px-4 py-2 shadow-xl/30 shadow-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ffaac3] transition-all duration-200 ease-in-out">
                                    <option :value="false">ผู้เล่นทั้งหมด</option>
                                    <option :value="true">เฉพาะผู้เข้าร่วม</option>
                                </select>
                            </div>

                            <!-- ตำแหน่ง -->
                            <div class="flex flex-col gap-2 items-center lg:relative">
                                <p class="font-medium">ตำแหน่ง</p>
                                <div class="w-full lg:absolute lg:top-8 lg:left-0 lg:min-w-106">
                                    <!-- เพิ่ม class พิเศษเพื่อควบคุมการแสดงผล dropdown -->
                                    <Multiselect v-model="filter_position" :options="uniquePositions" :multiple="true"
                                        :taggable="false" :limit="dropdownLimit" :limitText="getLimitText"
                                        placeholder="เลือกหรือลองค้นหาตำแหน่งผู้เล่น..." @open="handleDropdown(true)"
                                        @close="handleDropdown(false)" class="shadow-xl/30 shadow-black rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 🔽 แสดงผู้เล่นที่ตรงตามเงื่อนไข -->
                    <div class="bg-[#ffffff98] shadow-xl mb-8 mx-4 md:mx-0 mt-10 rounded-lg">
                        <div v-if="drawConditions.length > 0">
                            <div class="card-body">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="card-title text-base md:text-lg text-black">ผู้เล่นที่ตรงตามเงื่อนไข ({{
                                        drawConditions.length
                                        }}
                                        คน)
                                    </div>
                                    <input type="checkbox" @click="togglePlayer" class="toggle toggle-accent bg-black"
                                        checked />
                                </div>

                                <div v-show="!isShowing"
                                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div v-for="(player, index) in filteredDrawConditions" :key="player.member_id"
                                        class="card shadow-sm relative rounded-lg backdrop-blur-md">
                                        <div class="absolute top-3 right-3 w-3 h-3 rounded-full shadow"
                                            :class="player.is_active === true ? 'bg-green-500' : player.is_active === false ? 'bg-red-500' : 'bg-gray-300'"
                                            title="สถานะการเข้าร่วม"></div>

                                        <div class="card-body p-3 text-center text-black">
                                            <div class="avatar mx-auto mb-2">
                                                <div class="w-15 h-15 rounded-full overflow-hidden"
                                                    :style="{ backgroundColor: getRandomBgColor(index) }">
                                                    <img :src="getProfileImage(player.member_id ?? '')"
                                                        alt="รูปผู้เข้าร่วม" class="w-full h-full object-cover" />
                                                </div>
                                            </div>

                                            <div class="text-sm md:text-base font-bold">{{ player.full_name }}</div>
                                            <div class="text-xs md:text-sm text-gray-500">{{ player.position }}</div>
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

:deep(.multiselect) {
    background-color: transparent;
    color: black;
}

:deep(.multiselect__tags) {
    background-image: linear-gradient(to top, #00B2FF, #88E2FF);
    border: none;
    padding-top: 10px;
    border-radius: 10px;
}

:deep(.multiselect__tag) {
    background-image: linear-gradient(to top, #ffffff, #ecfaff);
    border-radius: 10px;
    color: black;
    box-shadow: black 0px 0px 5px;
    line-height: 1.5;
}

:deep(.multiselect__tag:hover) {
    background-image: linear-gradient(to top, #cacaca, #d6d6d6);
}

:deep(.multiselect__tag-icon:hover::after) {
    color: #ff0000;
}

:deep(.multiselect__input) {
    background-color: transparent;
    color: #000000;
    /* สีข้อความที่เข้มขึ้น */
    font-weight: 600;
    border: none;
    outline: none;
}

/* แก้ไขเป็นใช้ position: fixed ให้กับ content wrapper */
:deep(.multiselect__content-wrapper) {
    position: absolute;
    display: block;
    background: #fff;
    width: 100%;
    max-height: 240px;
    overflow: auto;
    border: 1px solid #e8e8e8;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 9999;
    /* เพิ่ม z-index ให้สูงมากๆ */
    -webkit-overflow-scrolling: touch;
    /* แก้ไขสำคัญ: ทำให้มัน overlay อยู่เหนือเนื้อหาอื่น ไม่ดัน content */
}

:deep(.multiselect__strong) {
    margin: 0;
    padding: 0;
    font-weight: 200;
    font-size: 0.9rem;
    text-align: center;
    align-items: center;
}
</style>