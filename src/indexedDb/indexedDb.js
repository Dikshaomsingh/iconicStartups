import React from 'react';

const setupIndexedDB = () => {
    const dbName = 'MyiconicStartupsDatabase';
    const dbVersion = 1;
  
    const request = window.indexedDB.open(dbName, dbVersion);
  
    return new Promise((resolve, reject) => {
      request.onerror = (event) => {
        reject(event.target.error);
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('MyDbStore')) {
          const store = db.createObjectStore('MyDbStore', { keyPath: 'id', autoIncrement: true });
          store.createIndex('articleName', 'articleName', { unique: false });
          store.createIndex('subtopic', 'subtopics.subtopic', { unique: false });
        }
      };
    });
  };
  
  export default setupIndexedDB;
  