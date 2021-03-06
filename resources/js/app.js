window.Popper = require('popper.js');
require('./bootstrap');
window.bootstrap = require('bootstrap');



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
import VueProgressBar from 'vue-progressbar';
import Swal from 'sweetalert2';

window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);


window.Toast = Toast;

window.Form = Form;

Vue.component(Button.name, Button);
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component(AlertErrors.name, AlertErrors);
Vue.component(AlertSuccess.name, AlertSuccess);


import NotFound from "./components/NotFound";
Vue.component('not-found', NotFound);

import LaravelVuePagination from 'laravel-vue-pagination';
Vue.component('pagination',LaravelVuePagination);

Vue.use(VueRouter);
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '2px'
});

import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Users from './components/Users';
import Developer from './components/Developer';
import Invoice from './components/Invoice';

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
    },
    {
        path: '/developer',
        component: Developer
    },
    {
        path: '/invoice',
        component: Invoice
    },
    {
        path: '*',
        component: NotFound
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

window.Fire = new Vue();

const app = new Vue({
    el: '#app',
    router,
    data:{
        search: ''
    },
    methods: {
        searchit: _.debounce(() => {
            Fire.$emit('searching');
        }, 1000),
        printInvoice() {
            console.log('printed');
            window.print();
        },
    }
});
