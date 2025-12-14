// Offline storage utilities using localStorage
// For a production app, consider using IndexedDB for larger datasets

export interface Animal {
  id: number;
  name: string;
  species: string;
  age: string;
  gender?: string;
  image?: string;
  health?: string;
}
export interface CareRecord {
  id: number;
  animalId: number;
  type: string;
  date: string;
  notes: string;
  completed: boolean;
}
const ANIMALS_KEY = 'animalcare_animals';
const CARE_RECORDS_KEY = 'animalcare_care_records';
const SYNC_QUEUE_KEY = 'animalcare_sync_queue';

// Animals
export function getAnimals(): Animal[] {
  try {
    const data = localStorage.getItem(ANIMALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading animals:', error);
    return [];
  }
}
export function saveAnimal(animal: Animal): void {
  try {
    const animals = getAnimals();
    const index = animals.findIndex(a => a.id === animal.id);
    if (index >= 0) {
      animals[index] = animal;
    } else {
      animals.push(animal);
    }
    localStorage.setItem(ANIMALS_KEY, JSON.stringify(animals));
    addToSyncQueue({
      type: 'animal',
      action: 'save',
      data: animal
    });
  } catch (error) {
    console.error('Error saving animal:', error);
  }
}
export function deleteAnimal(id: number): void {
  try {
    const animals = getAnimals().filter(a => a.id !== id);
    localStorage.setItem(ANIMALS_KEY, JSON.stringify(animals));
    addToSyncQueue({
      type: 'animal',
      action: 'delete',
      data: {
        id
      }
    });
  } catch (error) {
    console.error('Error deleting animal:', error);
  }
}

// Care Records
export function getCareRecords(animalId?: number): CareRecord[] {
  try {
    const data = localStorage.getItem(CARE_RECORDS_KEY);
    const records = data ? JSON.parse(data) : [];
    return animalId ? records.filter((r: CareRecord) => r.animalId === animalId) : records;
  } catch (error) {
    console.error('Error reading care records:', error);
    return [];
  }
}
export function saveCareRecord(record: CareRecord): void {
  try {
    const records = getCareRecords();
    const index = records.findIndex(r => r.id === record.id);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.push(record);
    }
    localStorage.setItem(CARE_RECORDS_KEY, JSON.stringify(records));
    addToSyncQueue({
      type: 'care',
      action: 'save',
      data: record
    });
  } catch (error) {
    console.error('Error saving care record:', error);
  }
}
export function deleteCareRecord(id: number): void {
  try {
    const records = getCareRecords().filter(r => r.id !== id);
    localStorage.setItem(CARE_RECORDS_KEY, JSON.stringify(records));
    addToSyncQueue({
      type: 'care',
      action: 'delete',
      data: {
        id
      }
    });
  } catch (error) {
    console.error('Error deleting care record:', error);
  }
}

// Sync Queue (for when app comes back online)
interface SyncQueueItem {
  type: 'animal' | 'care';
  action: 'save' | 'delete';
  data: any;
  timestamp?: number;
}
function addToSyncQueue(item: SyncQueueItem): void {
  try {
    const queue = getSyncQueue();
    queue.push({
      ...item,
      timestamp: Date.now()
    });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to sync queue:', error);
  }
}
export function getSyncQueue(): SyncQueueItem[] {
  try {
    const data = localStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading sync queue:', error);
    return [];
  }
}
export function clearSyncQueue(): void {
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing sync queue:', error);
  }
}

// Initialize with mock data if empty
export function initializeMockData(): void {
  if (getAnimals().length === 0) {
    const mockAnimals: Animal[] = [{
      id: 1,
      name: 'Max',
      species: 'Golden Retriever',
      age: '3 yrs',
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60',
      health: 'Healthy'
    }, {
      id: 2,
      name: 'Luna',
      species: 'Siamese Cat',
      age: '2 yrs',
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&auto=format&fit=crop&q=60',
      health: 'Healthy'
    }, {
      id: 3,
      name: 'Clover',
      species: 'Holland Lop',
      age: '1 yr',
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1585110396000-c9285742770f?w=600&auto=format&fit=crop&q=60',
      health: 'Healthy'
    }, {
      id: 4,
      name: 'Kiwi',
      species: 'Parrotlet',
      age: '4 yrs',
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&auto=format&fit=crop&q=60',
      health: 'Healthy'
    }];
    mockAnimals.forEach(animal => {
      localStorage.setItem(ANIMALS_KEY, JSON.stringify(mockAnimals));
    });
  }
}