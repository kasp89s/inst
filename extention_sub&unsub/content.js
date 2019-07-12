(function () {
    var div = document.createElement('div'),
        actionButton = (parseInt(localStorage.getItem('execute')) != 1) ?
            '<input style="width: 50px;" id="start-run" type="button" value="Старт">&nbsp;&nbsp;&nbsp;' :
            '<input style="width: 50px;" id="stop-run" type="button" value="Стоп">&nbsp;&nbsp;&nbsp;';

    div.innerHTML = '<div style="bottom: 0;left: 0;position: fixed; right: 0;background: #f2f2f2;border-top: 1px solid #e4e4e4;line-height: 40px;min-width: 980px;height: 50px; display: block;">' +
        '<input style="width: 100px;" name="username" id="save-value" type="text" value="' + localStorage.getItem('instagram_username') + '" placeholder="Имя пользователя" />' +
        '<input style="width: 50px;" type="button" id="save-username" value="save">&nbsp;&nbsp;&nbsp;' +
        actionButton +
        '<input id="sub-list-clear" type="button" value="Сбросить sub кэш">&nbsp;&nbsp;&nbsp;' +
        'Отписка с <input name="username" id="unsub-from" type="number" value="' + localStorage.getItem('unsub_from') + '" placeholder="23" />' +
        ' по <input name="username" id="unsub-to" type="number" value="' + localStorage.getItem('unsub_to') + '" placeholder="9" />' +
        '<input style="width: 50px;" type="button" id="save-unsub" value="save">&nbsp;&nbsp;&nbsp;' +
        '</div>';

    document.getElementsByTagName("body")[0].appendChild(div);

    document.getElementById("save-username").addEventListener("click", function () {
        var username = document.getElementById("save-value");

        localStorage.setItem('instagram_username', username.value);
        console.log(username.value);
    }, false);

    if (document.getElementById("start-run") != null)
        document.getElementById("start-run").addEventListener("click", function () {
            if (!localStorage.getItem('instagram_username')) {
                alert('Не введено имя аккаунта');
                return false;
            }

            if (!localStorage.getItem('unsub_from')) {
                alert('Не введено отписка с');
                return false;
            }

            if (!localStorage.getItem('unsub_to')) {
                alert('Не введено отписка по');
                return false;
            }

            localStorage.setItem('execute', 1);
            document.location.reload(true);
            console.log('start');
        }, false);

    if (document.getElementById("stop-run") != null)
        document.getElementById("stop-run").addEventListener("click", function () {
            localStorage.setItem('execute', 0);
            document.location.reload(true);
            console.log('stop');
        }, false);

    document.getElementById("sub-list-clear").addEventListener("click", function () {
        localStorage.removeItem(localStorage.getItem('instagram_username') + '_sublist');
        localStorage.setItem('execute', 1);
        document.location.reload(true);
        console.log('sub-list-clear');
    }, false);

    document.getElementById("save-unsub").addEventListener("click", function () {
        localStorage.setItem('unsub_from', document.getElementById("unsub-from").value);
        localStorage.setItem('unsub_to', document.getElementById("unsub-to").value);
        document.location.reload(true);
    }, false);
})();

if (localStorage.getItem('instagram_username') && localStorage.getItem('execute') == 1) {
    var profile = localStorage.getItem('instagram_username'),
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
        var hours = new Date().getHours();
        if (hours > parseInt(localStorage.getItem('unsub_from')) || hours < parseInt(localStorage.getItem('unsub_to'))) {
            // отписка
            if (window.location.href != 'https://www.instagram.com/' + profile + '/') {
                window.location.href = 'https://www.instagram.com/' + profile + '/';
            }
            console.log('старт отписка');
            startUnsub();
        } else {
            // подписка
            if (!subToParse) {
                localStorage.setItem(profile + '_random_sub', random);

                window.location.href = 'https://www.instagram.com/' + random + '/';
            } else {
                if (window.location.href != 'https://www.instagram.com/' + subToParse + '/') {
                    window.location.href = 'https://www.instagram.com/' + subToParse + '/';
                }
                console.log('старт подписка');
                startSubscribe();
            }
        }
    }
}

function startUnsub() {
    var a = document.getElementsByTagName("a"),
        current = 0,
        step = 5000,
        currentStep = 0,
        stack = [];

    for (var i in a) {
        try {
            if (a[i].hasAttribute('href') && a[i].getAttribute('href') == '/' + profile + '/following/')
                a[i].click();
        } catch (e) {
        }
    }

    function scrollSubList() {
        currentStep++;
        document.getElementsByClassName('isgrP')[0].scrollTo(current, current + step);

        current = current + step;

        if (currentStep >= 5) {
            clearInterval(scrollInterval);
            console.log('start parse');
            unsubStackFilter();
        }
    }

    var scrollInterval = setInterval(
        function () {
            scrollSubList()
        },
        5000);

    function unsubStackFilter() {
        var li = document.getElementsByTagName('li'),
            maxStackLenght = getRandomInt(25, 30);

        try {
            for (var i in li) {
                if ('undefined' != typeof li[i].getElementsByTagName('img')[0]) {
                    var a = li[i].getElementsByTagName('a'),
                        buttons = li[i].getElementsByTagName("button");
                    for (var j in a) {
                        if ('undefined' != typeof a[j].className && a[j].className.indexOf('notranslate') + 1) {
                            if (subscribers.indexOf(a[j].firstChild.nodeValue) === -1) {
                                console.log('Ydalyay dibila ' + a[j].firstChild.nodeValue + ' on ne podpisan!!!');
                                if (stack.length <= maxStackLenght)
                                    stack.push(buttons[0]);
                            }
                        }
                    }
                }
            }
        } catch (e) {
        }
        console.log(stack.length);
        unsub();
    }

    function unsub() {
        var button = stack.shift();
        if ("object" != typeof button) {
            console.log('start reload');
            setTimeout(function () {
                document.location.reload(true);
            }, getRandomInt(1200000, 1500000));

            return !1;
        }

        button.click();

        setTimeout(function () {
            pressCancelButton();
        }, getRandomInt(3e3, 5e3));
    }

    function pressCancelButton() {
        var buttons = document.getElementsByTagName("button");

        for (var i in buttons) {
            try {
                if (buttons[i].firstChild.nodeValue === 'Отменить подписку') {
                    console.log('unsub');
                    buttons[i].click();

                    setTimeout(function () {
                        unsub();
                    }, getRandomInt(3e3, 5e3));
                    break;
                }
            } catch (e) {
            }
        }
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
                if (a[i].hasAttribute('href') && a[i].getAttribute('href') == '/' + subToParse + '/followers/') {
                    allSubs = parseInt(a[i].getElementsByTagName('span')[0].firstChild.nodeValue);
                    a[i].click();

                    setTimeout(function () {
                        scrollSubList();
                    }, 2000);
                }
            } catch (e) {
            }
        }
    }

    function scrollSubList() {
        setTimeout(function () {
            document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);
        }, 2000);
        setTimeout(function () {
            document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);
        }, 4000);
        setTimeout(function () {
            document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);
        }, 6000);
        setTimeout(function () {
            document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);
            selectBestVariants();
        }, 8000);
    }

    function selectBestVariants() {
        var li = document.getElementsByTagName('li');
        var count = 0;
        for (var i in li) {
            try {
                if ('undefined' != typeof li[i].getElementsByTagName('button')[0] && li[i].getElementsByTagName('button')[0].firstChild.nodeValue === 'Подписаться') {
                    if (count >= limitPerPage)
                        break;

                    stack.push(li[i].getElementsByTagName('button')[0]);
                    count++
                }
            } catch (e) {
                console.log(e);
            }
        }

        console.log(stack);
        pushTheButton();
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

    setTimeout(function () {
        openListModal();
    }, 2000);
}

function updateSubscribers() {
    var usersOneScroll = 11,
        allSubs = 0,
        currentStep = 0,
        profile = localStorage.getItem('instagram_username'),
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
                if (a[i].hasAttribute('href') && a[i].getAttribute('href') == '/' + profile + '/followers/') {
                    allSubs = parseInt(a[i].getElementsByTagName('span')[0].firstChild.nodeValue);
                    console.log('You have ' + allSubs + ' sub. Need make ' + parseInt(allSubs / usersOneScroll) + ' scroll steps');
                    a[i].click();
                }
            } catch (e) {
            }
        }
    }, 2000);

    var scrollInterval = setInterval(
        function () {
            scrollSubList()
        },
        5000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
