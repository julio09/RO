$(document).on('keydown keyup', '.VHB , #InputsHB', function () {
    BuildFe();
});

$(document).on('keydown keyup', '.contrainte', function () {
    var parentdiv = $(this).parent();
    BuildCparam($(this), parentdiv);
});


$('#InputsHB , #InputsC').on('keydown keyup', function (e) {

    var e46 = e.keyCode !== 46; // keycode for delete
    var e8 = e.keyCode !== 8; // keycode for backspace
    var valp = $(this).val() > 10;
    var valm = $(this).val() < 10; //currently not working for x < 0

    if (valp && e46 && e8 || valm < 0 && e46 && e8) {
        console.log(valp);
        e.preventDefault();
        switch ($(this).attr('id')) {
            case 'InputsHB':
                alert('Attention, vous ne pouvez mettre que 10 Variables Hors Base');
                break;
            case 'InputsC':
                alert('Attention, vous ne pouvez mettre que 10 Contraintes');
                break;

            default:
                break;
        }

        if ($(this).hasClass('contrainte')) {
            alert('Attention, vous ne pouvez mettre que 10 paramètres');
        }

        if (valp) $(this).val(10);
        if (valm) $(this).val(0);
    }
});



$(document).ready(function () {

    $('#1').on('click', function () {
        console.log($(this));
    })


    console.log("main.js is ready ");

    //Au changement de valeur générer les champs
    $('[id^=Inputs]').bind('keyup mouseup', function () {

        switch ($(this).attr('id')) {
            case 'InputsHB':
                GenerateFields('HB', $(this).val());
                break;

            case 'InputsC':
                GenerateFields('C', $(this).val());
                break;

            default:
                break;
        }
    });

    //Bouton Valider
    $('#goBTN').click(function () {

        $('#resultTable').show();

        var arr = [0]; //constante 0
        arr = arr.concat(GetHB()); //Ajout des variables hors base

        var ZER = [];

        //Ajoute autant de 0 qu'il y a de contraintes
        for (var i = 0; i < GetContraintes().length; i++) {
            ZER.push(0);
        }

        arr = arr.concat(ZER);

        console.log(arr, GetHB(), GetContraintes());
        console.log(arr.length, GetHB().length, GetContraintes().length);

        var It = new Iteration(arr);

        GetContraintes().forEach(function (c, i) {

            var res = c[c.length - 1];
            c.splice(-1, 1); //enlève le résultat à la fin

            var tempTab = ZER.slice(0);
            tempTab[i] = 1;

            c.unshift(0); //ajoute 0 au début
            c = c.concat(tempTab); //ajoute les 0 * n contraintes


            console.log("C: " + c);
            console.log("Resultat: " + res);

            It.addContrainte(new Contrainte(c, res));
            console.log(It.contraintes[i]);
        })

        while (!Array.isArray(It)) {
            It = It.logic();
        }

        console.log("-----test reception des données-----\n");
        console.log("  -Variables Hors base: ", GetHB());
        console.log("  -Contraintes ", GetContraintes());
        console.log("  -Lancement du programme avec :", arr);
        console.log("------------------------------------\n");

        $('#tableBody').html('');
        FillTable(It);
    })

})


function GenerateFields(cas, n) {

    switch (cas) {
        case 'C':

            var Fields = $('#Generated_CFields');
            Fields.html(''); //Vider d'abord
            for (var i = 0; i < n; i++) { //Générer n champs
                Fields.append('<div style="margin:15px;">' +
                    '<label for="InputsC">Contrainte ' + (i + 1) + '</label>' +
                    '<input class="form-control contrainte" min="3" max="10" placeholder="params" type="number" id="' + (i + 1) + '">' +
                    '</div>');
            }
            break;

        case 'HB':

            var Fields = $('#Generated_HBFields');
            Fields.html(''); //Vider d'abord
            for (var i = 0; i < n; i++) { //Générer n champs

                Fields.append('<div style="margin:15px;">' +
                    '<label for="InputsHB">X ' + (i + 1) + '</label>' +
                    '<input class="form-control VHB" type="text" id="' + (i + 1) + '">' +
                    '</div>');
            }
            break;

        default:
            break;
    }
}

//Build Fonction Economique
function BuildFe() {
    $('#FE').val('');
    GetHB().forEach(function (hb, i) {
        $('#FE').get(0).value += hb + "X" + (i + 1) + " ";
    });
}


function BuildCparam(input) {

    var parentdiv = $(input).parent();

    var iD = 'Generate_Params' + $(input).attr('id');
    var jiD = '#' + iD;
    var ival = $(input).val();

    if (!$(jiD).length) {
        $(parentdiv).append('<div id="' + iD + '" class="gen"> a </div>');
    }

    $(jiD).html('');

    for (var i = 0; i < ival; i++) {

        if (i == (ival - 1)) {
            $(jiD).append(' = <input class="form-control" type="text" id="Param' + i + '">');
        } else {
            $(jiD).append(' <input class="form-control" type="text" id="Param' + i + '">');
        }
    }
}



function GetHB() {
    var HB = [];
    Array.from($("#Generated_HBFields  :input")).forEach(function (hb) {
        var val = $(hb).val();
        if (val == 0) HB.push(0);
        else HB.push(parseInt(val));
    });
    return HB
}

function GetContraintes() {
    var Contraintes = [];

    Array.from($('[id^=Generate_Params]')).forEach(function (c, i) {
        var Param = [];
        Array.from($(c).find('input')).forEach(function (param, j) {
            Param[j] = parseInt($(param).val());
        })
        Contraintes[i] = Param;
    });
    return Contraintes
}


function FillTable(It) {

    $('#resultTable').show();

    $('html,body').animate({
        scrollTop: $('#resultTable').offset().top
    }, 'slow');

    // var TABGraph = [];
    var iter = [];
    var Z = [];

    console.log(It);


    //--------------------TABLE-----------------------
    var TB = $('#tableBody');
    var T = It.length - 1;
 
    for (var i = 0; i < T; i++) {

        if (i !== T) {

            var TrID = "Tr" + i;
            $(TB).append('<tr id="' + TrID + '">');
            var Tr = document.getElementById(TrID);
            console.log(It.length);
            for (var j = It.length ; j >= 0; j--) {
                console.log(i,j);
                console.log("lel  ",It[i][j]);
                var x = Tr.insertCell(0);
                $(x).html(It[i][j]);
            }
            $(TB).append('</tr>');
        }
    }
    //--------------------TABLE-----------------------


    //--------------------Graph-----------------------
    It.forEach(function (tab, i) {
        if (i !== It.length - 1) {
            iter.push("Itération " + tab[0]);
            Z.push(tab[3]);
        } else {
            iter.push("Itération ZMax");
            Z.push(tab[1]); //Ajouter ZMAX
        }
    });

    console.log(iter, Z, Z[3]);
      
    // TABGraph = TABGraph.concat([iter], [Z]);

    var ctx = document.getElementById('Graph').getContext('2d');
    var Graph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: iter,
            datasets: [{
                pointRadius: 15,
                pointHoverRadius: 15,
                label: "Valeur de Z",
                borderColor: 'blue',
                data: [{
                    x: Z[0],
                    y: Z[0]
                }, {
                    x: Z[1],
                    y: Z[1]
                }, {
                    x: Z[2],
                    y: Z[2]
                }, {
                    x: Z[3],
                    y: Z[3]
                }]
            }]
        },
        options: {}
    });

    $('#Graph').html(Graph);


    //--------------------Graph-----------------------


}