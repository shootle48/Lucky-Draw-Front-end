<script setup lang="ts">
import PrizeInfo from '@/components/drawRoom/PrizeInfo.vue'
import DrawConditions from '@/components/drawRoom/DrawConditions.vue'
import PlayerCard from '@/components/drawRoom/PlayerCard.vue'
import WinnerModal from '@/components/drawRoom/WinnerModal.vue'
const router = useRouter();

const isPrizeExhausted = computed(() => (prizeData.value?.quantity || 0) <= 0);

const {
  roomName,
  roomId,
  prizeData,
  filteredPlayers,
  drawQuantity,
  isDrawing,
  showWinnerModal,
  currentWinner,
  currentIndex,
  startDrawing,
  submitWinner,
  filterPositions,
  filterStatuses,
  isActiveLabel,
  statusMap,
  glowingIndexes,
  glowingTempIndex,
  isLoading,
  isFinished,
} = useDrawPage();

// แบ่งผู้เล่นเป็น 2 กลุ่มสำหรับแสดงซ้าย-ขวา
const leftPlayers = computed(() => {
  const halfLength = Math.ceil(filteredPlayers.value.length / 2);
  return filteredPlayers.value.slice(0, halfLength);
});

const rightPlayers = computed(() => {
  const halfLength = Math.ceil(filteredPlayers.value.length / 2);
  return filteredPlayers.value.slice(halfLength);
});

const isMobileView = ref(false)

const updateIsMobileView = () => {
  isMobileView.value = window.innerWidth <= 768;
};

onMounted(() => {
  updateIsMobileView();
  window.addEventListener('resize', updateIsMobileView);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobileView);
});

</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-10">

    <div v-if="isDrawing" class="overlay">
      <LoadingPage />
    </div>
    <div v-else-if="isLoading" class="overlay">
      <LoadingPage />
    </div>

    <div class="text-center text-black space-y-4 m-4">
      <!-- Template ส่วนแสดงผู้เล่น -->
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 🧠 ถ้า mobile: แสดงผู้เล่นทุกคนรวม -->
        <!-- 🧠 ถ้า mobile: แสดงผู้เล่นทั้งหมดรวมกัน -->
        <div v-if="isMobileView" class="w-full space-y-6">
          <div>
            <h3 class="text-xl mb-4">ผู้เล่น ({{ filteredPlayers.length }} คน)</h3>
            <div class="w-full px-4 mb-4">
              <PrizeInfo :prizeData="prizeData" :drawQuantity="drawQuantity" :isDrawing="isDrawing"
                @startDrawing="startDrawing" />
              <DrawConditions :isActiveLabel="isActiveLabel" :filterPositions="filterPositions"
                :filterStatuses="filterStatuses" :statusMap="statusMap" :drawQuantity="drawQuantity" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <PlayerCard v-for="(player, index) in filteredPlayers" :key="player.member_id" :player="player"
                :index="index" :glowingIndexes="glowingIndexes" :glowingTempIndex="glowingTempIndex"
                :isDrawing="isDrawing" />
            </div>
          </div>

        </div>


        <!-- 🖥️ ถ้า desktop: แบ่งซ้าย-ขวา -->
        <template v-else>
          <!-- ซ้าย -->
          <div class="w-full md:w-1/3">
            <h3 class="text-xl mb-4">ผู้เล่น ({{ leftPlayers.length }} คน)</h3>
            <div class="grid grid-cols-3 gap-4">
              <PlayerCard v-for="(player, index) in leftPlayers" :key="player.member_id" :player="player" :index="index"
                :glowingIndexes="glowingIndexes" :glowingTempIndex="glowingTempIndex" :isDrawing="isDrawing" />
            </div>
          </div>

          <!-- กลาง -->
          <div class="w-full md:w-1/3 p-4">
            <div class="sticky top-4">
              <PrizeInfo :prizeData="prizeData" :drawQuantity="drawQuantity" :isDrawing="isDrawing"
                @startDrawing="startDrawing" />
              <DrawConditions :isActiveLabel="isActiveLabel" :filterPositions="filterPositions"
                :filterStatuses="filterStatuses" :statusMap="statusMap" :drawQuantity="drawQuantity" />
            </div>
          </div>

          <!-- ขวา -->
          <div class="w-full md:w-1/3">
            <h3 class="text-xl mb-4">ผู้เล่น ({{ rightPlayers.length }} คน)</h3>
            <div class="grid grid-cols-3 gap-4">
              <PlayerCard v-for="(player, index) in rightPlayers" :key="player.member_id" :player="player"
                :index="index + leftPlayers.length" :glowingIndexes="glowingIndexes"
                :glowingTempIndex="glowingTempIndex" :isDrawing="isDrawing" />
            </div>
          </div>
        </template>
      </div>

    </div>

    <WinnerModal v-if="showWinnerModal && currentWinner" :currentWinner="currentWinner" :currentIndex="currentIndex"
      :prizeData="prizeData" @submitWinner="submitWinner" />

    <!-- ❌ เมื่อรางวัลหมด หรือสุ่มครบแล้ว -->
    <div v-if="(isPrizeExhausted || isFinished) && !isLoading"
      class="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-130 text-white">
      <div class="backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-2xl border-4 border-red-300">
        <div class="text-4xl text-white font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text mb-3">
          {{ isPrizeExhausted ? 'รางวัลหมดแล้ว' : 'สุ่มครบตามจำนวนแล้ว' }}
        </div>
        <div class="w-full h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4"></div>
        <button @click="router.push(`/mainPage/${roomId}`)"
          class="relative overflow-hidden px-10 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 
                       text-white text-xl font-bold rounded-2xl shadow-2xl 
                       border-4 border-white/50
                       hover:scale-110 hover:shadow-3xl 
                       transform transition-all duration-300 ease-out
                       before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                       before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 cursor-pointer">
          <span class="relative z-10 flex items-center gap-3">
            กลับไปเลือกของรางวัล
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.card.glow {
  animation: glow 0.4s ease-in-out infinite alternate;
  z-index: 110;
  position: relative;
}

.card.glow-temp {
  animation: glow 0.3s ease-in-out infinite alternate;
  border: 2px dashed #ff9800;
  z-index: 120;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px #00ffe1;
    transform: scale(1.02);
  }

  to {
    box-shadow: 0 0 25px #ff00c8;
    transform: scale(1.07);
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(1px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>