<template xmlns="http://www.w3.org/1999/html">
    <div class="container">

        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>
                        <div class="card-tools">
                            <button class="btn btn-success"  @click="showModalwin">
                                Add New <i class="fas fa-user-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover text-nowrap">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Registered at</th>
                                <th>Modify</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="user in users" :key="user.id" >
                                <td>{{ user.id }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.type | upText }}</td>
                                <td>{{ user.created_at | myDate }}</td>
                                <td>
                                    <a href="#" @click="editModalwin(user)">
                                        <i class="fa fa-edit blue"></i>
                                    </a>
                                    /
                                    <a href="#" @click="deleteUser(user.id, user.name)">
                                        <i class="fa fa-trash red"></i>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </div>

        <!-- Modal -->
            <div class="modal fade" ref="addNew" tabindex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5  class="modal-title" v-show="!editMode" id="addNewLabel">Add New</h5>
                        <h5  class="modal-title" v-show="editMode" id="addNewLabel">Update users Info</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <form @submit.prevent="editMode ? updateUser() : createUser()" @keydown="form.onKeydown($event)" class="mx-3">
                        <div class="modal-body">
                        </div>

                            <AlertError :form="form"/>
                            <!-- <AlertErrors :form="form" /> -->
                            <!-- <AlertSuccess :form="form" message="Your changes have beend saved!" /> -->

                            <div class="mb-3">
                                <input id="name" v-model="form.name" type="text" name="name" class="form-control"
                                       placeholder="Name">
                                <HasError :form="form" field="name"/>
                            </div>

                            <div class="mb-3">
                                <input id="email" v-model="form.email" type="text" name="email" class="form-control"
                                       placeholder="Email Address">
                                <HasError :form="form" field="email"/>
                            </div>

                            <div class="mb-3">
                                    <textarea id="bio" v-model="form.bio" type="text" name="bio" class="form-control"
                                              placeholder="Short bio for user (Optional)"></textarea>
                                <HasError :form="form" field="bio"/>
                            </div>

                            <div class="mb-3">
                                <select id="type" v-model="form.type" type="text" name="type" class="form-control">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>
                                </select>
                                <HasError :form="form" field="type"/>
                            </div>

                            <div class="mb-3">
                                <input id="password" v-model="form.password" type="password" name="password"
                                       class="form-control" placeholder="Password">
                                <HasError :form="form" field="password"/>
                            </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
                            <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    data(){
        return {
            editMode: true,
            users: {},
            form: new Form({
                id: '',
                name: '',
                email: '',
                password: '',
                type: '',
                bio: '',
                photo: ''
            }),
            modal: null
        }
    },
    name: "Users",
    methods: {
        updateUser() {
            console.log('editing data!!')
            this.$Progress.start();

            this.form.put('api/user/' + this.form.id).then(response => {
                this.modal.hide();
                Swal.fire(
                    'Updated!',
                    `User ${response.data.name} has been updated.`,
                    'success'
                );
                Fire.$emit('AfterCreate');
                this.$Progress.finish();
            }).catch(() => {
                this.$Progress.fail();
            });
        },
        deleteUser(id, name) {
            Swal.fire({
                title: `Are you sure to delete user: ${name} ?`,
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.form.delete('api/user/' + id).then(() => {
                        Swal.fire(
                            'Deleted!',
                            'Record has been deleted.',
                            'success'
                        );
                        Fire.$emit('AfterCreate');
                    }).catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        );
                    });
                }
            })
        },
        showModalwin(){
            this.editMode = false;
            this.form.reset();
            this.modal.show();
        },
        editModalwin(user){
            this.editMode = true;
            this.form.reset();
            this.modal.show();
            this.form.fill(user);
        },
        loadUsers() {
            axios.get('/api/user').then(response => this.users = response.data.data);
        },
        async createUser() {

            this.$Progress.start();
            await this.form.post('/api/user')
            .then(() => {
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
                });

                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully'
                });

                this.modal.hide();
                Fire.$emit('AfterCreate');
                this.$Progress.finish();
            })
            .catch(() => {
                this.$Progress.fail();
            });
        }
    },
    created() {
        this.loadUsers();
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.addNew);
        Fire.$on('AfterCreate', () => this.loadUsers())
    }
}
</script>
