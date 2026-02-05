const admin = require('firebase-admin');
const fs = require('fs');

// ──────────────────────────────────────────
// SETUP
// ──────────────────────────────────────────
// Download your service account key from Firebase Console:
// Project Settings → Service Accounts → Generate New Private Key
// Save it as 'serviceAccountKey.json' in the same directory as this script
//
// IMPORTANT: Add 'serviceAccountKey.json' to your .gitignore file!
// This file contains sensitive credentials and should NEVER be committed to Git.
// ──────────────────────────────────────────

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ──────────────────────────────────────────
// IMPORT FUNCTION
// ──────────────────────────────────────────

async function importData() {
  console.log('🚀 Starting data import...\n');

  // Read the JSON file
  const data = JSON.parse(fs.readFileSync('./firebase_seed_data.json', 'utf8'));

  let totalImported = 0;

  // Import each collection
  for (const [collectionName, documents] of Object.entries(data)) {
    console.log(`📦 Importing collection: ${collectionName}`);
    
    for (const [docId, docData] of Object.entries(documents)) {
      try {
        // If the document has an empty 'id' field, set it to the document ID
        if (docData.id === '') {
          docData.id = docId;
        }

        await db.collection(collectionName).doc(docId).set(docData);
        console.log(`  ✓ Created document: ${docId}`);
        totalImported++;
      } catch (error) {
        console.error(`  ✗ Error creating document ${docId}:`, error);
      }
    }
    
    console.log('');
  }

  console.log(`✅ Import complete! Total documents imported: ${totalImported}`);
}

// ──────────────────────────────────────────
// RUN
// ──────────────────────────────────────────

importData()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });