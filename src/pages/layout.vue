<script setup lang="ts">
import Tabbar from '@/components/tabbar.vue';
</script>
<template>
    <div>
        <main>
            <simple-router-view></simple-router-view>
        </main>
        <Tabbar />
    </div>
</template>