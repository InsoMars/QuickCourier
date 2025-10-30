package com.QuickCourier.dtos;

public class ProductDTO {


    private Long idProducto;
    private String descripcion;
    private Double precioUniProd;
    private String categoriaProd;
    private String nombreProd;
    private Double pesoProd;

    public ProductDTO(){

    }




    public ProductDTO(Long idProducto, String descripcion, Double precioUniProd, String categoriaProd,
            String nombreProd, Double pesoProd) {
        this.idProducto = idProducto;
        this.descripcion = descripcion;
        this.precioUniProd = precioUniProd;
        this.categoriaProd = categoriaProd;
        this.nombreProd = nombreProd;
        this.pesoProd = pesoProd;
    }




    public Long getIdProducto() {
        return idProducto;
    }




    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }




    public String getDescripcion() {
        return descripcion;
    }




    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }




    public Double getPrecioUniProd() {
        return precioUniProd;
    }




    public void setPrecioUniProd(Double precioUniProd) {
        this.precioUniProd = precioUniProd;
    }




    public String getCategoriaProd() {
        return categoriaProd;
    }




    public void setCategoriaProd(String categoriaProd) {
        this.categoriaProd = categoriaProd;
    }




    public String getNombreProd() {
        return nombreProd;
    }




    public void setNombreProd(String nombreProd) {
        this.nombreProd = nombreProd;
    }




    public Double getPesoProd() {
        return pesoProd;
    }




    public void setPesoProd(Double pesoProd) {
        this.pesoProd = pesoProd;
    }


    

    


    
}
