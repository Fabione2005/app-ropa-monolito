package com.friapp.auth.service;

import com.friapp.auth.dto.LoginRequest;
import com.friapp.auth.dto.LoginResponse;
import com.friapp.auth.dto.RegistroRequest;
import com.friapp.auth.dto.RegistroResponse;
import com.friapp.shared.config.JwtConfig;
import com.friapp.shared.exception.BusinessException;
import com.friapp.users.entity.User;
import com.friapp.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;

    @Transactional
    public RegistroResponse registrar(RegistroRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya está registrado");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getNombreCompleto());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getTelefono());

        User saved = userRepository.save(user);
        return new RegistroResponse("Usuario registrado exitosamente", saved.getId());
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos");
        }

        String token = jwtConfig.generateToken(user);
        return new LoginResponse(token, user.getId(), user.getFullName(),
                user.getEmail(), user.getPointsBalance());
    }
}
