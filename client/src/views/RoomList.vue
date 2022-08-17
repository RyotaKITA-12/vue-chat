<template>
    <v-app id="inspire">
        <Sidebar />
        <v-app-bar app shrink-on-scroll>
            <v-toolbar-title>ルーム一覧</v-toolbar-title>
            <CreateRoom />

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-row>
                    <v-col v-for="room in rooms" :key="room.id" cols="4">
                        <router-link :to="{ path: '/chat', query: { room_id: room.id } }">
                            <v-avatar color="indigo" size="128">
                                <v-icon dark size="32" v-if="!room.thumbnailUrl">
                                    mdi-account-multiple
                                </v-icon>
                                <img :src="room.thumbnailUrl" v-if="room.thumbnailUrl">
                            </v-avatar>
                        </router-link>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import firebase from '@/firebase/firebase'
import Sidebar from '@/components/layouts/Sidebar'
import CreateRoom from '@/components/modals/CreateRoom'

export default {
    components: {
        Sidebar,
        CreateRoom,
    },
    data: () => ({
        rooms: []
    }),
    mounted() {
        this.getRooms()
    },
    methods: {
        async getRooms() {
            this.rooms = []
            const roomRef = firebase.firestore().collection("rooms")
            const snapshot = await roomRef.get()
            snapshot.docs.map(doc => {
                const data = { ...doc.data() }
                data.id = doc.id
                this.rooms.push(data)
            })
        }
    }
}
</script>

