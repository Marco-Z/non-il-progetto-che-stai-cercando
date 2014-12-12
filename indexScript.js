
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
    if(!jQuery.browser.mobile){
        $("#corpoPrincipale").load("piani/"+nome+".html");
    }
    else{
        $("#corpoPrincipale").load("piani/"+nome+"m.html");
    }
}

function cercaAula(luogo, aula){
    $("#corpoPrincipale").load("piani/"+luogo+"/"+aula+".html");
}

function toAula(elemento, aula){
    var luogo = elemento[0].getAttribute("id");
    var nomeAula = aula.getAttribute("id");
    $("#corpoPrincipale").load("piani/"+luogo+"/"+nomeAula+".html");
}

function ricercaAula(aula){
    var nomeAula = aula.value;
    var edificio;
    var piano;
    
    if(nomeAula[0] == 'A') {
        edificio = "dipartimento1_ed1_";
    } else if(nomeAula[0] == 'B') {
        edificio = "dipartimento1_ed2_";
    }
    
    if((nomeAula != 'Aula Studio 1°piano') || (nomeAula != 'Aula Studio 2°piano') || (nomeAula !='Aula PC 2°piano')) {
        piano = nomeAula[1];
    }
    
    $("#corpoPrincipale").load("piani/"+edificio+"piano"+piano+"/"+nomeAula+".html");
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
    if (elem!==null)
    {
        elem.style.fill = "#f5d60f";
    }
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
