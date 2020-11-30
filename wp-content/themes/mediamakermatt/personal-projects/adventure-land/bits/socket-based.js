var all_data = [];

character.all(function(name,data){
	
    data.event_name = name;
    
	all_data.push(data);
    console.log(all_data[0]);
    all_data.length = 0;
    
	time = new Date();
	
	setTimeout(function(){
		potions();
		if(data.source == 'attack'){
			if(data.kill == true){
				kill();
			}
		}
		loot();
	}, character.ping);
	
});






var monsters = ['goo'];
var last_attack = null;
var last_change = null;
var last_smart_move = null;
var last_loot = null;
var last_use_potion = null;

main_loop();
parent.socket.on("entities", function(){
	main_loop();
});

function main_loop(){
    potions();
    var targeted_monster = get_targeted_monster();
    var nearest_monster = get_nearest_monster({type: monsters[0]});
    if(targeted_monster){
        attack(targeted_monster);
    } else {
        if(nearest_monster){
            change(nearest_monster);
        } else {
            smartmove(monsters[0]);
        }
    }
    loot();
}

function potions(){
    var stack = 200;
    var hp = Object.values(character.items).filter(i => i != null && i.name.includes('hpot'))[0];
    var mp = Object.values(character.items).filter(i => i != null && i.name.includes('mpot'))[0];
    if(last_use_potion == null || new Date() - last_use_potion >= character.ping){
        if(character.mp <= character.mp_cost && can_use('mp') && mp.q >= 1){
            use_skill('mp');
            buy_with_gold(mp.name, stack - mp.q);
            last_use_potion = new Date();
        } else if(character.hp <= character.max_hp - parent.G.items[hp.name].gives[0][1] && can_use('hp') && hp.q >= 1){
            use_skill('hp');
            buy_with_gold(hp.name, stack - hp.q);
            last_use_potion = new Date();
        } else if(character.mp <= character.max_mp - parent.G.items[mp.name].gives[0][1] && can_use('mp') && mp.q >= 1){
            use_skill('mp');
            buy_with_gold(mp.name, stack - mp.q);
            last_use_potion = new Date();
        }
    }
}

function attack(target){
    if(parent.distance(character, target) <= character.range){
        if(last_attack == null || new Date() - last_attack >= 1000 / character.frequency){
            if(character.mp >= character.mp_cost){
                parent.monster_attack.call(target);
                last_attack = new Date();
            }
        }
    }
}

function change(target){
    if(last_change == null || new Date() - last_change >= character.ping){
        change_target(target);
        last_change = new Date();
    }
}

function smartmove(location){
    if(!smart.moving){
        if(last_smart_move == null || new Date() - last_smart_move >= character.ping){
            smart_move(location);
            last_smart_move = new Date();
        }  
    }
}

function loot(){
    if(last_loot == null || new Date() - last_loot >= 250){
        var looted = 0;
        var amt = 5;
        if(character.esize >= 1){
            for(var id in parent.chests){
                var chest = parent.chests[id];
                parent.open_chest(id);
                looted++;
                if(character.esize <= amt){
                    if(looted == character.esize) break; 
                } else {
                    if(looted == amt) break;
                }
                
            }
        }
        last_loot = new Date();
    }
}














































// Register to a single character event:
character.on("level_up",function(data){
	game_log("I am now level "+data.level+"!");
});

// Register to all character events:
character.all(function(name,data){
	data.event_name=name;
	show_json(data);
});

// incoming
{
	// If an "action" Game Event is targeting you
	// It's emitted to your character as an "incoming" event
	source: "attack", // Can be positive or negative
	actor: "CharacterName", // Monster ID or Character ID
	target: "42", // Monster ID or Character ID
	damage: 1390,
	projectile: "momentum",
	eta: 50, // Arrival in milliseconds
	pid: "abcd1234", // Projectile ID
}

// hit
{
	// Emitted when you've been hit by a projectile
	// Could be damaging, healing, or containing a condition
	// The full reference can be found in Game Events
	source: "attack",
	actor: "AttackerID", // Monster ID or Character ID
	target: "YourCharacterName", // Monster ID or Character ID
	damage: 1390,
	pid: "abcd1234", // Projectile ID
}

// target_hit
{
	// Same format as "hit" event
	// Emitted when you've hit someone
}

// loot
{
	// Emitted when you or a party member opens a chest
	id: "qwerty12345",
	opener: "CharacterName", // Character who opened the chest
	goldm: 1.2, // Character who opened the chest had +20% Gold
	dry: false, // Set if the opener was far away from the chest
	stale: false, // Set if the chest was unopened for more than 30 minutes
	// If the dry or stale flags are set, goldm is 1
	gold: 87, // You looted 87 gold
	party: true, // The chest was looted by a party
	items:[
		{name:"xsword", "level":0, "looter":"ACharacterName"},
		{name:"xstaff", "level":0, "looter":null, "lostandfound":true}, // Lost
		{name:"xbow", "level":10, "looter":"AnotherCharacterName", pvp_loot:true},
		// pvp_loot flag is set if the chest was a character drop at pvp
	],
}

// buy
{
	name: "coat",
	num: 0, // Inventory slot 0
	q: 1, // Quantity
	cost: 6000, // Gold spent
}

// cm
{
	name: "CharacterName", // Name of the character who sent the code message
	message: object, // Can be a string, array, any serializable object
}

// clim
{
	// Raw data that's posted to the CLI jsdom window from character.js
	// Can also be posted from master.js, which character.js will propagate
}

// death
{
	past: false, // true when your code executes with a dead character
}

// mobbing
{
	// If you target 4+ monsters, they start dealing increased damage
	// This behaviour is called "mobbing"
	intensity: 1, // The intensity increases with each hit
}

// stacked
{
	// If you place your characters on top of each other
	// Monsters deal stacked/increasing damage to all the stacked characters
	// When this event is triggered, scatter your characters
	ids: ["CharacterName1","CharacterName2","..."],
}

// level_up
{
	level: 72, // Your new level
}





















































































































const sell_whitelist = ['hpamulet', 'ringsj', 'hpbelt', 'slimestaff'];

setInterval(function(){ master(); }, 1);  

function master(){
    potions();
    attack_monster('goo');
    sell_items();
    loot_chests();
    revive();
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
            use_skill('mp');
            buy_with_gold(mp.name, 1);
            last_use_mp_potion = new Date();
        }
    } else if(character.hp <= character.max_hp - parent.G.items[hp.name].gives[0][1] && hp.q >= 1){
        if(last_use_hp_potion == null || new Date() - last_use_hp_potion >= parent.G.skills.use_hp.cooldown){
            use_skill('hp');
            buy_with_gold(hp.name, 1);
            last_use_hp_potion = new Date();
        }
    } else if(character.mp <= character.max_mp - parent.G.items[mp.name].gives[0][1] && mp.q >= 1){
        if(last_use_mp_potion == null || new Date() - last_use_mp_potion >= parent.G.skills.use_mp.cooldown){
            use_skill('mp');
            buy_with_gold(mp.name, 1);
            last_use_mp_potion = new Date();
        }
    }
}

var last_attack = null;
var last_change_target = null;
var last_move = null;
var last_smart_move = null;
var last_stop_move = null;
function attack_monster(mtype){
    var target = get_targeted_monster();
    if(target){
        var distance = distance_to_point(character.real_x, character.real_y, target.real_x, target.real_y);
        if(distance < character.range){
            if(last_attack == null || new Date() - last_attack >= 1000 / character.frequency){
                if(character.mp >= parent.G.skills['5shot'].mp + character.mp_cost){
                    use_skill('5shot');
                    last_attack = new Date();
                } else {
                    if(character.mp >= parent.G.skills['3shot'].mp + character.mp_cost){
                        use_skill('3shot');
                        last_attack = new Date();
                    } else {
                        if(character.mp >= character.mp_cost){
                            attack(target);
                            last_attack = new Date();
                        }
                    }
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
                    if(last_smart_move == null || new Date() - last_smart_move >= 1000 / character.ping){
                        smart_move(target.real_x, target.real_y);
                        last_smart_move = new Date();
                    }
                } else {
                    if(distance <= character.range){
                        if(last_stop_move == null || new Date() - last_stop_move >= 1000 / character.ping){
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
                if(last_smart_move == null || new Date() - last_smart_move >= 1000 / character.ping){
                    smart_move(mtype);
                    last_smart_move = new Date();
                }
            } else {
                if(distance <= character.range){
                    if(last_stop_move == null || new Date() - last_stop_move >= 1000 / character.ping){
                        stop('move');
                        last_stop_move = new Date();
                    }
                }
            }
        }
    }
}

var last_sell = null;
function sell_items(){
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
        }
    }
}

function distance_to_point(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
