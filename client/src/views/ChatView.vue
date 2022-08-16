<template>
    <v-app id="inspire">
        <v-system-bar app>
            <v-spacer></v-spacer>

            <v-icon>mdi-square</v-icon>

            <v-icon>mdi-circle</v-icon>

            <v-icon>mdi-triangle</v-icon>
        </v-system-bar>

        <v-main>
            <v-container class="py-8 px-6" fluid>
                <v-row>
                    <v-col v-for="card in cards" :key="card" cols="12">
                        <v-card>
                            <v-subheader>{{ card }}</v-subheader>

                            <v-list two-line>
                                <template v-for="(data, index) in messages">
                                    <v-list-item :key="index">
                                        <v-list-item-avatar color="grey darken-1">
                                        </v-list-item-avatar>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                {{ data.message }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-divider v-if="n !== 6" :key="`divider-${index}`" inset></v-divider>
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
export default {
    created() {
        this.user_id = this.$route.query.user_id;
    },
    data: () => ({
        user_id: "",
        cards: ['Today'],
        drawer: null,
        links: [
            ['mdi-inbox-arrow-down', 'Inbox'],
            ['mdi-send', 'Send'],
            ['mdi-delete', 'Trash'],
            ['mdi-alert-octagon', 'Spam'],
        ],
        body: '',
        messages: [
        ]
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
            this.messages.unshift({ message: this.body })
            this.body = ""
        },
    },
}
</script>
