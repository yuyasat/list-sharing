import { User as FirebaseUser } from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "@/firebase";
import getUser from "./getUser";

const setUser = async (store: any, user: FirebaseUser) => {
  const data = await getUser(user.uid);
  const _user = {
    displayName: user.displayName,
    uid: user.uid,
    email: user.email,
  };
  store.commit("setFirebaseUser", _user);
  if (!data.data()) {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName,
      createdAt: new Date(),
    });
  } else {
    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        displayName: user.displayName,
      },
      { merge: true }
    );
  }
};
export default setUser;
