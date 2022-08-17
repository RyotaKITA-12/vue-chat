<template>
    <v-app>
        <v-main style="padding-left: 30px;">
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import Sidebar from '@/components/layouts/Sidebar'

export default {
    name: 'App',
};
</script>
<style>
</style>
