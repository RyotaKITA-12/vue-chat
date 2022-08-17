<template>
    <v-navigation-drawer v-model="drawer" app>
        <v-sheet color="grey lighten-4" class="pa-4">
            <v-avatar color="white">
                <input type="file" ref="fileInput" @change="updateIcon" style="display: none"
                    accept="image/jpg, image/jpeg, image/png">
                <v-icon v-if="!imgUrl" dark @click="changeIcon">
                    mdi-account-circle
                </v-icon>
                <img :src="imgUrl" v-if="imgUrl">
            </v-avatar>

            <div class="username">{{ auth && auth.displayName }}</div>
        </v-sheet>

        <v-divider></v-divider>

        <v-list>
            <v-list-item v-for="[icon, text, link] in links" :key="icon" :to="link" link>
                <v-list-item-icon>
                    <v-icon>{{ icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ text }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item @click="signOut">
                <v-list-item-icon>
                    <v-icon color="red">
                        mdi-logout
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title style="color: red;">ログアウト</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import firebase from '@/firebase/firebase'

export default {
    name: 'App',
    data: () => ({
        drawer: null,
        links: [
            ['mdi-inbox-arrow-down', 'Inbox', '/'],
            ['mdi-send', 'Send', '/'],
            ['mdi-delete', 'Trash', '/'],
            ['mdi-alert-octagon', 'Spam', '/'],
        ],
        auth: null,
        imgUrl: ''
    }),
    mounted() {
        this.auth = JSON.parse(sessionStorage.getItem('user'))
        this.imgUrl = this.auth.imgURL
    },
    methods: {
        signOut() {
            firebase.auth().signOut().then(() => {
                localStorage.message = "ログアウトに成功しました"
                this.$router.push('/signin')
            })
        },
        changeIcon() {
            this.$refs.fileInput.click()
        },
        getAuth() {
            return firebase.auth().onAuthStateChanged((user) => { return user })
        },
        updateIcon() {
            const user = this.getAuth()
            if (!user) {
                sessionStorage.removeItem('user')
                this.$router.push('/signin')
            }
            const file = this.$refs.fileInput.files[0]
            const filePath = `/user/${file.name}`
            console.log(filePath)

            firebase.storage().ref().child(filePath).put(file).then(async snapshot => {
                const imgUrl = await snapshot.ref.getDownloadURL()
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        user.updateProfile({
                            imgURL: imgUrl
                        })
                    }
                })
                this.auth.imgURL = imgUrl
                sessionStorage.setItem('user', JSON.stringify(this.auth))

                this.imgUrl = imgUrl
            })
        },
    }
};
</script>
<style>
.grey.darken-1 {
    background-color: #757575;
    border-color: #757575;
}

.pa-4 {
    text-align: center;
    padding: 16px;
}

.username {
    padding-top: 10px;
}
</style>
