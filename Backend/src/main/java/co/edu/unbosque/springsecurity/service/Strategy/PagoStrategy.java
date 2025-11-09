package co.edu.unbosque.springsecurity.service.Strategy;

public interface PagoStrategy {


    PagoResult realizarPago(Double monto);
    
}
