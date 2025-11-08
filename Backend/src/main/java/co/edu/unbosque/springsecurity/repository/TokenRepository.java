package co.edu.unbosque.springsecurity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.Token;


@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
 @Query("""
        SELECT t FROM Token t
        WHERE t.usuario.id = :id
        AND (t.expirado = false OR t.revocado = false)
        """)
    List<Token> findAllValidTokensByUserId(@Param("id") Long id);
    
    Optional<Token> findByToken(String token);

}
