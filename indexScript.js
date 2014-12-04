
function show(padre){
    if (padre.offsetHeight>0){
        padre.style.display="none";
    }
    else{
        padre.style.display="block";
    }
}

function showGuida(){
    $("#corpoPrincipale").load("guida.html");
}

function showElemento(elemento){
    var nome = elemento.getAttribute("id");
    
    $("#corpoPrincipale").load("piani/"+nome+".html");
}

function toAula(elemento, aula){
    var luogo = elemento[0].getAttribute("id");
    var nomeAula = aula.getAttribute("id");
    $("#corpoPrincipale").load("piani/"+luogo+"/"+nomeAula+".html");
}

function ricercaAula(aula){
    var nomeAula = aula.value;
    var piano;
    alert(nomeAula);
    var car = nomeAula.charAt(0);
    if(car == "A") piano="dipartimento1_ed2";
    else if(car == "B") piano="dipartimento1_ed1";
    
    var car2 = nomeAula.charAt(1);
    if(car2 == 1) piano+="_piano1";
    else if(car2 == 2) piano+="_piano2";
    alert(piano);
    
    $("#corpoPrincipale").load("piani/"+piano+"/"+nomeAula+".html");
}

function displayMenu(){
    var menu = document.getElementById("barraLaterale");
    if (menu.offsetWidth > 0){
        menu.style.display="none";
        document.getElementById("corpoPrincipale").style.left = 0;
    }
    else{
        menu.style.display="block";
        document.getElementById("corpoPrincipale").style.left = 250;
    }
}

function polyHover(elem){
    elem.style.fill = "#f8ef8b";
}

function polyHoverOut(elem){
    elem.style.fill = "#f5d60f";
}

function main(){
    //recupera l'api key del nostro progetto da google developer console
    gapi.client.setApiKey(AIzaSyBIz_F_ZMCu4A3liviIrBIUjMK4dk1nHUY);
}

function party() {
    if (navigator.sayswho=='IE'){
        controller.buyDoge();  
    }
}

function invio(e){
if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
    ricercaAula(ricerca);
    }

}
