package co.edu.unbosque.springsecurity.service.Strategy;

public interface DescuentoStrategy {

    double aplicarDescuento(double costoEnvio, String username);

    String getDescripcion();
    
}




