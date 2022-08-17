<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    CREATE ROOM
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="text-h5">New Room</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="name" label="Room Name*" prepend-icon="mdi-account-multiple-plus"
                                    required>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-file-input v-model="file" label="Image upload"
                                    accept="image/jpg, image/jpeg, image/png" filled prepend-icon="mdi-camera">
                                </v-file-input>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="onSubmit">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="onSubmit">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import firebase from '@/firebase/firebase'

export default {
    data: () => ({
        dialog: false,
        name: "",
        file: null
    }),
    methods: {
        async onSubmit() {
            let thumbnailUrl = ""
            if (this.file) {
                const filePath = `/room/${this.file.name}`
                await firebase.storage().ref().child(filePath).put(this.file).then(async snapshot => {
                    thumbnailUrl = await snapshot.ref.getDownloadURL()
                })
            }
            const roomRef = firebase.firestore().collection('rooms')
            await roomRef.add({
                name: this.name,
                thumbnailUrl: thumbnailUrl,
                createdAt: firebase.firestore.Timestamp.now()
            }).then(result => {
                this.dialog = false
            })
        }
    }
}
</script>
