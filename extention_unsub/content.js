var profile = 'kateyka892143';

function start() {
	var limit = 1000,
		dateObj = new Date(),
		dateKey = dateObj.getFullYear() +'_'+ dateObj.getDate() +'_'+ dateObj.getMonth(),
		count = localStorage.getItem(dateKey + '_unsub');
		a = document.getElementsByTagName("a"),
		stack = [];
	 
	if (count > limit) {
		console.log('unsub limit end: ' + count);
		return false;
	}
	
	for (var i in a) {
		try {
			if(a[i].hasAttribute('href') && a[i].getAttribute('href') == '/' + profile + '/following/')
				a[i].click();
		} catch (e) {
		}
	}

	function unsubStack() {
		var buttons = document.getElementsByTagName("button");
		
		for (var i in buttons) {
				try {
					if (buttons[i].firstChild.nodeValue === 'Подписки')
					stack.push(buttons[i]);
				} catch (e) {
				}
		}
		
		unsub();
	}

	function unsub() {
		var button = stack.shift();
			if ("object" != typeof button) {
				console.log('start reload');
				setTimeout(function () {
					window.location.href = '';
				}, getRandomInt(600000, 700000));

				return !1;
			}

		button.click();
		
		setTimeout(function () {pressCancelButton();}, getRandomInt(3e3, 5e3));
	}

	function pressCancelButton() {
		var buttons = document.getElementsByTagName("button");
		
		for (var i in buttons) {
				try {
					if (buttons[i].firstChild.nodeValue === 'Отменить подписку') {
						count++;
						localStorage.setItem(dateKey + '_unsub', count);
						console.log('unsub' + count);
						buttons[i].click();

						setTimeout(function () {unsub();}, getRandomInt(3e3, 5e3));
						break;
					}
				} catch (e) {
				}
		}
	}


	setTimeout(function () {unsubStack();}, getRandomInt(3e3, 5e3));
}

if (window.location.href == 'https://www.instagram.com/' + profile + '/') {
	console.log('Hello from unsub bot plz enjoin now :)');
	
	setTimeout(
		function () {
			start();
		},
	5000);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}