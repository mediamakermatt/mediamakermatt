load_code('static_functions');
load_code('dynamic_functions');

setInterval(function(){
    use_potions('hpot1', 'mpot1', 200, 5);
    farm_normal_monsters(['armadillo', 'croc', 'bee', 'goo', 'chicken', 'hen']);
    handle_inventory();
    deposit_gold(1000000, 'bank');
    get_christmas_buff('newyear_tree', 30000);
    loot();
}, character.ping);

// FARM NORMAL MONSTERS
var last_change_target = null;
var last_smart_move = null;
function farm_normal_monsters(farm_monsters){
    var entities = Object.values(parent.entities);
    var monsters = entities.filter(c => !c.dead && c.type === 'monster' && farm_monsters.includes(c.mtype));
    var current_target = get_targeted_monster();
    if(last_change_target == null || new Date() - last_change_target >= character.ping){
        var min_d = 999999, target = null;
        if(monsters.length){
            for(let i in monsters){
                var monster = monsters[i];
                var c_dist = distance_to_point(character.real_x, character.real_y, monster.real_x, monster.real_y);
                if(c_dist < min_d){
                    min_d = c_dist, target = monster;
                    if(!current_target){
                        change_target(target);
                        last_change_target = new Date();
                    }
                }
            }
        }
    }
    if(current_target){
        attack_current_monster(current_target);
    } else {
        if(!smart.moving){
            if(last_smart_move == null || new Date() - last_smart_move >= character.ping){
                smart_move(farm_monsters[0]);
                last_smart_move = new Date();
            }
        }
    }
} // end farm_normal_monsters

// ATTACK CURRENT MONSTER
var last_attack_current_monster = null;
function attack_current_monster(monster){
    var distance = distance_to_point(character.real_x, character.real_y, monster.real_x, monster.real_y);
    if(distance > character.range){
        if(can_move_to(monster.real_x, monster.real_y)){
            if(!character.moving){
                if(last_attack_current_monster == null || new Date() - last_attack_current_monster >= character.ping){
                    move(
                        character.real_x + (monster.real_x - character.real_x) / 2,
                        character.real_y + (monster.real_y - character.real_y) / 2
                    );
                    last_attack_current_monster = new Date();
                }
            }
        } else if(!smart.moving){
            smart_move({x: monster.real_x, y: monster.real_y});
            last_attack_current_monster = new Date();
        }
    } else {
        if(last_attack_current_monster == null || new Date() - last_attack_current_monster >= 1000 / character.frequency){
            parent.monster_attack.call(monster);
            last_attack_current_monster = new Date();
        }
    }
}

// SELL ITEMS
function sell_items(sell_whitelist){
    for(let i in character.items){
        let item = character.items[i];
        if(item){
            if(Object.keys(sell_whitelist).includes(item.name)){
                if(item.level == undefined || (item.level != undefined && item.level <= sell_whitelist[item.name])){
                    sell(i);
                }
            }
        }
    }
} // end sell_items

// HANDLE INVENTORY (SEUC)
function handle_inventory(){
    sell_items({
        ringsj: 0, hpbelt: 0, hpamulet: 0, quiver: 7,
        slimestaff: 6, quiver: 6, mushroomstaff: 7, cclaw: 7,
        dexring: 2, intring: 2, strring: 2, vitring: 2,
        dexearring: 2, intearring: 2, strearring: 2, vitearring: 2,
        dexamulet: 2, intamulet: 2, stramulet: 2,
        dexbelt: 2, intbelt: 2, strbelt: 2,
        wcap: 6, wattire: 6, wbreeches: 6, wgloves: 6, wshoes: 6,
    });
} // end handle_inventory