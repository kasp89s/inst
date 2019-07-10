var profile = 'kateyka892143',
	subList = JSON.parse(localStorage.getItem(profile + '_sublist'));

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

	function unsubStackFilter () {
		var li = document.getElementsByTagName('li');
		
		try {
			for (var i in li) {
				if ('undefined' != typeof li[i].getElementsByTagName('img')[0]) {
					var a = li[i].getElementsByTagName('a'),
						buttons = li[i].getElementsByTagName("button");
					for (var j in a) {
						if ('undefined' != typeof a[j].className && a[j].className.indexOf('notranslate') + 1) {
							if (subList.indexOf(a[j].firstChild.nodeValue) === -1) {
								console.log('Ydalyay dibila ' + a[j].firstChild.nodeValue + ' on ne podpisan!!!');
								stack.push(buttons[0]);
							}
						}
					}
				}
			}
		} catch (e) {
		}
		
		unsub();
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


	setTimeout(function () {unsubStackFilter();}, getRandomInt(3e3, 5e3));
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
