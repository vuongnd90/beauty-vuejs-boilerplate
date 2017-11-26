// global imports
import Vue from 'vue'
import VueMaterial from 'vue-material'

// app imports
import AppLayout from './app.layout.vue'
import router from './router'
import store from './store'
import * as authService from './services/auth.service'
import * as userService from './services/user.service'

// mixins imports
import currentUser from './mixins/currentUser.vue'

// styles imports
import 'vue-material/dist/vue-material.css'
import './scss/style.scss'

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.mixin(currentUser)

/* eslint-disable no-new */
new Vue({
    name: 'Root',
    template: '<AppLayout/>',
    components: { AppLayout },
    el: '#app',
    router,
    store,

    created () {
        if (localStorage.getItem('refreshToken')) {
            this.initAppState()
        }
    },

    methods: {

        /**
         * refresh tokens and init userData in store
         */
        initAppState () {
            authService.refreshTokens()
                .then(() => userService.getCurrent())
                .then(user => store.commit('SET_USER', user.data))
                .catch(error => {
                    if (error.response.data.badRefreshToken) {
                        console.log('app.init.js >> badRefreshToken: true')
                    }
                    if (error.response.data.refreshTokenExpiredError) {
                        console.log('app.init.js >> refreshTokenExpiredError: true')
                    } else {
                        console.log(error)
                    }
                })
        }
    }
})
