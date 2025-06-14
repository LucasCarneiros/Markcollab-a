package com.markcollab.service;

import com.markcollab.model.Project;
import com.markcollab.model.Employer;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferencePayerRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value; // <-- Importe esta anotação
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    private final PreferenceClient preferenceClient;

    // Injeta o valor de 'frontend.base-url' do application.properties
    @Value("${frontend.base-url}") // <-- Adicione esta linha
    private String frontendBaseUrl; // <-- Altere o nome da variável para evitar conflito

    public MercadoPagoService() {
        this.preferenceClient = new PreferenceClient();
    }

    public String createPaymentPreference(Project project, Employer employer) throws MPException, MPApiException {
        // Crie um item para o pagamento (o projeto)
        PreferenceItemRequest itemRequest =
                PreferenceItemRequest.builder()
                        .id(String.valueOf(project.getProjectId()))
                        .title(project.getProjectTitle())
                        .description(project.getProjectDescription())
                        .quantity(1)
                        .currencyId("BRL") // Moeda Brasileira
                        .unitPrice(new BigDecimal(project.getProjectPrice()))
                        .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        items.add(itemRequest);

        // Crie os dados do pagador
        PreferencePayerRequest payerRequest =
                PreferencePayerRequest.builder()
                        .name(employer.getName())
                        .email(employer.getEmail())
                        .build();

        // AGORA, use a frontendBaseUrl injetada
        String successUrl = frontendBaseUrl + "/pagamento/sucesso";
        String pendingUrl = frontendBaseUrl + "/pagamento/pendente";
        String failureUrl = frontendBaseUrl + "/pagamento/falha";

        // --- ADICIONE ESTA LINHA PARA DEPURAR (É CRUCIAL!) ---
        System.out.println("DEBUG MP: Gerando URL de sucesso como: " + successUrl);
        // ----------------------------------------------------

        PreferenceRequest preferenceRequest =
                PreferenceRequest.builder()
                        .items(items)
                        .payer(payerRequest)
                        .backUrls(com.mercadopago.client.preference.PreferenceBackUrlsRequest.builder()
                                .success(successUrl) // Use a variável 'successUrl'
                                .pending(pendingUrl)
                                .failure(failureUrl)
                                .build())
                        .autoReturn("approved") // Correção já aplicada
                        .build();

        // Crie a preferência de pagamento
        Preference preference = preferenceClient.create(preferenceRequest);

        // Retorne a URL de inicialização (init_point)
        return preference.getInitPoint();
    }
}