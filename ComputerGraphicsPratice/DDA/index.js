const rowLen = 100;
const columnLen = 100;
const pixelWidth = 4;

let planeBody = document.querySelector('#plane > tbody');
for (let i = 0; i < columnLen; ++i) {
	let tr = document.createElement('tr');
	for (let j = 0; j < rowLen; ++j) {
		let td = document.createElement('td');
		td.setAttribute('id', `x${j}y${columnLen - i - 1}`);
		td.setAttribute('width', pixelWidth);
		td.setAttribute('height', pixelWidth);
		td.setAttribute('style', "background: #CCC");
		tr.appendChild(td);
	}
	planeBody.appendChild(tr);
}

function setColor(x, y, color) {
	let td = document.querySelector(`#x${x}y${y}`);
	let newValue = `background: ${color};`;
	if (td.attributes["style"] != newValue) td.setAttribute('style', newValue);	
}

function clearAll() {
	for (let i = 0; i < 100; ++i) {
		for (let j = 0; j < 100; ++j) {
			setColor(i, j, "#CCC");
		}
	}
}

function drawLine(x1, y1, x2, y2) {
	let m = (y2 - y1) / (x2 - x1);
	let h = y1 - m * x1;
	if (m < 1) {
		let y = y1;
		y -= m / 2;
		for (let i = x1; i < x2; ++i) {
			y += m;
			if (y >= columnLen) break;
			setColor(i, Math.floor(y), "#F00");
			
		}
	} else {
		let x = x1;
		for (let i = y1; i < y2; ++i) {
			x += 1/m;
			if (x >= rowLen) break;
			setColor(Math.floor(x), i, "#F00");
		}
	}
}

function doIt() {
	let x1 = document.querySelector('input#x1').value;
	let y1 = document.querySelector('input#y1').value;
	let x2 = document.querySelector('input#x2').value;
	let y2 = document.querySelector('input#y2').value;
	
	x1 = Math.floor(x1);
	y1 = Math.floor(y1);
	x2 = Math.floor(x2);
	y2 = Math.floor(y2);

	//clearAll();
	drawLine(x1, y1, x2, y2)
}