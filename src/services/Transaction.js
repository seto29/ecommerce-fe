import instance from "../axios";
import instanceSC from "../axiosSicepat";
import ls from "local-storage"

export const insert = async (addressID, total, paymentMethod, cartData, discount, deliveryFee, dId, discount_sb, point_payment) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('addressID', addressID)
    bodyFormData.append('total', total)
    bodyFormData.append('paymentMethod', paymentMethod)
    bodyFormData.append('discount', discount)
    bodyFormData.append('discount_sb', discount_sb)
    bodyFormData.append('deliveryFee', deliveryFee)
    bodyFormData.append('deliveryId', dId)
    bodyFormData.append('point', 0)
    bodyFormData.append('point_payment', point_payment)
    bodyFormData.append('cartData', JSON.stringify(cartData))
    const response = await instance({
        method: 'post',
        url: 'transactions/Insert.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const insertCO = async (question, shop_address, shop_name) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('question', question)
    bodyFormData.append('shop_address', shop_address)
    bodyFormData.append('shop_name', shop_name)
    const response = await instance({
        method: 'post',
        url: 'custom_orders/Insert.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updatePP = async (pp, tid) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('transactionID', tid)
    bodyFormData.append('pp', pp)
    const response = await instance({
        method: 'post',
        url: 'transactions/UpdatePP.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateStatus = async (status, transactionID) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('transactionID', transactionID)
    bodyFormData.append('status', status)
    const response = await instance({
        method: 'post',
        url: 'transactions/UpdateStatus.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const GetDetailByID = async (tID) => {    
    const result = await instance.get(
         'transactions/GetDetailByID.php?tID='+tID,
    );
    return result.data;
};

export const GetDiscountBalances = async () => {    
    const result = await instance.get(
         'discount_balance/GetHistory.php',
    );
    return result.data;
};
export const GetPoint = async () => {    
    const result = await instance.get(
         'users/GetPoints.php',
    );
    return result.data;
};

export const GetDetailByUserID = async () => {  
    const result = await instance.get(
         'transactions/GetByUserID.php',
    );
    return result.data;
};

export const Tracking = async (id) => {  
    const result = await instance.get(
         'transactions/Tracking.php?id='+id,
    );
    return result.data;
};
