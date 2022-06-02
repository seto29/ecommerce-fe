import axios from "axios";

var ls = require('local-storage');
const instance = axios.create({
    baseURL: "https://api-dev.hijiofficial.com/v2/",
    headers: { 'Authorization': 'Bearer ' + ls.get('token') }
     
    
});
export default instance;