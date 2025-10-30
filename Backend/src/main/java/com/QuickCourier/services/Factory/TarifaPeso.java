package com.QuickCourier.services.Factory;

public class TarifaPeso {

    public static double getRecargoPeso(double peso){

        if(peso<=1) return 4000;
        else if(peso<=3) return 4500;
        else if(peso<=5) return 6500;
        else return 9000;

    }
    
}
