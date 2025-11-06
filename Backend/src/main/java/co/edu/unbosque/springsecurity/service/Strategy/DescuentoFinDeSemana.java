package co.edu.unbosque.springsecurity.service.Strategy;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class DescuentoFinDeSemana implements DescuentoStrategy {

    @Override
     public double aplicarDescuento(double totalCompra, String username) {
        DayOfWeek hoy = LocalDate.now().getDayOfWeek();
        if (hoy == DayOfWeek.THURSDAY || hoy == DayOfWeek.SUNDAY) {
            System.out.println(" Descuento aplicado: fin de semana");
            return totalCompra * 0.90; 
        }else{
            System.out.println("Descuento fin de semana NO aplicable");
        }
        return totalCompra;
    }

    @Override
    public String getDescripcion() {
       return "Descuento del 20% por fin de semana";
    }
    
}
