package com.markcollab.integration;

import com.github.javafaker.Faker;
import com.markcollab.controller.AuthController;
import com.markcollab.payload.AuthRegisterRequest;
import com.markcollab.payload.MessageResponse; // <-- Importe o MessageResponse
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AuthIntegrationTest {

    @Autowired
    private AuthController authController;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
    }

    private AuthRegisterRequest generateEmployerData() {
        return AuthRegisterRequest.builder()
                .cpf(faker.number().digits(11))
                .name(faker.name().fullName())
                .username(faker.name().username())
                .email(faker.internet().emailAddress())
                .password("Valid1234")
                .role("EMPLOYER")
                .companyName(faker.company().name())
                .aboutMe(faker.lorem().sentence())
                .experience(faker.lorem().sentence())
                .build();
    }

    private AuthRegisterRequest generateFreelancerData() {
        return AuthRegisterRequest.builder()
                .cpf(faker.number().digits(11))
                .name(faker.name().fullName())
                .username(faker.name().username())
                .email(faker.internet().emailAddress())
                .password("Valid1234")
                .role("FREELANCER")
                .portfolioLink(faker.internet().url())
                .aboutMe(faker.lorem().sentence())
                .experience(faker.lorem().sentence())
                .build();
    }

    @Test
    public void shouldRegisterEmployerSuccessfully_whenAllFieldsAreValid() {
        AuthRegisterRequest body = generateEmployerData();
        // AQUI: Chame o método 'register' do authController diretamente
        ResponseEntity<MessageResponse> response = authController.register(body);
        assertEquals("Empregador registrado com sucesso!", response.getBody().getMessage());
    }

    @Test
    public void shouldRegisterFreelancerSuccessfully_whenAllFieldsAreValid() {
        AuthRegisterRequest body = generateFreelancerData();
        // AQUI: Chame o método 'register' do authController diretamente
        ResponseEntity<MessageResponse> response = authController.register(body);
        assertEquals("Freelancer registrado com sucesso!", response.getBody().getMessage());
    }

    @Test
    public void shouldReturnBadRequest_whenEmailIsDuplicate() {
        AuthRegisterRequest body = generateEmployerData();
        authController.register(body); // Chama o método 'register'

        AuthRegisterRequest duplicateEmailData = AuthRegisterRequest.builder()
                .cpf(faker.number().digits(11))
                .name(faker.name().fullName())
                .username(faker.name().username())
                .email(body.getEmail())
                .password("Valid1234")
                .role("EMPLOYER")
                .companyName(faker.company().name())
                .aboutMe(faker.lorem().sentence())
                .experience(faker.lorem().sentence())
                .build();

        // AQUI: Chame o método 'register' do authController diretamente
        ResponseEntity<MessageResponse> response = authController.register(duplicateEmailData);
        assertTrue(response.getBody().getMessage().contains("E-mail já está em uso"));
    }

    @Test
    public void shouldReturnBadRequest_whenCpfIsDuplicate() {
        AuthRegisterRequest body = generateFreelancerData();
        authController.register(body); // Chama o método 'register'

        AuthRegisterRequest duplicateCpfData = AuthRegisterRequest.builder()
                .cpf(body.getCpf())
                .name(faker.name().fullName())
                .username(faker.name().username())
                .email(faker.internet().emailAddress())
                .password("Valid1234")
                .role("FREELANCER")
                .portfolioLink(faker.internet().url())
                .aboutMe(faker.lorem().sentence())
                .experience(faker.lorem().sentence())
                .build();

        // AQUI: Chame o método 'register' do authController diretamente
        ResponseEntity<MessageResponse> response = authController.register(duplicateCpfData);
        assertTrue(response.getBody().getMessage().contains("CPF já em uso"));
    }

    @Test
    public void shouldReturnBadRequest_whenRoleIsInvalid() {
        AuthRegisterRequest body = AuthRegisterRequest.builder()
                .cpf(faker.number().digits(11))
                .name(faker.name().fullName())
                .username(faker.name().username())
                .email(faker.internet().emailAddress())
                .password("Valid1234")
                .role("INVALID")
                .aboutMe(faker.lorem().sentence())
                .experience(faker.lorem().sentence())
                .build();
        // AQUI: Chame o método 'register' do authController diretamente
        ResponseEntity<MessageResponse> response = authController.register(body);
        assertTrue(response.getBody().getMessage().contains("Role inválido"));
    }

    @Test
    public void shouldReturnBadRequest_whenUsernameIsDuplicate() {
        AuthRegisterRequest body = generateEmployerData();
        authController.register(body); // Chama o método 'register'

        AuthRegisterRequest duplicateUsernameData = AuthRegisterRequest.builder()
                .cpf(faker.number().digits(11))
                .name(faker.name().fullName())
                .username(body.getUsername())
                .email(faker.internet().emailAddress())
                .password("Valid1234")
                .role("EMPLOYER")
                .companyName(faker.company().name())
                .aboutMe(faker.lorem().sentence())
                .experience(faker.lorem().sentence())
                .build();

        // AQUI: Chame o método 'register' do authController diretamente
        ResponseEntity<MessageResponse> response = authController.register(duplicateUsernameData);
        assertTrue(response.getBody().getMessage().contains("Username já está em uso"));
    }
}