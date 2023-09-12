function nuevo(){   //boton nuevo canvas.
    let resp=false;
    if (global.modificado) resp=confirm("Perdes todo. Seguro?"); 
    if (!global.modificado||resp) canvasNuevo();
}

function canvasNuevo(){     //inicializa el canvas
    canvas.width=NUEVOX;canvas.height=NUEVOY;
    global.ultimaImagen=new ImageData(canvas.width,canvas.height);
    global.ultimaImagen=ctx.getImageData(0,0,canvas.width, canvas.height); //rezguarda la imagen
    global.modificado=false;  //al titulo no se le agrag asteriso y no se preguntaria por perder cambios
    global.nombre="nuevo"; //nombre del global.nombre
    document.title="miPaint: nuevo";
    recuperar=new Recuperar();  // se inicializa DesHacer
    recuperar.push(global.ultimaImagen); //ultima imagen a recuperar

}
function canvasNuevoInicial(){
    canvasNuevo();
     const img = new Image();
     img.src = 'images/ejemplo.png';
     global.modificado=false;
     img.onload = () => {
         canvas.width=img.width//4;
         canvas.height=img.height//4;
         ctx.drawImage(img, 0, 0);
         global.ultimaImagen=new Image(canvas.width,canvas.height);
         global.ultimaImagen=ctx.getImageData(0,0,canvas.width, canvas.height)
         recuperar.push(global.ultimaImagen)
     };
}

function abrir(){ //boton abrir global.nombre
    nuevo();  //se inicializa el canvas
    let resp=false; //respusta que se esperará del confirm
    if (global.modificado) resp= confirm("perdes lo anterior?");
    if (!global.modificado||resp){
        const file = document.querySelector('#file');
        file.click();
        file.addEventListener('change', () => {
            const img = new Image();
            img.src = URL.createObjectURL(file.files[0]);
            
            global.nombre=file.files[0].name;
            document.title="miPaint: "+global.nombre;
            global.modificado=false;
            img.onload = () => {
                canvas.width=img.width;
                canvas.height=img.height;
                ctx.drawImage(img, 0, 0);
                global.ultimaImagen=new Image(canvas.width,canvas.height);
                global.ultimaImagen=ctx.getImageData(0,0,canvas.width, canvas.height)
                recuperar.push(global.ultimaImagen)
            };
        });
    }
}

//boton guardar imagen
const guardador=document.querySelector('#guardador');  //input que se usa para guardar
function guardar(){  
    guardador.download=global.nombre;
    
    guardador.href=canvas.toDataURL('image/png');

    guardador.addEventListener('change', function() {
        alert('Se ha iniciado la descarga del global.nombre');
    });
    guardador.click();
    
    
    global.modificado=false;
    document.title="miPaint: "+global.nombre;
    
}

//funciones de Deshacer y Rehacer
class Recuperar{
    backUp=[]
    constructor(){
        this.indice=1;

    }
    resetear(){
    }
    push(img){
        this.indice=1;
        this.backUp.push(img);
    }
    deshacer(){
        if (this.indice<this.backUp.length){
            this.indice++;
            this.recuperar(this.indice);
        }
    }
    
    rehacer(){
        if (this.indice>1){
            this.indice--;
            this.recuperar(this.indice);
        }
    }
    recuperar(i){
        let recuperada=this.backUp[this.backUp.length-this.indice];
        ctx.putImageData(recuperada,0,0);
        global.ultimaImagen=recuperada;
    }
}

function deshacer(){
    recuperar.deshacer();
}

function rehacer(){
    recuperar.rehacer();
}

const paleta=document.querySelector('#paleta');
function color(e){
    alphaLapiz.value=255;        
    paleta.addEventListener('input',()=>{
        document.querySelector('#color').style="background-color:"+paleta.value+";";
        global.color=paleta.value;
    })
    paleta.click();
    paleta.value="#00ff00"
}

const paletaFondo=document.querySelector('#paletaFondo');
function colorFondo(){
    paletaFondo.addEventListener('input',()=>{
        document.querySelector('#colorFondo').style="background-color:"+paletaFondo.value+";";
        global.fondo=paletaFondo.value;
        alphaFondo.value=255;        
    })
    paletaFondo.click();
}

document.querySelector('#punto').onchange=()=>global.tamañoPunto=punto.value; 

const alphaFondo=document.querySelector('#alphaFondo')
alphaFondo.onchange=()=>{
    global.fondo=global.fondo.slice(0,7)+parseInt(alphaFondo.value).toString(16);
}
const alphaLapiz=document.querySelector('#alphaLapiz')
alphaLapiz.onchange=()=>{
    global.color=global.color.slice(0,7)+parseInt(alphaLapiz.value).toString(16);
}

// funcion que se llama cuando el global.nombre se ha global.modificado para alertar prevenir perder
function modificar(){
    document.title='miPaint: *'+global.nombre;
    global.modificado=true;
}

