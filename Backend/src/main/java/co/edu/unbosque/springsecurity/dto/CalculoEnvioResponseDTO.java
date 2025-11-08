package co.edu.unbosque.springsecurity.dto;



public class CalculoEnvioResponseDTO {
    private double totalCompra;   
    private double costoEnvio;    
    private double pesoTotal;     
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
