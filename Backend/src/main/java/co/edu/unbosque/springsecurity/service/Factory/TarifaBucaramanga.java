package co.edu.unbosque.springsecurity.service.Factory;

public class TarifaBucaramanga implements Tarifa {


    @Override
    public Double calcularTarifa(Double peso) {

        double tarifaBucaramanga=12000;
       
        if (peso<=1) return tarifaBucaramanga;
        else if (peso<=2.5) return tarifaBucaramanga+ 2000;
        else if (peso<=4) return tarifaBucaramanga+ 5000;
        else if (peso<=7) return tarifaBucaramanga +8000;
        else return tarifaBucaramanga+12000;
    }

     @Override
    public String getDescripcion() {
       return "Envío Bucaramanga";
    }
    
}
