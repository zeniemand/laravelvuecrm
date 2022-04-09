window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');
require('./bootstrap');


import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Users from './components/Users';

const routes = [
    {
        path: '/profile',
        component: Profile
    },
    {
        path: '/dashboard',
        component: Dashboard
    },
    {
        path: '/users',
        component: Users
    }

];

const router = new VueRouter(
    {
        mode: 'history',
        routes
    }
);

const app = new Vue({
    el: '#app',
    router
});
