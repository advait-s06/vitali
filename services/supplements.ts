import { loadData, saveData } from './storage';

export type Supplement = {
  id: string;
  name: string;
  days: string[];
  times: string[];
  withFood: boolean;
  takenDates: string[];
};

const SUPPLEMENTS_KEY = 'supplements';

export async function getSupplements(): Promise<Supplement[]> {
  const supplements = await loadData<Supplement[]>(SUPPLEMENTS_KEY);
  return supplements ?? [];
}

export async function saveSupplements(supplements: Supplement[]): Promise<void> {
  await saveData(SUPPLEMENTS_KEY, supplements);
}

export async function addSupplement(newSupplement: Supplement): Promise<void> {
  const current = await getSupplements();
  const updated = [...current, newSupplement];
  await saveSupplements(updated);
}

export async function updateSupplement(updatedSupplement: Supplement): Promise<void> {
  const current = await getSupplements();
  const updated = current.map((item) =>
    item.id === updatedSupplement.id ? updatedSupplement : item
  );
  await saveSupplements(updated);
}

export async function deleteSupplement(id: string): Promise<void> {
  const current = await getSupplements();
  const updated = current.filter((item) => item.id !== id);
  await saveSupplements(updated);
}

export async function toggleTakenForDate(id: string, dateKey: string): Promise<void> {
  const current = await getSupplements();

  const updated = current.map((item) => {
    if (item.id !== id) return item;

    const takenDates = item.takenDates ?? [];
    const alreadyTaken = takenDates.includes(dateKey);

    return {
      ...item,
      takenDates: alreadyTaken
        ? takenDates.filter((d) => d !== dateKey)
        : [...takenDates, dateKey],
    };
  });

  await saveSupplements(updated);
}