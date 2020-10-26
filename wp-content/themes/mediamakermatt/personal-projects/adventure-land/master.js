var farmTypes = ["xscorpion", "mrgreen", "mrpumpkin", "phoenix", "snowman"]; 
var potionTypes = ['hpot1', 'mpot1'];
var myCharacters = ["Sinstrite", "Curse", "Shield"];
var my_main_character = myCharacters[0];
var party_leaders = [my_main_character, "NexusNull", "Maela"];
var special_monsters = ['phoenix', 'mrgreen', 'mrpumpkin', 'snowman'];
var load_characters = true;
var load_utilities = false;
var sell_whitelist = {
    ringsj: 0, hpbelt: 0, hpamulet: 0,
    slimestaff: 6, quiver: 6, mushroomstaff: 7,
    dexring: 2, intring: 2, strring: 2, vitring: 2,
    dexearring: 2, intearring: 2, strearring: 2, vitearring: 2,
    dexamulet: 2, intamulet: 2, stramulet: 2,
    dexbelt: 2, intbelt: 2, strbelt: 2,
    wcap: 6, wattire: 6, wbreeches: 6, wgloves: 6, wshoes: 6,
};
var upgrade_whitelist = {
    pyjamas: 7, bunnyears: 7, carrotsword: 7,
    sshield: 7, wingedboots: 7,
    phelmet: 7, gphelmet: 7,
    gloves1: 7, coat1: 7, helmet1: 7, pants1: 7, shoes1: 7,
    harbringer: 5, oozingterror: 5, bataxe: 7, spear: 7,
    xmaspants: 7, xmassweater: 7, xmashat: 7, xmasshoes: 7, mittens: 7, warmscarf: 7,
    ornamentstaff: 7, candycanesword: 7,
    t2bow: 7, pmace: 7, basher: 7, harmor: 5, hgloves: 5,
};
localStorage.setItem('farmTypes', JSON.stringify(farmTypes));
localStorage.setItem('potionTypes', JSON.stringify(potionTypes));
localStorage.setItem('myCharacters', JSON.stringify(myCharacters));
localStorage.setItem('partyLeaders', JSON.stringify(party_leaders));
localStorage.setItem('specialMonsters', JSON.stringify(special_monsters));
localStorage.setItem('myMainCharacter', JSON.stringify(my_main_character));
localStorage.setItem('loadCharacters', JSON.stringify(load_characters));
localStorage.setItem('sellWhitelist', JSON.stringify(sell_whitelist));
localStorage.setItem('upgradeWhitelist', JSON.stringify(upgrade_whitelist));

function load_code_cache(name, onerror){ // onerror can be a function that will be executed if load_code fails
    // Failed to load
	if(!onerror) onerror=function(){ 
		game_log("load_code: Failed to load","#FF0000"); 
	}
	// Set code variable
	var code = localStorage.getItem("CODE_" + name);
	// Fetched from browser cache
	if(code != null){
		var library=document.createElement("script");
		library.type="text/javascript";
		library.text=code;
		library.onerror=onerror;
		code = library;
		game_log(name + " Loaded From Cache Successfully!","#00FF00");
	}
	// Fetched from server
	if(code == null || code == ""){
		var xhrObj = new XMLHttpRequest();
		xhrObj.open('GET',"/code.js?name="+encodeURIComponent(name)+"&timestamp="+(new Date().getTime()), false);
		xhrObj.send('');
		var library=document.createElement("script");
		library.type="text/javascript";
		library.text=xhrObj.responseText;
		library.onerror=onerror;
		code = library;
		localStorage.setItem("CODE_" + name, code.text);
		game_log(name + " Loaded From Server Successfully!","#FFFF00");
	}
    document.getElementsByTagName("head")[0].appendChild(code);
} // load_code_cache(name, onerror);

var requiredModules = ["AttackLoot"];

function loadModules(){
	for(id in requiredModules){
		var module = requiredModules[id];
		load_code_cache(module);
	}
	var allLoaded = true;
	for(id in requiredModules){
		var module = requiredModules[id];
		loadedIndex = parent.ModulesLoaded.indexOf(module);
		if(loadedIndex == -1){
			allLoaded = false
		}
	}
	parent.successful_load = allLoaded;
} // loadModules();

loadModules();

activate_skins();

setTimeout(function(){
	if(character.name == my_main_character && load_utilities){
		load_github_urls();	
	}
}, 1000 * 5);

function activate_skins(){
    if(character.ctype == "priest" && character.skin != "snow_angel"){
        if(character.slots.cape.name === "angelwings"){
            parent.socket.emit('activate',{slot:'cape'});
        }
    } else if(character.ctype != "priest" && character.skin != "mm_blue"){
        if(character.slots.ring1.name === "darktristone"){
            parent.socket.emit('activate',{slot:'ring1'});
        } else {
            if(character.slots.ring2.name === "darktristone"){
                parent.socket.emit('activate',{slot:'ring2'});
            }
        }
    }
}

function load_github_urls(){
    var urls = [ 
        "https://raw.githubusercontent.com/Spadar/AdventureLand/master/GUI/PartyShare.js",
        "https://raw.githubusercontent.com/Spadar/AdventureLand/master/GUI/GoldMeter.js",
        "https://raw.githubusercontent.com/Spadar/AdventureLand/master/GUI/DPSMeter.js"
    ];
    // https://www.w3schools.com/xml/dom_httprequest.asp
    function loadURLs( url ) {
        var ajax = new XMLHttpRequest();
        ajax.open( 'GET', url, false ); // <-- the 'false' makes it synchronous
        ajax.onreadystatechange = function () {
            var script = ajax.response || ajax.responseText;
            if (ajax.readyState === 4) {
                switch( ajax.status) {
                    case 200:
                        eval.apply( window, [script] );
                        game_log("SUCCESS: Script Loaded! ", url);
                    break;
                        default:
                        game_log("ERROR: Script Not Loaded. ", url);
                }
            }
        };
        ajax.send(null);
    }      
    for(var i in urls){
        loadURLs(urls[i]);    
    }
}




















































function retrieve_server_data_local_storage(){
    let monsters = ['mrgreen', 'mrpumpkin', 'snowman'];
    let priority = [];
    let servers = [];
    for(let i in parent.X.servers){
        let server = parent.X.servers[i];
        if(server){
            let sregion = server.region;
            let sname = server.name;
            let combined = sregion + "/" + sname;
            let retrieved = JSON.parse(localStorage.getItem(combined));
            if(retrieved != null && retrieved.length > 0){
                servers.push(retrieved);
            }
        }
    }
    for(let i in servers){
        let server = servers[i];
        if(server && server.length > 0){
            for(let k in monsters){
                let monster = monsters[k];
                if(monster){
                    for(let j in Object.values(server)){
                        let object = Object.values(server)[j];
                        if(object.skin == monster && priority.length < 1){
                            priority.push(server[0]);
                        }
                    }
                }
                break;
            }
        }
    }
    return priority[0];
}