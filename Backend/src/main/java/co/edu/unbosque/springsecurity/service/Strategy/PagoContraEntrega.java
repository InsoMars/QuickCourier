package co.edu.unbosque.springsecurity.service.Strategy;

public class PagoContraEntrega implements PagoStrategy {

    @Override
    public Double realizarPago(Double monto) {

         System.out.println("Pago por contra entrega.");

        return 0.0;
    }




}
