function start() {
	var buttons = document.getElementsByTagName('button')
		stack = [];

	for (var i in buttons) {
		stack.push(buttons[i]);
	}


	function lazyClick() {
		var button = stack.shift();
		
		if (typeof button === 'object') {
			console.log('sub');
			button.click();
		} else {
			console.log('end');
			reload();
			return false;
		}
		
		setTimeout(function () {
			lazyClick();
		}, getRandomInt(3000, 5000));
	}
	
	setTimeout(
		function () {
			lazyClick();
		},
	2000);
}
	
function reload()
{
	console.log('start reload');
	setTimeout(function () {
		window.location.href = 'https://www.instagram.com/explore/people/suggested/';
	}, getRandomInt(100000, 200000));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

	setTimeout(
		function () {
			start();
		},
	5000);