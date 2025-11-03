package co.edu.unbosque.springsecurity.dto;


public class DetalleFacturaDTO {

    private Long idDetalleFacturaProducto;
    private int cantidadProducto;
    private Double subtotalProducto;
    private Long idProducto;


    
    public Long getIdDetalleFacturaProducto() {
        return idDetalleFacturaProducto;
    }
    public void setIdDetalleFacturaProducto(Long idDetalleFacturaProducto) {
        this.idDetalleFacturaProducto = idDetalleFacturaProducto;
    }
    public int getCantidadProducto() {
        return cantidadProducto;
    }
    public void setCantidadProducto(int cantidadProducto) {
        this.cantidadProducto = cantidadProducto;
    }
    public Double getSubtotalProducto() {
        return subtotalProducto;
    }
    public void setSubtotalProducto(Double subtotalProducto) {
        this.subtotalProducto = subtotalProducto;
    }
    public Long getIdProducto() {
        return idProducto;
    }
    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }
    
   


    
    
    
}
