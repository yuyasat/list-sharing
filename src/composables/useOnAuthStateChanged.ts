import { auth } from "@/firebase";


const useOnAuthStateChanged = (store: any, afterFunction: () => any) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log(user);
      store.commit("setFirebaseUser", user);
      afterFunction();
      return user
    }
  })
}
export default useOnAuthStateChanged;