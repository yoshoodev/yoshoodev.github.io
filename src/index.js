import Aos, { init } from "aos";
import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import Swup from "swup";

const firebaseConfig = {
  apiKey: "AIzaSyD33F_vo2zofnh_-g6dk4I3eSawDcBkTL8",
  authDomain: "onlystudents-c006b.firebaseapp.com",
  projectId: "onlystudents-c006b",
  storageBucket: "onlystudents-c006b.appspot.com",
  messagingSenderId: "664309698186",
  appId: "1:664309698186:web:ca6a730b014e6e21316773",
  measurementId: "G-PTCTDT0BBV",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

var userauth = auth.currentUser;

const swup = new Swup();

Aos.init();

var comingfromreg = 0;

function redirect() {
  swup.loadPage({
    url: "/home.html", // route of request (defaults to current url)
    method: "GET", // method of request (defaults to "GET")
    customTransition: "transition-fade", // name of your transition used for adding custom class to html element and choosing custom animation in swupjs (as setting data-swup-transition attribute on link)
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    userauth = user;
    console.log("User is signed in !");

    if (comingfromreg == 0) {
      redirect();
    } else {
    }

    return true;
    // ...
  } else {
    // User is signed out
    console.log("User is not Signed IN");
    userauth = null;
    return false;
    // ...
  }
});

function validateForm() {
  var a = document.getElementById("emailform").value;
  var b = document.getElementById("passwordform").value;

  if ((a == null || a == "") && (b == null || b == "")) {
    Swal.fire({
      title: "User and Pass",
      text:
        "We need those to log you in !" +
        "\n" +
        "Say what you want we don't care :D",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "OK BOOMER",
    });
    return false;
  } else if (b == null || b == "") {
    Swal.fire({
      title: "Password",
      text:
        "We need it to log you in !" +
        "\n" +
        "It's secret so don't share it ;)",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "OK",
    });
    return false;
  } else if (a == null || a == "") {
    Swal.fire({
      title: "Email",
      text: "We need it to log you in !" + "\n" + "It's just an e-mail :D",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "Sure",
    });
    return false;
  } else {
    return true;
  }
}

async function registerData(nameI, usernameI, emailI, uidI) {
  try {
    const docRef = await setDoc(doc(db, "users", uidI), {
      name: nameI,
      username: usernameI,
      email: emailI,
    });
    console.log("Data added with ID: ", uidI);
  } catch (e) {
    console.error("Error adding data to users: ", e);
  }
}

function isUserNameValid(username) {
  /* 
    Usernames can only have: 
    - Lowercase Letters (a-z) 
    - Numbers (0-9)
    - Dots (.)
    - Underscores (_)
  */
  const res = /^[a-z0-9_\.]+$/.exec(username);
  const valid = !!res;
  if (valid == true) {
    return true;
  } else {
    Swal.fire({
      title: "Username not valid",
      text: ` Usernames can only have:
      - Lowercase Letters (a-z) 
      - Numbers (0-9)
      - Dots (.)
      - Underscores (_)`,
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "I will fix it !",
    });
    return false;
  }
}

function validateEmptyFormReg() {
  var a = document.getElementById("registeremailform").value;
  var b = document.getElementById("registeremailrepeat").value;
  var c = document.getElementById("userform").value;
  var d = document.getElementById("nameform").value;
  var e = document.getElementById("password1").value;
  var f = document.getElementById("password2").value;
  if (
    a == null ||
    a == "" ||
    b == null ||
    b == "" ||
    c == null ||
    c == "" ||
    d == null ||
    d == "" ||
    e == null ||
    e == "" ||
    f == null ||
    f == ""
  ) {
    Swal.fire({
      title: "Please input all fields",
      text: "You haven't completed all the necessary fields",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "I will fix it !",
    });
    return false;
  } else {
    if (e == f && a == b) {
      return true;
    } else if (a != b && e != f) {
      Swal.fire({
        title: "Really ?",
        text: "You messed up the email AND password re-type checks ? HOW ?",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Sry, Daddy",
      });
      return false;
    } else if (e != f) {
      Swal.fire({
        title: "Passwords are not the same",
        text: "The passwords you provided are not the same !",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Oops!",
      });
      return false;
    } else if (a != b) {
      Swal.fire({
        title: "Email's are not the same",
        text: "The email addresses you provided are not the same !",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "I know my mail",
      });
      return false;
    } else {
      console.log("WTF HAPPENED");
      return false;
    }
  }
}

document.getElementById("registerbtn").onclick = function () {
  var email = document.getElementById("registeremailform").value;
  var usernameBefore = document.getElementById("userform").value;
  var username = usernameBefore.toLowerCase();
  var name = document.getElementById("nameform").value;
  var password = document.getElementById("password1").value;

  if (userauth != null) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log("Signed in  " + userauth.uid + "cannot create new account !");
    alert("You are already signed-in, You should'nt be on this page!");
    redirect();
    // ...
  } else {
    if (validateEmptyFormReg() == true && isUserNameValid(username) == true) {
      comingfromreg = 1;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          registerData(name, username, email, userCredential.user.uid);
          console.log("Updating Username with " + username);
          const photogen = new String(
            "https://avatars.dicebear.com/api/adventurer-neutral/" +
              username +
              ".svg"
          );
          console.log("Generated url for pic : " + photogen);
          updateProfile(userCredential.user, {
            displayName: username,
            photoURL: photogen,
          })
            .then(() => {
              console.log("Updated: " + auth.currentUser.displayName);
            })
            .catch((error) => {});
          console.log(auth.currentUser.displayName);
          Swal.fire({
            title: "Register Succesful",
            text: "You have succesfully registered",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              redirect();
            }
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          switch (errorCode) {
            case "auth/invalid-email":
              Swal.fire({
                title: "Invalid Email",
                text: "We think you got your email wrong !\nRecheck it ! (Tip: check after @)",
                icon: "warning",
                showCancelButton: false,
                confirmButtonText: "Sure thing !",
              });
              break;

            case "auth/weak-password":
              Swal.fire({
                title: "Weak Password",
                text: "Weak Password !\nRecheck it ! (Tip: minimum length 6 characters)",
                icon: "warning",
                showCancelButton: false,
                confirmButtonText: "Cheking now",
              });
              break;

            case "auth/email-already-exists":
              Swal.fire({
                title: "Email Already Exists",
                text: "You already signed up with this email!\nTry another one :D",
                icon: "warning",
                showCancelButton: false,
                confirmButtonText: "OK BOSS",
              });
              break;

            case "auth/email-already-in-use":
              Swal.fire({
                title: "Email Already In Use",
                text: "You already signed up with this email!\nTry another one :D",
                icon: "warning",
                showCancelButton: false,
                confirmButtonText: "OK BOSS",
              });
              break;

            default:
              Swal.fire({
                title: "Ooopsie",
                text: "Give this code to the developer\n)" + errorCode,
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "Call The DEVS",
              });
              break;
          }
        });
    } else {
    }
  }
};

document.getElementById("loginbtn").onclick = function () {
  var email = document.getElementById("emailform").value;
  var password = document.getElementById("passwordform").value;

  if (validateForm() == true) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userauth = userCredential.user;
        console.log("Login successful");
        redirect();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case "auth/user-not-found":
            Swal.fire({
              title: "User Not Found",
              text: "Basically you don't exist for us.\nYou can go ahead and make an account now",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "Sure :D",
            });
            break;
          case "auth/wrong-password":
            Swal.fire({
              title: "Wrong Password",
              text: "Come on you don't know your password ?\nYou can reset it here :  coming soon TM",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "I got it !",
            });
            break;
          case "auth/user-disabled":
            Swal.fire({
              title: "User Disabled",
              text: "Did you get banned ? :d\nToo bad",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "Fuck You !",
            });
            break;

          case "auth/invalid-email":
            Swal.fire({
              title: "Invalid Email",
              text: "We think you got your email wrong !\nRecheck it ! (Tip: check after @)",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "Sure thing !",
            });
            break;
          default:
            Swal.fire({
              title: "Oopsie",
              text: "Take this code to the devs !\n " + errorCode,
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "Call the devs !",
            });
            break;
        }
      });
  } else {
    return false;
  }
};

document.getElementById("frgtpsswd").onclick = function () {
  var email = document.getElementById("emailform").value;
  if (email == null || email == "") {
    Swal.fire({
      title: "Email missing",
      text: "We need your email to send you the reset link :D",
      icon: "error",
      showCancelButton: false,
      confirmButtonText: "Sure",
    });
  } else {
    sendPasswordResetEmail(auth, email)
      .then((result) => {
        Swal.fire({
          title: "Success",
          text: "We sent you an email to recover your password !",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "Yay",
        });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            Swal.fire({
              title: "User Not Found",
              text: "There is no user with this email address !",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "Hmm",
            });
            break;
          case "auth/invalid-email":
            Swal.fire({
              title: "Invalid Email",
              text: "The email address is not valid !",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "IDK",
            });
            break;

          default:
            Swal.fire({
              title: "Error",
              text: "Code : " + error.code,
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "Oops",
            });
            break;
        }
      });
  }
};

const pwform = document.getElementById("passwordform");
pwform.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    //event.preventDefault();
    document.getElementById("loginbtn").click();
  }
});
