import { loadData, saveData } from "./storage";

export type Supplement = {
  id: string;
  name: string;
  time: string;
  withFood: boolean;
  takenToday: boolean;
  days: string[];
};

const SUPPLEMENTS_KEY = "supplements";

export async function getSupplements(): Promise<Supplement[]> {
  const data = await loadData(SUPPLEMENTS_KEY);
  return data || [];
}

export async function addSupplement(newSupplement: Supplement) {
  const supplements = await getSupplements();
  const updated = [...supplements, newSupplement];
  await saveData(SUPPLEMENTS_KEY, updated);


}

export async function deleteSupplement(id: string) {
  const supplements = await getSupplements();
  const updated = supplements.filter((supplement) => supplement.id !== id);
  await saveData(SUPPLEMENTS_KEY, updated);
}

export async function toggleTaken(id: string) {
  const supplements = await getSupplements();
  const updated = supplements.map((supplement) =>
    supplement.id === id
      ? { ...supplement, takenToday: !supplement.takenToday }
      : supplement
  );
  await saveData(SUPPLEMENTS_KEY, updated);
}