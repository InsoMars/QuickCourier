package co.edu.unbosque.springsecurity.service.Strategy;

public class PagoTarjeta implements PagoStrategy {

    

    @Override
    public Double realizarPago(Double monto) {

        Double cobroTotal = monto * 0.015;
        System.out.println("Procesando pago de $" + cobroTotal);
        return cobroTotal;
    }

    
}
