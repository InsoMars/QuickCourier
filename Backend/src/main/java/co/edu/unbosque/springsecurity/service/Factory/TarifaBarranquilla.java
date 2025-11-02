package co.edu.unbosque.springsecurity.service.Factory;

public class TarifaBarranquilla implements Tarifa {


    @Override
    public Double calcularTarifa(Double peso) {

        double tarifaBarranquilla=14000;
       
        if (peso<=1) return tarifaBarranquilla;
        else if (peso<=2.5) return tarifaBarranquilla+ 2000;
        else if (peso<=4) return tarifaBarranquilla+ 5000;
        else if (peso<=7) return tarifaBarranquilla +8000;
        else return tarifaBarranquilla+12000;
    }

    
}
