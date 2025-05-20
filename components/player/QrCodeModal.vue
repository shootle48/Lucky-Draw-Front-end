<template>
  <dialog ref="dialogRef" class="modal modal-open bg-[#00000000] backdrop-blur-sm">
    <div class="modal-box bg-rose-100 shadow-accent text-center">
      <h3 class="font-bold text-lg mb-4 text-black">QR Code สำหรับฟอร์ม</h3>

      <!-- แสดง QR ถ้ามีลิงก์ -->
      <div v-if="localLink" class="bg-white rounded-lg p-4 shadow-md w-fit mx-auto">
        <qrcode-vue :value="localLink" :size="200" class="mx-auto" foreground="#f34183" background="#ffffff00" />
        <!-- <p class="mt-2 text-sm break-words">{{ localLink }}</p> -->
      </div>

      <!-- input สำหรับใส่ลิงก์ -->
      <input type="text" v-model="localLink" placeholder="https://example.com/form"
        class="input input-bordered w-full mt-4 bg-rose-300 text-black" />

      <div class="modal-action justify-between items-center mt-6">

        <button @click="confirmLink"
          class="btn h-fit bg-gradient-to-t from-[#3fc028] to-[#5ee746] px-1 py-0.5 border-0 rounded-[2rem] w-fit text-white shadow-black shadow-sm">
          <div class="bg-[#3fc028] rounded-[2rem] px-2 py-0.5 text-sm md:text-md font-medium flex items-center gap-1">
            <p class="drop-shadow-lg">ตกลง</p>
          </div>
        </button>

        <button @click="closeModal" class=" btn h-fit bg-gradient-to-t from-[#c02828] to-[#e74646] px-1 py-0.5 border-0 rounded-[2rem] w-fit
          text-white shadow-black shadow-sm">
          <div class="bg-[#c02828] rounded-[2rem] px-2 py-0.5 text-sm md:text-md font-medium flex items-center gap-1">
            <p class="drop-shadow-lg">ปิด</p>
          </div>
        </button>

        <!-- <button class="btn btn-error text-white btn-sm" @click="closeModal">ปิด</button> -->
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{ link: string }>()
const emit = defineEmits(['close', 'update:link'])

const localLink = ref(props.link)

watch(() => props.link, (newVal) => {
  localLink.value = newVal
})

const closeModal = () => {
  emit('close')
}

const confirmLink = () => {
  emit('update:link', localLink.value)
  emit('close')
}
</script>

<style scoped></style>
