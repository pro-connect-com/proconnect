<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCTeGtqnKL2Mk6IrPFcDk0Gqzo_Y7Nikn8",
    authDomain: "proconnect-254.firebaseapp.com",
    projectId: "proconnect-254",
    storageBucket: "proconnect-254.firebasestorage.app",
    messagingSenderId: "406855935685",
    appId: "1:406855935685:web:8ed31baf7641b49c1232ac",
    measurementId: "G-VEM3JM1CKG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

export { db }; //Export db for use with other files
</script>