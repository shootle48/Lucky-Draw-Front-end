<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';

interface Prize {
    name: string;
    quantity: number;
    image?: string;
    colorClass: string;
}

// ข้อมูลรางวัล
const prizes = ref<Prize[]>([]);

// Modal เพิ่มรางวัล
const showAddPrizeModal = ref(false);
const newPrize = ref<Prize>({
    name: '',
    quantity: 1,
    colorClass: 'bg-amber-300'
});

// ตัวแปรสำหรับ Carousel
const currentSlide = ref(0);
const windowWidth = ref(0);
const autoSlideInterval = ref<number | null>(null);
const autoSlideEnabled = ref(true);

// จำนวนไอเท็มต่อหน้าจอตามขนาดหน้าจอ
const itemsPerPage = computed(() => {
    if (windowWidth.value < 768) return 1;
    if (windowWidth.value < 1024) return 2;
    return 4;
});

// คำนวณจำนวน slide สูงสุด
const maxSlide = computed(() => {
    return Math.max(0, Math.ceil(prizes.value.length / itemsPerPage.value) - 1);
});

// ฟังก์ชันเลื่อน carousel
const moveCarousel = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentSlide.value > 0) {
        currentSlide.value--;
    } else if (direction === 'right' && currentSlide.value < maxSlide.value) {
        currentSlide.value++;
    }
    
    // รีเซ็ต timer การเลื่อนอัตโนมัติเมื่อมีการเลื่อนด้วยตนเอง
    resetAutoSlide();
};

// เลื่อน slide อัตโนมัติ
const startAutoSlide = () => {
    if (autoSlideEnabled.value && prizes.value.length > itemsPerPage.value) {
        stopAutoSlide(); // ทำการ clear interval เดิมก่อน
        
        autoSlideInterval.value = window.setInterval(() => {
            if (currentSlide.value < maxSlide.value) {
                currentSlide.value++;
            } else {
                currentSlide.value = 0; // กลับไปยังสไลด์แรกเมื่อถึงสไลด์สุดท้าย
            }
        }, 5000); // เลื่อนทุก 5 วินาที
    }
};

// หยุดการเลื่อน slide อัตโนมัติ
const stopAutoSlide = () => {
    if (autoSlideInterval.value !== null) {
        clearInterval(autoSlideInterval.value);
        autoSlideInterval.value = null;
    }
};

// รีเซ็ตการเลื่อนอัตโนมัติ
const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
};

// สลับการเปิด/ปิดการเลื่อนอัตโนมัติ
const toggleAutoSlide = () => {
    autoSlideEnabled.value = !autoSlideEnabled.value;
    if (autoSlideEnabled.value) {
        startAutoSlide();
    } else {
        stopAutoSlide();
    }
};

// เพิ่มรางวัล
const addPrize = () => {
    if (newPrize.value.name && newPrize.value.quantity > 0) {
        prizes.value.push({ ...newPrize.value });
        
        // รีเซ็ตค่า
        newPrize.value = {
            name: '',
            quantity: 1,
            colorClass: 'bg-amber-300'
        };
        
        showAddPrizeModal.value = false;
        
        // เริ่ม auto slide เมื่อมีรางวัลมากกว่า itemsPerPage
        resetAutoSlide();
    }
};

// ลบรางวัล
const deletePrize = (index: number) => {
    prizes.value.splice(index, 1);
    
    // ปรับ currentSlide เมื่อลบรางวัลแล้วไม่มีรางวัลในหน้าปัจจุบัน
    if (currentSlide.value > maxSlide.value) {
        currentSlide.value = Math.max(0, maxSlide.value);
    }
    
    // หยุด auto slide ถ้าไม่มีรางวัลมากพอ
    if (prizes.value.length <= itemsPerPage.value) {
        stopAutoSlide();
    }
};

// แก้ไขรางวัล
const editPrize = (index: number) => {
    // อาจจะเพิ่มฟังก์ชันในอนาคต
    console.log('แก้ไขรางวัลที่', index);
};

// จำลองข้อมูลรางวัล
const mockPrizes = () => {
    prizes.value = [
        { name: 'iPhone 15 Pro', quantity: 1, colorClass: 'bg-red-500' },
        { name: 'iPad Pro', quantity: 2, colorClass: 'bg-blue-500' },
        { name: 'AirPods Pro', quantity: 5, colorClass: 'bg-green-500' },
        { name: 'MacBook Air', quantity: 1, colorClass: 'bg-purple-500' },
        { name: 'Apple Watch', quantity: 3, colorClass: 'bg-pink-500' },
        { name: 'บัตรของขวัญมูลค่า 1,000 บาท', quantity: 10, colorClass: 'bg-amber-300' }
    ];
};

// ติดตามการเปลี่ยนแปลงขนาดหน้าจอ
const handleResize = () => {
    windowWidth.value = window.innerWidth;
};

// ตรวจสอบการเปลี่ยนแปลงขนาดหน้าต่าง
onMounted(() => {
    // กำหนดค่าเริ่มต้นของขนาดหน้าจอเมื่อ component ถูกโหลด
    if (typeof window !== 'undefined') {
        windowWidth.value = window.innerWidth;
        window.addEventListener('resize', handleResize);
    } else {
        // ค่าเริ่มต้นสำหรับ SSR (Server-Side Rendering)
        windowWidth.value = 1024; // ค่า default สำหรับ desktop
    }
    
    mockPrizes(); // เรียกใช้ฟังก์ชันจำลองข้อมูลรางวัล
    
    // เริ่มการเลื่อนอัตโนมัติถ้ามีรางวัลมากกว่าที่แสดงในหน้าจอ
    startAutoSlide();
});

// เมื่อขนาดหน้าจอเปลี่ยน ให้ตรวจสอบว่า currentSlide ยังอยู่ในช่วงที่ถูกต้องไหม
watch(itemsPerPage, () => {
    if (currentSlide.value > maxSlide.value) {
        currentSlide.value = maxSlide.value;
    }
    
    // รีเซ็ต auto slide เมื่อขนาดหน้าจอเปลี่ยน
    resetAutoSlide();
});

// เมื่อจำนวนรางวัลเปลี่ยน
watch(() => prizes.value.length, (newLength) => {
    if (newLength > itemsPerPage.value) {
        startAutoSlide();
    } else {
        stopAutoSlide();
    }
});

// ทำความสะอาดเมื่อ component ถูกทำลาย
onBeforeUnmount(() => {
    stopAutoSlide();
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
    }
});
</script>

<template>
    <!-- ส่วนข้อมูลรางวัล -->
    <div class="card bg-base-100 w-full shadow-xl">
        <div class="card-body">
            <div class="flex justify-between items-center mb-4">
                <h2 class="card-title">รางวัล</h2>
                <div class="flex gap-2">
                    <!-- ปุ่มเปิด/ปิดการเลื่อนอัตโนมัติ -->
                    <button @click="toggleAutoSlide" class="btn btn-sm btn-circle" :class="autoSlideEnabled ? 'btn-success' : 'btn-outline'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="autoSlideEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path v-if="!autoSlideEnabled" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button @click="showAddPrizeModal = true" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        เพิ่มรางวัล
                    </button>
                </div>
            </div>

            <!-- รายการรางวัลแบบ Carousel -->
            <div v-if="prizes.length > 0" class="relative mb-4">
                <!-- ปุ่มเลื่อนซ้าย -->
                <button @click="moveCarousel('left')" 
                    class="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle bg-base-100 shadow-lg" 
                    v-show="currentSlide > 0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <!-- รายการรางวัล -->
                <div class="overflow-hidden">
                    <div class="flex transition-transform duration-300 ease-in-out"
                        :style="{ transform: `translateX(-${currentSlide * 100 / itemsPerPage}%)` }">
                        <div v-for="(prize, index) in prizes" :key="index" 
                            :style="{ flex: `0 0 ${100 / itemsPerPage}%` }" class="px-2">
                            <div
                                class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
                                <!-- ปุ่มลบรางวัล -->
                                <button @click="deletePrize(index)"
                                    class="absolute top-2 right-2 btn btn-sm btn-circle btn-error z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <!-- แถบสีด้านบนการ์ด -->
                                <div class="h-2 w-full" :class="prize.colorClass"></div>

                                <figure class="px-4 pt-4">
                                    <div v-if="prize.image" class="rounded-xl h-32 w-full">
                                        <img :src="prize.image" :alt="prize.name"
                                            class="rounded-xl object-contain h-32 mx-auto" />
                                    </div>
                                    <div v-else
                                        class="bg-base-300 rounded-xl flex items-center justify-center h-32 w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="h-12 w-12 text-base-content opacity-30" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </figure>

                                <div class="card-body p-4">
                                    <h3 class="font-bold text-center truncate">{{ prize.name }}</h3>
                                    <div class="badge badge-primary badge-outline mx-auto md:p-6 lg:p-2">จำนวน {{
                                        prize.quantity }} รางวัล</div>

                                    <div class="card-actions justify-end mt-2">
                                        <button @click="editPrize(index)"
                                            class="btn btn-sm btn-outline btn-info">แก้ไข</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- ปุ่มเลื่อนขวา -->
                <button @click="moveCarousel('right')" 
                    class="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle bg-base-100 shadow-lg"
                    v-show="currentSlide < maxSlide">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- ตัวแสดงสถานะการเล่นและจุดแสดงตำแหน่ง slide -->
            <div v-if="prizes.length > itemsPerPage" class="flex flex-col items-center gap-1 mt-2 mb-4">
                <div class="flex justify-center gap-1">
                    <button v-for="n in (maxSlide + 1)" :key="n" @click="currentSlide = n - 1" class="btn btn-xs btn-circle"
                        :class="currentSlide === n - 1 ? 'btn-primary' : 'btn-ghost'">
                    </button>
                </div>
                
                <!-- ตัวแสดงสถานะการเลื่อนอัตโนมัติ -->
                <div v-if="autoSlideEnabled" class="text-xs text-success mt-1">
                    <span>เลื่อนอัตโนมัติทุก 5 วินาที</span>
                </div>
            </div>

            <!-- ถ้าไม่มีรางวัล -->
            <div v-if="prizes.length === 0" class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>ยังไม่มีรางวัล กรุณาเพิ่มรางวัลอย่างน้อย 1 รายการ</span>
            </div>
        </div>
    </div>
    
    <!-- Modal เพิ่มรางวัล -->
    <div class="modal" :class="{ 'modal-open': showAddPrizeModal }">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">เพิ่มรางวัล</h3>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">ชื่อรางวัล</span>
                </label>
                <input v-model="newPrize.name" type="text" placeholder="ชื่อรางวัล" class="input input-bordered" />
            </div>
            <div class="form-control mt-2">
                <label class="label">
                    <span class="label-text">จำนวนรางวัล</span>
                </label>
                <input v-model="newPrize.quantity" type="number" min="1" placeholder="จำนวนรางวัล"
                    class="input input-bordered" />
            </div>
            <div class="form-control mt-2">
                <label class="label">
                    <span class="label-text">สีประจำรางวัล</span>
                </label>
                <select v-model="newPrize.colorClass" class="select select-bordered w-full">
                    <option value="bg-red-500">แดง</option>
                    <option value="bg-green-500">เขียว</option>
                    <option value="bg-blue-500">น้ำเงิน</option>
                    <option value="bg-amber-300">เหลือง</option>
                    <option value="bg-purple-500">ม่วง</option>
                    <option value="bg-pink-500">ชมพู</option>
                </select>
            </div>
            <div class="modal-action">
                <button @click="showAddPrizeModal = false" class="btn">ยกเลิก</button>
                <button @click="addPrize" class="btn btn-primary">เพิ่มรางวัล</button>
            </div>
        </div>
    </div>
</template>