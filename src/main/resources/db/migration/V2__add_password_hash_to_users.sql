-- password_hash es nullable: usuarios OAuth2 (Google/Facebook) no tienen contraseña propia
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
