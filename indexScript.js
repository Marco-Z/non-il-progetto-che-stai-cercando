var matrice;
var dim;
var lunedi;

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
    $("#corpoPrincipale").load("piani/"+luogo+"/"+nomeAula+".html", function(){
        orariAula(nomeAula);
    });
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
    
    $("#corpoPrincipale").load("piani/"+edificio+"piano"+piano+"/"+nomeAula+".html", function(){
        orariAula(nomeAula);
    });
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

function creoMatriceOrari()         // crea la matrice con le lezioni divise per aula, ora, e data;
{                                   // inoltre setta il primo giorno della settimana
    jQuery.get('output.txt', function (Data)
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
                            matrice[(matrice.length)-1][2] = c.substring(1, 6);
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
    
    $('#tabella').append(myTable);
}

function orariEdificio()
{
    var myTable="<table style= 'text-align:center; border-spacing: 20px; border-style: double; height: 38px; padding-left: 5px; padding-right: 5px; background-color: #fbd987; left: 90;'>";
    
    var ora = new Date();
    var giornoAttuale = ora.getDate();
    var oraAttuale = ora.getHours();
    //var giornoAttuale = "09";
    var minutoAttuale = ora.getMinutes();
    var count = 0;
    var auleLibere = false;
    for (var i = 0; i < dim; i++)       // ciclo sulla tabella di dati
    {
        if (matrice[i][0].substring(0, 2) === giornoAttuale)
        {
            var oraInizio = matrice[i][1].substring(0, 2);
            var oraFine = matrice[i][1].substring(8, 10);
            if (oraInizio <= oraAttuale && oraFine >= oraAttuale)
            {
                auleLibere = true;
                if (count === 0)
                {
                    myTable+= "<tr style='border: 1px solid #000'><td style='border: 1px solid #000'>"+matrice[i][2]+",     "+matrice[i][1]+"</td>";
                    count++;
                }
                else if (count === 3)
                {
                    myTable+="<td style='border: 1px solid #000'>"+matrice[i][2]+",     "+matrice[i][1]+"</td></tr>";
                    count = 0; 
                }
                else{
                    myTable+="<td style='border: 1px solid #000'>"+matrice[i][2]+",     "+matrice[i][1]+"</td>";
                    count++;
                }
                 // aggiungo l'aula disponibile e l'intervallo -> vedi se puoi allungare l'intervallo
            }
        }
    }
    myTable+="</table>";
    if (auleLibere === true)
    {
        $('#tabellaOrari').append(myTable);
    }
    else if (auleLibere === false)
    {
        var tutteLibere = "Tutte le aule sono libere! Enjoy!";
        $('#tabellaOrari').append(tutteLibere);
    }
}

function coloriAule(devoEstrarciIlPiano)
{
    /*
    var giornoAttuale = ora.getDate();
    var oraAttuale = ora.getHours();
    */
    var giornoAttuale = 11;
    var oraAttuale = 13;
    
    for(var i=0; i<datiasdf.length; i++){
        
        if( datiasdf[i].data.substring(0, 2)==giornoAttuale &&
            datiasdf[i].ora.substr(0, 2) <= oraAttuale &&
            datiasdf[i].ora.substr(8, 2) >= oraAttuale)
        {
            var aulaOccupata = datiasdf[i].aula.substr(5, 4);
            $("#"aulaOccupata).css("fill: red;"); //problema
        }
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
            });
        }
        else
        {
            $("#corpoPrincipale").load("piani/"+nome+"m.html", function(){
                coloriAule(nome);
            });
        }
    });
    $('.dipartimento #dip').click(function (e){
        e.preventDefault();
        var nome = ($(this).next().attr('id'));
        if(!jQuery.browser.mobile)
        {
            $("#corpoPrincipale").load("piani/"+nome+".html", function(){
                orariEdificio();
            });
        }
        else
        {
            $("#corpoPrincipale").load("piani/"+nome+"m.html", function(){
                orariEdificio();
            });
        }
    }); // creare il jQuery anche per il caricamento del piano e togliendo l'onclick da index.html? - mettere questo jQuery anche per il bottone indietro
    $('.svgClick').click(function(e)
    {
        e.preventDefault();
        var nome = ($(this).children().attr('id'));
        var aula = nome.substring(1, nome.length);
        alert(aula);
        var percorso = ($(this).parent().parent().attr('id'));
        alert(percorso);
        $('#corpoPrincipale').load("piani/"+percorso+"/"+aula+".html");
    });
});