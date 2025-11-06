package co.edu.unbosque.springsecurity.service.Strategy;

import java.util.Random;

public class PagoEfecty implements PagoStrategy {
    
    @Override
    public Double realizarPago(Double monto) {

        String codigoPago= generarCodigoPago();
        System.out.println("Pago por Efecty seleccionado.");
        System.out.println("Se generó el código de pago: " + codigoPago);
        System.out.println("El cliente debe pagar $" + monto + " en un punto Efecty con este código.");

        return 0.0;

    }
    

    public String generarCodigoPago(){

        Random random= new Random();

        int codigoPago= random.nextInt(1000000);

        return "EF-"+ codigoPago;
    }
}
