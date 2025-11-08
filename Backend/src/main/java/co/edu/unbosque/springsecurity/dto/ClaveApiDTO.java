package co.edu.unbosque.springsecurity.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaveApiDTO {
    private Long id;
    private String clave;
    private String propietario;
    private String descripcion;
    private boolean revocada;
    private LocalDateTime fechaCreacion;
}
