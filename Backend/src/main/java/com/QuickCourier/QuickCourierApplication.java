package com.QuickCourier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.QuickCourier.services.PedidoService;

@SpringBootApplication
public class QuickCourierApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickCourierApplication.class, args);
	

	PedidoService service = new PedidoService();
	double costo = service.calcularCostoEnvio("Barrios Unidos", 7);
	System.out.println("Costo total del envío: " + costo);
	}

}
