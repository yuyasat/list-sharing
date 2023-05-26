import { User as FirebaseUser } from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "@/firebase";

const setUser = async (user: FirebaseUser) => {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    displayName: user.displayName,
  });
};
export default setUser;