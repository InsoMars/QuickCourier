package co.edu.unbosque.springsecurity.service.Decorator;

import co.edu.unbosque.springsecurity.service.Factory.Tarifa;

public class ExtraManejoFragil extends TarifaExtraDecorator {

    public ExtraManejoFragil(Tarifa tarifaBase) {
        super(tarifaBase);
    }

    

    @Override
    public Double calcularTarifa(Double peso) {

        return super.calcularTarifa(peso)+15000;
    }

    @Override
    public String getDescripcion() {
        
        return super.getDescripcion()+ "Manejo Fragil";
    }


    
}
