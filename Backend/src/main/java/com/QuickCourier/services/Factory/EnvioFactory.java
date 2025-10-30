package com.QuickCourier.services.Factory;

public class EnvioFactory {

    public static Envio crearEnvio(){
        return new EnvioBogota();
    }
    
}
