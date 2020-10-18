var console_log = false;

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

var requiredModules = ["PathfindingGrid"];

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

setInterval(function(){
    aStar_controller();		
}, character.ping);

function aStar_controller(){ // controls all character movement
    let entities = Object.values(parent.entities);
    let special_monsters = JSON.parse(localStorage.getItem("specialMonsters"));
    let phoenix = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === "phoenix");
    var targeted = get_targeted_monster();
    var viable = find_viable_targets()[0];
    var closest = get_nearest_monster({type: JSON.parse(localStorage.getItem("farmTypes"))[0]});
    var cx = character.real_x;
    var cy = character.real_y;
    var character_range_deduction_buffer = character.range * 0.75;

    // GO TO PHOENIX (if spawned)
    if(phoenix.length > 0){
        farm_phoenix("phoenix", targeted, character_range_deduction_buffer);
    } else {
        // GO TO MRGREEN (if spawned)
        if(parent.S.mrgreen != undefined && parent.S.mrgreen.live){
            farm_mrgreen("mrgreen", targeted, character_range_deduction_buffer);
        } else {
            // GO TO MRPUMPKIN (if spawned)
            if(parent.S.mrpumpkin != undefined && parent.S.mrpumpkin.live){
                farm_mrpumpkin("mrpumpkin", targeted, character_range_deduction_buffer);
            } else {
                // GO TO SNOWMAN (if spawned)
                if(parent.S.snowman != undefined){
                    if(parent.S.snowman.live){
                        farm_snowman("snowman", targeted, character_range_deduction_buffer);
                    }
                } else {
                    // GO TO CHRISTMAS TREE (if christmas)
                    var christmasTreeName = "newyear_tree";
                    if(userMatchesText(christmasTreeName, parent.G.maps.main.ref)){
                        if(!character.s.holidayspirit){
                            christmas_tree_buff(christmasTreeName);
                        }
                    } else {
                        // GO TO DESIRED FARM MONSTER (24/7)
                        farm_normal_monsters_location(targeted, viable, character_range_deduction_buffer); 
                    }
                }
            }
        }
    }
} // aStar_controller();

function farm_phoenix(name, targeted, character_range_deduction_buffer, cx, cy){
    if(console_log){
        console.log("Farm Phoenix");
    }
    let entities = Object.values(parent.entities);
    let phoenix = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === name);
    if(!targeted){
        change_target(phoenix[0]);
        let health = parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[0]].gives[0][1];
        let monsterDmgSecond = (phoenix[0].frequency * phoenix[0].attack) * (G.skills.use_hp.cooldown / 1000);
        if(health <= monsterDmgSecond){
            var tr_x = phoenix[0].real_x;
            var tr_y = phoenix[0].real_y;
            var ar = Math.atan2(cy - tr_y, cx - tr_x);
            var rd = Math.round(distance_to_point(cx, cy, tr_x, tr_y)) - character_range_deduction_buffer;
            var dx = cx - (rd * Math.cos(ar));
            var dy = cy - (rd * Math.sin(ar));
            var target_location = {x: dx, y: dy, map: phoenix[0].map};
        } else {
            var target_location = {x: phoenix[0].x, y: phoenix[0].y, map: phoenix[0].map};
        }
    }
    if(target_location.map != undefined){
        localStorage.setItem('destinationMap', JSON.stringify(target_location.map));
    }
    goToPoint(target_location.x, target_location.y, target_location.map, true, true);
    if(!targeted){
        setTimeout(function(){
            if(!character.moving && !smart.moving){
                smart_move({x: target_location.x, y: target_location.y, map: target_location.map});
            }
        }, 1000);
    }
}

function farm_mrgreen(name, targeted, character_range_deduction_buffer, cx, cy){
    if(console_log){
        console.log("Farm Mr. Green");
    }
    let entities = Object.values(parent.entities);
    let mrgreen = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === name);
    let targeting_party = entities.filter(c => !c.dead && c.type === 'monster' && !special_monsters.includes(c.skin) && c.target && (Object.keys(parent.party).includes(c.target) || c.target == character.name));
    if(mrgreen.length < 1){
        var target_location = {x: parent.S.mrgreen.x, y: parent.S.mrgreen.y, map: parent.S.mrgreen.map};
    } else {
        if(targeting_party.length > 0){
            change_target(targeting_party[0]);
            var tr_x = targeting_party[0].real_x;
            var tr_y = targeting_party[0].real_y;
        } else {
            if(!targeted){
                change_target(mrgreen[0]);
                var tr_x = mrgreen[0].real_x;
                var tr_y = mrgreen[0].real_y;
            }
        }
        var ar = Math.atan2(cy - tr_y, cx - tr_x);
        var rd = Math.round(distance_to_point(cx, cy, tr_x, tr_y)) - character_range_deduction_buffer;
        var dx = cx - (rd * Math.cos(ar));
        var dy = cy - (rd * Math.sin(ar));
        var target_location = {x: dx, y: dy, map: mrgreen[0].map};
    }
    if(target_location.map != undefined){
        localStorage.setItem('destinationMap', JSON.stringify(target_location.map));
    }
    goToPoint(target_location.x, target_location.y, target_location.map, true, true);
    if(!targeted){
        setTimeout(function(){
            if(!character.moving && !smart.moving){
                smart_move({x: target_location.x, y: target_location.y, map: target_location.map});
            }
        }, 1000);
    }
}

function farm_mrpumpkin(name, targeted, character_range_deduction_buffer, cx, cy){
    if(console_log){
        console.log("Farm Mr. Pumpkin");
    }
    let entities = Object.values(parent.entities);
    let mrpumpkin = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === name);
    let targeting_party = entities.filter(c => !c.dead && c.type === 'monster' && !special_monsters.includes(c.skin) && c.target && (Object.keys(parent.party).includes(c.target) || c.target == character.name));
    if(mrpumpkin.length < 1){
        var target_location = {x: parent.S.mrpumpkin.x, y: parent.S.mrpumpkin.y, map: parent.S.mrpumpkin.map};
    } else {
        if(targeting_party.length > 0){
            change_target(targeting_party[0]);
            var tr_x = targeting_party[0].real_x;
            var tr_y = targeting_party[0].real_y;
        } else {
            if(!targeted){
                change_target(mrpumpkin[0]);
                var tr_x = mrpumpkin[0].real_x;
                var tr_y = mrpumpkin[0].real_y;
            }
        }
        var ar = Math.atan2(cy - tr_y, cx - tr_x);
        var rd = Math.round(distance_to_point(cx, cy, tr_x, tr_y)) - character_range_deduction_buffer;
        var dx = cx - (rd * Math.cos(ar));
        var dy = cy - (rd * Math.sin(ar));
        var target_location = {x: dx, y: dy, map: mrpumpkin[0].map};
    }
    if(target_location.map != undefined){
        localStorage.setItem('destinationMap', JSON.stringify(target_location.map));
    }
    goToPoint(target_location.x, target_location.y, target_location.map, true, true);
    if(!targeted){
        setTimeout(function(){
            if(!character.moving && !smart.moving){
                smart_move({x: target_location.x, y: target_location.y, map: target_location.map});
            }
        }, 1000);
    }
}

function farm_snowman(name, targeted, character_range_deduction_buffer, cx, cy){
    if(console_log){
        console.log("Farm Snowman");
    }
    let entities = Object.values(parent.entities);
    let snowman = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === name);
    let targeting_party = entities.filter(c => !c.dead && c.type === 'monster' && !special_monsters.includes(c.skin) && c.target && (Object.keys(parent.party).includes(c.target) || c.target == character.name));
    if(snowman.length < 1){
        var target_location = {x: parent.S.snowman.x, y: parent.S.snowman.y, map: parent.S.snowman.map};
    } else {
        if(targeting_party.length > 0){
            change_target(targeting_party[0]);
            var tr_x = targeting_party[0].real_x;
            var tr_y = targeting_party[0].real_y;
        } else {
            if(!targeted){
                change_target(snowman[0]);
                var tr_x = snowman[0].real_x;
                var tr_y = snowman[0].real_y;
            }
        }
        var ar = Math.atan2(cy - tr_y, cx - tr_x);
        var rd = Math.round(distance_to_point(cx, cy, tr_x, tr_y)) - character_range_deduction_buffer;
        var dx = cx - (rd * Math.cos(ar));
        var dy = cy - (rd * Math.sin(ar));
        var target_location = {x: dx, y: dy, map: snowman[0].map};
    }
    if(target_location.map != undefined){
        localStorage.setItem('destinationMap', JSON.stringify(target_location.map));
    }
    goToPoint(target_location.x, target_location.y, target_location.map, true, true);
    if(!targeted){
        setTimeout(function(){
            if(!character.moving && !smart.moving){
                smart_move({x: target_location.x, y: target_location.y, map: target_location.map});
            }
        }, 1000);
    }
}

function christmas_tree_buff(name){
    if(console_log){
        console.log("Get Christmas Tree Buff");
    }
    var christmasTreeName = name;
    var target_location = {x: parent.G.maps.main.ref[christmasTreeName].x, y: parent.G.maps.main.ref[christmasTreeName].y, map: parent.G.maps.main.ref[christmasTreeName].map};
    if(character.map == target_location.map){
        var distance = distance_to_point(character.real_x, character.real_y, target_location.x, target_location.y);
        if(distance <= 100){
            parent.socket.emit("interaction",{type:name});
        }
    }
    if(target_location.map != undefined){
        localStorage.setItem('destinationMap', JSON.stringify(target_location.map));
    }
    goToPoint(target_location.x, target_location.y, target_location.map, true, true);
    if(!targeted){
        setTimeout(function(){
            if(!character.moving && !smart.moving){
                smart_move({x: target_location.x, y: target_location.y, map: target_location.map});
            }
        }, 1000);
    }
}

function farm_normal_monsters_location(targeted, viable, character_range_deduction_buffer, closest, cx, cy){
    if(console_log){
        console.log("Farm Normal Monsters");
    }
    var targeted = get_targeted_monster();
    var viable = find_viable_targets()[0];
    if(!targeted){
        let health = parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[0]].gives[0][1];
        if(character.range < 50){
            if(closest){
                change_target(closest);
                let monsterDmgSecond = (closest.frequency * closest.attack) * (G.skills.use_hp.cooldown / 1000);
                if(health <= monsterDmgSecond){
                    var tr_x = closest.real_x;
                    var tr_y = closest.real_y;
                    var ar = Math.atan2(cy - tr_y, cx - tr_x);
                    var rd = Math.round(distance_to_point(cx, cy, tr_x, tr_y)) - character_range_deduction_buffer;
                    var dx = cx - (rd * Math.cos(ar));
                    var dy = cy - (rd * Math.sin(ar));
                    var target_location = {x: dx, y: dy, map: closest.map};
                } else {
                    var target_location = {x: closest.y, y: closest.x, map: closest.map};
                }
            }  else {
                var target_location = get_best_group_location(JSON.parse(localStorage.getItem("farmTypes"))[0]);
            }
        } else {
            if(viable){
                change_target(viable);
                let monsterDmgSecond = (viable.frequency * viable.attack) * (G.skills.use_hp.cooldown / 1000);
                if(health <= monsterDmgSecond){
                    var tr_x = viable.real_x;
                    var tr_y = viable.real_y;
                    var ar = Math.atan2(cy - tr_y, cx - tr_x);
                    var rd = Math.round(distance_to_point(cx, cy, tr_x, tr_y)) - character_range_deduction_buffer;
                    var dx = cx - (rd * Math.cos(ar));
                    var dy = cy - (rd * Math.sin(ar));
                    var target_location = {x: dx, y: dy, map: viable.map};
                } else {
                    var target_location = {x: viable.y, y: viable.x, map: viable.map};
                }
            }  else {
                var target_location = get_best_group_location(JSON.parse(localStorage.getItem("farmTypes"))[0]);
            }
        }
    } else {
        let health = parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[0]].gives[0][1];
        let monsterDmgSecond = (targeted.frequency * targeted.attack) * (G.skills.use_hp.cooldown / 1000);
        if(health <= monsterDmgSecond){
            var tr_x = targeted.real_x;
            var tr_y = targeted.real_y;
            var ar = Math.atan2(cy - tr_y, cx - tr_x);
            var rd = Math.round(distance_to_point(cx, cy, tr_x, tr_y)) - character_range_deduction_buffer;
            var dx = cx - (rd * Math.cos(ar));
            var dy = cy - (rd * Math.sin(ar));
            var target_location = {x: dx, y: dy, map: targeted.map};
        } else {
            var target_location = {x: targeted.x, y: targeted.y, map: targeted.map};
        }
    }
    if(console_log){
        console.log(target_location);
    }
    if(target_location.map != undefined){
        localStorage.setItem('destinationMap', JSON.stringify(target_location.map));
    }
    goToPoint(target_location.x, target_location.y, target_location.map, true, true);
    if(!targeted){
        setTimeout(function(){
            if(!character.moving && !smart.moving){
                smart_move({x: target_location.x, y: target_location.y, map: target_location.map});
            }
        }, 1000);
    }
}

// example: check a map reference to see if an NPC exists or not, used for Christmas Tree
function userMatchesText(text, user) {
    if (typeof user === "string") return user.includes(text);
    return Object.values(user).some(val => userMatchesText(text, val));
}

function distance_to_point(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function find_viable_targets(){
    if(character.party == null){
        var party_list = JSON.parse(localStorage.getItem("myCharacters"));
    } else {
        var party_list = Object.keys(parent.party);
    }
    var monsters = Object.values(parent.entities).filter(
        mob => (mob.target == null
                    || parent.party_list.includes(mob.target)
                    || mob.target == character.name)
                && (mob.type == "monster"
                    && (parent.party_list.includes(mob.target)
                    || mob.target == character.name))
                    || JSON.parse(localStorage.getItem("farmTypes")).includes(mob.mtype));
    for(id in monsters){
        var monster = monsters[id];
        if (parent.party_list.includes(monster.target)
            || monster.target == character.name) {
            monster.targeting_party = 1;
        } else {
            monster.targeting_party = 0;
        }
    }
    monsters.sort(function (current, next){
        if (current.targeting_party > next.targeting_party) {
            return -1;
        }
        var dist_current = distance(character, current);
        var dist_next = distance(character, next);
        if (dist_current < dist_next) {
            return -1;
        } else if (dist_current > dist_next) {
            return 1
        } else {
            return 0;
        }
    });
    return monsters;
}