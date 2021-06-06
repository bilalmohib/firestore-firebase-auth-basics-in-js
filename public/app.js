//This section is for google authentication
const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signedInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Welcome ${user.displayName} <p>User ID : ${user.uid}</p></h3>`;

    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = "";
    }
});

//This section is for google authentication

//This section is for firestore

const firestoreDB = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubscribe;


auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = firestoreDB.collection(`Data/${user.displayName}/${user.uid}/`);




        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            let nameP = document.getElementById("name").value;

            if (nameP == "") {
                alert("Please enter the name to continue");
                return;
            }



            const ref = thingsRef.doc();
            const id = ref.id;

            thingsRef.add({
                uid: user.uid,
                name: nameP,
                createAt: serverTimestamp(),
                UniqueID:id
            }).then(() => {
                console.log("Data sent"+" "+id);
            })
        }
        unsubscribe = thingsRef
            .where('uid', "==", user.uid)
            // .orderBy('createAt')
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li>${doc.data().name} and ID is: ${doc.data().UniqueID}</li>`
                });
                thingsList.innerHTML = items.join('');
            })

    }
});
//This section is for firestore

