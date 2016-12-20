class  Otro {
    constructor(controladorEstado){
        this.ce =controladorEstado;
    }
    actualizar(delta){

    }
    dibujar(){
        ctx.fillStyle = 'Blue';
        ctx.font = 'italic 30pt Calibri';
        ctx.fillText("LOGEATE PARA PODER JUGAR" , 150 , 200);
    }
    tecladoPulsado(e){
        if(TECLA_ARRIBA ===e.keyCode){
            console.log("Tecla presionada");
        }
    }
    tecladoSoltado(e){
        if(TECLA_ARRIBA ===e.keyCode){
            console.log("Tecla Soltado");
        }
    }
}