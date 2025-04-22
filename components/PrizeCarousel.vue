<script setup lang="ts">
import type { prizeType } from '@/types/prize';

const prizeStore = usePrizeStore();
const carouselStore = useCarouselStore();
const route = useRoute();
const { isLoading } = storeToRefs(prizeStore);
const currentRoomId = route.params.id as string;
const editingPrize = ref<prizeType | null>(null);
const showEditPrizeModal = ref(false);
const editImagePreview = ref<string | null>(null);
prizeStore.newPrize.room_id = currentRoomId;

// เริ่มการทำงานของ carousel เมื่อ component ถูกโหลด
onMounted(() => {
  carouselStore.setupCarousel();
});

const props = defineProps<{
  prizes: prizeType[];
}>();

const openEditModal = (prize: prizeType) => {
  // Create a copy of the prize to edit
  editingPrize.value = JSON.parse(JSON.stringify(prize));
  showEditPrizeModal.value = true;

  // Show image preview if available
  if (prize.image) {
    editImagePreview.value = getImageSrc(prize.image);
  }
};
const imagePreview = ref<string | null>(null);
const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target?.files?.[0];

  if (!file) return;

  // ตรวจสอบว่าเป็นรูปภาพ
  if (!file.type.startsWith("image/")) {
    alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
    return;
  }

  // ตรวจสอบขนาด (ไม่เกิน 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("ไฟล์มีขนาดใหญ่เกินไป กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 5MB");
    return;
  }

  // สร้าง preview ใหม่ (และ clear ตัวเก่า)
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = URL.createObjectURL(file);

  // ✅ กำหนดรูปใน store (ถ้าใช้ Pinia)
  const prizeStore = usePrizeStore();
  prizeStore.selectedImage = file;

  // ✅ หากกำลังแก้ไข ให้เก็บไว้ใน editingPrize ด้วย
  if (editingPrize.value) {
    editingPrize.value.image = file;
  }
};

const saveEditedPrize = async () => {
  if (!editingPrize.value) return;

  try {
    const prizeId = editingPrize.value.id as string;
    const updatedData = {
      name: editingPrize.value.name,
      quantity: editingPrize.value.quantity,
      image: editingPrize.value.image,
      room_id: editingPrize.value.room_id,
    };

    await prizeStore.updatePrize(prizeId, updatedData);
    showEditPrizeModal.value = false;
  } catch (error) {
    console.error("Error updating prize:", error);
  }
};

// ฟังก์ชันลบรูปภาพ
const removeEditImage = () => {
  if (editImagePreview.value) {
    URL.revokeObjectURL(editImagePreview.value);
  }

  editImagePreview.value = null;
  if (editingPrize.value) {
    editingPrize.value.image = null;
  }

  const fileInput = document.querySelector('.edit-form input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

const getImageSrc = (image: string | File | null): string => {
  if (!image) return "";
  if (typeof image === "string") return image; // ✅ image_url จาก backend
  return URL.createObjectURL(image); // ✅ สำหรับ preview ก่อนบันทึก
};


// รีเซ็ตรูปภาพเมื่อปิด modal
watch(showEditPrizeModal, (isOpen) => {
  if (!isOpen && editImagePreview.value) {
    URL.revokeObjectURL(editImagePreview.value);
    editImagePreview.value = null;
  }
});
</script>

<template>
  <!-- ส่วนข้อมูลรางวัล -->
  <div class="card bg-base-100 w-full shadow-xl">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-3xl">รางวัล</h2>
        <div class="flex gap-2">
          <!-- ปุ่มเปิด/ปิดการเลื่อนอัตโนมัติ -->
          <button @click="carouselStore.toggleAutoSlide" class="btn btn-sm btn-circle"
            :class="carouselStore.autoSlideEnabled ? 'btn-success' : 'btn-outline'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path v-if="carouselStore.autoSlideEnabled" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path v-if="!carouselStore.autoSlideEnabled" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button @click="prizeStore.showAddPrizeModal = true" class="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            เพิ่มรางวัล
          </button>
        </div>
      </div>

      <!-- รายการรางวัลแบบ Carousel -->
      <div v-if="props.prizes.length > 0" class="relative mb-4">
        <!-- ปุ่มเลื่อนซ้าย -->
        <button @click="carouselStore.moveCarousel('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle bg-base-100 shadow-lg"
          v-show="carouselStore.currentSlide > 0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- รายการรางวัล -->
        <div class="overflow-hidden">
          <div class="flex transition-transform duration-300 ease-in-out"
            :style="{ transform: `translateX(-${carouselStore.currentSlide * 100 / carouselStore.itemsPerPage}%)` }">
            <div v-for="(prize, index) in props.prizes" :key="index"
              :style="{ flex: `0 0 ${100 / carouselStore.itemsPerPage}%` }" class="px-2">
              <div
                class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
                <!-- ปุ่มลบรางวัล -->
                <button @click="prizeStore.deletePrize(prize.id as string)"
                  class="absolute top-2 right-2 btn btn-sm btn-circle btn-error z-10" :disabled="isLoading">
                  <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span v-else class="loading loading-spinner loading-xs"></span>
                </button>

                <!-- แถบสีด้านบนการ์ด -->
                <div class="h-2 w-full bg-primary"></div>

                <figure class="px-4 pt-4">

                  <img v-if="prize.image" :src="getImageSrc(prize.image)" :alt="prize.name"
                    class="rounded-xl object-contain h-32 mx-auto" />

                  <div v-else class="bg-base-300 rounded-xl flex items-center justify-center h-32 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content opacity-30" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </figure>

                <div class="card-body p-4">
                  <h3 class="font-bold text-center truncate">{{ prize.name }}</h3>
                  <div class="badge badge-primary badge-outline mx-auto">
                    จำนวน {{ prize.quantity }} รางวัล
                  </div>

                  <div class="card-actions justify-end mt-2">
                    <button @click="openEditModal(prize)" class="btn btn-sm btn-outline btn-info">แก้ไข</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ปุ่มเลื่อนขวา -->
        <button @click="carouselStore.moveCarousel('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle bg-base-100 shadow-lg"
          v-show="carouselStore.currentSlide < carouselStore.maxSlide">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- ตัวแสดงสถานะการเล่นและจุดแสดงตำแหน่ง slide -->
      <div v-if="props.prizes.length > carouselStore.itemsPerPage" class="flex flex-col items-center gap-1 mt-2 mb-4">
        <div class="flex justify-center gap-1">
          <button v-for="n in (carouselStore.maxSlide + 1)" :key="n" @click="carouselStore.currentSlide = n - 1"
            class="btn btn-xs btn-circle" :class="carouselStore.currentSlide === n - 1 ? 'btn-primary' : 'btn-ghost'">
          </button>
        </div>

        <!-- ตัวแสดงสถานะการเลื่อนอัตโนมัติ -->
        <div v-if="carouselStore.autoSlideEnabled" class="text-xs text-success mt-1">
          <span>เลื่อนอัตโนมัติทุก 5 วินาที</span>
        </div>
      </div>

      <!-- ถ้าไม่มีรางวัล -->
      <div v-if="props.prizes.length === 0" class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>ยังไม่มีรางวัล กรุณาเพิ่มรางวัลอย่างน้อย 1 รายการ</span>
      </div>
    </div>
  </div>

  <!-- Modal เพิ่มรางวัล -->
  <div class="modal" :class="{ 'modal-open': prizeStore.showAddPrizeModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">เพิ่มรางวัล</h3>
      <div class="form-control flex flex-col">
        <label class="label">
          <span class="label-text">ชื่อรางวัล</span>
        </label>
        <input v-model="prizeStore.newPrize.name" type="text" placeholder="ชื่อรางวัล"
          class="input input-bordered w-full" />
      </div>
      <div class="form-control mt-2 flex flex-col">
        <label class="label">
          <span class="label-text">จำนวนรางวัล</span>
        </label>
        <input v-model="prizeStore.newPrize.quantity" type="number" min="1" placeholder="จำนวนรางวัล"
          class="input input-bordered w-full" />
      </div>

      <!-- เพิ่มส่วนอัปโหลดรูปภาพ -->
      <div class="form-control mt-2">
        <label class="label">
          <span class="label-text">รูปภาพรางวัล</span>
        </label>
        <div class="flex flex-col items-center gap-2">
          <!-- แสดงรูปภาพตัวอย่าง ถ้ามีการเลือกรูป -->
          <div v-if="imagePreview"
            class="w-full h-40 bg-base-300 rounded-lg flex items-center justify-center overflow-hidden">
            <img :src="imagePreview" class="object-contain max-h-full" />
          </div>
          <div v-else class="w-full h-40 bg-base-300 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-18 w-18 text-base-content opacity-30" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div class="flex w-full gap-2">
            <input type="file" @change="handleImageChange" accept="image/*"
              class="file-input file-input-bordered file-input-sm w-full" />
            <button v-if="imagePreview" @click="removeEditImage" class="btn btn-sm btn-circle btn-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button @click="prizeStore.showAddPrizeModal = false" class="btn">ยกเลิก</button>
        <button @click="prizeStore.addPrize" class="btn btn-primary">เพิ่มรางวัล</button>
      </div>
    </div>
  </div>

  <!-- Modal แก้ไขรางวัล -->
  <div class="modal" :class="{ 'modal-open': showEditPrizeModal }">
    <div class="modal-box edit-form">
      <h3 class="font-bold text-lg mb-4">แก้ไขรางวัล</h3>
      <div v-if="editingPrize" class="form-control flex flex-col">
        <label class="label">
          <span class="label-text">ชื่อรางวัล</span>
        </label>
        <input v-model="editingPrize.name" type="text" placeholder="ชื่อรางวัล" class="input input-bordered w-full" />
      </div>
      <div v-if="editingPrize" class="form-control mt-2 flex flex-col">
        <label class="label">
          <span class="label-text">จำนวนรางวัล</span>
        </label>
        <input v-model="editingPrize.quantity" type="number" min="1" placeholder="จำนวนรางวัล"
          class="input input-bordered w-full" />
      </div>

      <!-- ส่วนอัปโหลดรูปภาพสำหรับการแก้ไข -->
      <div class="form-control mt-2">
        <label class="label">
          <span class="label-text">รูปภาพรางวัล</span>
        </label>
        <div class="flex flex-col items-center gap-2">
          <!-- แสดงรูปภาพตัวอย่าง ถ้ามีการเลือกรูป -->
          <div v-if="editImagePreview"
            class="w-full h-40 bg-base-300 rounded-lg flex items-center justify-center overflow-hidden">
            <img :src="editImagePreview" class="object-contain max-h-full" />
          </div>
          <div v-else class="w-full h-40 bg-base-300 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-18 w-18 text-base-content opacity-30" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div class="flex w-full gap-2">
            <input type="file" @change="handleImageChange" accept="image/*"
              class="file-input file-input-bordered file-input-sm w-full" />
            <button v-if="editImagePreview" @click="removeEditImage" class="btn btn-sm btn-circle btn-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button @click="showEditPrizeModal = false" class="btn">ยกเลิก</button>
        <button @click="saveEditedPrize" class="btn btn-primary" :disabled="isLoading">
          <span v-if="!isLoading">บันทึก</span>
          <span v-else class="loading loading-spinner loading-sm"></span>
        </button>
      </div>
    </div>
  </div>

  <LoadingPage v-if="isLoading" />
</template>