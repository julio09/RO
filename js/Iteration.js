function Contrainte(tableau, resultat) {
	this.algo = tableau;
	this.resultat = resultat;
}
var allIter = [];

function Iteration(algo, iteration = 0) {
	//l index 0 est pour la constante
	this.algo = algo;
	//index du X
	this.vEntree = 0;
	//index du X
	this.vSortie = 0;
	this.iteration = iteration;
	this.iteration++;
	this.contraintes = [];
	this.Ri = [];
	this.first = null;
	this.setFirstIteration = function (iter) {
		this.first = iter;
	}
	this.addContrainte = function (contrainte) {
		this.contraintes.push(contrainte);
	};
	this.calculateAllRi = function () {
		for (var contrainte in this.contraintes) {
			console.log(this.contraintes[contrainte]);
			this.Ri.push(this.contraintes[contrainte].resultat / this.contraintes[contrainte].algo[this.vEntree]);
		};
	};

	this.findVEntree = function () {
		var theNum = this.algo[1];
		var theIndex = 1;
		this.algo.forEach(function (num, index) {
			if (num > theNum && index > 0) {
				theNum = num;
				theIndex = index;
			}
		});
		this.vEntree = theIndex;
		console.log("Valeur d'entree: " + this.vEntree);
	};

	//idRi se trouve avec findEquationEchange
	this.findVSortie = function (idRi) {
		var algo = this.contraintes[idRi].algo;
		for (var index in algo) {
			if (algo[index] != 0 && this.algo[index] == 0) {
				console.log("Valeur de sortie " + algo[index]);
				this.vSortie = index;
			}
		};
	};

	this.findEquationEchange = function () {
		var min = null;
		this.Ri.forEach(function (ri) {
			console.log(ri);
			if (min == null && ri >= 0) {
				min = ri;
			}
			if (ri < min && ri >= 0) {
				min = ri;
			}
		});
		console.log("Ri :" + this.Ri.indexOf(min));
		return this.Ri.indexOf(min);
	};
	this.calculateNextAlgo = function () {
		var i = this.findEquationEchange();
		var tempAlgo = this.contraintes[i].algo.slice();
		console.log("Tempalgo: " + tempAlgo);
		var divider = tempAlgo[this.vEntree]
		tempAlgo[this.vEntree] = 0;
		console.log("Test Contrainte: " + this.contraintes[0].algo);
		var newAlgo = [];
		this.contraintes[i].algo.forEach(function (num, index) {
			var newnum = num * -1 / divider;
			newAlgo.push(newnum);
		});
		var multiplier = this.algo[this.vEntree];
		var tempAlgo2 = this.algo.slice(0);
		tempAlgo2[this.vEntree] = 0;
		var finalAlgo = [];
		tempAlgo2.forEach(function (num, index) {
			num += newAlgo[index] * multiplier;
			finalAlgo.push(num);
		});
		finalAlgo[0] += this.contraintes[i].resultat / divider * multiplier;
		finalAlgo[this.vEntree] = 0;
		return finalAlgo;
	}

	this.calculateNewContraintes = function () {
		var ind = this.findEquationEchange();
		var tempAlgoEchange = this.contraintes[ind].algo.slice();
		var tempResul = this.contraintes[ind].resultat;
		console.log("Equation d echange: " + tempAlgoEchange);

		var divider = tempAlgoEchange[this.vEntree];
		tempAlgoEchange[this.vEntree] = 0;
		var algoTempRemp = [];

		//remplace la variable d'entree par les valeurs selon l'equation d echange
		for (var i in tempAlgoEchange) {
			var num = tempAlgoEchange[i] * -1 / divider;
			console.log("Num calcule newContraintes: " + num);
			algoTempRemp.push(num);
		}
		var newContraintes = [];
		var contraintesRemp = new Contrainte(algoTempRemp, tempResul);
		for (var algo in this.contraintes) {
			if (algo == ind) {
				var temporaire = [];
				var divi = this.contraintes[algo].algo[this.vEntree];
				for (var num in this.contraintes[algo].algo) {
					temporaire.push(this.contraintes[algo].algo[num] / divi);
				}
				newContraintes.push(new Contrainte(temporaire, this.contraintes[algo].resultat / divi));
				continue;
			} else {
				var tableautemp = [];
				for (var num in this.contraintes[algo].algo) {
					var newNumero = this.contraintes[algo].algo[num] + (this.contraintes[algo].algo[this.vEntree] * contraintesRemp.algo[num]);
					console.log("NEW NUMERO: " + newNumero);
					tableautemp.push(newNumero);
				}
				console.log("contresTemp result: " + contraintesRemp.resultat);
				var resul = this.contraintes[algo].resultat - contraintesRemp.resultat / divider * this.contraintes[algo].algo[this.vEntree];
				tableautemp[this.vEntree] = 0;
				newContraintes.push(new Contrainte(tableautemp, resul));
			}
		}

		return newContraintes;

	};

	this.zmax = function () {
		/*var calc = Array(this.first.length).fill(0);
		for(var cont in this.contraintes){
			for(var i in this.contraintes[cont].algo){
				if(this.first[i] !== 0 && this.contraintes[cont].algo[i] !== 0){
					calc[i] = (this.contraintes[cont].resultat / this.contraintes[cont].algo[i]);
				}
			}
		}
		var resultat = [];
		for(var i in this.first){
			if(this.first[i] !== 0){
				if(this.algo[i] == 0){
					for(var y in this.algo){
						if(y > i && y !== 0){
							this.algo[i] = this.algo[y];
							this.algo[y] = 0;
							break;
						}
					}
				}
			}
		}
		for(var i in calc){
			resultat.push(calc[i] * this.algo[i]);
		}*/
		return this.algo[0];
	};

	this.checkFinal = function () {
		var test = true;
		this.algo.forEach(function (num, index) {
			console.log("Index " + index + " : " + num)
			if (index > 0 && num > 0) {
				console.log("check is false because num = " + num);
				test = false;
			}
		});
		return test;
	}

	this.logic = function () {
		if (this.first == null) {
			allIter = [];
			this.first = this.algo.slice();
			console.log(this.first);
		}
		if (this.checkFinal()) {

			console.log("Check was true, end of the program:");
			console.log(this.algo);
			console.log("Z Max:");
			console.log(this.zmax());
			$('#ShowZmax').html('<h1>Zmax : '+ this.zmax() +'</h1>');// Afficher Zmax
			allIter.push([this.algo, this.zmax()]);
			return allIter;
		}
		this.findVEntree();
		this.calculateAllRi();
		this.findVSortie(this.findEquationEchange());

		allIter.push([this.iteration, this.vEntree, parseInt(this.vSortie), this.algo[0] ]);
		var algo = this.calculateNextAlgo();
		console.log(algo);
		console.log(this.contraintes[0]);
		var contraintes = this.calculateNewContraintes();
		var iter = new Iteration(algo, this.iteration);
		iter.setFirstIteration(this.first);
		console.log(iter);
		contraintes.forEach(function (contr, index) {
			iter.addContrainte(contr);
			console.log(contr);
		});
		if (this.iteration == 10) {
			console.log("Check was true, end of the program:");
			console.log(this.algo);
			console.log("Z Max:");
			console.log(this.zmax());
			return [this.algo, this.zmax()];
		}
		return iter;
	}
}