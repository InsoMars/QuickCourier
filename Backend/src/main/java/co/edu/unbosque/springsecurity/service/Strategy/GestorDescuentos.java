package co.edu.unbosque.springsecurity.service.Strategy;

import java.util.ArrayList;
import java.util.List;

public class GestorDescuentos {

    private final List<DescuentoStrategy> estrategias = new ArrayList<>();


    public void agregarEstrategia(DescuentoStrategy estrategia) {
        estrategias.add(estrategia);
    }


     public double aplicarDescuentos(double total, String username) {
        for (DescuentoStrategy estrategia : estrategias) {
            double nuevoTotal = estrategia.aplicarDescuento(total, username);
            if (nuevoTotal != total) { 
                System.out.println("✅ Descuento aplicado: " + estrategia.getDescripcion());
                return nuevoTotal;
            }
        }
        return total;
    }

    
}
