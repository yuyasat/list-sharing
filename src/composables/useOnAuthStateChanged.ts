import { auth } from "@/firebase";
import router from "@/router";

const useOnAuthStateChanged = (store: any, afterFunction: () => any) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const _user = { displayName: user.displayName, uid: user.uid, email: user.email, }
      store.commit("setFirebaseUser", _user);
      afterFunction();
      return user
    } else {
      router.push("/");
    }
  })
}
export default useOnAuthStateChanged;