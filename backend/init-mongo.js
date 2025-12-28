db = db.getSiblingDB('userdb');

db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'userdb'
    }
  ]
});

db.createCollection('users'); 