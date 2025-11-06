package co.edu.unbosque.springsecurity.service.Strategy;

public interface DescuentoStrategy {

    double aplicarDescuento(double totalCompra, String username);

    String getDescripcion();
    
}
