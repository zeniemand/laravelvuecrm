<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;

class UserController extends Controller
{
    private const path_image_profile = 'img/profile/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::latest()->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8'
        ]);

        return User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'type' => $request['type'],
            'bio' => $request['bio'],
            'photo' => $request['photo'],
            'password' => Hash::make($request['password']),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|exclude_if:password,null|min:8'
        ]);

        $currentPhoto = $user->photo;
        if ($request->photo != $currentPhoto) {
            $imageName = $this->getNewImageName($request->photo);
            if(!$this->uploadImage($imageName, $request->photo, self::path_image_profile)) return ['error ' => 'could not upload image' ];
            $request->merge(['photo' => $imageName]);
        }

        $request = $this->passwordRequestUpdateCheck($request, $user);

        $user->update($request->all());
        return ['message ' => 'Success' ];
    }

    /**
     * @param Request $request
     * @param User $user
     * @return Request
     */
    protected function passwordRequestUpdateCheck(Request $request, User $user)
    {
        if(!empty($request->password)){
            $request->merge([
                'password' => Hash::make($request['password'])
            ]);
        }

        if($request->password === null){
            $request->merge([
                'password' => $user->password
            ]);
        }

        return $request;
    }

    /**
     * @param $imageName
     * @param $image_string_name
     * @param $image_path
     * @return \Intervention\Image\Image
     */
    protected function uploadImage($imageName, $image_string_name,$image_path)
    {
        return Image::make($image_string_name)->save(public_path($image_path).$imageName);
    }

    /**
     * @param $image_string_name
     * @return string
     */
    protected function getNewImageName($image_string_name)
    {
        return time() . '.' . explode('/', explode(':', substr($image_string_name, 0, strpos($image_string_name, ';')))[1])[1];
    }


    /**
     * Get data of the current authenticated user
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function profile()
    {
        return auth('api')->user();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8'
        ]);

        if($user->update($request->all())){
            return [
                'message' => "User {$request->name} updated",
                'name' => $request->name
            ];
        }
        return ['error' => 'update failed'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return ['message' => 'User deleted'];
    }
}
