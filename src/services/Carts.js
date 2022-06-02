import instance from "../axios";

export const getAll = async () => {    
    const result = await instance.get(
        'carts/GetByUserID.php',
    );
    //console.log(result)
    if(typeof result==="undefined"){
    getAll()
    }else{
       return result.data.orders;
    }
};

export const getAll1 = async () => {    
    const result = await instance.get(
        'carts/GetByUserID.php',
    );
    //console.log(result)
    if(typeof result==="undefined"){
    getAll()
    }else{
       return result.data;
    }
};

export const insert = async (productID, qty, notes, selectedProductSize, unit_metric) => {   
    let a = ""
    if(selectedProductSize && selectedProductSize[0]!==null){
        selectedProductSize.forEach(element => {
            a=a+element.id+','
        });
        a=a.substring(0, a.length-1);
    }
    var bodyFormData = new FormData();
    bodyFormData.append('productID', productID)
    bodyFormData.append('qty', qty)
    bodyFormData.append('notes', notes)
    bodyFormData.append('variants', a)
    bodyFormData.append('unit_metric', unit_metric)
    const response = await instance({
        method: 'post',
        url: 'carts/Insert.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    if(typeof response!=="undefined"){
        return response.data;
    }
};

export const minQty = async (productID, qty, notes, variants, unit_metric) => {  
    let a = ""
    if(variants && variants[0]!==null){
        variants.forEach(element => {
            a=a+element.id+','
        });
        a=a.substring(0, a.length-1);
    } 
    var bodyFormData = new FormData();
    bodyFormData.append('productID', productID)
    bodyFormData.append('qty', qty)
    bodyFormData.append('notes', notes)
    bodyFormData.append('variants', a)
    bodyFormData.append('unit_metric', unit_metric)
    const response = await instance({
        method: 'post',
        url: 'carts/MinQty.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const Delete = async (productID, qty, notes, variants, unit_metric) => {   
    let a = ""
    if(variants && variants[0]!==null){
        variants.forEach(element => {
            a=a+element.id+','
        });
        a=a.substring(0, a.length-1);
    } 
    var bodyFormData = new FormData();
    bodyFormData.append('productID', productID)
    bodyFormData.append('qty', qty)
    bodyFormData.append('notes', notes)
    bodyFormData.append('variants', a)
    bodyFormData.append('unit_metric', unit_metric)
    const response = await instance({
        method: 'post',
        url: 'carts/Delete.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const DeleteByUserID = async (productID, qty, notes) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('productID', productID)
    bodyFormData.append('qty', qty)
    bodyFormData.append('notes', notes)
    const response = await instance({
        method: 'post',
        url: 'carts/DeleteByUserID.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};


