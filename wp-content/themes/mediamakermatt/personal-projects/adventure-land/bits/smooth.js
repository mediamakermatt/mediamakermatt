const ranger_name = 'Sinstrite';
const mage_names = ['Bot1', 'Bot2'];
const monster_list = ['crab'];
const wanderers_set = parent.G.sets.wanderers.items;
const trash_whitelist = ['hpamulet', 'ringsj', 'hpbelt', 'slimestaff', 'cclaw'];
const sell_whitelist = trash_whitelist.concat(wanderers_set);
const exchange_whitelist = ['gem0'];
const dismantle_whitelist = ['firestaff', 'fireblade'];
const compound_whitelist = {
    strearring: 3,
    intearring: 3,
    dexearring: 3,
    vitearring: 3,
};

activate_skins();
function activate_skins(){
    if(character.name == ranger_name && character.skin !== "mm_blue"){
        parent.socket.emit('activate',{slot:'ring1'});
    } else if(character.name == mage_names[0] && character.skin !== "mm_blue"){
        parent.socket.emit('activate',{slot:'ring1'});
    } else if(character.name == mage_names[1] && character.skin !== "mm_yellow"){
        parent.socket.emit('activate',{slot:'ring1'});
    }
}

if(character.ctype == 'ranger'){
    start_character('Bot1', 'Smooth');
    start_character('Bot2', 'Smooth');
}

setInterval(function(){ 
    ranger();
    mage();
    master(); 
}, 1);  

function master(){
    potions();
    revive();
}

function ranger(){
    if(character.ctype == 'ranger'){
        attack_monster(monster_list[0]);
        seuc_items();
        loot_chests();
        handle_mage_gold();
        holiday_season();
    }
}

function mage(){
    if(character.ctype == 'mage'){
        follow_ranger();
        local_store_gold();
        battery();
    }
}

var last_holiday_season = null;
function holiday_season(){
    if(last_holiday_season == null || new Date() - last_holiday_season >= character.ping * 10){
        if(parent.S.holidayseason){
            christmas_tree();
            bank_gold();
        }
        last_holiday_season = new Date();
    }
}

var last_bank_gold = null;
function bank_gold(){
    if(last_bank_gold == null || new Date() - last_bank_gold >= character.ping){
        if(character.gold > 5000000 || (parent.S.grinch && parent.S.grinch.target == character.name)){
            if(!smart.moving){
                smart_move('bank', function(){
                    // This executes when we reach our destination
                    if(parent.S.grinch){
                        parent.socket.emit("bank",{operation:"deposit",amount:character.gold - 1000000});
                        last_bank_gold = new Date();
                    } else {
                        parent.socket.emit("bank",{operation:"deposit",amount:4000000});
                        last_bank_gold = new Date();
                    }
                });
            }
        }
    }
}

var last_christmas_buff = null;
function christmas_tree(){
    if(last_christmas_buff == null || new Date() - last_christmas_buff >= character.ping){
        var tree_data = parent.G.maps.main.ref.newyear_tree;
        if(tree_data){
            var tree_location = {x: tree_data.x, y: tree_data.y, map: tree_data.map};
            if(!character.s.holidayspirit || (character.s.holidayspirit && character.s.holidayspirit.ms <= 30000)){
                if(!smart.moving){
                    smart_move(tree_location, function(){
                        // This executes when we reach our destination
                        parent.socket.emit("interaction",{type:"newyear_tree"});
                        last_christmas_buff = new Date();
                    });
                }
            }
        }
    }
}

var last_send_gold = null;
function handle_mage_gold(){
    if(last_send_gold == null || new Date() - last_send_gold >= character.ping){
        for(let i in mage_names){
            var mage = get_player(mage_names[i]);
            if(mage){
                var mage_gold = JSON.parse(localStorage.getItem(mage.name + '_Gold'));
                var send_amt = 1000000 / 2;
                if(mage_gold <= send_amt){
                    send_gold(mage.name, send_amt);
                    last_send_gold = new Date();
                }
            }
            last_send_gold = new Date();
        }
    }
}

var last_local_storage = null;
function local_store_gold(){
    if(last_local_storage == null || new Date() - last_local_storage >= character.ping){
        localStorage.setItem(character.name + '_Gold', JSON.stringify(character.gold));
        last_local_storage = new Date();
    }
}

var last_energize = null;
function battery(){
    if(last_energize == null || new Date() - last_energize >= parent.G.skills.energize.cooldown){
        var ranger = get_player(ranger_name);
        if(ranger){
            if(character.name == mage_names[0] && ranger.mp <= ranger.max_mp * .5
            || character.name == mage_names[1] && ranger.mp <= ranger.max_mp * .25){
                var send_mp = ranger.max_mp - ranger.mp;
                parent.use_skill("energize", ranger.name, send_mp);
                last_energize = new Date();
            }
        }
    }
}

function follow_ranger(){
    var ranger = get_player(ranger_name);
    if(ranger){
        var distance = distance_to_point(character.real_x, character.real_y, ranger.real_x, ranger.real_y);
        if(distance >= character.range * .25){
            if(can_move_to(ranger.real_x, ranger.real_y)){
                if(last_move == null || new Date() - last_move >= character.ping){
                    move(
                        character.real_x + (ranger.real_x - character.real_x) / 2,
                        character.real_y + (ranger.real_y - character.real_y) / 2
                    );
                    last_move = new Date();
                }
            } else {
                if(!smart.moving){
                    if(last_smart_move == null || new Date() - last_smart_move >= character.ping){
                        smart_move(ranger.real_x, ranger.real_y);
                        last_smart_move = new Date();
                    }
                } else {
                    if(distance <= character.range * .25){
                        if(last_stop_move == null || new Date() - last_stop_move >= character.ping){
                            stop('move');
                            last_stop_move = new Date();
                        }
                    }
                }
            }
        }
    } else {
        if(!smart.moving){
            if(last_smart_move == null || new Date() - last_smart_move >= character.ping){
                smart_move(monster_list[0]);
                last_smart_move = new Date();
            }
        }
    }
}

var last_revive = null;
function revive(){
    if(last_revive == null || new Date() - last_revive >= 1000){
        if(character.rip){
            respawn();
            last_revive = new Date();
        }
    }
}

var last_loot = null;
function loot_chests(){
    if(last_loot == null || new Date() - last_loot >= 250){
        var looted = 0;
        for(var id in parent.chests){
            var chest = parent.chests[id];
            parent.open_chest(id);
            looted++;
            if(looted == 10){
                last_loot = new Date();
                break;
            }
            last_loot = new Date();
        }
    }
}
  
function game_data(){
    // Manage parent.entities.
    let entities = Object.values(parent.entities);
    // Fetching the other players.
    let players = entities.filter(p => !p.rip && !p.npc && p.type === 'character');
    // Fetching the monsters.
    let monsters = entities.filter(m => !m.dead && m.type === 'monster');
    // Fetching the npcs.
    let npcs = entities.filter(n => n.npc);
	// Build master string
	var game_data = {
		players: players,
		monsters: monsters,
		npcs: npcs
	};
	return game_data;
}

var last_use_hp_potion = null;
var last_use_mp_potion = null;
function potions(){
    var hp = Object.values(character.items).filter(i => i != null && i.name.includes('hpot'))[0];
    var mp = Object.values(character.items).filter(i => i != null && i.name.includes('mpot'))[0];
    if(character.mp <= character.mp_cost && mp.q >= 1){
        if(last_use_mp_potion == null || new Date() - last_use_mp_potion >= parent.G.skills.use_mp.cooldown){
            parent.use_skill('mp');
            if(mp.q <= 99){
                buy_with_gold(mp.name, 1);
            }
            last_use_mp_potion = new Date();
        }
    } else if(character.hp <= character.max_hp - parent.G.items[hp.name].gives[0][1] && hp.q >= 1){
        if(last_use_hp_potion == null || new Date() - last_use_hp_potion >= parent.G.skills.use_hp.cooldown){
            parent.use_skill('hp');
            if(hp.q <= 99){
                buy_with_gold(hp.name, 1);
            }
            last_use_hp_potion = new Date();
        }
    } else if(character.mp <= character.max_mp - parent.G.items[mp.name].gives[0][1] && mp.q >= 1){
        if(last_use_mp_potion == null || new Date() - last_use_mp_potion >= parent.G.skills.use_mp.cooldown){
            parent.use_skill('mp');
            if(mp.q <= 99){
                buy_with_gold(mp.name, 1);
            }
            last_use_mp_potion = new Date();
        }
    }
}

function use_5_or_3_shot(){
    let entities = Object.values(parent.entities);
    let monsters = entities.filter(c => !c.dead && c.type === 'monster' && monster_list.includes(c.mtype));
    // need to get aceptable monsters, measure their distances,
    // and push to an array, then measure the length of that array with
    // the id's of the monsters close enough to 3 or 5 shot
    if(monsters.length >= 5){
        if(character.mp >= parent.G.skills['5shot'].mp + character.mp_cost){
            if(last_attack == null || new Date() - last_attack >= 1000 / character.frequency){
                parent.use_skill('5shot');
                last_attack = new Date(); 
            }
        }
    } else {
        if(monsters.length >= 3){
            if(character.mp >= parent.G.skills['3shot'].mp + character.mp_cost){
                if(last_attack == null || new Date() - last_attack >= 1000 / character.frequency){
                    parent.use_skill('3shot');
                    last_attack = new Date(); 
                }
            }
        }
    }
}

function stay_at_center_of_bounding_box(){
    let entities = Object.values(parent.entities);
    var center = get_best_group_location(monster_list[0]);
    if(character.map == center.map){
        var distance = distance_to_point(character.real_x, character.real_y, center.x, center.y);
        if(distance > 10){
            if(!smart.moving){
                if(last_smart_move == null || new Date() - last_smart_move >= character.ping){
                    smart_move(center);
                    last_smart_move = new Date();
                }
            }
        }
    }
}

var last_attack = null;
var last_change_target = null;
var last_move = null;
var last_smart_move = null;
var last_stop_move = null;
function attack_monster(mtype){
    use_5_or_3_shot();
    if(new Date() - last_attack < 1000 / character.frequency){
        stay_at_center_of_bounding_box();
        return;
    }
    // Attack single target when possible
    var target = get_targeted_monster();
    if(target){
        var distance = distance_to_point(character.real_x, character.real_y, target.real_x, target.real_y);
        if(distance < character.range){
            if(character.mp >= character.mp_cost){
                if(last_attack == null || new Date() - last_attack >= 1000 / character.frequency){
                    attack(target);
                    last_attack = new Date();
                }
            }
        } else {
            if(can_move_to(target.real_x, target.real_y)){
                if(last_move == null || new Date() - last_move >= character.ping){
                    move(
                        character.real_x + (target.real_x - character.real_x) / 2,
                        character.real_y + (target.real_y - character.real_y) / 2
                    );
                    last_move = new Date();
                }
            } else {
                if(!smart.moving){
                    if(last_smart_move == null || new Date() - last_smart_move >= character.ping){
                        smart_move(target.real_x, target.real_y);
                        last_smart_move = new Date();
                    }
                } else {
                    if(distance <= character.range){
                        if(last_stop_move == null || new Date() - last_stop_move >= character.ping){
                            stop('move');
                            last_stop_move = new Date();
                        }
                    }
                }
            }
        }
    } else {
        var nearest = get_nearest_monster({type: mtype});
        if(nearest){
            if(last_change_target == null || new Date() - last_change_target >= character.ping){
                change_target(nearest);
                last_change_target = new Date();
            }
        } else {
            if(!smart.moving){
                if(last_smart_move == null || new Date() - last_smart_move >= character.ping){
                    smart_move(mtype);
                    last_smart_move = new Date();
                }
            } else {
                if(distance <= character.range){
                    if(last_stop_move == null || new Date() - last_stop_move >= character.ping){
                        stop('move');
                        last_stop_move = new Date();
                    }
                }
            }
        }
    }
}

var last_sell = null;
var last_exchange = null;
var last_dismantle = null;
var last_compound = null;
function seuc_items(){
    for(let i in character.items){
        let item = character.items[i];
        if(item){
            if(sell_whitelist.includes(item.name)){
                if(item.p == undefined || (item.p != undefined && item.p != "shiny")){
                    if(last_sell == null || new Date() - last_sell >= character.ping){
                        sell(i);
                        last_sell = new Date();
                    }
                }
            }
            if(exchange_whitelist.includes(item.name)){
                if(last_exchange == null || new Date() - last_exchange >= character.ping){
                    if(!character.q.exchange){
                        exchange(i);
                        last_exchange = new Date();
                    }
                }
            }
            if(dismantle_whitelist.includes(item.name)){
                if(last_dismantle == null || new Date() - last_dismantle >= character.ping * 5){
                    dismantle(i);
                    last_dismantle = new Date();
                }
            }
        }
    }
    if(last_compound == null || new Date() - last_compound >= character.ping * 5){
        if(!character.q.compound){
            compound_items();
            last_compound = new Date();
        }
    }
}

function compound_items(){
    let to_compound = character.items.reduce((collection, item, index) => {
        if (item && compound_whitelist[item.name] != null && item.level < compound_whitelist[item.name]) {
            let key = item.name + item.level;
            !collection.has(key) ? collection.set(key, [item.level, item_grade(item), index]) : collection.get(key).push(index);
        }
        return collection;
    }, new Map());
    for (var c of to_compound.values()) {
        let scroll_name = "cscroll" + c[1];
        for (let i = 2; i + 2 < c.length; i += 3) {
            let [scroll, _] = find_item(i => i.name == scroll_name);
            if (scroll == -1) {
                parent.buy(scroll_name);
                return;
            }
            parent.socket.emit('compound', {
                items: [c[i], c[i + 1], c[i + 2]],
                scroll_num: scroll,
                offering_num: null,
                clevel: c[0]
            });
            return;
        }
    }
}

function get_grade(item) {
    return parent.G.items[item.name].grades;
}
  
// Returns the item slot and the item given the slot to start from and a filter.
function find_item(filter) {
    for (let i = 0; i < character.items.length; i++) {
        let item = character.items[i];
        if (item && filter(item))
        return [i, character.items[i]];
    }
    return [-1, null];
}

function distance_to_point(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// find names of any map we can go to
// returns as a populated array
function get_all_reachable_map_names(){
    all_reachable_maps = [];
    all_reachable_map_names = [];
    all_reachable_maps.push(parent.current_map);
    var i = 0;
    while(i < all_reachable_maps.length){
        doors = G.maps[all_reachable_maps[i]].doors;
        name = G.maps[all_reachable_maps[i]].key;
        for(door of doors){
            if(!all_reachable_maps.includes(door[4])){
               all_reachable_maps.push(door[4]);
               all_reachable_map_names.push(name);
            }
        }
        i++;
    }
    return all_reachable_maps;
}

// Builds all the map objects into a single array
// Where all map data is located in an object
function get_all_reachable_map_objects(){
    var maps_array = get_all_reachable_map_names();
    var map_objects = [];
    for(m in maps_array){
        let name = maps_array[m];
        let map = parent.G.maps[name];
        let data = {
            name: name,
            map: map
        };
        map_objects.push(data);
    }
    return map_objects;
}

// returns any maps that contain the desired monster
function find_all_maps_of_desired_monster(){
    var world_map_objects = get_all_reachable_map_objects();
    var desired_monster_data = [];
    for(world_object in world_map_objects){
        let map = world_map_objects[world_object];
        if(map){
            for(monster_object in map.map.monsters){
                let monster = map.map.monsters[monster_object];
                if(monster_list.includes(monster.type)){
                    let data = {
                        map: map.name,
                        monster: monster
                    };
                    desired_monster_data.push(data);
                }
            }  
        }
    }
    return desired_monster_data;
}

// finds the largest group of desired monsters and returns the count
function get_largest_monster_group(){
    var desired_monster_data = find_all_maps_of_desired_monster();
    var count_amounts = [];
    for(o in desired_monster_data){
        let object = desired_monster_data[o];
        let count = object.monster.count;
        count_amounts.push(count);
    }
    var largest_count = Math.max(...count_amounts);
    return largest_count;
}

// finds the largest group of desired monsters and returns location object based on count
function get_best_group_data(){
    var desired_monster_data = find_all_maps_of_desired_monster();
    var largest_group = get_largest_monster_group();
    for(o in desired_monster_data){
        let object = desired_monster_data[o];
        let count = object.monster.count;
        if(count >= largest_group){
            return object;
        }
    }
}

// gets an x, y, map object of the center of the bounding box for monster spawns
function get_best_group_location(){
    var data = get_best_group_data();
    var boundary = data.monster.boundary;
    var x = (boundary[0] + boundary[2]) / 2;
    var y = (boundary[1] + boundary[3]) / 2;
    var map = data.map;
    var coordinates = {x: x, y: y, map: map};
    // console.log(coordinates);
    return coordinates;
}