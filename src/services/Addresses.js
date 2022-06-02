import instance from "../axios";
import instanceSC from "../axiosSicepat";

export const getAll = async () => {    
    const result = await instance.get(
         'addresses/GetByUserID.php',
    );
    return result.data;
};


export const getAllProvinces = async () => {
    let i = 0;
    let list = [];
    const response = await instance.get('addresses/GetAllProvinces.php')
    response['data']['provinces'].map(value => {
        list[i] = {
            id: value.id, value: value.name, label: value.name,
            target: { type: 'select', name: 'list', value: value.id, label: value.name }
        }
        i++;
        return i;
    })
    return  list    
};

export const getRegencyByProvinceID = async (id) => {
    let i = 0;
    let list = [];
    const response = await instance.get('addresses/GetRegencyByProvinceID.php?provinceID='+id)
    response['data']['regencies'].map(value => {
        list[i] = {
            id: value.id, value: value.name, label: value.name,
            target: { type: 'select', name: 'list', value: value.id, label: value.name }
        }
        i++;
        return i;
    })
    return  list    
};

export const getDistrictByRegencyID = async (id) => {
    let i = 0;
    let list = [];
    const response = await instance.get('addresses/GetDistrictByRegencyID.php?regencyID='+id)
    response['data']['district'].map(value => {
        list[i] = {
            id: value.id, value: value.name, label: value.name,
            target: { type: 'select', name: 'list', value: value.id, label: value.name }
        }
        i++;
        return i;
    })
    return  list    
};

export const getVillageByDistrictID = async (id) => {
    let i = 0;
    let list = [];
    const response = await instance.get('addresses/GetVillageByDistrictID.php?districtID='+id)
    response['data']['village'].map(value => {
        list[i] = {
            id: value.id, value: value.name, label: value.name,
            target: { type: 'select', name: 'list', value: value.id, label: value.name }
        }
        i++;
        return i;
    })
    return  list    
};

export const siCepatDestination = async () => {
    let list = [];
    let i = 0
    const response = await instanceSC.get('addresses/GetDestination.php')
    if(response.data.status==200){

        let results = response.data.result
        results.map(value => {
            list[i] = {
                id: value.destination_code, value: value.destination_code, label: value.district+', '+value.city+', '+value.province,
                target: { type: 'select', name: 'list', value: value.destination_code, label: value.district+', '+value.city+', '+value.province }
            }
            i++;
            return i;
            
        })
    }
    return  list    
};

export const insert = async (address, name,notes, recipientName, phone, postalCode, villageID) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('address', address)
    bodyFormData.append('name', name)
    bodyFormData.append('notes', notes)
    bodyFormData.append('recipientName', recipientName)
    bodyFormData.append('phone', phone)
    bodyFormData.append('postalCode', postalCode)
    bodyFormData.append('villageID', villageID)
    const response = await instance({
        method: 'post',
        url: 'addresses/Insert.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const update = async (address, name,notes, recipientName, phone, postalCode, villageID, id) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('address', address)
    bodyFormData.append('name', name)
    bodyFormData.append('notes', notes)
    bodyFormData.append('recipientName', recipientName)
    bodyFormData.append('phone', phone)
    bodyFormData.append('postalCode', postalCode)
    bodyFormData.append('villageID', villageID)
    bodyFormData.append('id', id)
    const response = await instance({
        method: 'post',
        url: 'addresses/Update.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateDefault = async (id) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('id', id)
    const response = await instance({
        method: 'post',
        url: 'addresses/SetDefault.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};