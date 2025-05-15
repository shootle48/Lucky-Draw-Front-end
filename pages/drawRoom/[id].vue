<template>
  <div class="text-center space-y-4">
    <h2 class="text-2xl font-bold">ห้อง: {{ roomName }}</h2>

    <div class="flex flex-col md:flex-row gap-4">
      <!-- ส่วนที่ 1: กลุ่มผู้เล่นด้านซ้าย -->
      <div class="w-full md:w-1/3">
        <h3 class="text-xl mb-4">ผู้เล่น ({{ leftPlayers.length }} คน)</h3>
        <div class="grid grid-cols-4 gap-4">
          <PlayerCard 
            v-for="(player, index) in leftPlayers" 
            :key="player.member_id" 
            :player="player" 
            :index="index"
            :glowingIndexes="glowingIndexes" 
            :glowingTempIndex="glowingTempIndex" 
            :isDrawing="isDrawing" 
          />
        </div>
      </div>

      <!-- ส่วนที่ 2: ข้อมูลรางวัลและเงื่อนไขตรงกลาง -->
      <div class="w-full md:w-1/3 bg-yellow-50 rounded-lg p-4 shadow-md">
        <div class="sticky top-4">
          <PrizeInfo 
            :prizeData="prizeData" 
            :drawQuantity="drawQuantity" 
            :isDrawing="isDrawing"
            @startDrawing="startDrawing" 
          />

          <DrawConditions 
            :isActiveLabel="isActiveLabel" 
            :filterPositions="filterPositions"
            :filterStatuses="filterStatuses" 
            :statusMap="statusMap" 
            :drawQuantity="drawQuantity" 
          />
        </div>
      </div>

      <!-- ส่วนที่ 3: กลุ่มผู้เล่นด้านขวา -->
      <div class="w-full md:w-1/3">
        <h3 class="text-xl mb-4">ผู้เล่น ({{ rightPlayers.length }} คน)</h3>
        <div class="grid grid-cols-4 gap-4">
          <PlayerCard 
            v-for="(player, index) in rightPlayers" 
            :key="player.member_id" 
            :player="player" 
            :index="index + leftPlayers.length"
            :glowingIndexes="glowingIndexes" 
            :glowingTempIndex="glowingTempIndex" 
            :isDrawing="isDrawing" 
          />
        </div>
      </div>
    </div>
  </div>

  <WinnerModal 
    v-if="showWinnerModal && currentWinner" 
    :currentWinner="currentWinner" 
    :currentIndex="currentIndex"
    :prizeData="prizeData" 
    @submitWinner="submitWinner" 
  />

  <!-- ❌ เมื่อรางวัลหมด หรือสุ่มครบแล้ว -->
  <div 
    v-if="(isPrizeExhausted || isFinished) && !isLoading"
    class="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[100] text-white"
  >
    <div class="text-2xl font-bold mb-4">
      🎁 {{ isPrizeExhausted ? 'รางวัลหมดแล้ว' : 'สุ่มครบตามจำนวนแล้ว' }}
    </div>
    <button class="btn btn-accent" @click="router.push(`/mainPage/${roomId}`)">
      🔙 กลับไปเลือกของรางวัล
    </button>
  </div>

  <div v-if="isDrawing" class="overlay z-40">
    <LoadingPage />
  </div>
</template>

<script setup lang="ts">
import PrizeInfo from '@/components/drawRoom/PrizeInfo.vue'
import DrawConditions from '@/components/drawRoom/DrawConditions.vue'
import PlayerCard from '@/components/drawRoom/PlayerCard.vue'
import WinnerModal from '@/components/drawRoom/WinnerModal.vue'
import LoadingPage from '@/components/LoadingPage.vue'
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
</script>

<style>
.card.glow {
    animation: glow 0.4s ease-in-out infinite alternate;
    z-index: 60;
    position: relative;
}

.card.glow-temp {
    animation: glow 0.3s ease-in-out infinite alternate;
    border: 2px dashed #ff9800;
    z-index: 50;
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
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>