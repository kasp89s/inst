var profile = 'kateyka892143',
	limitPerPage = getRandomInt(20, 25);
	subscribers = JSON.parse(localStorage.getItem(profile + '_sublist')),
	random = (subscribers) ? subscribers[getRandomInt(0, subscribers.length - 1)] : null,
	subToParse = localStorage.getItem(profile + '_random_sub');

if (subscribers === null) {
	if (window.location.href != 'https://www.instagram.com/' + profile + '/') {
		window.location.href = 'https://www.instagram.com/' + profile + '/';
	} else {
		updateSubscribers();
	}
} else {
	if (!subToParse) {
		localStorage.setItem(profile + '_random_sub', random);
		
		window.location.href = 'https://www.instagram.com/' + random + '/';
	} else {
		if (window.location.href != 'https://www.instagram.com/' + subToParse + '/') {
			window.location.href = 'https://www.instagram.com/' + subToParse + '/';
		}
		startSubscribe();
	}
}

function startSubscribe() {
	console.log('startSubscribe');
	localStorage.removeItem(profile + '_random_sub');
	
	var stack = [];
	
	function openListModal() {
		console.log(subToParse);
		var a = document.getElementsByTagName('a');
		for (var i in a) {
				try {
					if(a[i].hasAttribute('href') && a[i].getAttribute('href') == '/'+subToParse+'/followers/') {
						allSubs = parseInt(a[i].getElementsByTagName('span')[0].firstChild.nodeValue);
						a[i].click();
						
						setTimeout(function () {scrollSubList();}, 2000);
					}
				} catch (e) {
				}
		}
	}
	
	function scrollSubList() {
		setTimeout(function () {document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);}, 2000);
		setTimeout(function () {document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);}, 4000);
		setTimeout(function () {document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);}, 6000);
		setTimeout(function () {document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000); selectBestVariants();}, 8000);
	}
	
	function selectBestVariants() {
		var li = document.getElementsByTagName('li');
	
		try {
			var count = 0;
			for (var i in li) {
				if ('undefined' != typeof li[i].getElementsByTagName('button')[0] && li[i].getElementsByTagName('button')[0].firstChild.nodeValue === 'Подписаться') {
					if (count >= limitPerPage)
						break;
					
					stack.push(li[i].getElementsByTagName('button')[0]);
					count++
				}
			}
			
			console.log(stack);
			pushTheButton();
		} catch (e) {
			console.log(e);
		}
	}
	
	function pushTheButton() {
		var button = stack.shift();
		
		if (typeof button === 'object') {
			console.log('sub');
			button.click();
		} else {
			console.log('end');
			setTimeout(function () {
				document.location.reload(true);
			}, getRandomInt(1800000, 2000000));
			return false;
		}
		
		setTimeout(function () {
			pushTheButton();
		}, getRandomInt(3000, 5000));
	}

	setTimeout(function () {openListModal();}, 2000);
}

function updateSubscribers() {
	var usersOneScroll = 10,
	allSubs = 0,
	currentStep = 0,
	profile = 'kateyka892143',
	current = 0,
	step = 5000,
	subList = [],
	a = document.getElementsByTagName('a');


	function scrollSubList() {
		currentStep++;
		console.log('step ' + currentStep + ' of ' + parseInt(allSubs / usersOneScroll))
		document.getElementsByClassName('isgrP')[0].scrollTo(current, current + step);
		
		current = current + step;
		
		if (currentStep >= parseInt(allSubs / usersOneScroll)) {
			clearInterval(scrollInterval);
			console.log('start parse');
			parseNames();
		}
	}

	function parseNames() {
		var li = document.getElementsByTagName('li');
		
		try {
			for (var i in li) {
				if ('undefined' != typeof li[i].getElementsByTagName('img')[0]) {
					var a = li[i].getElementsByTagName('a');
					for (var j in a) {
						if ('undefined' != typeof a[j].className && a[j].className.indexOf('notranslate') + 1)
							subList.push(a[j].firstChild.nodeValue);
					}
				}
			}
		} catch (e) {
		}
		
		localStorage.setItem(profile + '_sublist', JSON.stringify(subList));
		console.log(subList);
		document.location.reload(true);
	}

	setTimeout(function () {
			for (var i in a) {
				try {
					if(a[i].hasAttribute('href') && a[i].getAttribute('href') == '/'+profile+'/followers/') {
						allSubs = parseInt(a[i].getElementsByTagName('span')[0].firstChild.nodeValue);
						console.log('You have '+allSubs+' sub. Need make ' + parseInt(allSubs / usersOneScroll) + ' scroll steps');
						a[i].click();
					}
				} catch (e) {
				}
			}
	}, 2000)

	var scrollInterval = setInterval(
		function () {
			scrollSubList()
		},
	5000);
}
	
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}