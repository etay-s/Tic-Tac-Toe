    let c = document.getElementById("canvas");
	let cx = document.getElementById("xcanv");
	let co = document.getElementById("ocanv");
	let ctx = c.getContext("2d");
	let butt = document.getElementsByTagName("button");
	butt[0].onclick = function (event) { showGrid(event) };
	butt[1].onclick = function (event) { showGrid(event) };
	ctx.font = '50px serif';
	ctx.fillText('Choose your player', 320, 500);
	drawShapes(co, "o");
	drawShapes(cx, "x");
	let arr = [];
	let compSign;
	createGridArr();
	let spn = document.getElementsByTagName("span")[0];
	let turns = 0;

	function startGame(shape) {
		let flag = false;
		let winner = false;
		c.onclick = function (event) {
			for (let i = 0; i < 9; i++) {
				if (arr[i]["posx"] < event.layerX && arr[i]["posx"] + arr[i]["length"] > event.layerX) {
					if (arr[i]["posy"] < event.layerY && arr[i]["posy"] + arr[i]["length"] > event.layerY) {
						if (arr[i]["status"] == "" && !winner) {
							drawShapes(c, shape, arr[i]);
							flag = true;
							turns++;
							let tempArr = checkWin(shape);
							if(tempArr){
								drawWin(tempArr.sort(function (a, b) { return a - b; }));
								winner = true;
							}
							break;
						}
					}
				}
			}
			if(!winner && flag && turns != 9){
				c.onclick ="";
				setTimeout(compPlay, 1000, shape);
			}
			else if(winner){
				spn.innerHTML = "You Won!";
				butt[2].hidden = false;
				butt[2].onclick = function(){location.reload();}
			}
			else if (flag){
				spn.innerHTML = "It's a Tie!";
				butt[2].hidden = false;
				butt[2].onclick = function(){location.reload();}
				}
		}
	}

	function compPlay(shape) {
		let indx;
		let tempArr = [];
		let winner = false;
		if (shape == "x") {
				compSign = "o";
			}
		else {
				compSign = "x";
		}
		let tempComp = checkWin(compSign, true);
		let tempSign = checkWin(shape, true);
		if(tempComp){
			tempArr = tempComp;
			indx = tempArr[2];
		}
		else if(tempSign){
			tempArr = tempSign;
		 	indx = tempArr[2];
		}
		else{
			indx = Math.floor(Math.random() * 9);
		}
		if (arr[indx]["status"] == "") {
			drawShapes(c, compSign, arr[indx]);
			turns++;
			tempArr = checkWin(compSign);
			if (tempArr) {
				drawWin(tempArr.sort(function (a, b) { return a - b; }));
				winner = true;
			}
			if(!winner){startGame(shape);}
			else{
				spn.innerHTML = "You Lost!"
				butt[2].hidden = false;
				butt[2].onclick = function(){location.reload();}
			}
		}
		else {
			compPlay(shape);
		}
	}
	function drawWin(win) {
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.lineCap = "round";
		a1 = arr[win[0]];
		a3 = arr[win[2]];
		if (win[win.length - 1] == "r") {
			ctx.moveTo(a1["posx"], a1["posy"] + a1["length"] / 2);
			ctx.lineTo(a3["posx"] + a3["length"], a3["posy"] + a3["length"] / 2);
			ctx.stroke();
		}
		else if (win[win.length - 1] == "c") {
			ctx.moveTo(a1["posx"] + a1["length"] / 2, a1["posy"]);
			ctx.lineTo(a3["posx"] + a3["length"] / 2, a3["posy"] + a3["length"]);
			ctx.stroke();
		}
		else {
			if (win[0] == 0){
				ctx.moveTo(a1["posx"], a1["posy"]);
				ctx.lineTo(a3["posx"] + a3["length"], a3["posy"] + a3["length"]);
				ctx.stroke();
			}
			else{
				ctx.moveTo(a1["posx"] + a1["length"], a1["posy"]);
				ctx.lineTo(a3["posx"], a3["posy"] + a3["length"]);
				ctx.stroke();
			}
			
		}
	}

	function diagonalTend(n, shape) {
		let winArr = [];
		let count = 0;
		for (let i = n + 4; i < 9; i += 4) {
			if (shape == arr[i]["status"]) { winArr.push(i); count++;}
		}
		for (let i = n - 4; i >= 0; i -= 4) {
			if (shape == arr[i]["status"]) { winArr.push(i); count++;}
		}
		winArr.push(count);
		return winArr;
	}

	function checkDiagonal(n, shape) {
		let winArr = [];
		winArr = diagonalTend(n, shape);
		let count = winArr.pop();
		if (arr[4]["status"] == shape && (n == 2 || n == 6)) { winArr.push(4); count++;}
		if (n == 4 && count == 0){
			if(shape == arr[2]["status"]){winArr.push(2); count++;}
			if(shape == arr[6]["status"]){winArr.push(6); count++;}
		}
		winArr.push(n);
		winArr.push("d");
		if(count == 2){ return winArr; }
	}

	function checkColumn(n, shape) {
		let winArr = [];
		let count = 0;
		for (let i = n + 3; i < 9; i += 3) {
			if (shape == arr[i]["status"]) { winArr.push(i); count++; }
		}
		for (let i = n - 3; i >= 0; i -= 3) {
			if (shape == arr[i]["status"]) { winArr.push(i); count++; }
		}
		if(count == 2){
			winArr.push(n);
			winArr.push("c");
			return winArr;
		}
	}

	function checkWin(shape, chk) {
		for (let i = 0; i < 9; i++) {
			let winArr = [];
			let temp;

			if ((arr[i]["status"] == "" && chk) || (!chk && arr[i]["status"] == shape)){
				if (i % 3 == 0) {
					
					if (shape == arr[i + 1]["status"] && shape == arr[i + 2]["status"]) {
						winArr = [i + 1, i + 2, i];
						winArr.push("r");
						if(arr[winArr[0]]["status"] != ""){ return winArr; }
					}
					else {
						
						if (i % 2 == 0) {
							temp =  checkDiagonal(i, shape);
							if(temp){return temp;}
						}
						temp = checkColumn(i, shape);
						if(temp){return temp;}
					}
				}
				else if (i % 3 == 1) {
					
					if (shape == arr[i - 1]["status"] && shape == arr[i + 1]["status"]) {
						winArr = [i - 1, i + 1, i];
						winArr.push("r");
						if(arr[winArr[0]]["status"] != ""){ return winArr; }
					}
					else {
						if (i % 2 == 0) {
							temp =  checkDiagonal(i, shape);
							if(temp){return temp;}
						}
						temp = checkColumn(i, shape);
						if(temp){return temp;}
					}
				}
				else {
					
					if (shape == arr[i - 2]["status"] && shape == arr[i - 1]["status"]) {
						winArr = [i - 2, i - 1, i];
						winArr.push("r");
						if(arr[winArr[0]]["status"] != ""){ return winArr; }
					}
					else {
						
						if (i % 2 == 0) {
							temp =  checkDiagonal(i, shape);
							if(temp){return temp;}
						}
						temp = checkColumn(i, shape);
						if(temp){return temp;}
					}
				}
			}
		}
	}

	function showGrid(e) {
		ctx.clearRect(0, 0, c.width, c.height);
		drawGrid(c.width, c.height / 3, 0);
		drawGrid(c.width, (c.height / 3) * 2, 0);
		drawGrid(c.width / 3, c.height, 1);
		drawGrid((c.width / 3) * 2, c.height, 1);
		butt[0].hidden = true;
		butt[1].hidden = true;
		let sign = e.currentTarget.name;
		startGame(sign);
	}

	function createGridArr() {
		let x;
		let y = 0;
		let n = 0;
		let m = 0;
		for (let i = 1; i <= 9; i++) {
			if (n % 3 == 0) { n = 0; }
			x = (c.width / 3) * n;
			n += 1;
			if (m % 3 == 0) { y = (c.width / 3) * (m / 3); }
			m += 1;
			arr.push({
				status: "",
				posx: x,
				posy: y,
				length: c.width / 3
			});
		}
	}

	//0 = horizontal
	//1 = vertical
	function drawGrid(width, height, dir) {
		ctx.beginPath();
		if (dir == 0) {
			ctx.moveTo(0, height);
			ctx.lineTo(width, height);
			ctx.stroke();
		}
		else {
			ctx.moveTo(width, 0);
			ctx.lineTo(width, height);
			ctx.stroke();
		}
	}

	function drawShapes(cb, shape, obj) {
		var canv = cb.getContext("2d");
		canv.beginPath();
		canv.lineWidth = 10;
		canv.lineCap = "round";
		if (shape == "o") {
			if (obj) { canv.arc(obj["posx"] + (obj["length"] / 2), obj["posy"] + (obj["length"] / 2), (obj["length"] / 2) * 0.8, 0, 2 * Math.PI); obj["status"] = shape; }
			else { canv.arc(cb.width / 2, cb.height / 2, (cb.height / 2) * 0.8, 0, 2 * Math.PI); }
			canv.stroke();
		}
		else {
			if (obj) {
				canv.moveTo(obj["posx"] + (obj["length"]) * 0.05, obj["posy"] + (obj["length"]) * 0.05);
				canv.lineTo(obj["posx"] + (obj["length"]) * 0.95, obj["posy"] + (obj["length"]) * 0.95);
				canv.moveTo(obj["posx"] + (obj["length"]) * 0.95, obj["posy"] + (obj["length"]) * 0.05);
				canv.lineTo(obj["posx"] + (obj["length"]) * 0.05, obj["posy"] + (obj["length"]) * 0.95);
				obj["status"] = shape;
			}
			else {
				canv.moveTo(20, 20);
				canv.lineTo(cb.width - 20, cb.height - 20);
				canv.moveTo(20, cb.height - 20);
				canv.lineTo(cb.width - 20, 20);
			}
			canv.stroke();
		}
	}