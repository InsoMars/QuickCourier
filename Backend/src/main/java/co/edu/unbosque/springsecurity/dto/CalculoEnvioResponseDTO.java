package co.edu.unbosque.springsecurity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public class CalculoEnvioResponseDTO {
    private double totalCompra;   // total de productos
    private double costoEnvio;    // costo del envío
    private double pesoTotal;     // peso calculado
    private double totalFinal;


    public CalculoEnvioResponseDTO(double totalCompra, double costoEnvio, double pesoTotal, double totalFinal) {
        this.totalCompra = totalCompra;
        this.costoEnvio = costoEnvio;
        this.pesoTotal = pesoTotal;
        this.totalFinal = totalFinal;
    }


    public CalculoEnvioResponseDTO() {
    }


    public double getTotalCompra() {
        return totalCompra;
    }


    public void setTotalCompra(double totalCompra) {
        this.totalCompra = totalCompra;
    }


    public double getCostoEnvio() {
        return costoEnvio;
    }


    public void setCostoEnvio(double costoEnvio) {
        this.costoEnvio = costoEnvio;
    }


    public double getPesoTotal() {
        return pesoTotal;
    }


    public void setPesoTotal(double pesoTotal) {
        this.pesoTotal = pesoTotal;
    }


    public double getTotalFinal() {
        return totalFinal;
    }


    public void setTotalFinal(double totalFinal) {
        this.totalFinal = totalFinal;
    }


    



    
    
}
