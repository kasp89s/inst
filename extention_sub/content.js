function start() {
	var subLimit = 1000,
		dateObj = new Date(),
		dateKey = dateObj.getFullYear() +'_'+ dateObj.getDate() +'_'+ dateObj.getMonth(),
		stack = [],
		countSub = localStorage.getItem(dateKey + '_sub');

	if (countSub > subLimit) {
		console.log('sub limit end: ' + countSub);
		return false;
	}
	
	fillStack(stack);

	function lazyClick() {
		var button = stack.shift();
		
		if (typeof button === 'object') {
			countSub++;
			localStorage.setItem(dateKey + '_sub', countSub);
			console.log('sub' + countSub);
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
	
function fillStack(stack)
{
	var div = document.getElementsByTagName('div');

	for (var i in div) {
		try {
			if (div[i].hasAttribute('aria-labelledby')) {
				var button = div[i].getElementsByTagName('button')[0],
					dives = div[i].getElementsByTagName('div'),
					aprove = false;

				for (var j in dives) {
					if (["Рекомендации для вас", "Ваш подписчик"].indexOf(dives[j].firstChild.nodeValue) != -1) {
						aprove = true;
						break;
					}
				}
				
				if (aprove)
					stack.push(button);
			}
		} catch (e) {
		}
	}
}

function reload()
{
	console.log('start reload');
	setTimeout(function () {
		window.location.href = 'https://www.instagram.com/explore/people/suggested/';
	}, getRandomInt(600000, 700000));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

if (window.location.href == 'https://www.instagram.com/explore/people/suggested/') {
	console.log('Hello from subscribe bot plz enjoin now :)');
	
	setTimeout(
		function () {
			start();
		},
	5000);
}
