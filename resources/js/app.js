window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');
require('./bootstrap');


import Vue from 'vue';
import VueRouter from 'vue-router';
import Form from 'vform';
import {
    Button,
    HasError,
    AlertError,
    AlertErrors,
    AlertSuccess
} from 'vform/src/components/bootstrap5';
import moment from 'moment';

window.Form = Form;
Vue.component(Button.name, Button);
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component(AlertErrors.name, AlertErrors);
Vue.component(AlertSuccess.name, AlertSuccess);

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

Vue.filter('upText', text => text.charAt(0).toUpperCase() + text.slice(1) );
Vue.filter('myDate', created => moment(created).format('MMMM Do YYYY') );

const app = new Vue({
    el: '#app',
    router
});
