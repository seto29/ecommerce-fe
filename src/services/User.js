import instance from "../axios";
import axios from "axios";
import ls from 'local-storage'

export const guestRegister = async () => {   
    const response = await instance({
        method: 'post',
        url: 'auth/GuestRegister.php',
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}
;
export const tokenRecreate = async () => {   
    const response = await instance({
        method: 'post',
        url: 'auth/reCreate.php',
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateGuestToUser = async (name, phone, email, password, birth_date) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('name', name)
    bodyFormData.append('phone', phone)
    bodyFormData.append('email', email)
    bodyFormData.append('password', password)
    bodyFormData.append('birth_date', birth_date)
    const response = await instance({
        method: 'post',
        baseURL: "https://api-dev.hijiofficial.com/v2/",
        url: 'auth/UpdateGuestToUser.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer '+ls.get('token') }
    });
    return response.data;
};

export const Update = async (name, phone, email, birth_date) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('name', name)
    bodyFormData.append('phone', phone)
    bodyFormData.append('email', email)
    bodyFormData.append('birth_date', birth_date)
    const response = await instance({
        method: 'post',
        url: 'users/Update.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const UpdatePassword = async (oldPassword, password) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('oldPassword', oldPassword)
    bodyFormData.append('password', password)
    const response = await instance({
        method: 'post',
        url: 'users/UpdatePassword.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const Login = async (email, password) => {   
    var bodyFormData = new FormData()
    bodyFormData.append('phone', email)
    bodyFormData.append('password', password)
    const response = await instance({
        method: 'post',
        url: 'auth/UserLogin.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;

};

export const GetByID = async () => {   
    const response = await instance({
        method: 'post',
        url: 'users/GetByID.php',
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
