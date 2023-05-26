import { db } from "@/firebase";
import router from "@/router";
import {
  collection,
  query,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";

const checkValidWorkspace = async (loginUserUid: string | undefined, workspaceId: string) => {
  const q = query(
    collection(db, "workspaces"),
    where("members", "array-contains", loginUserUid),
    where(documentId(), "==", workspaceId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.docs.length === 0) router.push("/workspaces");
};

export default checkValidWorkspace;