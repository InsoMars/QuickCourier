package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
@Entity
@Table(name = "token")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_token")
    private Long id;

    @Column(unique = true)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name="token_type")
    private TokenType tokenType = TokenType.BEARER;

    private boolean revocado;
    private boolean expirado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    private Cliente usuario;
}
