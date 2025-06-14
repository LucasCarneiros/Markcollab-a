/*

package com.markcollab.controller; // <-- Mude o pacote para o correto

import com.markcollab.service.MercadoPagoService; // <-- Importe o MercadoPagoService
import com.markcollab.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*; // Para when, verify, times
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// O pacote correto para testes de controlador geralmente é o mesmo do controlador ou um subpacote
// Ex: package com.markcollab.controller;

public class ProjectControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProjectService projectService;

    @Mock // <-- Adicione um mock para o MercadoPagoService
    private MercadoPagoService mercadoPagoService;

    private ProjectController projectController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // AGORA, passe AMBOS os mocks para o construtor do ProjectController
        projectController = new ProjectController(projectService, mercadoPagoService);
        mockMvc = MockMvcBuilders.standaloneSetup(projectController).build();
    }


    @Test
    void testGetProjects() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/projects/open"))
                .andExpect(MockMvcResultMatchers.status().isOk());

        Mockito.verify(projectService, Mockito.times(1)).findAll();
        // Se este método findAll() ou o /api/projects/open não depender do MercadoPagoService,
        // não precisa de mais mocks aqui para este teste específico.
    }

    // Você precisará adicionar um teste para o endpoint de pagamento (payProject) aqui,
    // simulando chamadas e verificando o comportamento, assim como fiz no meu exemplo anterior.
    // Exemplo:
    /*
    @Test
    void payProject_shouldReturnInitPoint_whenSuccessful() throws Exception {
        // Mockando o comportamento do projectService e mercadoPagoService conforme necessário
        // ...
        mockMvc.perform(post("/api/projects/1/pay/14078327435"))
               .andExpect(status().isOk())
               .andExpect(content().string(containsString("https://sandbox.mercadopago.com/checkout/v1/redirect")));
        // ...
    }
    */
/*
}

*/