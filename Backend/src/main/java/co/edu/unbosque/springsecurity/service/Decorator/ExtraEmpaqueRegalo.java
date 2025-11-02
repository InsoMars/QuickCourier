package co.edu.unbosque.springsecurity.service.Decorator;

import co.edu.unbosque.springsecurity.service.Factory.Tarifa;

public class ExtraEmpaqueRegalo extends TarifaExtraDecorator {

    public ExtraEmpaqueRegalo(Tarifa tarifaBase) {
        super(tarifaBase);
    }

    

    @Override
    public Double calcularTarifa(Double peso) {

        return super.calcularTarifa(peso)+5000;
    }

      @Override
    public String getDescripcion() {
        
        return super.getDescripcion()+ "Empaque regalo";
    }

    
}
