package co.edu.unbosque.springsecurity.dto;

import java.util.List;

public class CalculoEnvioDTO {


    private String ciudad;
    private boolean empaqueRegalo;
    private boolean envioExpress;
    private boolean envioSeguro;
    private boolean manejoFragil;
    private List<DetalleFacturaDTO> productos;

    
    public String getCiudad() {
        return ciudad;
    }
    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }
    public boolean isEmpaqueRegalo() {
        return empaqueRegalo;
    }
    public void setEmpaqueRegalo(boolean empaqueRegalo) {
        this.empaqueRegalo = empaqueRegalo;
    }
    public boolean isEnvioExpress() {
        return envioExpress;
    }
    public void setEnvioExpress(boolean envioExpress) {
        this.envioExpress = envioExpress;
    }
    public boolean isEnvioSeguro() {
        return envioSeguro;
    }
    public void setEnvioSeguro(boolean envioSeguro) {
        this.envioSeguro = envioSeguro;
    }
    public boolean isManejoFragil() {
        return manejoFragil;
    }
    public void setManejoFragil(boolean manejoFragil) {
        this.manejoFragil = manejoFragil;
    }
    public List<DetalleFacturaDTO> getProductos() {
        return productos;
    }
    public void setProductos(List<DetalleFacturaDTO> productos) {
        this.productos = productos;
    }

    

    



    
}
