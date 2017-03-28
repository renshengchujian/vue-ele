// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Router from 'vue-router';
import App from './App';
import goods from '@/components/goods/goods';
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';

import '@/common/stylus/index.styl';

Vue.use(Router);

const routes = [{
    path: '/',
    component: goods
}, {
    path: '/goods',
    component: goods
}, {
    path: '/ratings',
    component: ratings
}, {
    path: '/seller',
    component: seller
}];

const router = new Router({
    linkActiveClass: 'active',
    routes
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App},
    render: h => h(App)
});
