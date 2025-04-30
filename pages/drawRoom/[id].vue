<script setup lang="ts">
import PrizeInfo from '@/components/drawRoom/PrizeInfo.vue'
import DrawConditions from '@/components/drawRoom/DrawConditions.vue'
import PlayerGrid from '@/components/drawRoom/PlayerGrid.vue'
import WinnerModal from '@/components/drawRoom/WinnerModal.vue'
const {
    roomName,
    prizeData,
    filteredPlayers,
    drawQuantity,
    isDrawing,
    showWinnerModal,
    currentWinner,
    startDrawing,
    submitWinner,
    filterPositions,
    filterStatuses,
    isActiveLabel,
    statusMap,
    glowingIndexes,
    glowingTempIndex,
} = useDrawPage()
</script>



<template>
    <div v-if="isDrawing" class="overlay">
        <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div class="text-center space-y-4">
        <h2 class="text-2xl font-bold">ห้อง: {{ roomName }}</h2>

        <PrizeInfo :prizeData="prizeData" :drawQuantity="drawQuantity" :isDrawing="isDrawing"
            @startDrawing="startDrawing" />

        <DrawConditions :isActiveLabel="isActiveLabel" :filterPositions="filterPositions"
            :filterStatuses="filterStatuses" :statusMap="statusMap" :drawQuantity="drawQuantity" />

        <PlayerGrid v-if="filteredPlayers.length > 0" :players="filteredPlayers" :glowingIndexes="glowingIndexes"
            :glowingTempIndex="glowingTempIndex" :isDrawing="isDrawing" />
        <div v-else-if="!isLoading" class="text-center text-gray-500 mt-6">
            ไม่พบผู้เล่นที่ตรงตามเงื่อนไข
        </div>
    </div>

    <WinnerModal v-if="showWinnerModal && currentWinner" :currentWinner="currentWinner" :currentIndex="currentIndex"
        :prizeData="prizeData" @submitWinner="submitWinner" />
</template>

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
    /* ให้ต่ำกว่าการ์ด */
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
