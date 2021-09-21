require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const fs = require('fs');

const FormData = require('form-data');

exports.pinFileToIPFS=(fpath,name,description) =>{
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

     
    let data = new FormData();
    data.append('file', fs.createReadStream(fpath));
 
    return axios
        .post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: process.env.API_Key,
                pinata_secret_api_key: process.env.API_Secret
            }
        })
        .then(function (response) {
            //handle response here
            //console.log(response);
            console.log("https://ipfs.io/ipfs/"+response.data.IpfsHash);
            var imgURI = "https://ipfs.io/ipfs/"+response.data.IpfsHash;
            
           return pinJSONToIPFS(JSON.stringify({
                name: name,
                description: description,
                image: imgURI
              }));
             
        })
        .catch(function (error) {
            //handle error 
            console.log(error);
        });
};

 function pinJSONToIPFS(JSONBody){
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, 
            
            {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                pinata_api_key: process.env.API_Key,
                pinata_secret_api_key: process.env.API_Secret
            }
        })
        .then(function (response) {
            //handle response here
            console.log("https://ipfs.io/ipfs/"+response.data.IpfsHash);
            return response.data;
        })
        .catch(function (error) {
            //handle error here
            console.log(error);
        });
};
 
