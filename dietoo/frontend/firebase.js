import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-J-wLrWmKlX-LMbBh-CLqZan_f-f5Q_4",
    authDomain: "dietoo.firebaseapp.com",
     storageBucket: "dietoo.firebasestorage.app",
    projectId: "dietoo",
     messagingSenderId: "982262169220",
    appId: "1:982262169220:web:c94c2d3a0b986de2530cd1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
