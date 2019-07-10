function start() {
	var likeLimit = 1000,
		dateObj = new Date(),
		dateKey = dateObj.getFullYear() +'_'+ dateObj.getDate() +'_'+ dateObj.getMonth(),
		countLikes = localStorage.getItem(dateKey + '_likes'),
		t = document.getElementsByTagName("button"),
		stack = [];

	if (countLikes > likeLimit) {
		console.log('likes limit end: ' + countLikes);
		return false;
	}

	for (var o in t) {
		if (typeof t[0] === 'object') {
			try {
				var span = t[o].getElementsByTagName('span');
				if (span[0] && span[0].hasAttribute('aria-label') && span[0].getAttribute('aria-label') === 'Нравится') {
					stack.push(span[0]);
				}
			} catch (e) {

			}
		}
	}

	function like() {
		var o = stack.shift();
		if ("object" != typeof o) {
				console.log('start reload');
				setTimeout(function () {
					window.location.href = '';
				}, getRandomInt(60000, 70000));

			return !1;
		}

		countLikes++;
		localStorage.setItem(dateKey + '_likes', countLikes);
		console.log('like' + countLikes);
		console.log(stack);
		o.click();
		setTimeout(function () {like();}, getRandomInt(3e3, 5e3));
	}
	
	setTimeout(function () {like();}, getRandomInt(3e3, 5e3));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
if (window.location.href == 'https://www.instagram.com/') {
	console.log('Hello from like bot plz enjoin now :)');
	
	setTimeout(function () {window.scrollTo(0, 0);}, 1000);
	setTimeout(function () {window.scrollTo(0, 2000);}, 2000);
	
	setTimeout(
		function () {
			start();
		},
	5000);
}
