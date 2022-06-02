import instance from "../axios";

export const siCepatTarif = async (destination, weight) => {
    let i = 0;
    let list = [];
    const response = await instance.get('addresses/siCepatTariff.php?destination='+destination+'&weight='+weight) 
    return  response.data    
}

export const kurirHiji = async () => {
    let i = 0;
    let list = [];
    const response = await instance.get('delivery_method/GetAll.php') 
    return  response.data
}
