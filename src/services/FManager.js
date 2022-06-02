import axios from '../axios';

export const fUpload = async (imageUpload, dir) => {
        var formData = new FormData(); 
        formData.set( 
            "myFile", 
            imageUpload, 
            imageUpload.name 
        ); 
        formData.append( 
            "targetDir", 
            dir           
        );
    const response = await axios.post('fileManager/fileUploader.php', formData)
    return response.data
};