//GLOBAL VARIABLES --------------------------------------------------------------------
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global window, XMLHttpRequest, document, Handlebars, setInterval, clearInterval, DIC_OFFICE, DIC_STATE, DIC_PARTY, DIC_GFXTYPES, DIC_HTML, Promise */
var url = 'http://uvn-eng-tools.be.local/api/v1/elections/2018-11-06/';
var WINNER_OVERWRITE = true;
var TEMP_DATA, TEMP_ABBR, First_Pass, LOOP_INTERVAL;

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//ONINIT ----------------------------------------------------------------------------
window.onload = getFullData();

//Closes dropdowns if user clicks outside of button
window.onclick = function (event) {
    var i;
    if (!event.target.matches('.btn-name')) {
        var cwLists = document.getElementsByClassName('cw-list');
        for (i = 0; i < cwLists.length; i++) {
            var openList = cwLists[i];
            if (openList.classList.contains('showList')) {
                openList.classList.remove('showList');
            }
        }
    }
    if (!event.target.matches('.btn-sel')) {
        var selLists = document.getElementsByClassName('sel-list');
        for (i = 0; i < selLists.length; i++) {
            var openList2 = selLists[i];
            if (openList2.classList.contains('show')) {
                openList2.classList.remove('show');
            }
        }
    }
}

//-----------------------------------------------------------------------------------
//LOADS DATA STRUCTURE: SUMMARY_DATA = API///detail=summary -------------------------
function getFullData() {
    window.console.log('STARTING....');
    clearInterval(LOOP_INTERVAL);
    document.getElementById('spinnerCon').style.display = 'Block';
    document.getElementById('info').style.display = 'none';
    var htmlType = document.getElementsByTagName("title")[0].getAttribute("name");
    if (htmlType != "DNU") {
        First_Pass = true;
        pullData();
        LOOP_INTERVAL = setInterval(function () {
            pullData();
        }, 50000);
    }

    function pullData() {
        window.console.log('Updating..');
        First_Pass = true;
        var promise = new requestPromise('GET', url + '?format=json', true, null);
        promise.then(function (info) {
            TEMP_DATA = info;
            TEMP_DATA.races = sortData(TEMP_DATA);
            TEMP_DATA = filterData(TEMP_DATA);
            refreshUI();
        }).catch(function (error) {
            window.console.log(error);
        });
    }
}

//-----------------------------------------------------------------------------------
//LOADING AND REFRESHING DATA -------------------------------------------------------
function refreshUI() {
    if (First_Pass) {
        loadData(TEMP_DATA); //----- Creates HTML from HB template
        document.getElementById('spinnerCon').style.display = 'none';
        document.getElementById('info').style.display = 'Block';
        First_Pass = false;
    }
    updateAPI(); //----------------- Updates API with winner AP data.
    window.console.log("End.");
}


//-----------------------------------------------------------------------------------
//HB: Template Loader ---------------------------------------------------------------
function loadData(data) {
    var rawTemp = document.getElementById("infoTemplate").innerHTML;
    var compiledTemp = Handlebars.compile(rawTemp);
    var outputHTML = compiledTemp(data);

    var infoCon = document.getElementById("infoContainer");
    infoCon.innerHTML = outputHTML;
}

//-----------------------------------------------------------------------------------
//Requester with promise ------------------------------------------------------------
function requestPromise(type, tempUrl, bool, output) {
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.open(type, tempUrl, bool);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.onload = function () {
            if (xhttp.status >= 200 && xhttp.status < 400) {
                resolve(JSON.parse(xhttp.response));
            } else {
                //ERROR ON SERVER
                reject(xhttp.statusText);
            }
        };
        xhttp.onerror = function () {
            //ERROR WITH CONNECTION
            reject(xhttp.statusText);
        };
        xhttp.send(output);
    });
}

//-----------------------------------------------------------------------------------
//OBJECT SORTERS --------------------------------------------------------------------

//Updates API with winner AP data. --------------------------------------------------
function updateAPI() {
    window.console.log("PASS");
    for (var i = 0; i < TEMP_DATA.races.length; i++) {
        if (TEMP_DATA.races[i].location != 'US') {
            var office = TEMP_DATA.races[i].office_type;
            var state = TEMP_DATA.races[i].location;
            var district = TEMP_DATA.races[i].district;
            var fuente = TEMP_DATA.races[i].projection.caption;
            var urlInfo = getRaceLUrlObj(state, office, district);

            var btnName = document.getElementById('cwCon' + urlInfo.uName).children[1];
            var htmlFuente = document.getElementById('fuente' + urlInfo.uName);
            var candName = btnName.innerHTML;
            var candId = findId(candName, i);
            var projId = TEMP_DATA.races[i].projection.winners;
            var winnerId = candInfo(projId, i, 'id');
            if (winnerId != candId || projId != candId || fuente != htmlFuente.value) {
                window.console.log(i + ': ' + candName + ' :: candId:' + candId + ';  winnerId:' + winnerId + ';  projId:' + projId);
                var winnerName = candInfo(winnerId, i, 'full_name');
                htmlFuente.value = fuente;
                postWinner(i, winnerId, winnerName);
            }
        }
    }
}

//Sorts through object based on a value. Sorts alphabeticlly ------------------------
function sortData(data) {
    var htmlName = document.getElementsByTagName("title")[0].getAttribute("name");
    var byName = data.races.slice(0);
    byName.sort(function (a, b) {
        var x = a.location.toUpperCase();
        var y = b.location.toUpperCase();
        var temp1 = DIC_STATE[x][1].replace(':', '.');
        var temp2 = DIC_STATE[y][1].replace(':', '.');
        temp1 = DIC_STATE[x][1].includes("-") ? parseFloat(temp1) + .01 : parseFloat(temp1);
        temp2 = DIC_STATE[y][1].includes("-") ? parseFloat(temp2) + .01 : parseFloat(temp2);
        temp1 = DIC_STATE[x][1].includes("am") ? parseFloat(temp1) + 12 : parseFloat(temp1);
        temp2 = DIC_STATE[y][1].includes("am") ? parseFloat(temp2) + 12 : parseFloat(temp2);
        if (htmlName != 'abc' && temp1 != temp2) {
            return temp1 - temp2;
        } else {
            if (x == y) {
                var v = DIC_OFFICE[a.office_type.toUpperCase()][1];
                var w = DIC_OFFICE[b.office_type.toUpperCase()][1];
                if (v == w) {
                    return a.district - b.district;
                } else {
                    return v - w;
                }
            } else {
                return x < y ? -1 : x > y ? 1 : 0;
            }
        }
    });
    return byName;
}

//Filters data based on the request type from the nav bar. -------------------------
function filterData(mainData) {
    var htmlName = document.getElementsByTagName("title")[0].getAttribute("name");
    var i = 0;
    var data = {};
    data.date = mainData.date;
    data.current_as_of = mainData.current_as_of;
    data.races = mainData.races;
    Object.keys(mainData.races).map(function (k) {
        //if ((mainData.races[k].location != 'MS' || mainData.races[k].office_type != 'S') && (mainData.races[k].location != 'MN' || mainData.races[k].office_type != 'S')) {
        if (htmlName == 'H') {
            if (i == 0) {
                data.races = [];
                i++;
            }
            if (mainData.races[k].office_type == 'H') {
                data.races.push(mainData.races[k]);
            }
        } else if (htmlName == 'G') {
            if (i == 0) {
                data.races = [];
                i++;
            }
            if (mainData.races[k].office_type == 'G') {
                data.races.push(mainData.races[k]);
            }
        } else if (htmlName == 'S') {
            if (i == 0) {
                data.races = [];
                i++;
            }
            if (mainData.races[k].office_type == 'S') {
                data.races.push(mainData.races[k]);
            }
        } else if (htmlName == 'I') {
            if (i == 0) {
                data.races = [];
                i++;
            }
            if (mainData.races[k].office_type == 'I') {
                data.races.push(mainData.races[k]);
            }
        } else if (htmlName == 'P') {
            if (i == 0) {
                data.races = [];
                i++;
            }
            if (mainData.races[k].office_type == 'P') {
                data.races.push(mainData.races[k]);
            }
        } else {
            if (i == 0) {
                data.races = [];
                i++;
            }
            if (mainData.races[k].office_type == 'H' || mainData.races[k].office_type == 'S' || mainData.races[k].office_type == 'G') {
                data.races.push(mainData.races[k]);
            }
        }
        //}
    });
    return data;
}



//-----------------------------------------------------------------------------------
//HELPFUL FUNCTIONS -----------------------------------------------------------------

//Main HTML Function.
function mainClick(current) {
    var htmlTitle = document.getElementsByTagName("title")[0];
    var contHTML = document.getElementById("mainMenu").children;
    var infoArr = DIC_HTML[current.id] ? DIC_HTML[current.id] : DIC_HTML.title;
    //Set class name for css.
    for (var i = 0; i < contHTML.length; i++) {
        contHTML[i].setAttribute("class", "item" + i);
    }
    if (current.id != "title") {
        current.setAttribute("class", "itemS");
    }
    //Set title info.
    htmlTitle.setAttribute("name", infoArr[0]);
    htmlTitle.innerHTML = infoArr[1];
    getFullData();
}

//Creates an object with race url information: urlTail, url, uName
function getRaceLUrlObj(state, office, district) {
    var data = {};
    data.urlTail = state + "/" + office + "/?format=json";
    data.uName = state + office;
    data.url = url + state + "/" + office + "/?format=json";
    //data.urlTailText = "'" + state + "/" + office + "/?format=json'";
    if (district) {
        data.urlTail = state + "/" + office + "/" + district + "/?format=json";
        data.uName = state + office + district;
        data.url = url + state + "/" + office + "/" + district + "/?format=json";
    }
    return data;
}

//Creates an object that can be sent as a POST command
function postObj(candId, fuenteValue, office) {
    var listArr = DIC_GFXTYPES[office] ? DIC_GFXTYPES[office] : DIC_GFXTYPES.Default;
    var listVal = parseInt(candId) < 0 ? parseInt(candId) * -1 : 0;
    var data = {};
    data.winners = [candId];
    data.template = listArr[listVal];
    data.caption = fuenteValue;
    if (listVal != 0) {
        data.winners = [];
        data.caption = "";
    } else if (candId == "") {
        data.winners = [];
        data.caption = "";
    }
    return data;
}

//Finds the current winners info and returns an obj : {"first_name","last_name","party"...}.
function findCandInfo(data, candId) {
    var first_name = null;
    var last_name = null;
    var full_name = null;
    var party = null;
    var party_color = null;
    var winner = false;
    var incumbent = false;
    var votes = 0;
    var vote_percentage = 0;
    var title = data.projection.template;
    var tempValue = 0;
    //Finding winner -------------------------------------------
    for (var i = 0; i < data.results.length; i++) {
        if (WINNER_OVERWRITE && data.results[i].winner) {
            if (data.max_winners == 1) {
                candId = data.results[i].id;
                break;
            } else {
                var tempHi = data.results[i].votes;
                if (tempHi > tempValue) {
                    tempValue = tempHi;
                    candId = data.results[i].id;
                }
            }
        }
    }
    //Setting main values ---------------------------------------
    for (i = 0; i < data.results.length; i++) {
        if (data.results[i].id == candId) {
            first_name = data.results[i].candidate.first_name;
            last_name = data.results[i].candidate.last_name;
            party = data.results[i].party.toUpperCase();
            winner = data.results[i].winner;
            incumbent = data.results[i].incumbent;
            votes = data.results[i].votes;
            vote_percentage = data.results[i].vote_percentage;
            var ukParty = data.results[i].party;
        }
    }
    full_name = findName(first_name, last_name, title);
    //Party Setup -----------------------------------------------
    if (party != null) {
        party = DIC_PARTY[party.trim()];
        if (party != undefined) {
            party_color = party[1];
            party = party[0];
        }
    }
    if (party == null && ukParty != "") {
        party = ukParty;
    }
    if (party == undefined || party == null) {
        party = '';
    }
    if (party_color == undefined || party_color == null) {
        party_color = '';
    }
    //Object Setup -----------------------------------------------
    var output = JSON.parse('{"first_name": "' + first_name + '", ' +
        '"last_name": "' + last_name + '", "party": "' + party + '", ' +
        '"full_name": "' + full_name + '", "id": "' + candId + '", ' +
        '"winner": "' + winner + '", "incumbent": "' + incumbent + '", ' +
        '"votes": "' + votes + '", "vote_percentage": "' + vote_percentage + '", ' +
        '"party_color": "' + party_color + '", "title": "' + title + '"}');

    return output;
}

//Finds candidates id from candidates full name
function findId(name, index) {
    var data = TEMP_DATA.races[index];
    var title = data.projection.template;
    var id = "";

    for (var i = 0; i < data.results.length; i++) {
        var tempId = data.results[i].id;
        var first = data.results[i].candidate.first_name;
        var last = data.results[i].candidate.last_name;
        var tempName = findName(first, last, title);
        if (tempName == name) {
            id = tempId;
        }
    }
    return id;
}

//Finds full name or responce(I).
function findName(first_name, last_name, title) {
    var name = String(first_name) + " " + String(last_name);
    if (name == 'null null') {
        if (title != '') {
            name = title.toUpperCase();
        } else {
            name = "UNKNOWN ELEMENT";
        }
    } else if (last_name == null) {
        name = first_name;
    } else if (first_name == null) {
        name = last_name;
    }
    return name;
}

//Toggle between hiding and showing list
function dropDown(index, abbr, office, district) {
    var raceFinnished = candInfo(0, index, "winner") == 'true' ? true : false;
    var urlData = getRaceLUrlObj(abbr, office, district);
    var tempId = "cwList" + urlData.uName;
    var lists = document.getElementsByClassName('cw-list showList');
    //Close other open lists
    if (lists[0]) {
        for (var i = 0; i < lists.length; i++) {
            if (lists[i] != document.getElementById(tempId)) {
                lists[i].classList.toggle("showList");
            }
        }
    }
    //open selected list
    if (!WINNER_OVERWRITE || !raceFinnished) {
        document.getElementById(tempId).classList.toggle("showList");
    }
}


//OnClick function. Update API and HTML.
function winnerClick(index, current) {
    var candId = Number(current.id);
    var candName = current.innerHTML;
    postWinner(index, candId, candName);
}

//Function. Sends POST command to proper API And updates HTML.
function postWinner(index, candId, candName) {
    var office = TEMP_DATA.races[index].office_type;
    var state = TEMP_DATA.races[index].location;
    var district = TEMP_DATA.races[index].district;
    var urlInfo = getRaceLUrlObj(state, office, district);
    var newUrl = urlInfo.url;
    var fuenteTemp = document.getElementById("fuente" + urlInfo.uName);
    var contTemp = document.getElementById("cwCon" + urlInfo.uName).parentElement.parentElement;
    var winnerTemp = contTemp.getElementsByClassName("btn-name")[0];
    var partyTemp = contTemp.getElementsByClassName("cw-party")[0];
    var bottomBar = contTemp.getElementsByClassName("last-bar")[0];
    winnerTemp.setAttribute("name", candId);
    fuenteTemp.parentElement.style.display = "inline-flex";
    if (parseInt(candId) < 0 || candId == "") {
        fuenteTemp.parentElement.style.display = "none";
    }
    //Create data obj, filled with selected info to be POSTed.
    var data = postObj(candId, fuenteTemp.value, office);
    data.template = candId == "" ? TEMP_DATA.races[index].projection.template : data.template;
    var jsonInfo = JSON.stringify(data);
    //Create a new request. Send POST command to API.
    var promise = new requestPromise('POST', newUrl, true, jsonInfo);
    promise.then(function () {
        winnerTemp.innerHTML = candName;
        fuenteTemp.setAttribute('name', candId);
        fuenteTemp.parentElement.setAttribute('name', candId);
        if (partyTemp) {
            partyTemp.innerHTML = candInfo(parseInt(candId), index, "party");
            partyTemp.style.backgroundColor = candInfo(parseInt(candId), index, "party_color");
            partyTemp.style.borderColor = partyTemp.style.backgroundColor;
            bottomBar.style.backgroundColor = partyTemp.style.backgroundColor;
            bottomBar.style.borderColor = partyTemp.style.backgroundColor;
        }
    }).catch(function (error) {
        window.console.log(error);
    });
    //Update TEMP_DATA.
    var updatePromise = new requestPromise('GET', newUrl, true, null);
    updatePromise.then(function (info) {
        TEMP_DATA.races[index] = info;
    }).catch(function (error) {
        window.console.log(error);
    });
}

//OnClick function. Input fuente listener for <enter> keystroke.
function fuenteClick(input, state, office, district) {
    var urlObj = getRaceLUrlObj(state, office, district);
    var newUrl = urlObj.url;
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            var data = postObj(input.name, input.value, office);
            var jsonInfo = JSON.stringify(data);
            //Create a new request.
            var promise = new requestPromise('POST', newUrl, true, jsonInfo);
            promise.then(function () {
                input.blur();
            }).catch(function (error) {
                window.console.log(error);
            });
        }
    });
}

//Can find specific candidate info (full_name, first_name, last_name, party...)
function candInfo(winnerNum, index, type) {
    var info = findCandInfo(TEMP_DATA.races[index], winnerNum);
    var output = info.hasOwnProperty(type) ? info[type] : type;
    return output;
}

//Toggle races based on state.
function toggleRaceInfo(abbr) {
    var races = document.getElementsByName(abbr);
    if (races[0]) {
        var displayVal = "none";
        if (races[0].style.display == "none") {
            displayVal = "Block"
        }
        races.forEach(function (race) {
            race.style.display = displayVal;
        });
    }
}

//Toggle all races
function toggleAllRaces(displayVal) {
    var races = document.getElementsByClassName("race-info-temp");
    for (var i = 0; i < races.length; i++) {
        races[i].style.display = displayVal;
    }
}

//-----------------------------------------------------------------------------------
//HB Helper Functions ---------------------------------------------------------------
Handlebars.registerHelper('lookUpDic', function (type, abbr) {
    switch (type) {
        case 'state':
            return DIC_STATE[abbr.fn(this).trim()][0];
        case 'closingTime':
            return DIC_STATE[abbr.fn(this).trim()][1];
        case 'office':
            return DIC_OFFICE[abbr.fn(this).trim()][0].toUpperCase();
        default:
            return abbr.fn(this);
    }
});

Handlebars.registerHelper('nonRepeat', function (abbr) {
    var outPut;
    var abb = "'" + abbr + "'";
    var clickInfo = 'onClick="toggleRaceInfo(' + abb + ')"';
    if (TEMP_ABBR != abbr) {
        outPut = '<button ' + clickInfo + ' id="groupLine" class="group-line">';
        outPut += DIC_STATE[abbr.trim()][0].toUpperCase() + ' - ' + DIC_STATE[abbr.trim()][1];
        outPut += '</button>';
    }
    TEMP_ABBR = abbr;
    return outPut;
});

Handlebars.registerHelper('createList', function (index) {
    var data = TEMP_DATA.races[index];
    var office = data.office_type;
    var listArr = DIC_GFXTYPES[office] ? DIC_GFXTYPES[office] : DIC_GFXTYPES.Default;
    var clickInfo = 'onClick="winnerClick(' + index + ', this)"';
    //Populates pull down menu - Defaults
    var htmlString = '';
    for (var i = 1; i < listArr.length; i++) {
        htmlString += '<a id="' + (parseInt(i) * -1) + '" ' + clickInfo + '>' + listArr[i].toUpperCase() + '</a>';
    }
    //Populates pull down menu - Race specific
    for (i = 0; i < data.results.length; i++) {
        var info = data.results[i];
        var candName = info.candidate.first_name + "  " + info.candidate.last_name;
        if (office == 'I') {
            htmlString += '<a id="' + info.id + '" ' + clickInfo + '>' + info.candidate.last_name + "</a>";
        } else {
            htmlString += '<a id="' + info.id + '" ' + clickInfo + '>' + candName + "</a>";
        }
    }
    return htmlString;
});

Handlebars.registerHelper('winnersInfo', function (winnerNum, index, type) {
    var output = candInfo(winnerNum, index, type);
    output = output == 'WINNER' ? DIC_GFXTYPES.Default[1].toUpperCase() : output;
    output = output == 'WAITING' ? DIC_GFXTYPES.Default[1].toUpperCase() : output;
    output = output == 'RESULTADOS' ? DIC_GFXTYPES.Default[1].toUpperCase() : output;
    return output;
});

Handlebars.registerHelper('truncateNum', function (num, value) {
    var output = parseFloat(value);
    output = output == 100 ? String(output) : String(output.toFixed(num));
    return output;
});

Handlebars.registerHelper('fuenteDisplay', function (index) {
    var typeAPI = TEMP_DATA.races[index].projection.template;
    var projection = DIC_GFXTYPES.Default[0];
    var output = typeAPI == projection || typeAPI == 'winner' ? "inline-flex" : "none";
    return output;
});

Handlebars.registerHelper('btnColor', function (index) {
    var winner = String(candInfo(0, index, "winner"));
    var output = winner == "true" ? " closedRace" : "";
    return output;
});

Handlebars.registerHelper('partyColor', function (winnerNum, index) {
    var color = candInfo(winnerNum, index, "party_color");
    return "background-color: " + color + "; border-color: " + color + ";";
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
