package co.edu.unbosque.springsecurity.service.Factory;

public class TarifaBogota implements Tarifa {


    @Override
    public Double calcularTarifa(Double peso) {

        double tarifaBogota=8000;
       
        if (peso<=1) return tarifaBogota;
        else if (peso<=2.5) return tarifaBogota+ 2000;
        else if (peso<=4) return tarifaBogota+ 5000;
        else if (peso<=7) return tarifaBogota +8000;
        else return tarifaBogota+12000;
    }

    
}
