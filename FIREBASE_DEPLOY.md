# 🚀 Deploy Firebase Configuration

## Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

## Deploy Commands

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### Deploy Everything
```bash
firebase deploy
```

## Verify Deployment

### Check Rules:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **customer-18261**
3. Firestore Database → Rules
4. Verify rules are updated

### Check Indexes:
1. Firestore Database → Indexes
2. Should see indexes for:
   - restaurants (category + rating)
   - orders (userId + createdAt)
   - menus (isAvailable + category)

## Troubleshooting

### If deployment fails:
```bash
# Re-initialize
firebase init firestore

# Select existing project
# Choose firestore.rules and firestore.indexes.json

# Deploy again
firebase deploy --only firestore
```

### If indexes are missing:
- Wait for Firebase to auto-suggest index creation
- Or manually create in Firebase Console
- Or deploy using: `firebase deploy --only firestore:indexes`
