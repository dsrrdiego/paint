'use strict'
    
let modo="lapiz";  //la funcion qu tiene que actuar, (lapiz, goma, etc)
function mouseMove(e){     //mouse sobre el canvas
    if (e.buttons==1){
        cerrar(); //cierra el div de filtros
        if (!global.modificado) modificar();  //si el global.nombre fue global.modificado se prepara para las alertas
    }else{
        ctx.putImageData(global.ultimaImagen,0,0);
    }
    eval(modo)(e);  //lamo a la funcion de dibujo correspondiente
}


//inicializacion

const NUEVOX=1000;
const NUEVOY=500;
const global={  //propiedades globales del lienzo
    nombre:'nuevo',
    modificado:false,  //si esta modificado advierte ante una perdida de informacion
    tamañoPunto:5,
    color:'#ff000064',
    fondo:'#0000ff64',
    ultimaImagen:null //aqui se almacena la ultima imagen valida para swap de pantalla.
    
}
document.title='miPaint: '+global.nombre;

const canvas=document.querySelector('#canvas');
const ctx=canvas.getContext('2d',{ willReadFrequently: true });

let recuperar=new Recuperar();  //sistema de hacer/deshacer

//  Asignacion de eventos
canvas.onmousemove=(e)=>mouseMove(e);
canvas.onmousedown=(e)=>{mouseMove(e);e.preventDefault()};
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.onmouseup=()=> recuperar.push(global.ultimaImagen);
canvas.onmouseout=()=>ctx.putImageData(global.ultimaImagen,0,0);  //limpia el canvas del ultimo cursor


//todos los botones que NO son de tipo modo ( o sea, incluye a menu y a filtro) ( no a los seleccionables)
const btnMenu=document.querySelectorAll('.btnClick');
btnMenu.forEach(boton => {boton.onclick=(e) => {
    if (e.target.id!="filtros") cerrar(); //cierra el div filtro salvo que sea el boton para abrir el div
    (eval(e.target.id))(e);} //se llama a la funcion que corresponda el boton
});

//botones de tipo modo de dibujo (lapiz, goma, etc) Son seleccionables
let cursores={"lapiz":"crosshair","goma":"add-scroll"};
const btnBarra=document.querySelectorAll('.btnModo');
btnBarra.forEach(boton => {
    boton.onclick= (e) => {
        modo=e.target.id;
        btnBarra.forEach(bt=>bt.style="border:none;")
        boton.style="border: 2px solid red;";
        canvas.style="cursor:"+cursores[modo];
        datosChupete.style="display:none";
        };
    });
    btnBarra[0].click();
    
// canvasNuevoInicial(); //carga imagen de inicio

