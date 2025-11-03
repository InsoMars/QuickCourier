package co.edu.unbosque.springsecurity.service.Factory;

import org.springframework.stereotype.Component;


@Component
public class TarifaFactory {


    public static Tarifa calcularTarifaBase(String ciudad){

       switch (ciudad.toLowerCase()){

        case "bogota": 
        return new TarifaBogota();

        case "medellin":
        return new TarifaMedellin();

        case "bucaramanga":
        return new TarifaBucaramanga();

        case "cali":
        return new TarifaCali();

        case "barranquilla":

        return new TarifaBarranquilla();

        default: throw new IllegalArgumentException("Ciudad no soportada: " + ciudad);
       } 


}

}