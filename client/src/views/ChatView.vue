<template>
    <v-app id="inspire">
        <Sidebar />
        <v-main>
            <h1>{{ room ? room.name : "" }}</h1>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col v-for="card in cards" :key="card" cols="12">
                        <v-card>
                            <v-subheader>{{ card }}</v-subheader>

                            <v-list two-line>
                                <template v-for="(data, index) in messages">
                                    <v-list-item :key="index">
                                        <v-list-item-avatar color="grey darken-1">
                                            <v-img :src="data.imgURL"></v-img>
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                {{ data.message }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-divider :key="`divider-${index}`" inset></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-textarea v-model="body" class="mx-2" label="メッセージを送信" rows="3" prepend-icon="mdi-comment" auto-grow>
            </v-textarea>
            <v-btn class="mr-4" @click="submit" :disabled="invalid">
                submit
            </v-btn>
            <v-btn @click="clear">
                clear
            </v-btn>
        </v-main>
    </v-app>
</template>

<script>
import firebase from "@/firebase/firebase"
import Sidebar from '@/components/layouts/Sidebar'

export default {
    components: {
        Sidebar
    },
    async created() {
        this.room_id = this.$route.query.room_id;
        const roomRef = firebase.firestore().collection("rooms").doc(this.room_id)
        const roomDoc = await roomRef.get()
        if (!roomDoc.exists) {
            await this.$router.push('/')
        }
        this.room = roomDoc.data()

        /* const chatRef = firebase.firestore().collection("chats") */
        /* const snapshot = await chatRef.get()                     */
    },
    mounted() {
        this.auth = JSON.parse(sessionStorage.getItem('user'))

        const roomRef = firebase.firestore().collection('rooms').doc(this.room_id)
        roomRef.collection('messages').orderBy('createdAt', 'asc').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(changes => {
                this.messages.push(changes.doc.data())
            })
        })

    },
    data: () => ({
        room_id: "",
        room: null,
        cards: ['Today'],
        drawer: null,
        links: [
            ['mdi-inbox-arrow-down', 'Inbox'],
            ['mdi-send', 'Send'],
            ['mdi-delete', 'Trash'],
            ['mdi-alert-octagon', 'Spam'],
        ],
        body: '',
        messages: [],
        auth: null,
    }),
    computed: {
        invalid() {
            if (!this.body) {
                return true
            }
            return false;
        }
    },
    methods: {
        clear() {
            this.body = ""
        },
        submit() {
            const roomRef = firebase.firestore().collection('rooms').doc(this.room_id)
            roomRef.collection('messages').add({
                message: this.body,
                user_id: this.auth.displayName,
                imgURL: this.auth.imgURL,
                createdAt: firebase.firestore.Timestamp.now(),
            }).then(result => {
                this.body = ""
            }).catch(error => {
                alert("メッセージの送信に失敗しました")
            })
        },
    },
}
</script>
