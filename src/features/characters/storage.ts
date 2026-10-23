import type { PuppetRigV1 } from "@/features/puppet/rig";

export type Character = {
  id: string; name: string; image: Blob; rig: PuppetRigV1;
  backgroundId: "rustic-bar"; outfitId: "portrait-original";
  sources: { name: string; size: number; type: string; status: "not-processed" }[];
  createdAt: string;
};
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("historical-bar", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("characters", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("No se pudo abrir el almacenamiento local."));
    request.onblocked = () => reject(new Error("Cerrá otras pestañas del bar y volvé a intentar."));
  });
}
async function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("characters", mode);
    const request = action(tx.objectStore("characters"));
    tx.oncomplete = () => { db.close(); resolve(request.result); };
    tx.onabort = tx.onerror = () => { db.close(); reject(new Error("No se pudo guardar o leer el personaje. Revisá el espacio disponible y los permisos del navegador.")); };
  });
}
export const saveCharacter = (character: Character) => transact("readwrite", store => store.put(character));
export const getCharacter = (id: string): Promise<Character | undefined> => transact("readonly", store => store.get(id));
export const listCharacters = (): Promise<Character[]> => transact("readonly", store => store.getAll());
