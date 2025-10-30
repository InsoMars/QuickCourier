package com.QuickCourier.services.Factory;

public class EnvioBogota implements Envio {

    @Override
    public double calcularCosto(double peso, String localidad) {
        
        double tarifaBase=Localidad.getTarifaBase(localidad);
        double recargoPeso= TarifaPeso.getRecargoPeso(peso);
        return tarifaBase+recargoPeso;

    }
    
}
