import instance from "../axios";

export const getAll = async () => {    
    const result = await instance.get(
         'products/GetAll.php',
    );
    return result.data;
};

export const getAllSample = async () => {    
    const result = await instance.get(
         'samples/GetAll.php',
    );
    return result.data;
};

export const getAllR = async () => {    
    const result = await instance.get(
         'products/GetAllR.php',
    );
    return result.data;
};

export const getTopRated = async () => {    
    const result = await instance.get(
         'products/GetTopRated.php',
    );
    return result.data;
};

export const GetSortByRating = async () => {    
    const result = await instance.get(
         'products/GetSortByRating.php',
    );
    return result.data;
};

export const GetDetailByID = async (id) => {    
    const result = await instance.get(
         'products/GetDetailBySlug.php?slug='+id,
    );
    console.log(result.data.product);
    return result.data;
};

export const GetDetailByID1 = async (id) => {    
    const result = await instance.get(
         'products/GetDetailByID.php?id='+id,
    );
    return result.data;
};