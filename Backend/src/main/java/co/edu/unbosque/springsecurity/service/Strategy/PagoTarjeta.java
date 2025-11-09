package co.edu.unbosque.springsecurity.service.Strategy;

public class PagoTarjeta implements PagoStrategy {

    

    @Override
    public PagoResult realizarPago(Double monto) {

        Double cobroTotal = monto * 0.015;
        return new PagoResult(cobroTotal, null);
    }

    
}
