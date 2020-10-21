var monster_types = ['goo'];
var potion_types = ['hpot0', 'mpot0'];
var sell_whitelist = ['ringsj', 'hpamulet', 'hpbelt'];

setInterval(function(){
    use_potions(potion_types[0], potion_types[1]);
    visit_town(5);
    attack_target(monster_types[0]);
    loot();
}, character.ping);

function use_potions(health, mana){
    if(character.mp <= character.mp_cost){
        use(parent.G.items[mana].gives[0][0]);
    } else {
        if(character.hp <= character.max_hp - parent.G.items[health].gives[0][1]){
            use(parent.G.items[health].gives[0][0]);
        } else if(character.mp <= character.max_mp - parent.G.items[mana].gives[0][1]){
            use(parent.G.items[mana].gives[0][0]);
        }
    }
}

function visit_town(amt){
    if(character.esize <= amt || quantity(potion_types[0]) <= amt || quantity(potion_types[1]) <= amt){
        if(quantity("computer") < 1){
            if(!smart.moving){
                smart_move({to:"potions",return:true},function(){ 
                    handle_inventory();
                });
            }
        } else {
            handle_inventory();
        }
    }
}

function handle_inventory(){
    sell_items();
    buy_potions(5, 200);
}

function sell_items(){
    for(let i in character.items){
        let item = character.items[i];
        if(item){
            if(sell_whitelist.includes(item.name)){
                sell(i);
            }
        }
    }
}

function buy_potions(amt, buy){
    if(quantity(potion_types[0]) <= amt){
        if(character.gold >= parent.G.items[potion_types[0]].g){
            buy_with_gold(potion_types[0], buy - quantity(potion_types[0]));
        }
    }
    if(quantity(potion_types[1]) <= amt){
        if(character.gold >= parent.G.items[potion_types[1]].g){
            buy_with_gold(potion_types[1], buy - quantity(potion_types[1]));
        }
    }
}

var last_attack = null;
function attack_target(name){
    var current = get_targeted_monster();
    var target = get_nearest_monster({type: name, no_target: true});
    if(current){
        if(distance(character, target) <= character.range){
            if(last_attack == null || new Date() - last_attack >= 1000 / character.frequency){
                attack(target);
                last_attack = new Date();
            }
        } else {
            var hx = character.real_x+(target.real_x-character.real_x)/2;
            var hy = character.real_y+(target.real_y-character.real_y)/2;
            if(can_move_to(hx, hy)){
                if(!character.moving){
                    move(hx, hy);
                }
            } else {
                if(!smart.moving){
                    smart_move({x: target.real_x, y: target.real_y});
                }
            }
        }
    } else {
        if(target){
            change_target(target);
        } else {
            if(!smart.moving){
                smart_move(name);
            }
        }
    }
}