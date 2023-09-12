
function lapiz(e){
    ctx.fillStyle=global.color;
    ctx.beginPath();
    ctx.arc(e.layerX, e.layerY,global.tamañoPunto/2 , 0,2*Math.PI*global.tamañoPunto/2);
    ctx.fill();

    if (e.buttons==1) global.ultimaImagen=ctx.getImageData(0,0,canvas.width, canvas.height);
}


function goma(e){
    if (e.buttons==1){
        ctx.fillStyle=global.fondo;
        ctx.fillRect(e.layerX-global.tamañoPunto*2,e.layerY-global.tamañoPunto*2,global.tamañoPunto*4,global.tamañoPunto*4);
        global.ultimaImagen=ctx.getImageData(0,0,canvas.width, canvas.height);
    }else if (e.buttons==2){
        borradoEspecial(e.layerX,e.layerY,global.tamañoPunto*4);
    }else{ 
        ctx.fillStyle='#ff000050';
        ctx.fillRect(e.layerX-global.tamañoPunto*2,e.layerY-global.tamañoPunto*2,global.tamañoPunto*4,global.tamañoPunto*4);
    }
}


const datos=document.querySelector('#datosChupete');
function chupete(e){
    let i=(e.offsetX+e.offsetY*global.ultimaImagen.width)*4;
    
    const r=global.ultimaImagen.data[i];
    const g=global.ultimaImagen.data[i+1];
    const b=global.ultimaImagen.data[i+2];
    const a=global.ultimaImagen.data[i+3];
    
    let rN=r.toString(16);
    if (rN<10) rN="0" +rN;
    let gN=g.toString(16);
    if (gN<10) gN="0" +gN;
    let bN=b.toString(16);
    if (bN<10) bN="0" +bN;
    let aN=a.toString(16);
    if (aN<10) aN="0" +aN;

    const colorNuevo="#"+rN+gN+bN+aN;
    datos.innerHTML=r+"|"+g+"|"+b+"|"+a;
    datos.style="display:block";
    datos.style=`color:${colorNuevo};`;


    if (e.buttons==1){
        document.querySelector('#color').style="background-color:"+colorNuevo+";";
        global.color=colorNuevo;
        alphaLapiz.value=a;

    }
    if (e.buttons==2){
        document.querySelector('#colorFondo').style="background-color:"+colorNuevo+";";
        alphaFondo.value=a;
        global.fondo=colorNuevo;
    }
}


class MiRectangulo{
    constructor(x,y,color){
        this.x=x;
        this.y=y
        ctx.strokeStyle=color;
        ctx.fillStyle=color;
    }
    move(x,y){
        this.x2=x-this.x;
        this.y2=y-this.y;
        this.dibujar();
    }
    dibujar(){
        ctx.lineWidth=global.tamañoPunto;
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.x2,this.y2);
        ctx.stroke();
        ctx.closePath();
    }

}

class MiRectanguloRelleno extends MiRectangulo{
    constructor(x,y,color,fondo){
        super(x,y,color);
        ctx.fillStyle=fondo;
    }
    dibujar(){
        ctx.lineWidth=global.tamañoPunto;
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.x2,this.y2);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}


let apretado=false;
let miRectangulo;
function figura(e,tipo){
    ctx.putImageData(global.ultimaImagen,0,0);
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.rect(e.layerX+2,e.layerY-2,10,-10);
    if (tipo) ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (!apretado && e.buttons==1){ //apretó
        apretado=true;
        if (!tipo){miRectangulo=new MiRectangulo(e.layerX,e.layerY,global.color);
        }else{
            
        miRectangulo=new tipo(e.layerX,e.layerY,global.color,global.fondo);
        }
    }
    if (apretado && e.buttons==1){ //tiene apretado
        miRectangulo.move(e.layerX,e.layerY);
    } 
    
    if (apretado&& e.buttons==0){ //soltó
        apretado=false;
        ctx.putImageData(global.ultimaImagen,0,0);

        miRectangulo.dibujar();
        global.ultimaImagen=ctx.getImageData(0,0,canvas.width, canvas.height);
        recuperar.push(global.ultimaImagen);
    }
        
}

function rectangulo(e){
    figura(e,MiRectangulo)
}
function rectanguloLLeno(e){
    figura(e,MiRectanguloRelleno);
}


function borradoEspecial(xx,yy,ancho){
    for (let y=yy;y<yy+ancho;y++){
        for (let x=xx;x<xx+ancho;x++){
            const i=(canvas.width*y+x)*4;

            const r=global.ultimaImagen.data[i];
            const g=global.ultimaImagen.data[i+1];
            const b=global.ultimaImagen.data[i+2];

            const lapizR=parseInt(global.color.slice(1,3),16)
            const lapizG=parseInt(global.color.slice(3,5),16)
            const lapizB=parseInt(global.color.slice(5,7),16)
            const fondoR=parseInt(global.fondo.slice(1,3),16)
            const fondoG=parseInt(global.fondo.slice(3,5),16)
            const fondoB=parseInt(global.fondo.slice(5,7),16)
            
            if (r==lapizR && g==lapizG && b==lapizB){
                global.ultimaImagen.data[i]=fondoR;
                global.ultimaImagen.data[i+1]=fondoG;
                global.ultimaImagen.data[i+2]=fondoB;

            }
        }
    }
}

function pintar(e){

    ctx.fillRect(e.layerX,e.layerY,20,20);
    // let x=e.layerX;
    // let y=e.layerY;
    let centro=(e.layerX+e.layerY*canvas.width)*4;

    for (let y=-1;y<2;y++){
        for (let x=-1;x<2;x++){
            const i=dameIndice(centro,x,y,0);
            const pixelR=global.ultimaImagen.data[i]
            const pixelG=global.ultimaImagen.data[i+1]
            const pixelB=global.ultimaImagen.data[i+2]
        }
    }


    


}
