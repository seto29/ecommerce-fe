import instance from "../axios";

export const fInsert = async (discuss, product_id) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('product_id', product_id)
    bodyFormData.append('discuss', discuss)
    const response = await instance({
        method: 'post',
        url: 'productsReview/Insert.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const fInsertReply = async (discussionID, content) => {   
    var bodyFormData = new FormData();
    bodyFormData.append('content', content)
    bodyFormData.append('discussionID', discussionID)
    const response = await instance({
        method: 'post',
        url: 'discussion_replies/Insert.php',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};