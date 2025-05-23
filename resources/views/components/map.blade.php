<div class="flex flex-col md:flex-row w-full h-full">
    <div class="w-full md:w-1/4 z-10 bg-white/80 md:bg-white p-4 md:p-6 shadow md:shadow-lg">
        <livewire:product-selector />
    </div>
    <div class="flex-1 relative">
        <div id="map" x-data="map" style="width: 100%; height: 100vh;"></div>
    </div>
</div>
