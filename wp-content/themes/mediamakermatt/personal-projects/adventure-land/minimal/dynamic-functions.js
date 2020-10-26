// MERCHANT STAND
var last_merchant_stand = null;
function merchant_stand(ctype, stand){ // 'merchant', 'stand0'
    if(last_merchant_stand == null || new Date() - last_merchant_stand >= character.ping){
        if(character.moving || smart.moving){
            parent.socket.emit(ctype, { close: 1 });
            last_merchant_stand = new Date();
        } else {
            parent.socket.emit(ctype, { num: item_location(stand) });
            last_merchant_stand = new Date();
        }
    }
} // end merchant_stand

// DEPOSIT GOLD
var last_deposit_gold = null;
function deposit_gold(keep_amt, bank_name){ // 1000000, 'bank'
    if(last_deposit_gold == null || new Date() - last_deposit_gold >= character.ping){
        if(character.map != bank_name && character.gold > keep_amt * 2){
            if(!smart.moving){
                smart_move(bank_name, function(){
                    parent.socket.emit(bank_name,{operation:"deposit",amount: character.gold - keep_amt});
                    last_deposit_gold = new Date();
                });
            }
        }
    }
} // end deposit_gold

// GET CHRISTMAS BUFF
var last_christmas_buff = null;
function get_christmas_buff(tree_name, remaining_time){ // 'newyear_tree', 30000
    if(last_christmas_buff == null || new Date() - last_christmas_buff >= character.ping){
        if(parent.G.maps.main.ref[tree_name]){
            if(character.s.holidayspirit == undefined || (character.s.holidayspirit != undefined && character.s.holidayspirit.ms < remaining_time)){
                if(!smart.moving){
                    smart_move(parent.G.maps.main.ref[tree_name],function(){
                        parent.socket.emit("interaction",{type:tree_name});
                        last_christmas_buff = new Date();
                    });
                }
            }
        }
    }
} // end get_christmas_buff

// USE POTIONS
var last_potion_use = null;
function use_potions(health_name, mana_name, buy_amount, min_amount){ // 'hpot1', 'mpot1', 200, 5
    if(last_potion_use == null || new Date() - last_potion_use >= parent.G.skills.use_hp.cooldown){
        if(character.mp <= character.mp_cost){
            use(parent.G.items[mana_name].gives[0][0]);
            buy_potions(health_name, mana_name, buy_amount);
            last_potion_use = new Date();
        } else if(character.hp <= character.max_hp - parent.G.items[health_name].gives[0][1]){
            use(parent.G.items[health_name].gives[0][0]);
            buy_potions(health_name, mana_name, buy_amount);
            last_potion_use = new Date();
        } else if(character.mp <= character.max_mp - parent.G.items[mana_name].gives[0][1]){
            use(parent.G.items[mana_name].gives[0][0]);
            buy_potions(health_name, mana_name, buy_amount);
            last_potion_use = new Date();
        }
    }
} // end use_potions

// BUY POTIONS
var last_buy_potion = null;
function buy_potions(health_name, mana_name, buy_amount){
    if(last_buy_potion == null || new Date() - last_buy_potion >= character.ping){
        if(item_quantity(health_name) < buy_amount){
            buy_with_gold(health_name, buy_amount - item_quantity(health_name));
            last_buy_potion = new Date();
        }
        if(item_quantity(mana_name) < buy_amount){
            buy_with_gold(mana_name, buy_amount - item_quantity(mana_name));
            last_buy_potion = new Date();
        }
    }
} // end buy_potions