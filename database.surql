{
	events: {},
	fields: {
		password: "DEFINE FIELD password ON users TYPE string ASSERT $value != '' PERMISSIONS FULL",
		username: "DEFINE FIELD username ON users TYPE string ASSERT $value != '' PERMISSIONS FULL"
	},
	indexes: {
		usernameIndex: 'DEFINE INDEX usernameIndex ON users FIELDS username UNIQUE'
	},
	lives: {},
	tables: {}
}


-------- Query 1 --------

{
	accesses: {
		public: "DEFINE ACCESS public ON DATABASE TYPE RECORD SIGNUP (RETURN {  }) SIGNIN (RETURN {  }) WITH JWT ALGORITHM HS512 KEY '[REDACTED]' WITH ISSUER KEY '[REDACTED]' DURATION FOR TOKEN 1h, FOR SESSION 1h",
		user: "DEFINE ACCESS user ON DATABASE TYPE RECORD SIGNUP (CREATE users SET username = $username, password = crypto::argon2::generate($password)) SIGNIN (SELECT * FROM users WHERE username = $username AND crypto::argon2::compare(password, $password)) WITH JWT ALGORITHM HS512 KEY '[REDACTED]' WITH ISSUER KEY '[REDACTED]' DURATION FOR TOKEN 1h, FOR SESSION NONE"
	},
	analyzers: {},
	apis: {},
	configs: {},
	functions: {},
	models: {},
	params: {},
	tables: {
		users: 'DEFINE TABLE users TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, update WHERE id = $auth.id, FOR create, delete NONE'
	},
	users: {
		"database-admin": "DEFINE USER `database-admin` ON DATABASE PASSHASH '$argon2id$v=19$m=19456,t=2,p=1$AhRiibb1imxx9GhQIKNeyw$KPru3i9KSYCvgXZ7Bu+mWLois348A1oDXtqghcPdz/8' ROLES OWNER, EDITOR, VIEWER DURATION FOR TOKEN 1h, FOR SESSION NONE"
	}
}