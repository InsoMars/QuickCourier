package co.edu.unbosque.springsecurity.service.Decorator;

import co.edu.unbosque.springsecurity.service.Factory.Tarifa;

public class ExtraEntregaExpress extends TarifaExtraDecorator {

    public ExtraEntregaExpress(Tarifa tarifaBase) {
        super(tarifaBase);
    }

    

    @Override
    public Double calcularTarifa(Double peso) {

        return super.calcularTarifa(peso)+10000;
    }

      @Override
    public String getDescripcion() {
        
        return super.getDescripcion()+ "Entrega express";
    }
    
}
