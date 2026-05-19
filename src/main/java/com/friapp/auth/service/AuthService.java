package com.friapp.auth.service;

import com.friapp.auth.dto.RegistroRequest;
import com.friapp.auth.dto.RegistroResponse;
import com.friapp.shared.exception.BusinessException;
import com.friapp.users.entity.User;
import com.friapp.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
}
