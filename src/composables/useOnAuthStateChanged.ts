import { auth } from "@/firebase";
import router from "@/router";


const useOnAuthStateChanged = (store: any, afterFunction: () => any) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      store.commit("setFirebaseUser", user);
      afterFunction();
      return user
    } else {
      router.push("/");
    }
  })
}
export default useOnAuthStateChanged;