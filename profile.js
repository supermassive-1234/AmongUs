// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const usersRef = database.ref('users');

let currentUser = null;

function saveProfile() {
  if (!currentUser) {
    alert('No user is signed in. Please log in first.');
    console.log('Current user is null');
    return;
  }

  const username = document.getElementById('profile-username').value;
  const profilePicFile = document.getElementById('profile-pic').files[0];

  if (username && profilePicFile) {
    const userRef = usersRef.child(currentUser.uid);
    const storageRef = storage.ref(`profilePictures/${currentUser.uid}`);

    storageRef.put(profilePicFile).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(url => {
      return userRef.set({
        username: username,
        profilePictureUrl: url
      });
    }).then(() => {
      alert('Profile was successfully saved!');
      window.location.href = "chatroom.html";
    }).catch(error => {
      console.log("Error saving profile: ", error);
    });
  } else {
    alert('Please fill all the fields');
  }
}

function updateProfile() {
  if (!currentUser) {
    alert('No user is signed in. Please log in first.');
    console.log('Current user is null');
    return;
  }

  const username = document.getElementById('profile-username').value;
  const profilePicFile = document.getElementById('profile-pic').files[0];

  if (username) {
    const userRef = usersRef.child(currentUser.uid);

    if (profilePicFile) {
      const storageRef = storage.ref(`profilePictures/${currentUser.uid}`);

      storageRef.put(profilePicFile).then(snapshot => {
        return snapshot.ref.getDownloadURL();
      }).then(url => {
        return userRef.update({
          username: username,
          profilePictureUrl: url
        });
      }).then(() => {
        alert('Profile updated successfully');
      }).catch(error => {
        console.log("Error updating profile: ", error);
      });
    } else {
      userRef.update({
        username: username
      }).then(() => {
        alert('Profile updated successfully!');
      }).catch(error => {
        console.log("Error updating profile: ", error);
      });
    }
  } else {
    alert('Please enter a username');
  }
}

document.getElementById('save-profile').addEventListener('click', saveProfile);
document.getElementById('update-profile').addEventListener('click', updateProfile);

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    console.log('User signed in:', currentUser);
    usersRef.child(currentUser.uid).once('value', snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        document.getElementById('profile-username').value = userData.username;
        document.getElementById('save-profile').style.display = 'none';
        document.getElementById('edit-profile').style.display = 'block';
        document.getElementById('update-profile').style.display = 'block';
      } else {
        console.log('No profile data found for this user.');
      }
    }).catch(error => {
      console.log("Error fetching user data: ", error);
    });
  } else {
    console.log('No user signed in');
    window.location.href = "profile.html";  // Redirect to login page
  }
});
