import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

export async function fetchItems() {
  const snapshot = await getDocs(collection(firestore, "items"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
