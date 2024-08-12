// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
const admin = require('firebase-admin');

const serviceAccount = require('../service_account_key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const sendPush = async (registrationTokens, payload, options) => {
    try {

        
        return admin.messaging().sendToDevice(registrationTokens, payload, options)
            .then(function (response) {
                // console.log("Successfully sent message:", response);
                return response;
            })
            .catch(function (error) {
                // console.log("Error sending message:", error);
                return error;
            });
    } catch (error) {
        return error;
    }
}

// const firebaseConfig = {
//   apiKey: "AIzaSyBVkmVXYxTfZLT9KegfFHOdZ1L1jPmL3oY",
//   authDomain: "bestbid-d74e1.firebaseapp.com",
//   projectId: "bestbid-d74e1",
//   storageBucket: "bestbid-d74e1.appspot.com",
//   messagingSenderId: "457291419520",
//   appId: "1:457291419520:web:bc8cff3b4365802eb33b65",
//   measurementId: "G-PD4W0KVRJB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


module.exports = { sendPush };