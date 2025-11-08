package co.edu.unbosque.springsecurity.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="tarifa_peso")
public class TarifaPeso {

    

@Id
@Column(name="id_peso")
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long idPeso;

@Column(name="maximo_peso")
private Double maxPeso;

@Column(name="precio_peso")
private Double precioPeso;



}
