package com.markcollab.config;

import com.markcollab.model.Employer;
import com.markcollab.model.Freelancer;
import com.markcollab.repository.EmployerRepository;
import com.markcollab.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Importe este para HttpMethod.OPTIONS
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Optional;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor // Gera o construtor para EmployerRepository e FreelancerRepository
public class SecurityConfig {

    // Repositórios necessários para o UserDetailsService
    private final EmployerRepository employerRepository;
    private final FreelancerRepository freelancerRepository;

    @Bean
    // securityFilterChain recebe o HttpSecurity, JwtAuthenticationFilter e AuthenticationProvider
    // como parâmetros injetados pelo Spring, quebrando o ciclo de dependências.
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthFilter, // Injetado automaticamente pelo Spring
            AuthenticationProvider authenticationProvider // Injetado automaticamente pelo Spring
    ) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita CSRF para APIs REST
                .cors(withDefaults()) // Aplica a configuração de CORS definida no bean corsConfigurationSource()
                .authorizeHttpRequests(auth -> auth
                        // Permite requisições OPTIONS (preflight CORS) para qualquer caminho
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Rotas públicas (autenticação e pagamento)
                        .requestMatchers("/api/auth/**", "/api/projects/*/pay/*").permitAll()
                        // Todas as outras requisições exigem autenticação
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sessão sem estado para JWT
                )
                // Define o provedor de autenticação que o Spring Security deve usar
                .authenticationProvider(authenticationProvider)
                // Adiciona o filtro JWT antes do filtro padrão de autenticação de usuário/senha do Spring Security
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean para configurar as permissões de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite requisições do seu frontend local
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        // Cabeçalhos que podem ser enviados na requisição
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        // Permite envio de credenciais (cookies, cabeçalhos de autorização como JWT)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração de CORS a todas as rotas
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // --- BEANS DE AUTENTICAÇÃO NECESSÁRIOS PARA O SPRING SECURITY ---

    // Define como o Spring Security carrega os detalhes do usuário (ex: do banco de dados)
    @Bean
    public UserDetailsService userDetailsService() {
        return identifier -> { // Renomeado para 'identifier' para maior clareza
            // Tenta encontrar o usuário em EmployerRepository
            return employerRepository.findByEmail(identifier)
                    .map(user -> (UserDetails) user) // Mapeia para UserDetails
                    .or(() -> employerRepository.findById(identifier).map(user -> (UserDetails) user)) // Tenta por CPF
                    .or(() -> employerRepository.findByUsername(identifier).map(user -> (UserDetails) user)) // Tenta por Username

                    // Se não for encontrado em EmployerRepository, tenta em FreelancerRepository
                    .or(() -> freelancerRepository.findByEmail(identifier).map(user -> (UserDetails) user)) // Tenta por email
                    .or(() -> freelancerRepository.findById(identifier).map(user -> (UserDetails) user)) // Tenta por CPF
                    .or(() -> freelancerRepository.findByUsername(identifier).map(user -> (UserDetails) user)) // Tenta por Username

                    // Se não encontrar em nenhum lugar, lança a exceção
                    .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + identifier));
        };
    }

    // Define o codificador de senhas (BCrypt é amplamente recomendado)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Define o provedor de autenticação, que usa o UserDetailsService e o PasswordEncoder
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService()); // Define o serviço de detalhes do usuário
        authProvider.setPasswordEncoder(passwordEncoder());       // Define o codificador de senhas
        return authProvider;
    }

    // Define o gerenciador de autenticação principal
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}