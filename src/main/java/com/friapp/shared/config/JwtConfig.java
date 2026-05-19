package com.friapp.shared.config;

import com.friapp.users.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtConfig {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-days:7}")
    private int expirationDays;

    public String generateToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        long expirationMs = (long) expirationDays * 24 * 60 * 60 * 1000;

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }
}
