import instance from "../axios";

export const getAll = async () => {    
    const result = await instance.get(
         'ads/GetAll.php',
    );
    return result.data;
};