package com.markcollab.payload; // Ou com.markcollab.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
    // Você pode ter outros campos, como um código de erro, status, etc.
    // private String status;
}