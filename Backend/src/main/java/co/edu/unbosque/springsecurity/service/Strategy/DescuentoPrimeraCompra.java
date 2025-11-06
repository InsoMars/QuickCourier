package co.edu.unbosque.springsecurity.service.Strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import co.edu.unbosque.springsecurity.model.Cliente;
import co.edu.unbosque.springsecurity.repository.ClienteRepository;

@Component
public class DescuentoPrimeraCompra implements DescuentoStrategy {


    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public double aplicarDescuento(double totalCompra, String username) {
        Cliente cliente = clienteRepository.findByEmail(username).orElse(null);

        if (cliente != null && cliente.isPrimeraCompra()) {
            cliente.setPrimeraCompra(false); 
            clienteRepository.save(cliente);
            return totalCompra * 0.50; 
        }else{
            System.out.println("Descuento de primera compra NO aplicable");
        }
        return totalCompra;
    }

    @Override
    public String getDescripcion() {
        return  "Descuento del 50% por primera compra";
    }
    
}
