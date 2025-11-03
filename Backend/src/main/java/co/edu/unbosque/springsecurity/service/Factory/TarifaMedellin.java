package co.edu.unbosque.springsecurity.service.Factory;

public class TarifaMedellin implements Tarifa {


    @Override
    public Double calcularTarifa(Double peso) {

        double tarifaMedellin=15000;
       
        if (peso<=1) return tarifaMedellin;
        else if (peso<=2.5) return tarifaMedellin+ 2000;
        else if (peso<=4) return tarifaMedellin+ 5000;
        else if (peso<=7) return tarifaMedellin +8000;
        else return tarifaMedellin+12000;
    }

    @Override
    public String getDescripcion() {
       return "Envío Medellín";
    }

    
}
