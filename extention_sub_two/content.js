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
        'По тегам <input type="checkbox" id="save-tag" value="1" ' + ((localStorage.getItem('sub_tag') == 'true') ? 'checked' : '') + '>&nbsp;&nbsp;&nbsp;' +
        '<input type="text" id="teg-value" value="' + localStorage.getItem('sub_tag_value') + '">&nbsp;&nbsp;&nbsp;' +
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

    document.getElementById("save-tag").addEventListener("change", function () {
        localStorage.setItem('sub_tag', this.checked);
        document.location.reload(true);
    }, false);

    document.getElementById("teg-value").addEventListener("change", function () {
        localStorage.setItem('sub_tag_value', this.value);
    }, false);
})();

if (localStorage.getItem('instagram_username') && localStorage.getItem('execute') == 1) {
    var rezerveTimeout = setTimeout(function () {
        document.location.reload(true);
    }, 60000);

    var errorTimeout = setTimeout(function () {
        document.location.reload(true);
    }, 3600000);

    var profile = localStorage.getItem('instagram_username'),
        limitPerPage = getRandomInt(20, 25);
    subscribers = JSON.parse(localStorage.getItem(profile + '_sublist')),
        random = (subscribers) ? subscribers[getRandomInt(0, subscribers.length - 1)] : null,
        subToParse = localStorage.getItem(profile + '_random_sub'),
        tagToParse = localStorage.getItem(profile + '_tag_value');

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

            if (localStorage.getItem('sub_tag') == 'true' && localStorage.getItem('sub_tag_value')) {
                if (!tagToParse) {
                    var tags = localStorage.getItem('sub_tag_value').split(" "),
                        tag = tags[getRandomInt(0, tags.length - 1)];

                    localStorage.setItem(profile + '_tag_value', tagToParse);

                    window.location.href = 'https://www.instagram.com/explore/tags/' + tag + '/';
                } else {
                    if (window.location.href != 'https://www.instagram.com/explore/tags/' + tagToParse + '/') {
                        window.location.href = 'https://www.instagram.com/explore/tags/' + tagToParse + '/';
                    } else {
                        startSubscribeTag();
                    }
                }
            } else {
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
}

function startSubscribeTag() {
    console.log('старт подписка');
    localStorage.removeItem(profile + '_tag_value');

    var div = document.getElementsByClassName("_bz0w"),
        truePosts = [],
        currentAction = 0,
        modalScrols = 0,
        limitPerPage = getRandomInt(20, 25),
        stack = [];

    for (var i in div) {
        try {
            var link = div[i].getElementsByTagName('a')[0];
            simulateMouseover(link);

            var countBlock = div[i].getElementsByClassName('qn-0x')[0].getElementsByTagName('span')[0];

            if (parseInt(countBlock.firstChild.nodeValue) >= 100)
                truePosts.push(i);

        } catch (e) {
        }
    }

//if (truePosts.length == 0)
//	return false;

    var posts = document.getElementsByClassName("eLAPa"),
        postToParse = getRandomInt(0, truePosts.length - 1);

    posts[postToParse].click();

    setTimeout(function () {
        openLikersModal();
    }, 4000);

    function openLikersModal() {
        var link = document.getElementsByClassName("_8A5w5");

        link[link.length - 1].click();

        setTimeout(function () {
            selectBestVariants();
        }, 4000);
    }

    function scrollSubList() {
        var modal = document.getElementsByClassName('i0EQd')[0].getElementsByTagName('div')[0];

        stack = [];

        setTimeout(function () {
            modal.scrollTo(modalScrols, modalScrols + 4000);
            modalScrols += 4000;
        }, 2000);
        setTimeout(function () {
            modal.scrollTo(modalScrols, modalScrols + 4000);
            modalScrols += 4000;
            selectBestVariants();
        }, 4000);
    }

    function selectBestVariants() {
        var li = document.getElementsByClassName('i0EQd')[0].getElementsByTagName('div')[0].getElementsByTagName('button');

        var count = 0;
        for (var i in li) {
            try {
                if (li[i].firstChild.nodeValue === 'Подписаться') {
                    stack.push(li[i]);
                }
            } catch (e) {
                console.log(e);
            }
        }

        console.log(stack);
        clearTimeout(rezerveTimeout);
        pushTheButton();
    }

    function pushTheButton() {
        var button = stack.shift();

        if (currentAction >= limitPerPage) {
            console.log('end');
            setTimeout(function () {
                document.location.reload(true);
            }, getRandomInt(1800000, 2000000));
            return false;
        }

        if (typeof button === 'object') {
            currentAction++;
            console.log('кнопка');
            button.click();

            setTimeout(function () {
                pushTheButton();
            }, getRandomInt(1000, 2000));
        } else {
            console.log('листаем скролл');
            scrollSubList();
        }
    }

    function simulateMouseover(target) {
        var event = new MouseEvent('mouseover', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });

        !target.dispatchEvent(event);
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
            maxStackLenght = getRandomInt(10, 15);

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

        clearTimeout(rezerveTimeout);
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
        }, 8000);
        setTimeout(function () {
            document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);
        }, 10000);
        setTimeout(function () {
            document.getElementsByClassName('isgrP')[0].scrollTo(0, 5000);
            selectBestVariants();
        }, 12000);
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
        clearTimeout(rezerveTimeout);
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

    clearTimeout(rezerveTimeout);

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
