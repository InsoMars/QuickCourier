package co.edu.unbosque.springsecurity.service.Strategy;

import org.springframework.stereotype.Component;

@Component
public class ControladorPago {

    public static PagoStrategy procesarPago(String metodoPago){


        switch (metodoPago.toLowerCase()){

            case "contraentrega":

            return new PagoContraEntrega();

            case "efecty":
 
            return new PagoEfecty();

            case "tarjeta":

            return new PagoTarjeta();
        
         default: throw new IllegalArgumentException("Método no soportado: " + metodoPago);

    }
    
}
}
