package co.edu.unbosque.springsecurity.service.Strategy;

import java.util.Random;

public class PagoEfecty implements PagoStrategy {
    
    @Override
    public PagoResult realizarPago(Double monto) {
        String codigoPago = generarCodigoPago();
        System.out.println("💳 Pago Efecty generado: " + codigoPago);
        System.out.println("Monto a pagar: $" + monto);
        return new PagoResult(monto, codigoPago);
    }
    

   private String generarCodigoPago() {
        Random random = new Random();
        int codigo = random.nextInt(1000000);
        return "EF-" + String.format("%06d", codigo);
    }
}
