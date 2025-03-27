import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// 🔹 ここに Firebase コンソールから取得した設定を入力！
const firebaseConfig = {
  apiKey: "AIzaSyDegZWnYhSriBwL3ZNLw7BaLlDzxT5GnQ4",
  authDomain: "honor-purchaser.firebaseapp.com",
  databaseURL: "https://honor-purchaser-default-rtdb.firebaseio.com/",
  projectId: "honor-purchaser",
  storageBucket: "honor-purchaser.firebasestorage.app",
  messagingSenderId: "103377328365",
  appId: "1:103377328365:web:05af7e9990d89bbb94d4e4",
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
