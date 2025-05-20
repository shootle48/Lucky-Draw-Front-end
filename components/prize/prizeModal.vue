<script setup lang="ts">
import { ref, computed } from 'vue';
import type { prizeType } from '@/types/prize';

const prizeStore = usePrizeStore();
const { isLoading } = storeToRefs(prizeStore);

// สำหรับ Add Prize Modal
const imagePreview = ref<string | null>(null);
const addFileInput = ref<HTMLInputElement | null>(null);

// สำหรับ Edit Prize Modal
const showEditPrizeModal = ref(false);
const editingPrize = ref<prizeType | null>(null);
const editImagePreview = ref<string | null>(null);
const selectedEditImage = ref<File | null>(null);
const editFileInput = ref<HTMLInputElement | null>(null);

// Watch การเปลี่ยนแปลงของ selectedImage ใน store สำหรับ Add Modal
watch(() => prizeStore.selectedImage, (newImage) => {
    if (newImage) {
        imagePreview.value = URL.createObjectURL(newImage);
    } else {
        imagePreview.value = null;
    }
});

watch(() => prizeStore.showAddPrizeModal, (newVal) => {
    if (!newVal) {

        imagePreview.value = null
        prizeStore.selectedImage = null
        if (addFileInput.value) {
            addFileInput.value.value = ''
        }
    }
})

const isAddFormValid = computed(() => {
    return (
        prizeStore.newPrize.name.trim() !== '' &&
        Number(prizeStore.newPrize.quantity) > 0
    );
});

const isEditFormValid = computed(() => {
    return (
        editingPrize.value !== null &&
        editingPrize.value.name.trim() !== '' &&
        Number(editingPrize.value.quantity) > 0
    );
});


// Handle การเปลี่ยนรูปภาพสำหรับ Add Modal
const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        prizeStore.onImageChange(e);
    }
};

// ลบรูปภาพที่เลือกสำหรับ Add Modal
const removeImage = () => {
    imagePreview.value = null;
    prizeStore.selectedImage = null;
    // รีเซ็ต input file
    if (addFileInput.value) {
        addFileInput.value.value = '';
    }
};

// เปิด Edit Modal พร้อมข้อมูลรางวัลที่ต้องการแก้ไข
const openEditModal = (prize: prizeType) => {
    editingPrize.value = JSON.parse(JSON.stringify(prize)); // Deep copy
    // ตั้งค่ารูปภาพตัวอย่าง
    if (prize.image_url) {
        editImagePreview.value = typeof prize.image_url === 'string'
            ? prize.image_url
            : URL.createObjectURL(prize.image_url as File);
    } else {
        editImagePreview.value = null;
    }
    if (addFileInput.value) {
        addFileInput.value.value = '';
    }
    showEditPrizeModal.value = true;
};

// Handle การเปลี่ยนรูปภาพสำหรับ Edit Modal
const handleEditImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        selectedEditImage.value = target.files[0];
        editImagePreview.value = URL.createObjectURL(target.files[0]);

        if (editingPrize.value) {
            editingPrize.value.image = target.files[0];
        }
    }
};

// ลบรูปภาพที่เลือกสำหรับ Edit Modal
const removeEditImage = () => {
    editImagePreview.value = null;
    selectedEditImage.value = null;

    if (editingPrize.value) {
        editingPrize.value.image_url = ''; // เซ็ตให้เป็นสตริงว่างเพื่อแสดงผลในหน้า UI
        editingPrize.value.image = null;   // เพิ่มบรรทัดนี้เพื่อเตรียมส่งค่า null ไปยัง API
    }

    // รีเซ็ต input file
    if (editFileInput.value) {
        editFileInput.value.value = '';
    }
};

// บันทึกการแก้ไขรางวัล
const saveEditedPrize = async () => {
    if (!editingPrize.value) return;

    try {
        // ถ้ามีไฟล์รูปภาพใหม่
        if (selectedEditImage.value) {
            editingPrize.value.image = selectedEditImage.value;
        }

        // ส่งเฉพาะ prizeId และ editingPrize.value ซึ่งมีทั้ง image ใหม่หรือ null แล้ว
        await prizeStore.updatePrize(editingPrize.value.id as string, editingPrize.value);
        await prizeStore.fetchPrizes(prizeStore.newPrize.room_id);
        showEditPrizeModal.value = false;

        // รีเซ็ตหลังจากบันทึกเสร็จ
        editingPrize.value = null;
        selectedEditImage.value = null;
        editImagePreview.value = null;
        if (editFileInput.value) {
            editFileInput.value.value = ''; // reset file input
        }
    } catch (error) {
        console.error("Error saving edited prize:", error);
    }
};

// Export method สำหรับการเรียกใช้จาก component อื่น
defineExpose({
    openEditModal
});
</script>

<template>
    <!-- Modal เพิ่มรางวัล -->
    <div class="modal" :class="{ 'modal-open': prizeStore.showAddPrizeModal }">
        <div class="modal-box bg-[#ffffff] text-black/60 shadow-xl rounded-xl mx-auto flex flex-col gap-4">
            <h3 class="font-bold text-lg mb-4">เพิ่มรางวัล</h3>
            <!-- เพิ่มส่วนอัปโหลดรูปภาพ -->
            <div class="form-control mt-2">
                <label class="label">
                    <span class="label-text">รูปภาพรางวัล</span>
                </label>
                <div class="flex flex-col items-center">
                    <!-- แสดงรูปภาพตัวอย่าง ถ้ามีการเลือกรูป -->
                    <div class="flex justify-center mb-4 relative">
                        <div v-if="imagePreview"
                            class="w-60 h-60 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img :src="imagePreview" class="object-cover w-full h-full" />
                        </div>
                        <div v-else
                            class="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <div class="flex w-full gap-2">
                        <input ref="addFileInput" type="file" @change="handleImageChange" accept="image/*"
                            class="file-input file-input-bordered file-input-sm w-full text-black text-md bg-black/10" />
                        <button v-if="imagePreview" @click="removeImage" class="btn btn-sm btn-circle btn-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="form-control flex flex-col">
                <label class="label">
                    <span class="label-text">กรอกชื่อรางวัล</span>
                </label>
                <input v-model="prizeStore.newPrize.name" type="text" placeholder="ชื่อรางวัล"
                    class="input input-bordered w-full text-black bg-black/10" />
            </div>
            <div class="form-control mt-2 flex flex-col">
                <label class="label">
                    <span class="label-text">จำนวนรางวัล</span>
                </label>
                <input v-model="prizeStore.newPrize.quantity" type="number" min="1" placeholder="จำนวนรางวัล"
                    class="input input-bordered w-full text-black bg-black/10" />
            </div>

            <div class="modal-action flex justify-center gap-4">
                <!-- ปุ่มยกเลิก -->
                <button @click="prizeStore.showAddPrizeModal = false"
                    class="btn px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition duration-150">
                    ยกเลิก
                </button>

                <!-- ปุ่มเพิ่มรางวัล -->
                <button @click="prizeStore.addPrize" :disabled="!isAddFormValid || isLoading"
                    class="relative px-6 py-2 rounded-full bg-gradient-to-t from-[#ff8f00] to-[#ffd902] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
                    <span v-if="!isLoading">เพิ่มรางวัล</span>
                    <span v-else class="flex items-center gap-2">
                        <span class="loading loading-spinner loading-sm"></span>
                        กำลังเพิ่ม...
                    </span>
                </button>
            </div>

        </div>
    </div>

    <!-- Modal แก้ไขรางวัล -->
    <div class="modal" :class="{ 'modal-open': showEditPrizeModal }">
        <div class="modal-box bg-[#ffffff] text-black/60 shadow-xl rounded-xl mx-auto flex flex-col gap-4">
            <h3 class="font-bold text-lg mb-4">แก้ไขรางวัล</h3>

            <!-- อัปโหลดรูปภาพ -->
            <div class="form-control mt-2">
                <label class="label">
                    <span class="label-text">รูปภาพรางวัล</span>
                </label>
                <div class="flex flex-col items-center gap-2">
                    <div v-if="editImagePreview"
                        class="w-60 h-60 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img :src="editImagePreview" class="object-cover w-full h-full" />
                    </div>
                    <div v-else
                        class="w-60 h-60 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <div class="flex w-full gap-2">
                        <input ref="editFileInput" type="file" @change="handleEditImageChange" accept="image/*"
                            class="file-input file-input-bordered file-input-sm w-full text-black text-md bg-black/10" />
                        <button v-if="editImagePreview" @click="removeEditImage"
                            class="btn btn-sm btn-circle btn-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ฟอร์มชื่อรางวัล -->
            <div v-if="editingPrize" class="form-control flex flex-col">
                <label class="label">
                    <span class="label-text">ชื่อรางวัล</span>
                </label>
                <input v-model="editingPrize.name" type="text" placeholder="ชื่อรางวัล"
                    class="input input-bordered w-full text-black bg-black/10" />
            </div>

            <!-- ฟอร์มจำนวนรางวัล -->
            <div v-if="editingPrize" class="form-control mt-2 flex flex-col">
                <label class="label">
                    <span class="label-text">จำนวนรางวัล</span>
                </label>
                <input v-model="editingPrize.quantity" type="number" min="1" placeholder="จำนวนรางวัล"
                    class="input input-bordered w-full text-black bg-black/10" />
            </div>

            <!-- ปุ่ม -->
            <div class="modal-action flex justify-center gap-4">
                <!-- ปุ่มยกเลิก -->
                <button @click="showEditPrizeModal = false"
                    class="btn px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition duration-150">
                    ยกเลิก
                </button>

                <!-- ปุ่มบันทึก -->
                <button @click="saveEditedPrize" :disabled="!isEditFormValid || isLoading"
                    class="relative px-6 py-2 rounded-full bg-gradient-to-t from-[#ff8f00] to-[#ffd902] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
                    <span v-if="!isLoading">บันทึก</span>
                    <span v-else class="flex items-center gap-2">
                        <span class="loading loading-spinner loading-sm"></span>
                        กำลังบันทึก...
                    </span>
                </button>
            </div>
        </div>
    </div>

</template>