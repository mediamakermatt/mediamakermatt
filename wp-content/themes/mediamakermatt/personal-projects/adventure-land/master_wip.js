var load_characters = true;
var farm_phoenix = true;
var merchant_trade_in_town = true;
var main_loop = character.ping;
var potion_types = ['hpot1', 'mpot1'];
var load_code_name = "master_wip";
var party_names = ['Lootbot', 'Sinstrite', 'Shield', 'Curse'];
var normal_monsters = ["crab", "bee"];
var high_priority_monsters = ['mrgreen', 'mrpumpkin', 'snowman'];
var gold_limit = 1000000;
var farm_location = {x: -1091, y: -62, map: "main"};
var town_trade_location = {x: 22, y: -142, map: "main"};
var sell_whitelist = {
    ringsj: 0, hpbelt: 0, hpamulet: 0, quiver: 7,
    slimestaff: 6, quiver: 6, mushroomstaff: 7, cclaw: 7,
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

localStorage.setItem('potionTypes', JSON.stringify(potion_types));

if(load_characters && character.ctype == "merchant"){
    setTimeout(function(){
        for(let i in party_names){
            let player_name = party_names[i];
            if(player_name && player_name != character.name){
                parent.start_character_runner(player_name, load_code_name);
            }
        }
    },1000);
}

setInterval(function(){
    handleItems();
}, 1000);

function handleItems(){
    for(let i in character.items){
        let item = character.items[i];
        if(item && !item.p){
            sellItems(i, item);
        }
		if(item && (item.name == 'fireblade' || item.name == 'firestaff')){
			dismantle(i);
		}
    }
    upgradeItems();
}

function sellItems(slot, data){
    let item_name = data.name;
    if(Object.keys(sell_whitelist).includes(data.name)){
        if(data.level <= sell_whitelist[data.name]){
            sell(slot);
        }
    }
}

function getGrade(item) {
    return parent.G.items[item.name].grades;
}
  
// Returns the item slot and the item given the slot to start from and a filter.
function findItem(filter) {
    for (let i = 0; i < character.items.length; i++) {
        let item = character.items[i];
        if (item && filter(item))
        return [i, character.items[i]];
    }
    return [-1, null];
}

function upgradeItems(){
    for (let i = 0; i < character.items.length; i++){
        let c = character.items[i];
        if (c) {
            var level = upgrade_whitelist[c.name];
            if(level && c.level < level){
                let grades = getGrade(c);
                let scroll_name;
                if (c.level < grades[0])
                scroll_name = 'scroll0';
                else if (c.level < grades[1])
                scroll_name = 'scroll1';
                else
                scroll_name = 'scroll2';
                let [scroll_slot, scroll] = findItem(i => i.name == scroll_name);
                if (!scroll) {
                    parent.buy(scroll_name);
                    return;
                }
                if(!character.q.upgrade){
                    parent.socket.emit('upgrade', {
                        item_num: i,
                        scroll_num: scroll_slot,
                        offering_num: null,
                        clevel: c.level
                    });
                }
                return;
            }
        }
    }
}

var last_rip = null;
setInterval(function(){
    if(character.rip){
        if(last_rip == null || new Date() - last_rip >= 5000){
            respawn();
            last_rip = new Date();
        }
    } else {
        if(character.ctype == "merchant") var ctype = character.ctype;
        else var ctype = "farmer";
        switch(ctype){
            case "merchant":
                merchantMaster();
                break;
            case "farmer":
                farmerMaster();
                break;
        }
    }
}, 1);

// IF CHARACTER IS A MERCHANT
function merchantMaster(){
    localStorageMerchant();
    openCloseStand(main_loop);
    simplePotions(200, 5);
    var task = merchantLogic();
    if(task != null){
        switch(task){
            case "visitPartyMembers":
                visitPartyMembers();
                break;
            case "depositBank":
                depositBank();
                break;
            case "tradeItems":
                tradeItems();
                break;
        }
    } else {
        set_message("No Task");
        // no task available
    }
}

// IF CHARACTER IS A FARMER
function farmerMaster(){
    localStorageFarmer();
    simpleAttack();
    simplePotions(200, 5);
    loot();
    sendToMerchant(300, 1000); // dist & time
    var task = farmerLogic();
    if(task != null){
        switch(task){
            case "partyChristmasBuff":
                partyChristmasBuff();
                break;
            case "acquireMonsterHunt":
                acquireMonsterHunt();
                break;
            case "soloMonsterHunt":
                soloMonsterHunt();
                break;
            case "partyMonsterHunt":
                partyMonsterHunt();
                break;
            case "farmHighPriorityMonsters":
                farmHighPriorityMonsters();
                break;
            case "farmPhoenix":
                farmPhoenix();
                break;
            case "farmNormalMonsters":
                farmNormalMonsters();
                break;
        }
    } else {
        set_message("No Task");
        // no task available
    }
}

function acquireMonsterHunt(){
    set_message("Acquire Hunt");
    move_to_npc("monsterhunter");
}

function move_to_npc(name){
    var npc = getNPC(name);
    if(character.map == npc.map){
        var dist = distanceToPoint(
            character.real_x, character.real_y, 
            npc.x, npc.y
        );
        if(dist >= character.range){
            if(!smart.moving){
                smart_move({x: npc.x, y: npc.y});
            }
        } else {
            interact_with_npc(name);
        }
    } else {
        if(!smart.moving){
            smart_move({x: npc.x, y: npc.y, map: npc.map});
        }
    }
}

function interact_with_npc(name){
    if(name === "monsterhunter"){
        interact_monsterhunter();
    }
}

function interact_monsterhunter(){
    if(character.s.monsterhunt == undefined){
        setTimeout(function(){
            parent.socket.emit("monsterhunt");
        },250);
        setTimeout(function(){
            parent.socket.emit("monsterhunt");
        },250 * 2);
    } else {
        if(character.s.monsterhunt.c < 1){
            setTimeout(function(){
                parent.socket.emit("monsterhunt");
            },250);
        }
    }
}

function getNPC(name){
    for(i in parent.G.maps){
        let map = G.maps[i];
        let ref = map.ref;
        for(j in ref){
            let data = ref[j];
            let id = data.id;
            if(id == name){
                return data;
            }
        }
    } return null;
}

// IF CHARACTER IS A MERCHANT
function merchantLogic(){
    if(watchFarmers()){
        var task = "visitPartyMembers";
    } else {
        if(character.gold > gold_limit * 2){
            // deposit gold and items to bank
            var task = "depositBank";
        } else {
            // park and open merchant stand to sell and buy items to and from other players
            var task = "tradeItems";
        }
    }
    if(task){
        return task;
    } else {
        return null;
    }
}

// IF CHARACTER IS A FARMER
function farmerLogic(){
    if(parent.G.maps.main.ref.newyear_tree && !character.s.holidayspirit){
        // entire party travels to christmas tree and grabs buff
        var task = "partyChristmasBuff";
    } else {
        if(character.s.monsterhunt == undefined){
            // prioritize acquiring a monster hunt
            var task = "acquireMonsterHunt";
        } else {
            if(canCompleteMonsterHuntSolo()){
                var task = "soloMonsterHunt";
            } else {
                if(canCompleteMonsterHuntParty()){
                    var task = "partyMonsterHunt";
                } else {
                    if(getHighPriorityMonsters().length && farmHighPriorityMonsters() != false){
                        var task = "farmHighPriorityMonsters";
                    } else {
                        if(farmPhoenix() && farm_phoenix){
                            var task = "farmPhoenix";
                        } else {
                            var task = "farmNormalMonsters";
                        }
                    }
                }
            }
        }
    }
    if(task){
        return task;
    } else {
        return null;
    }
}

function localStorageMerchant(){
    // get merchants local storage data
}

function farmPhoenix(){
    var logic = [];
    let entities = Object.values(parent.entities);
    let phoenix = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === 'phoenix');
    if(!phoenix.length){
        return false;
    } else {
        set_message("Farm Phoenix");
        var monster = phoenix[0];
        var distance = distanceToPoint(monster.real_x, monster.real_y, character.real_x, character.real_y);
        if(distance > character.range * .9){
            if(can_move_to(monster.real_x, monster.real_y)){
                if(!character.moving){
                    move(monster.real_x, monster.real_y);
                }
            } else {
                if(!smart.moving){
                    smart_move({x: monster.real_x, y: monster.real_y, map: character.map});
                }
            }
        }
        return true;
    }
}

function farmNormalMonsters(){
    set_message("Farm Normal");
    var monsters = [];
    let entities = Object.values(parent.entities);
    let desired_monsters = entities.filter(c => !c.dead && c.type === 'monster' && normal_monsters.includes(c.mtype));
    for(let i in desired_monsters){
        let monster = desired_monsters[i];
        if(monster){
            monsters.push(monster);
        }
    }
    if(monsters.length){
        var target = get_nearest_monster({type: normal_monsters[0]});
        var current_target = get_targeted_monster();
        if(!current_target){
            change_target(target);
        }
    } else {
        if(!smart.moving){
            smart_move(normal_monsters[0]);
        }
    }
}

function farmHighPriorityMonsters(){
    set_message("Farm High");
    var monsters = [];
    for(let i in high_priority_monsters){
        let monster = parent.S[high_priority_monsters[i]];
        var snowman_hp = parent.G.monsters.snowman.max_hp;
        if(monster && monster.live && monster.hp < monster.max_hp * 0.75 && monster.max_hp > snowman_hp){
            monsters.push(monster);
        }
    }
    var current_target = get_targeted_monster();
    var snowman_target = get_nearest_monster({type: "snowman"});
    if(monsters.length && !snowman_target){
        let entities = Object.values(parent.entities);
        let desired_monsters = entities.filter(c => !c.dead && c.type === 'monster' && high_priority_monsters.includes(c.mtype));
        if(!desired_monsters.length && !smart.moving){
            smart_move({x: monsters[0].x, y: monsters[0].y, map: monsters[0].map});
        }
        return true;
    }
    if(parent.S.snowman != undefined && parent.S.snowman.live){
        if(!snowman_target){
            if(!smart.moving){
                smart_move({x: parent.S.snowman.x, y: parent.S.snowman.y, map: parent.S.snowman.map});
            }
        } else {
            if(!current_target){
                change_target(snowman_target);
            }
        }
        return true;
    } else {
        return false;
    }
}

function canCompleteMonsterHuntSolo(){
    return false;
}

function canCompleteMonsterHuntParty(){
    return false;
}

function soloMonsterHunt(){
    set_message("Solo Hunt ");
}

function partyMonsterHunt(){
    set_message("Party Hunt");
}

function getHighPriorityMonsters(){
    var monsters = [];
    for(let i in Object.keys(parent.S)){
        let monster = Object.keys(parent.S)[i];
        if(monster && high_priority_monsters.includes(monster)){
            monsters.push(monster);
        }
    }
    return monsters;
}

function partyChristmasBuff(){
    set_message("Xmas Buff");
    if(!smart.moving){
        smart_move(parent.G.maps.main.ref.newyear_tree,function(){
            // This executes when we reach our destination
            parent.socket.emit("interaction",{type:"newyear_tree"});
        });
    }
}

function localStorageFarmer(){
    var data = {
        mluck: determineBuff("mluck", 1000 * 30),
        rspeed: determineBuff("rspeed", 1000 * 30),
        party: determineParty(),
        gold: character.gold,
        esize: character.esize,
        location: {x: character.real_x, y: character.real_y, map: character.map},
    }
    localStorage.setItem(character.name + "_Data", JSON.stringify(data));
}

function determineBuff(name, time){
    if(character.s[name] != undefined){
        if(character.s[name].ms >= time){
            if(name == 'mluck'){
                if(character.s[name].f != undefined){
                    if(character.s[name].f == party_names[0]){
                        var buff = true;
                    } else {
                        var buff = false;
                    }
                } else {
                    var buff = false;
                }  
            } else {
                var buff = true;
            }
        } else {
            var buff = false;
        }
    } else {
        var buff = false;
    }
    return buff;
}

function determineParty(){
    if(character.party != undefined){
        var party = character.party;
    } else {
        var party = false;
    }
    return party;
}

function distanceToPoint(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function watchFarmers(){
    var visit_party_members = [];
    for(let i in party_names){
        let party_member = party_names[i];
        if(party_member && party_member != character.name){
            var member_data = JSON.parse(localStorage.getItem(party_member + "_Data"));
            if(!member_data.gold || !member_data.mluck || member_data.esize <= 5 || member_data.gold >= gold_limit * 2){
                visit_party_members.push(party_member);
                visitPartyMembers();
            }
        }
    }
    if(visit_party_members.length){
        return true;
    }
    visit_party_members.length = 0;
    return false;
}

function visitPartyMembers(){
    set_message("Visit Farmers");
    var location = JSON.parse(localStorage.getItem(party_names[1] + "_Data")).location;
    if(character.map != location.map){
        if(!smart.moving){
            smart_move(location);
        }
    } else {
        var distance = distanceToPoint(location.x, location.y, character.real_x, character.real_y);
        if(distance >= 100){
            if(!smart.moving){
                smart_move(location);
            } 
        } else {
            buffFarmers();
        }
    }
}

var last_mluck = null;
function buffFarmers(){
    if(character.ctype == "merchant"){
        if(last_mluck == null || new Date() - last_mluck >= parent.G.skills.mluck.cooldown){
            if(character.mp >= parent.G.skills.mluck.mp){
                for(let i in party_names){
                    let party_member = get_player(party_names[i]);
                    if(party_member && party_member.name != character.name){
                        if(party_member.s.mluck == undefined || (party_member.s.mluck != undefined && party_member.s.mluck.f != character.name))
                        use_skill("mluck", party_member);
                        last_mluck = new Date();
                    }
                }
            }
        }
    }
}

var last_gold_send = null;
function sendToMerchant(dist, time){
    sentMerchantItems();
    if(last_gold_send == null || new Date() - last_gold_send >= time){
        var merchant = get_player(party_names[0]);
        var gold_keep = gold_limit * 2;
        if(merchant){
            var distance = distanceToPoint(merchant.real_x, merchant.real_y, character.real_x, character.real_y);
            if(distance <= dist){
                if(character.gold >= gold_keep){
                    parent.socket.emit("send",{name:party_names[0], gold:character.gold - gold_limit});
                    last_gold_send = new Date();
                }
            }
        }
    }
}

function sentMerchantItems(){
    for(let i in character.items){
        let item = character.items[i];
        if(item){
            if(item.l == undefined){
                if(item.p != undefined && item.p == "shiny"){
                    sendItemToMerchant(300, i, 9999, 250);
                }
                if(item.q != undefined && !potion_types.includes(item.name)){
                    sendItemToMerchant(300, i, 9999, 250);
                }
                if(item.level != undefined){
                    if(upgrade_whitelist[item.name] != undefined && Object.keys(upgrade_whitelist).includes(item.name)){
                        if(item.level >= upgrade_whitelist[item.name]){
                            sendItemToMerchant(300, i, 9999, 250);
                        }
                    }
                }
            }
        }
    }
}

var last_item_send = null;
function sendItemToMerchant(dist, slot, amt, time){
    if(last_item_send == null || new Date() - last_item_send >= time){
        var merchant = get_player(party_names[0]);
        if(merchant){
            var distance = distanceToPoint(merchant.real_x, merchant.real_y, character.real_x, character.real_y);
            if(distance <= dist){
                parent.socket.emit("send",{name:party_names[0], num:slot, q:amt||1});
                last_item_send = new Date();
            }
        }
    }
}

function depositBank(){
    set_message("Bank Deposit");
    if(character.map != "bank"){
        if(!smart.moving){
            smart_move("bank", function(){
                parent.socket.emit("bank",{operation:"deposit",amount: character.gold - gold_limit});
            });
        }
    }
}

function tradeItems(){
    if(merchant_trade_in_town){
        set_message("Town Trade");
        if(character.map == town_trade_location.map){
            var distance = distanceToPoint(town_trade_location.x, town_trade_location.y, character.real_x, character.real_y);
        }
        if((distance && distance > 25) || character.map != town_trade_location.map){
            if(!smart.moving){
                smart_move(town_trade_location);
            }
        }
    }
}

var last_merchant_stand = null;
function openCloseStand(time){
    if(last_merchant_stand == null || new Date() - last_merchant_stand >= time){
        if(character.moving){
            parent.socket.emit("merchant", { close: 1 });
            last_merchant_stand = new Date();
        } else {
            parent.socket.emit("merchant", { num: itemLocation('stand0') });
            last_merchant_stand = new Date();
        }
    }
}

/*
inventory_item_quantity(name, level=null)
These fetch the AMOUNT of a specific item and level in an inventory index.
*/
function itemQuantity(name, level=null){

    let item_count = character.items.filter(item => item != null && item.name == name && (level !== null ? item.level == level : true)).reduce(function(a,b){
        return a + (b["q"] || 1);
    }, 0);
    return item_count;

} // end inventory_item_quantity
 
/*
inventory_items(name)
These fetch the LOCATION of a specific item and level in an inventory index.
*/
function itemLocation(name, level=null){

    for(let i in character.items){
        let item = character.items[i];
        if(item && item.name == name && (level !== null ? item.level == level : true)){
            return i;
        }
    }
    return null;

} // end inventory_items

var lastAttack = null;
function simpleAttack(){
    var target = get_targeted_monster();
    if(target){
        var distance = distanceToPoint(target.real_x, target.real_y, character.real_x, character.real_y);
        if(distance > character.range){
            if(can_move_to(target.real_x, target.real_y)){
                if(!character.moving){
                    move(target.real_x, target.real_y);
                }
            } else {
                if(!smart.moving){
                    smart_move({x: target.real_x, y: target.real_y});
                }
            }
        } else {
            if(lastAttack == null || new Date() - lastAttack >= 1000 / character.frequency){
                parent.monster_attack.call(target);
                lastAttack = new Date();
            }
        }
    }
}

var lastHealthPotion = null;
var lastManaPotion = null;
function simplePotions(buy_amount, min_amount){
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

var lastPurchase = null;
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