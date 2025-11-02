package co.edu.unbosque.springsecurity.service.Decorator;

import co.edu.unbosque.springsecurity.service.Factory.Tarifa;

public class ExtraEnvioSeguro extends TarifaExtraDecorator {

    public ExtraEnvioSeguro(Tarifa tarifaBase) {
        super(tarifaBase);
    }

    

    @Override
    public Double calcularTarifa(Double peso) {

        return super.calcularTarifa(peso)+20000;
    }

      @Override
    public String getDescripcion() {
        
        return super.getDescripcion()+ "Envío seguro";
    }
}
