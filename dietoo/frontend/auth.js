import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.signup = async () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful");
    window.location.href = "home.html";
  } catch (err) {
    alert(err.message);
  }
};

window.login = async () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
    window.location.href = "home.html";
  } catch (err) {
    alert(err.message);
  }
};
