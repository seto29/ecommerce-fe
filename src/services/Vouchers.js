import instance from "../axios";

export const getAll = async () => {    
    const res = await instance.get(
         'vouchers/GetByUserID.php',
    )
    if(typeof res==='undefined'){

    }else{

        return res.data;
    }
};