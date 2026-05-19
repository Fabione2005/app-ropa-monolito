package com.friapp.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroRequest {

    @NotBlank(message = "El nombre completo es requerido")
    @JsonProperty("nombre_completo")
    private String nombreCompleto;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El formato del email no es válido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    private String telefono;

    @NotNull(message = "Debes aceptar los términos y condiciones")
    @AssertTrue(message = "Debes aceptar los términos y condiciones")
    @JsonProperty("acepta_terminos")
    private Boolean aceptaTerminos;
}
