import instance from "../axios";

export const getAll = async () => {    
    const result = await instance.get(
         'categories/GetAll.php',
    );
    return result.data;
};

export const getDefaultImage = async () => {    
    const result = await instance.get(
         'subcategories/GetImageDefault.php',
    );
    return result.data;
};