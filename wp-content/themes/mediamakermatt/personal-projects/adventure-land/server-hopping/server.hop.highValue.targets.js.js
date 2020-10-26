
var server_hop = true;
var load_characters = true;
var potionTypes = ['hpot1', 'mpot1'];
var monsters = ['mrgreen', 'mrpumpkin', 'snowman'];
var farmTypes = ["xscorpion", "mrgreen", "mrpumpkin", "phoenix", "snowman"];
var myCharacters = ["Sinstrite", "Curse", "Shield"];
var my_main_character = myCharacters[0];
var party_leaders = [my_main_character, "NexusNull", "Maela"];
var special_monsters = ['phoenix', 'mrgreen', 'mrpumpkin', 'snowman'];
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
localStorage.setItem('myMainCharacter', JSON.stringify(my_main_character));
localStorage.setItem('sellWhitelist', JSON.stringify(sell_whitelist));
localStorage.setItem('upgradeWhitelist', JSON.stringify(upgrade_whitelist));
localStorage.setItem('specialMonsters', JSON.stringify(special_monsters));
localStorage.setItem('loadCharacters', JSON.stringify(load_characters));

var lastHealthPotion = null;
var lastManaPotion = null;
var lastLoot = null;
var lastPurchase = null;
var lastMove = null;
var lastTown = null;

load_code("PathfindingGrid");
load_code("AttackLoot");

activate_skins();

if(server_hop){ setInterval(function(){

    use_potions(200, 5);

    var server_data = retrieve_server_data_local_storage().data;
    var location = {x: server_data.x, y: server_data.y, map: server_data.map};
    var current_target = get_targeted_monster();

    if(!current_target){
        var entities = Object.values(parent.entities);
        var high_value_monsters = entities.filter(c => !c.dead && c.type === 'monster' && monsters.includes(c.skin));
        if(high_value_monsters.length){
            change_target(high_value_monsters[0]);
        }
        setTimeout(function(){
            switch_servers();
        }, 5000);
    }

    goToPoint(location.x, location.y, location.map, true, true);
    
    if(character.real_x == 0 && character.real_y == 0 && character.map == "spookytown"){
        if(!smart.moving){
            smart_move(location);
        }
    }

    if(character.moving){
        lastMove = new Date();
    }

    // need to account for distance, is it actually better or worse to use town skill?
    if(!current_target && !character.moving && !character.map != location.map){
        if(lastMove == null || new Date() - lastMove >= 1000){
            if(!smart.moving && !character.moving){
                if(lastTown == null || new Date() - lastTown >= 5000){
                    use_skill("town");
                    lastTown = new Date();
                }
            }
        }
    }

    quick_loot(5);
    
}, 250); }

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

function use_potions(buy_amount, min_amount){
    if(lastHealthPotion == null || new Date() - lastHealthPotion >= parent.G.skills.use_hp.cooldown){
        if(character.mp >= character.mp_cost && character.hp <= character.max_hp - parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[0]].gives[0][1]){
            use(parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[0]].gives[0][0]);
            buy_potions(buy_amount, min_amount);
            lastHealthPotion = new Date();
        }
    }
    if(lastManaPotion == null || new Date() - lastManaPotion >= parent.G.skills.use_mp.cooldown){
        if(character.max_mp < parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[1]].gives[0][1]){
            if(character.mp < character.mp_cost * 5){
                use(parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[1]].gives[0][0]);
                buy_potions(buy_amount, min_amount);
                lastManaPotion = new Date();
            } 
        } else if(character.mp <= character.max_mp - parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[1]].gives[0][1]){
            use(parent.G.items[JSON.parse(localStorage.getItem("potionTypes"))[1]].gives[0][0]);
            buy_potions(buy_amount, min_amount);
            lastManaPotion = new Date();
        }
    }
}

function buy_potions(amount, min){
    if(lastPurchase == null || new Date() - lastPurchase >= 250){
        if(character.gold > 100){
            if(quantity(JSON.parse(localStorage.getItem("potionTypes"))[0]) < min){
                buy(JSON.parse(localStorage.getItem("potionTypes"))[0], amount - quantity(JSON.parse(localStorage.getItem("potionTypes"))[0]));
                lastPurchase = new Date();
            }
            if(quantity(JSON.parse(localStorage.getItem("potionTypes"))[1]) < min){
                buy(JSON.parse(localStorage.getItem("potionTypes"))[1], amount - quantity(JSON.parse(localStorage.getItem("potionTypes"))[1]));
                lastPurchase = new Date();
            }
        }
    }
}

function quick_loot(amt){
    if(lastLoot == null || new Date() - lastLoot >= 250){
        var looted = 0;
        for(var id in parent.chests){
            parent.open_chest(id);
            looted++;
            if(looted == amt){
                lastLoot = new Date();
                break;
            }
            lastLoot = new Date();
        }
    }
}

function distance_to_point(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
} // end function

function switch_servers(){
    var best_server = retrieve_server_data_local_storage(monsters);
    var current = parent.server_region + '/' + parent.server_identifier;
    if(best_server != undefined){
        if(current != best_server.server){
            var string = "Switch to " + best_server.server;
            if(character.name == my_main_character && parent.game_logs[parent.game_logs.length - 1][0] != string){
                game_log("Switch to " + best_server.server);
            }
            var url = 'character/' + character.name + '/in/' + best_server.server + '/';
            parent.window.location.href = url;
        } else {
            var string = "Stay on " + best_server.server;
            if(character.name == my_main_character && parent.game_logs[parent.game_logs.length - 1][0] != string){
                game_log("Stay on " + best_server.server);
            }
        }
    } else {
        var string = "No server detected.";
        if(character.name == my_main_character && parent.game_logs[parent.game_logs.length - 1][0] != string){
            game_log("No server detected.");
        }
    }
}

function retrieve_server_data_local_storage(){
    var servers = [];
    var objects = [];
    var best = [];
    for(let i in parent.X.servers){
        var server = parent.X.servers[i];
        if(server){
            var combined = server.region + "/" + server.name;
            var retrieved = JSON.parse(localStorage.getItem(combined));
            if(retrieved != null && retrieved.length > 0){
                servers.push(retrieved);
            }
        }
    }
    for(let i in servers){
        var array = servers[i];
        if(array.length){
            for(let j in Object.values(array)){
                var object = Object.values(array)[j];
                if(object){
                    objects.push(object);
                }
            }
        }
    }
    for(let m = 0; m < monsters.length; m++){
        for(let i in objects){
            var object = objects[i];
            if(object){
                if(monsters[m] == object.skin){
                    if(best.length < 1){
                        best.push(object);
                    }
                }
            }
        }
    }
    return best[0];
}

function qa(a, b, c, d, e){
    return;
}