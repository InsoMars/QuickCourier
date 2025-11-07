package co.edu.unbosque.springsecurity.service.Strategy;

public class PagoTarjeta implements PagoStrategy {

    

    @Override
    public Double realizarPago(Double monto) {

        Double cobroTotal = monto * 0.015;
        return cobroTotal;
    }

    
}
