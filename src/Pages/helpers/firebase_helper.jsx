import firebase from 'firebase/compat/app';

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";

class FirebaseAuthBackend {
  constructor(firebaseConfig) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          localStorage.setItem("authUser", JSON.stringify(user));
          this.isAdmin(user.uid).then(res=>{
            const isAdmin = res.data().admin ? true : false
            localStorage.setItem("isAdmin", isAdmin);
          }).catch(err=>{
            console.log(err)
          })
        } else {
          localStorage.removeItem("authUser");
          localStorage.removeItem("isAdmin")
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password, username) => {
    //console.log("email", email, password)
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          users => {
            firebase.firestore().collection('users').doc(users.user.uid).set({
              email: email,
              username: username
            })
            //console.log("user", users)
            resolve(firebase.auth().currentUser);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Registers the user with given details
   */
  editProfileAPI = (email, password) => {
    //console.log("edit", email, password)
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          user => {

            this.addNewUserToFirestore(user)
            resolve(firebase.auth().currentUser);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          user => {
            //console.log("login user", user)
            //this.addNewUserToFirestore(user)
            resolve(firebase.auth().currentUser);
          },
          error => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = email => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + "//" + window.location.host + "/login",
        })
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Social Login user with given details
   */
  socialLoginUser = (data, type) => {
    let credential = {};
    if (type === "google") {
      credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.token);
    } else if (type === "facebook") {
      credential = firebase.auth.FacebookAuthProvider.credential(data.token);
    }
    return new Promise((resolve, reject) => {
      if (!!credential) {
        firebase.auth().signInWithCredential(credential)
          .then(user => {
            resolve(this.addNewUserToFirestore(user));
          })
          .catch(error => {
            reject(this._handleError(error));
          });
      } else {
        reject(this._handleError("failed to register"));
      }
    });
  };

  addNewUserToFirestore = (user) => {
    const collection = firebase.firestore().collection("users");
    const { profile } = user.additionalUserInfo;
    const details = {
      firstName: profile.given_name ? profile.given_name : profile.first_name,
      lastName: profile.family_name ? profile.family_name : profile.last_name,
      fullName: profile.name,
      email: profile.email,
      picture: profile.picture,
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp()
    };
    collection.doc(firebase.auth().currentUser.uid).set(details);
    return { user, details };
  };

  setLoggeedInUser = user => {
    localStorage.setItem("authUser", JSON.stringify(user));
    this.isAdmin(user.uid).then(res=>{
      //console.log("admin res",res.data())
      const isAdmin = res.data().admin ? true : false
      localStorage.setItem("isAdmin", isAdmin);
    })
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null;
    return JSON.parse(localStorage.getItem("authUser"));
  };

  isAdmin = (uid)=>{
    return new Promise((resolve, reject) => {
      //console.log("uid",uid)
      const collection = firebase.firestore().collection("users").doc(uid).get().then(snapshots => {
        //console.log("user collection", snapshots)
        resolve(snapshots)
      }).catch(err => {
        reject(err)
      })

    })
  }

  postArticleNameList = (values,edit)=>{
    return new Promise((resolve, reject) => {
      let collectionList = []
      firebase.firestore().collection('articleName').doc('KLj4TQDDg5TH6PjS3H2N').update({
        articleName: edit? firebase.firestore.FieldValue.arrayUnion(values) : values
      })
      .then(function() {
        console.log('Array values successfully added to the document.');
        resolve('Array values successfully added to the document.')
      })
      .catch(function(error) {
        console.error('Error adding array values to the document:', error);
        reject(error)
      });

    })
  }
  // to fetch firestore collection
  getDbCollection = (name) => {
    return new Promise((resolve, reject) => {
      const collection = firebase.firestore().collection(name).get().then(snapshots => {
        resolve(snapshots.docs)
      }).catch(err => {
        reject(err)
      })

    })
  }

  // to create firestore collection
  postDbCollection = (name, data) => {
    return new Promise((resolve, reject) => {
      const collection = firebase.firestore().collection(name).add(data).then(snapshots => {
        //console.log("collection add", snapshots)
        resolve(snapshots)
      }).catch(err => {
        reject(err)
      })

    })
  }

  //to update firebasestore collection
  updateDbCollection = (name, docId, newData) => {
    console.log("updateDBCollection",name,"--",newData)
    return new Promise((resolve, reject) => {
      const collection = firebase.firestore().collection(name).doc(docId).update(newData).then(snapshots => {
        //console.log("collection update", snapshots)
        resolve(snapshots)
      }).catch(err => {
        reject(err)
      })

    })
  }

  //to delete a collection in firebase
  deleteCollection = (name) => {
    console.log("DeleteDBCollection",name)
    return new Promise((resolve, reject) => {
      const collectionRef = firebase.firestore().collection(name);

      console.log("collectionRef",collectionRef,collectionRef.parent)
      collectionRef.get().then((querySnapshot) => {
        // Delete each document in the collection
        console.log("querySnapshot",querySnapshot)
        querySnapshot.forEach((doc) => {
          doc.ref.delete().then(() => {
            console.log('Document successfully deleted!',doc,"ref",doc.ref,);
            resolve(true)
          }).catch((error) => {
            console.error('Error deleting document: ', error);
            reject(false)
          });
        });
      }).then(() => {
        // After deleting all documents, you can also delete the collection itself
        collectionRef?.parent?.doc(collectionRef.id).delete().then(() => {
          console.log('Collection successfully deleted!');
          resolve("Delete Successful!")
        }).catch((error) => {
          console.error('Error deleting collection: ', error);
          reject(error)
        });
      }).catch((error) => {
        console.error('Error getting documents: ', error);
        reject(error)
      });

    })
  }

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}


let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = () => {
  let firebaseConfig = {
      apiKey: "AIzaSyA8klfWXZsZetSXRCEHYo55bL-EIWC1F3Y",
      authDomain: "iconicstartups.firebaseapp.com",
      projectId: "iconicstartups",
      storageBucket: "iconicstartups.appspot.com",
      messagingSenderId: "392080616183",
      appId: "1:392080616183:web:662f43ee0abf1524fac1f2",
      measurementId: "G-7KWHVZ7RK3"
    };
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(firebaseConfig);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
