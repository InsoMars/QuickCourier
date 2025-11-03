package co.edu.unbosque.springsecurity.service.Factory;

public class TarifaCali implements Tarifa {


    @Override
    public Double calcularTarifa(Double peso) {

        double tarifaCali=10000;
       
        if (peso<=1) return tarifaCali;
        else if (peso<=2.5) return tarifaCali+ 2000;
        else if (peso<=4) return tarifaCali+ 5000;
        else if (peso<=7) return tarifaCali +8000;
        else return tarifaCali+12000;
    }

     @Override
    public String getDescripcion() {
       return "Envío Cali";
    }
}
