package co.edu.unbosque.springsecurity.service.Decorator;

import co.edu.unbosque.springsecurity.service.Factory.Tarifa;


public abstract class TarifaExtraDecorator implements Tarifa {


    protected Tarifa tarifaBase;

    public TarifaExtraDecorator(Tarifa tarifaBase) {
        this.tarifaBase = tarifaBase;
    }
    


    @Override
    public Double calcularTarifa(Double peso) {

        return tarifaBase.calcularTarifa(peso);
    }


    @Override
    public String getDescripcion() {
        return tarifaBase.getDescripcion();
    }

    
    
}
