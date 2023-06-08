import React from 'react';
import CryptoJS from 'crypto-js';
import sjcl from 'sjcl';

export const storeEncryptDataToDb = (db, data, name) => {
  const key = 'my-iconicStartup-key'; // Replace with your own secret key

  const transaction = db.transaction(['MyDbStore'], 'readwrite');
  const store = transaction.objectStore('MyDbStore');

  const serializedData = JSON.stringify(data);
  const encryptedData = sjcl.encrypt(key, serializedData);

  const request = store.put({ id: name, data: encryptedData });

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      //console.log('Data stored in IndexedDB');
      resolve(true)
    };
  
    request.onerror = (event) => {
      console.error('Error storing data in IndexedDB:', event.target.error);
      reject(false)
    };

  })

};

export const retrieveDataFromDb = (db, key) => {
  const transaction = db.transaction(['MyDbStore'], 'readonly');
  const store = transaction.objectStore('MyDbStore');

  const request = store.get(key);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const record = event.target.result;
  
      if (record) {
        const encryptedData = record.data;
        const decryptedData = sjcl.decrypt('my-iconicStartup-key', encryptedData);
        const parsedData = JSON.parse(decryptedData);
        // callback(parsedData);
        resolve(parsedData)
      }
    };
  
    request.onerror = (event) => {
      console.error('Error retrieving data from IndexedDB:', event.target.error);
      // callback(null);
      reject(null)
    };
  })

};

export const getAllDataFromDb = (db,) => {
  const transaction = db.transaction(['MyDbStore'], 'readonly');
  const store = transaction.objectStore('MyDbStore');

  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const record = event.target.result;
      //console.log("record",record)
      const parsedData=[];
  
      if (record.length>0) {
        record.map((items)=>{
          const encryptedData = items.data;
          const decryptedData = sjcl.decrypt('my-iconicStartup-key', encryptedData);
          parsedData.push(JSON.parse(decryptedData));

        })
       //console.log("parsed",parsedData)
        
        resolve(parsedData)
      }
    };
  
    request.onerror = (event) => {
      console.error('Error retrieving data from IndexedDB:', event.target.error);
      reject(null)
    };
  })

};

export const modifyDbData = (db, newData, name) => {
  const key = 'my-iconicStartup-key'; // Replace with your own secret key

  const transaction = db.transaction(['MyDbStore'], 'readwrite');
  const store = transaction.objectStore('MyDbStore');

  let request = store.get(name);
  //console.log("request",request)
 
  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      //console.log('data',event,"--",event.target)
      if (!event?.target?.result) {
        storeEncryptDataToDb(db, [newData], name).then((res) => {
          if (res) {
            //console.log('db field setup',name)
            resolve(res)
          }
        })
      }else{
        const encryptedData = event?.target?.result?.data;
  
        // Decrypt the existing data
        const decryptedData = sjcl.decrypt(key, encryptedData);
        const existingData = JSON.parse(decryptedData);
    
        // Push the new data into the existing array
        
        //console.log("exsiting", existingData)
        existingData.push(newData);
        // Encrypt the modified data
        const serializedModifiedData = JSON.stringify(existingData);
        const encryptedModifiedData = sjcl.encrypt(key, serializedModifiedData);
    
        // Update the data in the object store
        const updateRequest = store.put({ id: name, data: encryptedModifiedData });
    
        updateRequest.onsuccess = () => {        
          //console.log('Data modified successfully');
          resolve(true)
        };
    
        updateRequest.onerror = (event) => {
          console.error('Failed to modify data:', event.target.error);
        };
        
      }
    };
  
    request.onerror = (event) => {      
      console.error('Failed to retrieve data:', event.target.error);
      reject(false)
    };

  })
};

