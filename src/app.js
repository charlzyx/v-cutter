import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'
import store from './vuex/store.js'

Vue.use(Vuex)
Vue.use(VueTouch)
Vue.use(VueRouter)

import Index from './view/index.vue'

const App = Vue.extend({
    store,
    vuex:{

    }
})

let router = new VueRouter();
window.Router = router;

router.map({
    '/':{
        component: Index
    }
})

router.start(App, '#app');