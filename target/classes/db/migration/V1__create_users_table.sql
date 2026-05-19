CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    rut VARCHAR(12) UNIQUE,
    rut_verified BOOLEAN NOT NULL DEFAULT FALSE,
    region VARCHAR(100),
    commune VARCHAR(100),
    points_balance INTEGER NOT NULL DEFAULT 0,
    rating_avg FLOAT NOT NULL DEFAULT 0.0,
    rating_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_rut ON users(rut);
