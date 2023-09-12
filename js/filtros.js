//botons del filtro
const btnFiltro=document.querySelectorAll(".btnClickFiltro");
btnFiltro.forEach(btn=>btn.onclick=(e)=>filtrar(e.target.id));
    

const filtrosDiv=document.querySelector('#filtrosDiv');
const canvasFiltro=document.querySelectorAll('#filtrosDiv>div>canvas');
let contextos=[]; //de cada canvas de muestra de filtros
canvasFiltro.forEach(c=>contextos.push(c.getContext('2d')));    

let imagenOriginal=new ImageData(canvas.width, canvas.height);
let imagenProvisoria=new ImageData(canvas.width, canvas.height);

function filtros(quienLlama){  // mostrar el div con los canvas
    let total=contextos.length-1;
    if (quienLlama!="desdeFiltro") {imagenOriginal=ctx.getImageData(0,0,canvas.width,canvas.height);total++}//resguardo para el filtro original. y considera su redibujacion
    imagenProvisoria=ctx.getImageData(0,0,canvas.width,canvas.height);
    
    const image = new Image();
    image.src = canvas.toDataURL();
    image.onload = () => {
        for (let i=1;i<total;i++){
            contextos[i].drawImage(image,0,0,canvasFiltro[0].width,canvasFiltro[0].height);
        }
    }

    //excepciones: filtros que no pude emular con css
    cargar(deteccion,0);
    cargar(binarizacion,2);

    //animaciones
    if (quienLlama!="desdeFiltro"){
    setTimeout(()=>{
        let animacion="";
        ((filtrosDiv.style.animation).slice(-6)==="Arriba")? animacion="haciaAbajo" : animacion="haciaArriba";
        filtrosDiv.style="animation: "+animacion+" 0.6s ease-out forwards;";
    },1000);
}
}

//cargar excepciones que no pude lograr con css
function cargar(filtro,contexto){
filtrar(filtro,"llamadoDesdeCargar");
    setTimeout(()=>{
        let im1=new ImageData(canvas.width, canvas.height);
        im1=ctx.getImageData(0,0,canvas.width,canvas.height);
        
        const image = new Image();
        image.src = canvas.toDataURL();
        image.onload = () => {
            contextos[contexto].drawImage(image,0,0,canvasFiltro[0].width,canvasFiltro[0].height);
        }
        ctx.putImageData(imagenProvisoria,0,0);
       global.ultimaImagen=imagenProvisoria;
    },100);
}

function filtrar(f,quienLlama){
    document.body.style="cursor:progress;";
    setTimeout(function(){
        
        if (!global.modificado) modificar()
        let nueva=new ImageData(canvas.width, canvas.height);
        nueva=ctx.getImageData(0,0,canvas.width,canvas.height);
    
        for (let i=0; i<global.ultimaImagen.width*global.ultimaImagen.height*4;i+=4){

            let pixelNuevo=(eval(f))(i,global.ultimaImagen.data[i],global.ultimaImagen.data[i+1],global.ultimaImagen.data[i+2]);
            nueva.data[i]=pixelNuevo[0];
            nueva.data[i+1]=pixelNuevo[1];
            nueva.data[i+2]=pixelNuevo[2];
            nueva.data[i+3]=global.ultimaImagen.data[i+3];
        }
        
        global.ultimaImagen=nueva;
        ctx.putImageData(global.ultimaImagen,0,0);
        
        if (!quienLlama) {recuperar.push(global.ultimaImagen);filtros("desdeFiltro");}
        document.body.style="cursor:default;";
    },100);
}

//filtros:
function gris(i,r,g,b){
    let prom=(r+g+b)/3;
    return [prom,prom,prom];
}
function binarizacion(i,r,g,b){
    const c=80;
    let pixel=gris(i,r,g,b);
    const prom=(r+g+b)/3
    if (prom>c) {
        pixel[0]=255;
        pixel[1]=255;
        pixel[2]=255;
    }else{
        pixel[0]=0;
        pixel[1]=0;
        pixel[2]=0;
    }
    return [pixel[0],pixel[1],pixel[2]]

}


function blur(i){
        let c=global.ultimaImagen.data;
        let suma=[];
        for (let color=0;color<3;color++){
            suma[color]=0;
            for (let y=-1;y<2;y++){
                for (let x=-1;x<2;x++){
                    const indice=dameIndice(i,x,y,color);
                    suma[color]+=c[indice];
                }
            }
            suma[color]=suma[color]/9;
        }
        return suma;
}

function dameIndice(i,x,y,color){ 
    return i+(x*4)+(y*canvas.width*4)+color;
}


let mascara=[   //para el sobel ,
[[[-1],[0],[1]],
[[-2],[0],[2]],
[[-1],[0],[1]]],

[[[-1],[-2],[-1]],
            [[0],[0],[0]],
            [[1],[2],[1]]]
            ]

            
            
function deteccion(i){
    let c=global.ultimaImagen.data;
    let suma=[];
        for (let color=0;color<3;color++){
            suma[color]=0;
            for (let y=-1;y<2;y++){
                for (let x=-1;x<2;x++){
                    const indice=dameIndice(i,x,y,color);
                    suma[color]+=c[indice]*mascara[0][x+1][y+1];
                }
            }
        }
        return suma;
    }
    
function negativo(i,r,g,b){
    return [255-r,255-g,255-b];
}


function brillo(i,r,g,b){
    const hsb=RGBToHSB(r,g,b);
    hsb[2]=120;
    const miRgb=HSBToRGB(hsb[0],hsb[1],hsb[2]);
    return [miRgb[0],miRgb[1],miRgb[2]];
}

function saturación(i,r,g,b){
    const hsl=RGBToHSL(r,g,b);
    hsl[1]=40;
    const miRgb=HSLToRGB(hsl[0],hsl[1],hsl[2]);
    return [miRgb[0],miRgb[1],miRgb[2]];
}

function sepia(i,r,g,b){
    return [r*0.393 + g*0.769+ b*0.189,
        r*0.349 + g*0.686+ b*0.168,
        r*0.272 + g*0.534+ b*0.131];
    }

    
    
document.querySelector('#original').onclick=original;
function original(){
    ctx.putImageData(imagenOriginal,0,0);
    global.ultimaImagen=imagenOriginal;
    filtros("desdeFiltro");

}

function cerrar(){ //cierra el div de filtros
    filtrosDiv.style="animation: haciaAbajo 1s ease-in forwards;";
}


///funciones de convercion

const RGBToHSB = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};


const HSBToRGB = (h, s, b) => {
s /= 100;
b /= 100;
const k = (n) => (n + h / 60) % 6;
const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
return [255 * f(5), 255 * f(3), 255 * f(1)];
};

const RGBToHSL = (r, g, b) => {
r /= 255;
g /= 255;
b /= 255;
const l = Math.max(r, g, b);
const s = l - Math.min(r, g, b);
const h = s
    ? l === r
    ? (g - b) / s
    : l === g
    ? 2 + (b - r) / s
    : 4 + (r - g) / s
    : 0;
return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
];
};

const HSLToRGB = (h, s, l) => {
s /= 100;
l /= 100;
const k = n => (n + h / 30) % 12;
const a = s * Math.min(l, 1 - l);
const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
return [255 * f(0), 255 * f(8), 255 * f(4)];
};
    