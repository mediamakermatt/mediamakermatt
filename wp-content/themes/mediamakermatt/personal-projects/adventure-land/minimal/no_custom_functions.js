var inventory_infolist = [200, 5, 5]; // potion stack amount / lower potion limit / empty slot limit
var monster_killlist = {bee: 0, goo: 1};
var sell_whitelist = ['slimestaff'];
var visit_town = false;

var last_attack = null;
var last_move = null;
var last_smart_move = null;
var last_change_target = null;
var last_use_potion = null;
var last_sell = null;
var last_buy = null;
var last_move_stop = null;
var last_loot = null;

setInterval(function(){
    items();
    farm();
}, 250);

function items(){
    var hp = Object.values(character.items).filter(i => i != null && i.name.includes('hpot'))[0];
    var mp = Object.values(character.items).filter(i => i != null && i.name.includes('mpot'))[0];
    if(last_use_potion == null || new Date() - last_use_potion >= 250){
        if(character.mp <= character.mp_cost && can_use('mp') && mp.q >= 1){
            use_skill('mp');
            last_use_potion = new Date();
        } else if(character.hp <= character.max_hp - parent.G.items[hp.name].gives[0][1] && can_use('hp') && hp.q >= 1){
            use_skill('hp');
            last_use_potion = new Date();
        } else if(character.mp <= character.max_mp - parent.G.items[mp.name].gives[0][1] && can_use('mp') && mp.q >= 1){
            use_skill('mp');
            last_use_potion = new Date();
        }
    }
    if(character.esize <= inventory_infolist[2] || hp.q <= inventory_infolist[1] || mp.q <= inventory_infolist[1]){
        visit_town = true;
        if(!smart.moving){
            if(last_smart_move == null || new Date() - last_smart_move >= 100){
                smart_move({to:"potions",return:true},function(){ 
                    if(last_sell == null || new Date() - last_sell >= 100){
                        for(let i in character.items){
                            if(character.items[i] && sell_whitelist.includes(character.items[i].name)){ 
                                sell(i); 
                                last_sell = new Date();
                            }
                        }
                    }
                    if(last_buy == null || new Date() - last_buy >= 100){
                        if(parent.G.items[hp.name].g){ 
                            buy(hp.name, inventory_infolist[0] - hp.q); 
                            last_buy = new Date();
                        }
                        if(parent.G.items[mp.name].g){ 
                            buy(mp.name, inventory_infolist[0] - mp.q);
                            last_buy = new Date(); 
                        }
                    }
                    last_smart_move = new Date();
                });
            }
        }
    } else {
        visit_town = false;
    }
    if(last_loot == null || new Date() - last_loot >= 250){
        loot();
        last_loot = new Date();
    }
}

function farm(){
    var most_prioritized = Object.keys(monster_killlist).reduce((key, v) => monster_killlist[v] < monster_killlist[key] ? v : key);
    var entities = Object.values(parent.entities);
    var next_best = entities.filter(c => !c.dead && c.type === 'monster' && Object.keys(monster_killlist).includes(c.mtype) && c.mtype !== most_prioritized);
    var best_monsters = entities.filter(c => !c.dead && c.type === 'monster' && c.mtype === most_prioritized);
    var current = get_targeted_monster();
    if(best_monsters.length > 0){
        var best_target = get_nearest_monster({type: best_monsters[0].mtype, no_target: true});
        if(parent.distance(character, best_target) < character.range){
            var target = best_target;
        } else {
            if(next_best.length > 0){
                var target = get_nearest_monster({type: next_best[0].mtype, no_target: true});
            }
        }
    } else {
        if(next_best.length > 0){
            var target = get_nearest_monster({type: next_best[0].mtype, no_target: true});
        }
    }
    if(target != null){
        var current = get_targeted_monster();
        if(!current){
            if(last_change_target == null || new Date() - last_change_target >= 100){
                change_target(target);
                last_change_target = new Date();
            }
        }
        if(parent.distance(character, target) <= character.range){
            if(last_attack == null || new Date() - last_attack >= 1000 / character.frequency){
                if(character.mp >= character.mp_cost){
                    parent.monster_attack.call(target);
                    last_attack = new Date();
                }
            }
        } else {
            var half_x = character.real_x+(target.real_x-character.real_x)/2;
			var half_y = character.real_y+(target.real_y-character.real_y)/2;
            if(can_move_to(half_x, half_y)){
                if(!character.moving){
                    if(last_move == null || new Date() - last_move >= 100){
                        move(half_x, half_y);
                        last_move = new Date();
                    }
                }
            } else if(!smart.moving){
                if(last_smart_move == null || new Date() - last_smart_move >= 100){
                    smart_move({x: target.real_x, y: target.real_y});
                    last_smart_move = new Date();
                }
            }
        }
    }
    if((!current && best_monsters.length < 1) || (current && current.mtype != most_prioritized && current.hp <= character.attack * .9)){
        if(!smart.moving){
            if(last_smart_move == null || new Date() - last_smart_move >= 100){
                smart_move(most_prioritized);
                last_smart_move = new Date();
            }
        }
    }
    if(current && current.mtype == most_prioritized && parent.distance(character, current) < character.range){
        if(smart.moving){
            if(last_move_stop == null || new Date() - last_move_stop >= 100){
                stop('move');
                last_move_stop = new Date();
            }
        }
    }
}













var time = null;
if(time == null || new Date() - time >= 100){
    setTimeout(function(){
        thing();
    });
}

function thing(){
    var nearest = get_nearest_monster();
    var targeted = get_targeted_monster();
    if(!targeted){
        if(nearest){
            change_target(nearest);
            time = new Date();
        }
    } else {
        attack(targeted);
        time = new Date();
    }
}
