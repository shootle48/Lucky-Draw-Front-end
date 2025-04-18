<template>
    <!-- ส่วนข้อมูลรางวัล -->
    <div class="card bg-base-100 w-full shadow-xl">
        <div class="card-body">
            <div class="flex justify-between items-center mb-4">
                <h2 class="card-title">รางวัล</h2>
                <button @click="" class="btn btn-primary btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    เพิ่มรางวัล
                </button>
            </div>

            <!-- รายการรางวัลแบบการ์ด -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div
                    class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden   -w-full">
                    <!-- ปุ่มลบรางวัล -->
                    <button  class="absolute top-2 right-2 btn btn-sm btn-circle btn-error z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- แถบสีด้านบนการ์ด -->
                    <div class="h-2 w-full bg-amber-300" ></div>

                    <figure class="px-4 pt-4">
                        <!-- <img  alt="รูปรางวัล"
                            class="rounded-xl object-contain h-32 mx-auto" /> -->
                        <div class="bg-base-300 rounded-xl flex items-center justify-center h-32 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content opacity-30"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </figure>

                    <div class="card-body p-4">
                        <h3 class="font-bold text-center truncate"> </h3>
                        <div class="badge badge-primary badge-outline mx-auto md:p-6 lg:p-2">จำนวน 8 รางวัล</div>

                        <div class="card-actions justify-end mt-2">
                            <button  class="btn btn-sm btn-outline btn-info">แก้ไข</button>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden min-w-full">
                    <!-- ปุ่มลบรางวัล -->
                    <button  class="absolute top-2 right-2 btn btn-sm btn-circle btn-error z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- แถบสีด้านบนการ์ด -->
                    <div class="h-2 w-full bg-amber-300" ></div>

                    <figure class="px-4 pt-4">
                        <!-- <img  alt="รูปรางวัล"
                            class="rounded-xl object-contain h-32 mx-auto" /> -->
                        <div class="bg-base-300 rounded-xl flex items-center justify-center h-32 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content opacity-30"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </figure>

                    <div class="card-body p-4">
                        <h3 class="font-bold text-center truncate"> </h3>
                        <div class="badge badge-primary badge-outline mx-auto md:p-6 lg:p-2">จำนวน 8 รางวัล</div>

                        <div class="card-actions justify-end mt-2">
                            <button  class="btn btn-sm btn-outline btn-info">แก้ไข</button>
                        </div>
                    </div>
                </div>
                <div
                    class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden min-w-full">
                    <!-- ปุ่มลบรางวัล -->
                    <button  class="absolute top-2 right-2 btn btn-sm btn-circle btn-error z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- แถบสีด้านบนการ์ด -->
                    <div class="h-2 w-full bg-amber-300" ></div>

                    <figure class="px-4 pt-4">
                        <!-- <img  alt="รูปรางวัล"
                            class="rounded-xl object-contain h-32 mx-auto" /> -->
                        <div class="bg-base-300 rounded-xl flex items-center justify-center h-32 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content opacity-30"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </figure>

                    <div class="card-body p-4">
                        <h3 class="font-bold text-center truncate"> </h3>
                        <div class="badge badge-primary badge-outline mx-auto md:p-6 lg:p-2">จำนวน 8 รางวัล</div>

                        <div class="card-actions justify-end mt-2">
                            <button  class="btn btn-sm btn-outline btn-info">แก้ไข</button>
                        </div>
                    </div>
                </div>
            </div>
            

            <!-- ถ้าไม่มีรางวัล -->
            <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>ยังไม่มีรางวัล กรุณาเพิ่มรางวัลอย่างน้อย 1 รายการ</span>
            </div>
        </div>
    </div>
</template>