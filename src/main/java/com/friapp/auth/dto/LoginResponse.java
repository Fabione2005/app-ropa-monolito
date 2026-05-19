package com.friapp.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private UUID id;

    @JsonProperty("nombre_completo")
    private String nombreCompleto;

    private String email;

    @JsonProperty("points_balance")
    private int pointsBalance;
}
