
const firebaseConfig = {
  apiKey: "AIzaSyC5ueT7YoI1-NcPHMAHEZ70SmVG-tsMxBg",
  authDomain: "amongus-40e92.firebaseapp.com",
  databaseURL: "https://amongus-40e92-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "amongus-40e92",
  storageBucket: "amongus-40e92.appspot.com",
  messagingSenderId: "531751858337",
  appId: "1:531751858337:web:c32cdc25edda7cbf3f40e0",
  measurementId: "G-E6WS80ZFFV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const messagesRef = database.ref('messages');
const userRef = database.ref('users');
let currentUser = null;

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(handleSignIn).catch(handleError);
}

function signInWithGitHub() {
  const provider = new firebase.auth.GithubAuthProvider();
  auth.signInWithPopup(provider).then(handleSignIn).catch(handleError);
}

function signInWithEmail() {
  const email = prompt("Enter your email");
  const password = prompt("Enter your password");
  auth.signInWithEmailAndPassword(email, password).then(handleSignIn).catch(handleError);
}

function signInWithPhone() {
  const phoneNumber = prompt("Enter your phone number");
  const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  auth.signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(confirmationResult => {
      const code = prompt("Enter the verification code");
      return confirmationResult.confirm(code);
    })
    .then(handleSignIn)
    .catch(handleError);
}

function handleSignIn(result) {
  const user = result.user;
  if (user) {
    checkUserProfile();
  }
}

function handleError(error) {
  console.error("Sign-in error:", error.message);
  alert("Sign-in failed: " + error.message);
}

function checkUserProfile() {
  const user = auth.currentUser;
  userRef.child(user.uid).once('value').then(snapshot => {
    if (snapshot.exists()) {
      loadUserProfile(snapshot.val());
      loadChat();
    } else {
      window.location.href = "profile.html";
    }
  });
}

document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
document.getElementById('github-signin').addEventListener('click', signInWithGitHub);
document.getElementById('email-signin').addEventListener('click', signInWithEmail);
document.getElementById('phone-signin').addEventListener('click', signInWithPhone);

function handleLogin(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      currentUser = userCredential.user;
      checkUserProfile();
    })
    .catch(error => {
      console.log("Error logging in", error);
    });
}

function loadUserProfile(userData) {
  document.getElementById('username-display').textContent = userData.username;
  if (userData.profilePictureUrl) {
    document.getElementById('profile-pic-display').src = userData.profilePictureUrl;
  }
}

function loadChat() {
  document.getElementById('chat-container').style.display = 'block';
  messagesRef.on('child_added', snapshot => {
    const message = snapshot.val();
    displayMessage(message);
  });
}

function sendMessage() {
  const messageInput = document.getElementById('message-text');
  const message = messageInput.value;

  if (message && currentUser) {
    const newMessageRef = messagesRef.push();
    newMessageRef.set({
      uid: currentUser.uid,
      username: currentUser.displayName,
      text: message,
      profilePictureUrl: currentUser.photoURL || '',
      timestamp: Date.now()
    });
    messageInput.value = '';
  }
}

function displayMessage(message) {
  const messagesDiv = document.getElementById('messages-container');
  const messageElement = document.createElement('div'); 
  messageElement.classList.add('token1');
  const profilePic = document.createElement('img');
  profilePic.src = message.profilePictureUrl || '/beautifulSunsetByChatGpt.png';
  profilePic.classList.add('pp');
  profilePic.onclick = () => showUserProfile(message.uid);

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content1');
  messageContent.textContent = `${message.username}: ${message.text}`;

  messageElement.appendChild(profilePic);
  messageElement.appendChild(messageContent);
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showUserProfile(uid) {
  userRef.child(uid).once('value', snapshot => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      alert(`Username: ${userData.username}\nProfile Picture: ${userData.profilePictureUrl}`);
    }
  });
}

document.getElementById('send-message').addEventListener('click', sendMessage);

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    checkUserProfile();
  } else {
    // Handle case where no user is signed in
  }
});
