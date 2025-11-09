package co.edu.unbosque.springsecurity.service.Strategy;

public class PagoContraEntrega implements PagoStrategy {

    @Override
    public PagoResult realizarPago(Double monto) {

         System.out.println("Pago por contra entrega.");

        return  new PagoResult(0.0, null);
    }




}
