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
