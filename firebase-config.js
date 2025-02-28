// Configurare Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "proiectul-tau.firebaseapp.com",
    databaseURL: "https://proiectul-tau.firebaseio.com",
    projectId: "proiectul-tau",
    storageBucket: "proiectul-tau.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefghij"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();
