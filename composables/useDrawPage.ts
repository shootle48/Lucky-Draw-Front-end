// composables/useDrawPage.ts
export function useDrawPage() {
  const route = useRoute();
  const drawStore = useDrawStore();
  const playerStore = usePlayerStore();
  const prizeStore = usePrizeStore();
  const drawConditionStore = useDrawConditionStore();
  const winnerStore = useWinnerStore();

  const { rooms } = storeToRefs(playerStore);
  const { prize, isLoading } = storeToRefs(prizeStore);
  const { drawConditions } = storeToRefs(drawConditionStore);

  const roomName = computed(() => rooms.value?.name || "ไม่พบชื่อห้อง");
  const roomId = computed(() => rooms.value?.id || "");
  const prizeData = computed(() => prize.value);
  const filteredPlayers = computed(() => drawConditions.value || []);
  const drawConditionID = route.params.id as string;
  const drawCondition = computed(() => drawStore.drawConditions);
  const drawQuantity = computed(() => drawCondition.value?.quantity || 1);

  const isDrawing = ref(false);
  const showWinnerModal = ref(false);
  const drawnWinners = ref<any[]>([]);
  const currentIndex = ref(0);
  const glowingTempIndex = ref<number | null>(null);
  const glowingIndexes = ref<number[]>([]);
  const remainingPlayers = ref<any[]>([]);
  const isFinished = ref(false); // ✅ เพิ่มตรงนี้

  // เพิ่มตัวแปรเก็บ ID ของผู้เล่นที่เคยถูกสุ่มแล้ว
  const drawnPlayerIds = ref<Set<number | string>>(new Set());

  const currentWinner = computed(
    () => drawnWinners.value[currentIndex.value] || null
  );

  const statusMap: Record<string, { label: string; color: string }> = {
    not_received: { label: "ยังไม่ได้รางวัล", color: "badge-warning" },
    received: { label: "ได้รับรางวัลแล้ว", color: "badge-success" },
    waive: { label: "สละสิทธิ์", color: "badge-error" },
  };

  const filterPositions = computed(
    () => drawCondition.value?.filter_position || []
  );
  const filterStatuses = computed(
    () => drawCondition.value?.filter_status || []
  );
  const isActiveLabel = computed(() =>
    drawCondition.value?.filter_is_active
      ? "เฉพาะผู้เข้าร่วม"
      : "ผู้เล่นทั้งหมด"
  );

  const startDrawing = async () => {
    if (filteredPlayers.value.length === 0 || isDrawing.value) return;
    if (drawQuantity.value > filteredPlayers.value.length) {
      alert("จำนวนผู้เล่นไม่พอสำหรับสุ่มรางวัล");
      return;
    }

    isFinished.value = false; // ✅ Reset ตอนเริ่มสุ่มใหม่
    isDrawing.value = true;

    isDrawing.value = true;
    drawnWinners.value = [];
    glowingIndexes.value = [];
    currentIndex.value = 0;
    // รีเซ็ต drawnPlayerIds เมื่อเริ่มสุ่มใหม่
    drawnPlayerIds.value.clear();

    // กรองผู้เล่นที่ยังไม่เคยถูกสุ่มเป็นผู้โชคดี
    remainingPlayers.value = [...filteredPlayers.value];

    await drawNextRound();
  };

  const drawNextRound = async () => {
    const isLastAutoAssign =
      drawQuantity.value === filteredPlayers.value.length &&
      drawnWinners.value.length === drawQuantity.value - 1 &&
      remainingPlayers.value.length === 1;

    if (isLastAutoAssign) {
      const selected = remainingPlayers.value.splice(0, 1)[0];
      drawnPlayerIds.value.add(selected.id);
      drawnWinners.value.push(selected);

      currentIndex.value = drawnWinners.value.length - 1; // 🧠 อัปเดตให้ currentWinner ทำงานถูกต้อง
      glowingIndexes.value.push(selected.id);
      glowingTempIndex.value = null;

      console.log(
        `🎯 ผู้โชคดีคนสุดท้าย: ${selected.first_name} ${selected.last_name} (ไม่ต้องสุ่ม)`
      );

      setTimeout(() => {
        showWinnerModal.value = true;
        isDrawing.value = false;
      }, 500);

      return;
    }

    // 🌀 กรณีทั่วไป: ทำการสุ่ม
    let speed = 60;
    let count = 0;
    const maxCount = 20;

    const loop = () => {
      glowingTempIndex.value = Math.floor(
        Math.random() * remainingPlayers.value.length
      );
      count++;

      if (count < maxCount) {
        speed += 30;
        setTimeout(loop, speed);
      } else {
        const finalIndex = Math.floor(
          Math.random() * remainingPlayers.value.length
        );
        const selected = remainingPlayers.value.splice(finalIndex, 1)[0];

        drawnPlayerIds.value.add(selected.id);
        drawnWinners.value.push(selected);

        currentIndex.value = drawnWinners.value.length - 1;
        glowingIndexes.value.push(selected.id);
        glowingTempIndex.value = null;

        console.log(
          `🎯 ผู้โชคดีลำดับที่ ${drawnWinners.value.length}: ${selected.first_name} ${selected.last_name}`
        );

        setTimeout(() => {
          showWinnerModal.value = true;
          isDrawing.value = false;
        }, 500);
      }
    };

    loop();
  };

  const submitWinner = async (status: "received" | "waive") => {
    const winner = currentWinner.value;
    if (!winner) return;

    const payload = {
      room_id: drawCondition.value?.room_id,
      player_id: winner.id,
      prize_id: drawCondition.value?.prize_id,
      quantity: 1,
      draw_condition_id: drawConditionID,
      player_status: status,
    };

    await winnerStore.createWinner(payload);
    console.log("📦 ส่งข้อมูลผู้โชคดี:", payload);
    showWinnerModal.value = false;

    // ตรวจสอบว่าต้องสุ่มคนถัดไปหรือไม่
    if (drawnWinners.value.length < drawQuantity.value) {
      // ยังสุ่มไม่ครบตามจำนวน - ทำการสุ่มคนถัดไป

      // กรองผู้เล่นที่ยังไม่เคยถูกสุ่มก่อนสุ่มรอบถัดไป
      remainingPlayers.value = filteredPlayers.value.filter(
        (player) => !drawnPlayerIds.value.has(player.id)
      );

      // ตรวจสอบว่ายังมีผู้เล่นเหลือพอที่จะสุ่มต่อไปหรือไม่
      if (remainingPlayers.value.length === 0) {
        alert("ไม่มีผู้เล่นเหลือสำหรับสุ่มรางวัลแล้ว");
        return;
      }

      isDrawing.value = true;
      setTimeout(() => drawNextRound(), 500);
    } else {
      // สุ่มครบตามจำนวนแล้ว - แสดงข้อความสุ่มครบ
      isFinished.value = true;
    }
  };

  onMounted(async () => {
    await drawStore.fetchDrawData(drawConditionID);
    const {
      room_id,
      prize_id,
      filter_status,
      filter_position,
      filter_is_active,
    } = drawStore.drawConditions;

    if (room_id) await playerStore.fetchRoom(room_id);
    if (prize_id) await prizeStore.getPrize(prize_id);

    if (filter_status?.length && filter_position?.length) {
      await drawConditionStore.fetchDrawConditions(
        room_id,
        filter_status,
        filter_position,
        filter_is_active
      );
      console.log(drawConditionStore.drawConditions);
    } else {
      drawConditionStore.drawConditions = [];
    }
  });

  return {
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
  };
}
