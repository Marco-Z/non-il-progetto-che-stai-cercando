var matrice;
var dim;
var lunedi;
var availableTags;

$(document).ready(function() {
availableTags = [
   "A101"   ,   "A102"   ,   "A103"   ,   "A104"   ,   "A105"   ,   "A106"   ,   "A107"   ,   "A108"   ,
   "A201"   ,   "A202"   ,   "A203"   ,   "A204"   ,   "A205"   ,   "A206"   ,   "A207"   ,   "A208"   ,
   "A209"   ,   "A210"   ,   "A211"   ,   "A212"   ,   "A213"   ,   "A214"   ,   "A215"   ,   "A216"   ,
   "A217"   ,   "A218"   ,   "A219"   ,   "A220"   ,   "A221"   ,   "A222"   ,   "A223"   ,   "A224"   ,
   "B101"   ,   "B102"   ,   "B103"   ,   "B104"   ,   "B105"   ,   "B106"   ,   "B107"       ];
$( "#ricerca" ).autocomplete({
      source: availableTags
    });
});

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
        $("#corpoPrincipale").load("piani/"+nome+".html", function(){
            coloriAule(nome);
            orariPiano(nome);
        });
    }
    else{
        $("#corpoPrincipale").load("piani/"+nome+"m.html", function(){
            coloriAule(nome);
            orariPiano(nome);
        });
    }
}

function cercaAula(luogo, aula){
    $("#corpoPrincipale").load("piani/"+luogo+"/"+aula+".html");
}

function toAula(elemento, aula){
    var luogo = elemento[0].getAttribute("id");
    var nomeAula = aula.getAttribute("id");
    $("#corpoPrincipale").load("piani/"+luogo+"/"+nomeAula+".html", function(){
        orariAula(nomeAula);
    });
}

function ricercaAula(aula){
    var nomeAula = aula.value;
    var edificio;
    var piano;
    
    piano = nomeAula[1];
    
    if(nomeAula[0] == 'A') {
        edificio = "dipartimento1_ed1_";
    } else if(nomeAula[0] == 'B') {
        edificio = "dipartimento1_ed2_";
        if (nomeAula[3]>5) piano=2;
    }
    
    if (controllo(nomeAula)){
        $("#corpoPrincipale").load("piani/"+edificio+"piano"+piano+"/"+nomeAula+".html", function(){
            orariAula(nomeAula);
        });
    }
}

function controllo(nomeAula){
    var giusto = false;
    for(var i=0;i<availableTags.length;i++){
        if (availableTags[i]===nomeAula) giusto=true;
    }
    return giusto;
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

var colore;
function polyHover(elem){
    colore = elem.style.fill;
    elem.style.fill = "#f8ef8b";
}

function polyHoverOut(elem){
    if (elem!==null){
        elem.style.fill = colore;
    };
}

function creoMatriceOrari()         // crea la matrice con le lezioni divise per aula, ora, e data;
{                                   // inoltre setta il primo giorno della settimana
    $.get("output.txt", function (Data)
    {
        dim = 0; 
        for (var i = 0; i <= Data.length; i++)
        {
            if (Data[i] === '{')
            {
                dim++;
            }
        }
        matrice = new Array();
        
        var a, b, c;
        for (var i = 0; i < Data.length; i++)
        {
            if (Data[i] === '{')
            {
                a = Data.substring(i+2, i+12);
                b = Data.substring(i+16, i+29);
                c = Data.substring(i+39, i+47);
                
                if (c[0] === 'A')
                {
                    if (c[1] === '1' || c[1] === '2')
                    {
                        if (c[4] === ' ')
                        {
                            matrice[matrice.length] = new Array();
                            matrice[(matrice.length)-1][0] = a;
                            matrice[(matrice.length)-1][1] = b;
                            matrice[(matrice.length)-1][2] = c.substring(0, 4);
                        }
                    }
                }
                else if (c[1] === 'B')
                {
                    if (c[2] === '1')
                    {
                        if (c[5] === ' ')
                        {
                            matrice[matrice.length] = new Array();
                            matrice[(matrice.length)-1][0] = a;
                            matrice[(matrice.length)-1][1] = b;
                            matrice[(matrice.length)-1][2] = c.substring(1, 5);
                        }
                    }
                }
                else if (c[0] === 'p' && c[1] === 'c')
                {
                    matrice[matrice.length] = new Array();
                    matrice[(matrice.length)-1][0] = a;
                    matrice[(matrice.length)-1][1] = b;
                    matrice[(matrice.length)-1][2] = c;
                }
            }
        }
        
        dim = matrice.length;
    });
}

function orariAula(nomeAula)
{
    var buffer = new Array();
    for (var i = 0; i < 12; i++) // creo la tabella di buffer dati settata a false
    {
        buffer[i] = new Array();
        for (var h = 1; h < 6; h++)
        {
            buffer[i][h] = false;
        }
    }
    
    for (var i = 0; i < dim; i++)       // ciclo sulla tabella di dati e salvo true o false nella tabella di buffer
    {
        if (matrice[i][2] === nomeAula)
        {
            var a = matrice[i][0];
            var anno = a.substring(6, 10);
        
            if (a[3] === '1')
                var mese = a.substring(3, 5);
            else
                var mese = a[4];
            mese--;

            if (a[0] !== '0')
                var giorno = a.substring(0, 2);
            else
                var giorno = a[1];

            var data = new Date(anno, mese, giorno);
            var dayOfWeek = data.getDay();      // ho trovato il giorno della settimana, quindi la colonna che mi interessa
            
            var oraInizio = matrice[i][1].substring(0, 2);
            var oraFine = matrice[i][1].substring(8, 10);
            var differenza = oraFine - oraInizio;
            
            for (var t = 0; t < differenza; t++)
            {
                buffer[dayOfWeek][oraInizio-7+t] = true;        // setto a true la casella in cui ho trovato una lezione
            }
        }
    }
    
    var myTable="<table style='text-align: center; padding-left: 10px; padding-right: 10px; border-spacing: 0px;'>";
    for (var i=0;i<12;i++){ 
        myTable+="<tr>";
        
        for (var h=0;h<6;h++){
            myTable+="<td";
            
            if (buffer[h][i] === true)
            {
                myTable+= " style='background-color: #fa902d;"
            }
            else
            {
                if (h!==0)
                    myTable+= " style='background-color:  #5ec9c5;"
            }
            
            if (h === 0)
            {
                myTable+= " style= 'width: 100px; border-spacing: 0px; border-style: double; height: 38px; padding-left: 5px; padding-right: 5px; background-color: #fbd987;'";
            }
            else if (i === 0)
            {
                myTable+= " width: 100px; border-spacing: 0px; border-style: double; height: 38px; padding-left: 5px; padding-right: 5px; background-color: #fbd987;'";
            }
            else
            {
                myTable+= " width: 50px; border-spacing: 0px; border-style: double; border-width: 1px; padding-left: 5px; padding-right: 5px; height: 38px;'";
            }
            myTable+=">";
            
            if (h === 0 && i !== 0)
            {
                myTable+=(i+7)+".00 - "+(i+8)+".00";
            }
            
            if (i === 0)
            switch(h)
            {
                case 1: myTable+="Lunedì"; break;
                case 2: myTable+="Martedì"; break;
                case 3: myTable+="Mercoledì"; break;
                case 4: myTable+="Giovedì"; break;
                case 5: myTable+="Venerdì"; break;
            }
            
            myTable+="</td>";
        }
        
        myTable+="</tr>";
    }
    myTable+="</table>";
    
    $('#tabella').html(myTable);
}

function orariEdificio(luogo)
{
    if(luogo.substring((luogo.length)-1, luogo.length) === '1')
    {
        var edificio = "A";
    }
    else if (luogo.substring((luogo.length)-1, luogo.length) === '2')
    {
        var edificio = "B";
    }
    
    var ora = new Date();
    var giornoAttuale = ora.getDate();
    var oraAttuale = ora.getHours();
    giornoAttuale = giornoAttuale.toString();
    oraAttuale = oraAttuale.toString();
    if (giornoAttuale.length === 1)
    {
        giornoAttuale = "0"+giornoAttuale;
    }
    if (oraAttuale.length === 1)
    {
        oraAttuale = "0"+oraAttuale;
    }
    
    var count = 0;
    var auleLibere = false;
    var confronto = new Array();
    var dimConfronto = 0;
    
    for (var i = 0; i < dim; i++)       // ciclo sulla tabella di dati
    {
        if (matrice[i][0].substring(0, 2) === giornoAttuale)
        {
            var oraInizio = matrice[i][1].substring(0, 2);
            var oraFine = matrice[i][1].substring(8, 10);
            if (matrice[i][2].substring(0, 1) === edificio)
            {
                if (oraInizio <= oraAttuale && oraFine >= oraAttuale)
                {
                    fine = false;
                    for (var j = 0; j < confronto.length; j++)
                    {
                        if ((matrice[i][2]+",     "+matrice[i][1]) === confronto[j])
                        {
                            fine = true;
                        }
                    }
                    if (fine === false)
                    {
                        auleLibere = true;
                        confronto[dimConfronto] = matrice[i][2]+",     "+matrice[i][1];
                        dimConfronto++;

                        fine = true;
                    }
                }
            }
            else if (matrice[i][2].substring(0, 1) === 'p' && matrice[i][2].substring(3, 4) === edificio)
            {
                if (oraInizio <= oraAttuale && oraFine >= oraAttuale)
                {
                    fine = false;
                    for (var j = 0; j < confronto.length; j++)
                    {
                        if ((matrice[i][2]+",     "+matrice[i][1]) === confronto[j])
                        {
                            fine = true;
                        }
                    }
                    if (fine === false)
                    {
                        auleLibere = true;
                        confronto[dimConfronto] = matrice[i][2]+",     "+matrice[i][1];
                        dimConfronto++;

                        fine = true;
                    }
                }
            }
        }
    }
    
    var tabella = "<table style= 'text-align:center; border-spacing: 20px; border-style: double; height: 38px; padding-left: 5px; padding-right: 5px; background-color: #fbd987; margin-left:auto; margin-right:auto;'>";
    confronto.sort();
    var colonna = 0;
    
    for (var i = 0; i < confronto.length; i++)
    {
        if (colonna === 0)
        {
            tabella+= "<tr style='border: 1px solid #000'><td style='border: 1px solid #000'>"+confronto[i]+"</td>";
            colonna++;
        }
        else if (colonna === 3)
        {
            tabella+="<td style='border: 1px solid #000'>"+confronto[i]+"</td></tr>";
            colonna = 0; 
        }
        else{
            tabella+="<td style='border: 1px solid #000'>"+confronto[i]+"</td>";
            colonna++;
        }
    }
    
    tabella+="</table>";
    if (auleLibere === true)
    {
        $('#tabellaOrari').append(tabella);
    }
    else if (auleLibere === false)
    {
        var tutteLibere = "<p style='background-color: rgba(255, 255, 255, 0.5);'> Tutte le aule sono libere! Enjoy! </p>";
        $('#tabellaOrari').append(tutteLibere);
    }
}

function orariDipartimento()
{
    var ora = new Date();
    var giornoAttuale = ora.getDate();
    var oraAttuale = ora.getHours();
    giornoAttuale = giornoAttuale.toString();
    oraAttuale = oraAttuale.toString();
    if (giornoAttuale.length === 1)
    {
        giornoAttuale = "0"+giornoAttuale;
    }
    if (oraAttuale.length === 1)
    {
        oraAttuale = "0"+oraAttuale;
    }
    
    var count = 0;
    var dimConfronto = 0;
    var auleLibere = false;
    var confronto = new Array();
    var fine = false;
    
    for (var i = 0; i < dim; i++)       // ciclo sulla tabella di dati
    {
        if (matrice[i][0].substring(0, 2) === giornoAttuale)
        {
            var oraInizio = matrice[i][1].substring(0, 2);
            var oraFine = matrice[i][1].substring(8, 10);
            if (oraInizio <= oraAttuale && oraFine >= oraAttuale)
            {
                fine = false;
                for (var j = 0; j < confronto.length; j++)
                {
                    if ((matrice[i][2]+",     "+matrice[i][1]) === confronto[j])
                    {
                        fine = true;
                         // aggiungo l'aula disponibile e l'intervallo -> vedi se puoi allungare l'intervallo
                    }
                }
                if (fine === false)
                {
                    auleLibere = true;
                    confronto[dimConfronto] = matrice[i][2]+",     "+matrice[i][1];
                    dimConfronto++;
                    
                    fine = true;
                }
            }
        }
    }
    
    var tabella = "<table style= 'text-align:center; border-spacing: 20px; border-style: double; height: 38px; padding-left: 5px; padding-right: 5px; background-color: #fbd987; margin-left:auto; margin-right:auto;'>";
    confronto.sort();
    var colonna = 0;
    
    for (var i = 0; i < confronto.length; i++)
    {
        if (colonna === 0)
        {
            tabella+= "<tr style='border: 1px solid #000'><td style='border: 1px solid #000'>"+confronto[i]+"</td>";
            colonna++;
        }
        else if (colonna === 3)
        {
            tabella+="<td style='border: 1px solid #000'>"+confronto[i]+"</td></tr>";
            colonna = 0; 
        }
        else{
            tabella+="<td style='border: 1px solid #000'>"+confronto[i]+"</td>";
            colonna++;
        }
    }
    
    tabella+="</table>";
    if (auleLibere === true)
    {
        $('#tabellaOrari').append(tabella);
    }
    else if (auleLibere === false)
    {
        var tutteLibere = "<p style='background-color: rgba(255, 255, 255, 0.5);'> Tutte le aule sono libere! Enjoy! </p>";
        $('#tabellaOrari').append(tutteLibere);
    }
}

function orariPiano(luogo)
{
    var edificio = luogo.substring(16, 17);
    var piano = luogo.substring(23, 24);
    
    if(edificio === '1')
    {
        edificio = 'A';
    }
    else if (edificio === '2')
    {
        edificio = 'B';
    }
    
    var ora = new Date();
    var giornoAttuale = ora.getDate();
    var oraAttuale = ora.getHours();
    giornoAttuale = giornoAttuale.toString();
    oraAttuale = oraAttuale.toString();
    if (giornoAttuale.length === 1)
    {
        giornoAttuale = "0"+giornoAttuale;
    }
    if (oraAttuale.length === 1)
    {
        oraAttuale = "0"+oraAttuale;
    }
    
    var count = 0;
    var auleLibere = false;
    var dimConfronto = 0;
    var confronto = new Array();
    
    for (var i = 0; i < dim; i++)       // ciclo sulla tabella di dati
    {
        if (matrice[i][0].substring(0, 2) === giornoAttuale)
        {
            var oraInizio = matrice[i][1].substring(0, 2);
            var oraFine = matrice[i][1].substring(8, 10);
            if (matrice[i][2].substring(0, 1) === edificio && matrice[i][2].substring(1, 2) === piano)
            {
                if (oraInizio <= oraAttuale && oraFine >= oraAttuale)
                {
                    fine = false;
                    for (var j = 0; j < confronto.length; j++)
                    {
                        if ((matrice[i][2]+",     "+matrice[i][1]) === confronto[j])
                        {
                            fine = true;
                        }
                    }
                    if (fine === false)
                    {
                        auleLibere = true;
                        confronto[dimConfronto] = matrice[i][2]+",     "+matrice[i][1];
                        dimConfronto++;

                        fine = true;
                    }
                }
            }
            else if (matrice[i][2].substring(0, 1) === 'p' && matrice[i][2].substring(3, 4) === edificio && matrice[i][2].substring(4, 5) === piano)
            {
                if (oraInizio <= oraAttuale && oraFine >= oraAttuale)
                {
                    fine = false;
                    for (var j = 0; j < confronto.length; j++)
                    {
                        if ((matrice[i][2]+",     "+matrice[i][1]) === confronto[j])
                        {
                            fine = true;
                        }
                    }
                    if (fine === false)
                    {
                        auleLibere = true;
                        confronto[dimConfronto] = matrice[i][2]+",     "+matrice[i][1];
                        dimConfronto++;

                        fine = true;
                    }
                }
            }
        }
    }
    
    var tabella = "<table style= 'text-align:center; border-spacing: 20px; border-style: double; height: 38px; padding-left: 5px; padding-right: 5px; background-color: #fbd987; margin-left:auto; margin-right:auto;'>";
    confronto.sort();
    var colonna = 0;
    
    for (var i = 0; i < confronto.length; i++)
    {
        if (colonna === 0)
        {
            tabella+= "<tr style='border: 1px solid #000'><td style='border: 1px solid #000'>"+confronto[i]+"</td>";
            colonna++;
        }
        else if (colonna === 3)
        {
            tabella+="<td style='border: 1px solid #000'>"+confronto[i]+"</td></tr>";
            colonna = 0; 
        }
        else{
            tabella+="<td style='border: 1px solid #000'>"+confronto[i]+"</td>";
            colonna++;
        }
    }
    
    tabella+="</table>";
    if (auleLibere === true)
    {
        $('#tabellaOrari').append(tabella);
    }
    else if (auleLibere === false)
    {
        var tutteLibere = "<p style='background-color: rgba(255, 255, 255, 0.5);'> Tutte le aule sono libere! Enjoy! </p>";
        $('#tabellaOrari').append(tutteLibere);
    }
}

function coloriAule(devoEstrarciIlPiano)
{
    var ora = new Date();
    var giornoAttuale = ora.getDate();
    var oraAttuale = ora.getHours();
    
    for(var i=0; i<datiasdf.length; i++){
        
        if( datiasdf[i].data.substring(0, 2)==giornoAttuale &&
            datiasdf[i].ora.substr(0, 2) <= oraAttuale &&
            datiasdf[i].ora.substr(8, 2) >= oraAttuale)
        {
            var aulaOccupata = datiasdf[i].aula.substr(0, 4);
                switch(aulaOccupata){
                        case "A101":
                            $("#A101").css("fill", "#fa902d");
                            $("#A101").css("background-color", "#fa902d");
                            break;
                        case "A102":
                            $("#A102").css("fill", "#fa902d");
                            $("#A102").css("background-color", "#fa902d");
                            break;
                        case "A103":
                            $("#A103").css("fill", "#fa902d");
                            $("#A103").css("background-color", "#fa902d");
                            break;
                        case "A104":
                            $("#A104").css("fill", "#fa902d");
                            $("#A104").css("background-color", "#fa902d");
                            break;
                        case "A105":
                            $("#A105").css("fill", "#fa902d");
                            $("#A105").css("background-color", "#fa902d");
                            break;
                        case "A106":
                            $("#A106").css("fill", "#fa902d");
                            $("#A106").css("background-color", "#fa902d");
                            break;
                        case "A107":
                            $("#A107").css("fill", "#fa902d");
                            $("#A107").css("background-color", "#fa902d");
                            break;
                         case "A108":
                            $("#A108").css("fill", "#fa902d");
                            $("#A108").css("background-color", "#fa902d");
                            break;

                        case "A201":
                            $("#A201").css("fill", "#fa902d");
                            $("#A201").css("background-color", "#fa902d");
                            break;
                        case "A202":
                            $("#A202").css("fill", "#fa902d");
                            $("#A202").css("background-color", "#fa902d");
                            break;
                        case "A203":
                            $("#A203").css("fill", "#fa902d");
                            $("#A203").css("background-color", "#fa902d");
                            break;
                        case "A204":
                            $("#A204").css("fill", "#fa902d");
                            $("#A204").css("background-color", "#fa902d");
                            break;
                        case "A205":
                            $("#A205").css("fill", "#fa902d");
                            $("#A205").css("background-color", "#fa902d");
                            break;
                        case "A206":
                            $("#A206").css("fill", "#fa902d");
                            $("#A206").css("background-color", "#fa902d");
                            break;
                        case "A207":
                            $("#A207").css("fill", "#fa902d");
                            $("#A207").css("background-color", "#fa902d");
                            break;
                        case "A208":
                            $("#A208").css("fill", "#fa902d");
                            $("#A208").css("background-color", "#fa902d");
                            break;
                        case "A209":
                            $("#A209").css("fill", "#fa902d");
                            $("#A209").css("background-color", "#fa902d");
                            break;
                        case "A210":
                            $("#A210").css("fill", "#fa902d");
                            $("#A210").css("background-color", "#fa902d");
                            break;
                        case "A211":
                            $("#A211").css("fill", "#fa902d");
                            $("#A211").css("background-color", "#fa902d");
                            break;
                        case "A212":
                            $("#A212").css("fill", "#fa902d");
                            $("#A212").css("background-color", "#fa902d");
                            break;
                        case "A213":
                            $("#A213").css("fill", "#fa902d");
                            $("#A213").css("background-color", "#fa902d");
                            break;
                        case "A214":
                            $("#A214").css("fill", "#fa902d");
                            $("#A214").css("background-color", "#fa902d");
                            break;
                        case "A215":
                            $("#A215").css("fill", "#fa902d");
                            $("#A215").css("background-color", "#fa902d");
                            break;
                        case "A216":
                            $("#A216").css("fill", "#fa902d");
                            $("#A216").css("background-color", "#fa902d");
                            break;
                        case "A217":
                            $("#A217").css("fill", "#fa902d");
                            $("#A217").css("background-color", "#fa902d");
                            break;
                        case "A218":
                            $("#A218").css("fill", "#fa902d");
                            $("#A218").css("background-color", "#fa902d");
                            break;
                        case "A219":
                            $("#A219").css("fill", "#fa902d");
                            $("#A219").css("background-color", "#fa902d");
                            break;
                        case "A220":
                            $("#A220").css("fill", "#fa902d");
                            $("#A220").css("background-color", "#fa902d");
                            break;
                        case "A221":
                            $("#A221").css("fill", "#fa902d");
                            $("#A221").css("background-color", "#fa902d");
                            break;
                        case "A222":
                            $("#A222").css("fill", "#fa902d");
                            $("#A222").css("background-color", "#fa902d");
                            break;
                        case "A223":
                            $("#A223").css("fill", "#fa902d");
                            $("#A223").css("background-color", "#fa902d");
                            break;
                        case "A224":
                            $("#A224").css("fill", "#fa902d");
                            $("#A224").css("background-color", "#fa902d");
                            break;
                        
                        case "B101":
                            $("#B101").css("fill", "#fa902d");
                            $("#B101").css("background-color", "#fa902d");
                            break;
                        case "B102":
                            $("#B102").css("fill", "#fa902d");
                            $("#B102").css("background-color", "#fa902d");
                            break;
                        case "B103":
                            $("#B103").css("fill", "#fa902d");
                            $("#B103").css("background-color", "#fa902d");
                            break;
                        case "B104":
                            $("#B104").css("fill", "#fa902d");
                            $("#B104").css("background-color", "#fa902d");
                            break;
                        case "B105":
                            $("#B105").css("fill", "#fa902d");
                            $("#B105").css("background-color", "#fa902d");
                            break;
                        case "B106":
                            $("#B106").css("fill", "#fa902d");
                            $("#B106").css("background-color", "#fa902d");
                            break;
                        case "B107":
                            $("#B107").css("fill", "#fa902d");
                            $("#B107").css("background-color", "#fa902d");
                            break;
                        default:
                            break;
                };
        };
    };
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

$(function(){
    creoMatriceOrari();
    $('.piano .barraLateraleTreeButton').click(function(e){ 
        e.preventDefault();
        var nome = ($(this).parent().attr('id'));
        if(!jQuery.browser.mobile)
        {
            $("#corpoPrincipale").load("piani/"+nome+".html", function(){
                coloriAule(nome);
                orariPiano(nome);
            });
        }
        else
        {
            $("#corpoPrincipale").load("piani/"+nome+"m.html", function(){
                coloriAule(nome);
                orariPiano(nome);
            });
        }
    });
    
    $('.dipartimento #dip').click(function (e){
        e.preventDefault();
        var nome = ($(this).next().attr('id'));
        if(!jQuery.browser.mobile)
        {
            $("#corpoPrincipale").load("piani/"+nome+".html", function(){
                orariEdificio(nome);
            });
        }
        else
        {
            $("#corpoPrincipale").load("piani/"+nome+"m.html", function(){
                orariEdificio(nome);
            });
        }
    }); // creare il jQuery anche per il caricamento del piano e togliendo l'onclick da index.html? - mettere questo jQuery anche per il bottone indietro
    
    $('#Povo').click(function(e)
    {
        e.preventDefault();
        var nome = ($(this).next().attr('id'));
        $('#corpoPrincipale').load("piani/"+nome+".html", function(){
            orariDipartimento();
        })
    });
});