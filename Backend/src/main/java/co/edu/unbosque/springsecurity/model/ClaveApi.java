package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clave_api")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaveApi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String clave;

    @Column(nullable = false)
    private String propietario;

    private String descripcion;

    @Column(nullable = false)
    private boolean revocada = false;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
}
