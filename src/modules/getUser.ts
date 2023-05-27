import { db } from "@/firebase";
import {
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

const getUser = async (
  userUid: string
): Promise<DocumentSnapshot<DocumentData>> => {
  const docRef = doc(db, "users", userUid);
  const data = await getDoc(docRef);
  return data;
};

export default getUser;
