package com.markcollab.controller;

import com.markcollab.dto.ProjectDTO;
import com.markcollab.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.markcollab.model.Employer; // Importe o modelo Employer
import com.markcollab.model.Project;   // Importe o modelo Project
import com.markcollab.service.MercadoPagoService;
import com.mercadopago.exceptions.MPApiException; // <-- Importe as exceções do MP
import com.mercadopago.exceptions.MPException;   // <-- Importe as exceções do MP

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired // <-- ADICIONE ESTA INJEÇÃO
    private MercadoPagoService mercadoPagoService;

    /**
     * 1) Retorna todos os projetos abertos (open=true).
     *    GET /api/projects/open
     */
    @GetMapping("/open")
    public ResponseEntity<List<ProjectDTO>> getOpenProjects() {
        return ResponseEntity.ok(projectService.getOpenProjects());
    }

    /**
     * 2) Retorna um único projeto no formato DTO.
     *    GET /api/projects/{projectId}
     */
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long projectId) {
        try {
            ProjectDTO dto = projectService.getProjectById(projectId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 3) Cria novo projeto (POST /api/projects/{employerCpf})
     */
    @PostMapping("/{employerCpf}")
    public ResponseEntity<ProjectDTO> createProject(
            @PathVariable String employerCpf,
            @RequestBody com.markcollab.model.Project project) {
        ProjectDTO saved = projectService.createProject(project, employerCpf);
        return ResponseEntity.ok(saved);
    }

    /**
     * 4) Atualiza apenas o status de um projeto (PUT /api/projects/{projectId}/status/{employerCpf})
     */
    @PutMapping("/{projectId}/status/{employerCpf}")
    public ResponseEntity<?> updateProjectStatus(
            @PathVariable Long projectId,
            @PathVariable String employerCpf,
            @RequestBody String newStatus) {
        try {
            com.markcollab.model.Project updated = projectService.updateProjectStatus(projectId, newStatus, employerCpf);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            String msg = ex.getMessage();
            if ("Unauthorized action".equals(msg)) {
                return ResponseEntity.status(403).body("Unauthorized action");
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    /**
     * 5) Contrata um freelancer para este projeto:
     *    POST /api/projects/{projectId}/hire/{freelancerCpf}/{employerCpf}
     */
    @PostMapping("/{projectId}/hire/{freelancerCpf}/{employerCpf}")
    public ResponseEntity<ProjectDTO> hireFreelancer(
            @PathVariable Long projectId,
            @PathVariable String freelancerCpf,
            @PathVariable String employerCpf) {
        ProjectDTO dto = projectService.hireFreelancer(projectId, freelancerCpf, employerCpf);
        return ResponseEntity.ok(dto);
    }

    /**
     * 6) Atualiza dados gerais do projeto (PUT /api/projects/{projectId}/{employerCpf})
     */
    @PutMapping("/{projectId}/{employerCpf}")
    public ResponseEntity<?> updateProject(
            @PathVariable Long projectId,
            @RequestBody com.markcollab.model.Project updatedProject,
            @PathVariable String employerCpf) {
        try {
            com.markcollab.model.Project updated = projectService.updateProject(projectId, updatedProject, employerCpf);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            String msg = ex.getMessage();
            if ("Unauthorized action".equals(msg)) {
                return ResponseEntity.status(403).body("Unauthorized action");
            }
            return ResponseEntity.badRequest().body(msg);
        }
    }

    /**
     * 7) Deleta projeto (DELETE /api/projects/{projectId}/{employerCpf})
     */
    @DeleteMapping("/{projectId}/{employerCpf}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            @PathVariable String employerCpf) {
        projectService.deleteProject(projectId, employerCpf);
        return ResponseEntity.noContent().build();
    }

    /**
     * 8) Cria Interesse (proposta) para este projeto:
     *    POST /api/projects/{projectId}/interest/{freelancerCpf}
     */
    @PostMapping("/{projectId}/interest/{freelancerCpf}")
    public ResponseEntity<?> addInterest(
            @PathVariable Long projectId,
            @PathVariable String freelancerCpf) {
        return ResponseEntity.ok(projectService.addInterest(projectId, freelancerCpf));
    }

    /**
     * 9) Gera descrição automática via IA (POST /api/projects/{projectId}/generate-description)
     */
    @PostMapping("/{projectId}/generate-description")
    public ResponseEntity<ProjectDTO> generateDescription(
            @PathVariable Long projectId) {
        ProjectDTO dto = projectService.generateProjectDescription(projectId);
        return ResponseEntity.ok(dto);
    }

    /**
     * 10) Retorna todos os projetos (abertos ou não) de um empregador específico.
     *     GET /api/projects/employer/{employerCpf}
     */
    @GetMapping("/employer/{employerCpf}")
    public ResponseEntity<List<ProjectDTO>> getByEmployer(@PathVariable String employerCpf) {
        try {
            List<ProjectDTO> lista = projectService.getProjectsByEmployer(employerCpf);
            return ResponseEntity.ok(lista);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 11) Retorna todos os projetos em que um freelancer foi contratado.
     *     GET /api/projects/freelancer/{freelancerCpf}
     */
    @GetMapping("/freelancer/{freelancerCpf}")
    public ResponseEntity<List<ProjectDTO>> getByFreelancer(@PathVariable String freelancerCpf) {
        try {
            List<ProjectDTO> lista = projectService.getProjectsByFreelancer(freelancerCpf);
            return ResponseEntity.ok(lista);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 12) Inicia o fluxo de pagamento para um projeto através do Checkout Pro.
     * POST /api/projects/{projectId}/pay/{employerCpf}
     * Retorna a URL de redirecionamento do Mercado Pago (init_point).
     */
    @PostMapping("/{projectId}/pay/{employerCpf}")
    public ResponseEntity<String> payProject(
            @PathVariable Long projectId,
            @PathVariable String employerCpf) {
        try {
            // Primeiro, obtenha o projeto e o empregador (ENTIDADES COMPLETAS)
            // Esses métodos 'findProjectById' e 'findEmployerByCpf' serão criados/ajustados no ProjectService
            Project project = projectService.findProjectById(projectId);
            Employer employer = projectService.findEmployerByCpf(employerCpf);

            // VALIDAÇÕES PARA INICIAR O PAGAMENTO:
            // 1. Verifica se o empregador que está tentando pagar é realmente o dono do projeto.
            if (project.getProjectEmployer() == null || !project.getProjectEmployer().getCpf().equals(employerCpf)) {
                return ResponseEntity.status(403).body("Ação não autorizada: Apenas o empregador do projeto pode iniciar o pagamento.");
            }

            // 2. Verifica se o projeto está em um status que permita INICIAR o pagamento.
            // Para o seu fluxo, o pagamento é o passo ENTRE aceitar a proposta e de fato "contratar" no DB.
            // O projeto deve estar 'Aberto' ou talvez 'Aguardando Pagamento'.
            // Não deve estar já 'Concluído' ou 'Cancelado'.
            if (project.getStatus() == null ||
                    (!project.getStatus().equals("Aberto") && !project.getStatus().equals("Em andamento"))) { // Inclua 'Em andamento' se for o caso
                return ResponseEntity.badRequest().body("O projeto não está no status 'Aberto' (ou 'Em andamento') para iniciar o pagamento.");
            }

            // Se as validações passarem, crie a preferência de pagamento no Mercado Pago
            String initPoint = mercadoPagoService.createPaymentPreference(project, employer);

            // Retorna a URL de redirecionamento do Mercado Pago para o frontend
            return ResponseEntity.ok(initPoint);
        } catch (MPApiException e) {
            // Erro específico da API do Mercado Pago
            System.err.println("Erro na API do Mercado Pago: " + new String(e.getApiResponse().getContent()));
            return ResponseEntity.status(e.getStatusCode()).body("Erro ao processar pagamento com Mercado Pago: " + e.getMessage());
        } catch (MPException e) {
            // Erro geral da SDK do Mercado Pago
            System.err.println("Erro geral do Mercado Pago (SDK): " + e.getMessage());
            return ResponseEntity.status(500).body("Erro interno ao processar pagamento com Mercado Pago.");
        } catch (RuntimeException e) {
            // Erros como "Project not found" ou "Employer not found" que vêm do ProjectService
            System.err.println("Erro durante a busca de projeto/empregador ou validação: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Captura qualquer outra exceção inesperada
            System.err.println("Erro inesperado ao iniciar pagamento: " + e.getMessage());
            e.printStackTrace(); // Imprime o stack trace para depuração
            return ResponseEntity.status(500).body("Ocorreu um erro inesperado ao iniciar o pagamento.");
        }
    }
}
