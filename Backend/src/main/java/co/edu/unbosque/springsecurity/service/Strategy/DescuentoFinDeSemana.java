package co.edu.unbosque.springsecurity.service.Strategy;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class DescuentoFinDeSemana implements DescuentoStrategy {

    @Override
     public double aplicarDescuento(double costoEnvio, String username) {
        DayOfWeek hoy = LocalDate.now().getDayOfWeek();
        if (hoy == DayOfWeek.SATURDAY || hoy == DayOfWeek.SUNDAY) {
            System.out.println(" Descuento aplicado: fin de semana");
            return costoEnvio * 0.90; 
        }else{
            System.out.println("Descuento fin de semana NO aplicable");
        }
        return costoEnvio;
    }

    @Override
    public String getDescripcion() {
       return "Descuento del 10% por fin de semana";
    }
    
}
