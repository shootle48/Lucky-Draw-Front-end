<template>
    <div>
        hello prizeChoose
        <div>
            {{ roomData.id }}
            <br>
            {{ roomData.name }}
        </div>
        <PrizeCard v-if="prizeData" :prize="prizeData" :handleEditPrize="() => {}" />
        <div>
            <ul v-for="player in playerData" :id="player.member_id">
                <li> {{ player.prefix }}</li>
                <li>{{ player.firstName }} {{ player.lastName }}</li>
                <li>{{ player.member_id }}</li>
                <li> {{ player.position }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const playerStore = usePlayerStore()
const prizeStore = usePrizeStore()
const roomId = route.params.roomId;
const prizeId = route.params.prizeId;

const roomData = playerStore.rooms
const playerData = playerStore.players
const { prize: prizeData } = storeToRefs(prizeStore);



onMounted(async () => {
    await playerStore.fetchRoom(roomId as string)
    await playerStore.fetchPlayers(roomId as string)
    await prizeStore.getPrize(prizeId as string)
    console.log(prizeData)
})

</script>

<style lang="scss" scoped></style>