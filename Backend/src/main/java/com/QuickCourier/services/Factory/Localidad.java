package com.QuickCourier.services.Factory;

import java.util.HashMap;
import java.util.Map;

public class Localidad {

      private static final Map<String, Double> TARIFA_LOCALIDAD = new HashMap<>();

    static {
        TARIFA_LOCALIDAD.put("Suba", 8000.0);
        TARIFA_LOCALIDAD.put("Chapinero", 9500.0);
        TARIFA_LOCALIDAD.put("Engativa", 8800.0);
        TARIFA_LOCALIDAD.put("Usaquen", 9200.0);
        TARIFA_LOCALIDAD.put("Kennedy", 8700.0);
        TARIFA_LOCALIDAD.put("Barrios Unidos", 8600.0);
    }

    public static double getTarifaBase(String localidad) {
        return TARIFA_LOCALIDAD.getOrDefault(localidad, 5000.0); 
    }
    
}
