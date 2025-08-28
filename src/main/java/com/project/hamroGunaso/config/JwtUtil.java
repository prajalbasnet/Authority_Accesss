package com.project.hamroGunaso.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.project.hamroGunaso.ENUM.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;

    @Value("${jwt.reset.expiration-minutes:15}") // reset token default 15 minutes
    private long resetTokenExpirationMinutes;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Regular login token (1 hour)
    public String generateToken(String email, Role role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Reset token generator (short-lived)
    public String generateResetToken(String email, Role role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + resetTokenExpirationMinutes * 60 * 1000)) // e.g., 15 mins
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email (subject)
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extract role
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Check if token expired
    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Validate token for email
    public boolean validateToken(String token, String email) {
        return extractEmail(token).equals(email) && !isTokenExpired(token);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
