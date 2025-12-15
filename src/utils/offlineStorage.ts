export interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  weight: number;
  color: string;
  medicalHistory: string;
  vaccinations: string[];
  lastCheckup?:  string;
  synced?:  boolean;
  lastModified?:  number;
}

export interface CareRecord {
  id: string;
  animalId: string;
  careType: 'feeding' | 'grooming' | 'exercise' | 'medication' | 'veterinary';
  date: string;
  notes: string;
  nextDue?: string;
  synced?:  boolean;
  lastModified?:  number;
}

let db: IDBDatabase;

const DB_NAME = 'AnimalCareDB';
const DB_VERSION = 1;
const STORE_ANIMALS = 'animals';
const STORE_CARE = 'care';

export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = event => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create Animals store
      if (!database.objectStoreNames.contains(STORE_ANIMALS)) {
        const animalsStore = database.createObjectStore(STORE_ANIMALS, {
          keyPath: 'id',
        });
        animalsStore.createIndex('name', 'name', { unique: false });
        animalsStore.createIndex('species', 'species', { unique: false });
        animalsStore.createIndex('lastModified', 'lastModified', { unique: false });
      }

      // Create Care store
      if (!database.objectStoreNames.contains(STORE_CARE)) {
        const careStore = database.createObjectStore(STORE_CARE, {
          keyPath: 'id',
        });
        careStore. createIndex('animalId', 'animalId', { unique:  false });
        careStore.createIndex('careType', 'careType', { unique: false });
        careStore.createIndex('date', 'date', { unique:  false });
        careStore.createIndex('lastModified', 'lastModified', { unique: false });
      }
    };
  });
}

// ========== ANIMAL OPERATIONS ==========

export async function addAnimal(animal:  Omit<Animal, 'id'>): Promise<Animal> {
  const animalData: Animal = {
    ... animal,
    id: Date.now().toString(),
    synced: false,
    lastModified: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db. transaction(STORE_ANIMALS, 'readwrite');
    const store = transaction.objectStore(STORE_ANIMALS);
    const request = store.add(animalData);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Request background sync if available
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(reg => {
          (reg as any).sync.register('sync-animals');
        });
      }
      resolve(animalData);
    };
  });
}

export async function getAnimals(): Promise<Animal[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ANIMALS, 'readonly');
    const store = transaction.objectStore(STORE_ANIMALS);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getAnimalById(id: string): Promise<Animal | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ANIMALS, 'readonly');
    const store = transaction. objectStore(STORE_ANIMALS);
    const request = store. get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function updateAnimal(animal: Animal): Promise<void> {
  const updatedAnimal = {
    ...animal,
    synced: false,
    lastModified: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ANIMALS, 'readwrite');
    const store = transaction. objectStore(STORE_ANIMALS);
    const request = store. put(updatedAnimal);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(reg => {
          (reg as any).sync.register('sync-animals');
        });
      }
      resolve();
    };
  });
}

export async function deleteAnimal(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_ANIMALS, 'readwrite');
    const store = transaction.objectStore(STORE_ANIMALS);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ========== CARE OPERATIONS ==========

export async function addCareRecord(care: Omit<CareRecord, 'id'>): Promise<CareRecord> {
  const careData: CareRecord = {
    ...care,
    id: Date.now().toString(),
    synced: false,
    lastModified: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CARE, 'readwrite');
    const store = transaction.objectStore(STORE_CARE);
    const request = store.add(careData);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(reg => {
          (reg as any).sync.register('sync-care');
        });
      }
      resolve(careData);
    };
  });
}

export async function getCareRecords(animalId?:  string): Promise<CareRecord[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CARE, 'readonly');
    const store = transaction. objectStore(STORE_CARE);
    
    let request;
    if (animalId) {
      const index = store.index('animalId');
      request = index.getAll(animalId);
    } else {
      request = store.getAll();
    }

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getCareRecordById(id: string): Promise<CareRecord | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CARE, 'readonly');
    const store = transaction.objectStore(STORE_CARE);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function updateCareRecord(care: CareRecord): Promise<void> {
  const updatedCare = {
    ...care,
    synced: false,
    lastModified: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_CARE, 'readwrite');
    const store = transaction.objectStore(STORE_CARE);
    const request = store.put(updatedCare);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(reg => {
          (reg as any).sync.register('sync-care');
        });
      }
      resolve();
    };
  });
}

export async function deleteCareRecord(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db. transaction(STORE_CARE, 'readwrite');
    const store = transaction.objectStore(STORE_CARE);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ========== MOCK DATA ==========

export async function initializeMockData(): Promise<void> {
  await initDatabase();
  
  const existingAnimals = await getAnimals();
  if (existingAnimals.length === 0) {
    // Add mock animals
    const mockAnimals:  Omit<Animal, 'id'>[] = [
      {
        name: 'Max',
        species: 'Dog',
        breed: 'Golden Retriever',
        dateOfBirth: '2020-05-15',
        weight: 30,
        color: 'Golden',
        medicalHistory: 'Healthy, no allergies',
        vaccinations: ['Rabies', 'DHPP'],
      },
      {
        name:  'Luna',
        species: 'Cat',
        breed: 'Persian',
        dateOfBirth:  '2021-03-20',
        weight: 4.5,
        color: 'White',
        medicalHistory: 'Sensitive stomach',
        vaccinations: ['FVRCP'],
      },
    ];

    for (const animal of mockAnimals) {
      await addAnimal(animal);
    }

    // Add mock care records
    const mockCare: Omit<CareRecord, 'id'>[] = [
      {
        animalId: (await getAnimals())[0].id,
        careType: 'feeding',
        date: new Date().toISOString().split('T')[0],
        notes: 'Fed with premium dog food',
        nextDue:  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        animalId: (await getAnimals())[1].id,
        careType: 'grooming',
        date:  new Date().toISOString().split('T')[0],
        notes: 'Brushed fur thoroughly',
        nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ];

    for (const care of mockCare) {
      await addCareRecord(care);
    }
  }
}

// ========== SYNC UTILITIES ==========

export async function getSyncStatus(): Promise<{
  animalsPending: number;
  carePending: number;
}> {
  const animals = await getAnimals();
  const care = await getCareRecords();

  return {
    animalsPending:  animals.filter(a => !a.synced).length,
    carePending: care.filter(c => !c.synced).length,
  };
}

export async function syncWithServer(apiBaseUrl: string): Promise<void> {
  // Sync animals
  const animals = await getAnimals();
  for (const animal of animals. filter(a => !a.synced)) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal),
      });

      if (response.ok) {
        animal.synced = true;
        await updateAnimal(animal);
      }
    } catch (error) {
      console.error('Failed to sync animal:', error);
    }
  }

  // Sync care records
  const care = await getCareRecords();
  for (const record of care.filter(c => !c.synced)) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/care`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });

      if (response.ok) {
        record.synced = true;
        await updateCareRecord(record);
      }
    } catch (error) {
      console.error('Failed to sync care record:', error);
    }
  }
}