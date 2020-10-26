load_code("HandleInventory");
load_code("ManageParty");

var lastHealthPotion = null;
var lastManaPotion = null;
var lastAttack = null;
var lastLoot = null;
var lastPurchase = null;
var three_shot = [];

setInterval(function(){

    use_potions(200, 5); // buy & min
    quick_priest_heals();
    quick_attack_skills();
	quick_attack_monster();
    quick_loot(5); // amt to loot before break

},1);

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

function quick_priest_heals(){
    if(lastAttack == null || new Date() - lastAttack >= 1000 / character.frequency){
        if(character.ctype == "priest"){
            if(character.party != null){
                for(let i in Object.keys(parent.party)){
                    let member = Object.keys(parent.party)[i];
                    if(member){
                        let player = get_player(member);
                        if(player){
                            if(player.hp <= player.max_hp * .75){
                                heal(player);
                                lastAttack = new Date();
                            }
                        }
                    }
                }
            }
        }
    }
}

var last_curse = null;
var last_dark_blessing = null;
var last_hardshell = null;
var last_warcry = null;
var last_agitate = null;
var last_hunters_mark = null;
var last_supershot = null;

function quick_attack_skills(){
    let entities = Object.values(parent.entities);
	let monsters = entities.filter(c => !c.dead && c.type === 'monster');
    let target = get_targeted_monster();
    let hp_buffer = 5000;
    // PRIEST
    if(character.ctype == "priest"){
        if(last_curse == null || new Date() - last_curse >= parent.G.skills.curse.cooldown){
            let targeting_party = monsters.filter(c => c.target && my_characters.includes(c.target));
            for(let i in targeting_party){
                let targeter = targeting_party[i];
                three_shot.push(targeter.id);
                if(!targeter.s.cursed){
                    if(character.mp >= parent.G.skills.curse.mp){
                        if(targeter.hp >= hp_buffer){
                            if(can_use("curse")){
                                use_skill("curse", targeter);
                                last_curse = new Date();
                            }
                        }
                    }
                }
            }
        }
        if(last_dark_blessing == null || new Date() - last_dark_blessing >= parent.G.skills.darkblessing.cooldown){
            if(target){
                if(character.mp >= parent.G.skills.darkblessing.mp){
                    if(can_use("darkblessing")){
                        use_skill("darkblessing");
                        last_dark_blessing = new Date();
                    }
                }
            }
        }
    }
    // WARRIOR
    else if(character.ctype == "warrior"){
        if(last_hardshell == null || new Date() - last_hardshell >= parent.G.skills.hardshell.cooldown){
            if(character.hp <= character.max_hp * .35){
                if(character.mp >= parent.G.skills.hardshell.mp){
                    if(can_use("hardshell")){
                        use_skill("hardshell");
                        last_hardshell = new Date();
                    }
                }
            }
        }
        if(last_warcry == null || new Date() - last_warcry >= parent.G.skills.warcry.cooldown){
            if(target){
                if(character.mp >= parent.G.skills.warcry.mp){
                    if(can_use("warcry")){
                        use_skill("warcry");
                        last_warcry = new Date();
                    }
                }
            }
        }
        if(last_agitate == null || new Date() - last_agitate >= parent.G.skills.agitate.cooldown){
            let aggro = monsters.filter(c => c.target && c.target === character.name);
            let entities = Object.values(parent.entities);
            let targeters_of_party = ['phoenix', 'mrgreen', 'mrpumpkin', 'snowman'];
            let phoenix = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === targeters_of_party[0]);
            let mrgreen = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === targeters_of_party[1]);
            let mrpumpkin = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === targeters_of_party[2]);
            let snowman = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === targeters_of_party[3]);
            if(phoenix || mrgreen || mrpumpkin || snowman) return;
            let mainFarm = entities.filter(c => !c.dead && c.type === 'monster' && c.skin === JSON.parse(localStorage.getItem("farmTypes"))[0]);
            if(mainFarm.length > 0){
                if(aggro.length < 2){
                    if(character.mp >= parent.G.skills.taunt.mp && character.hp >= character.max_hp * .75){
                        if(can_use("agitate")){
                            use_skill("agitate");
                            last_agitate = new Date();
                        }
                    }
                }
            }
        }
    }
    // RANGER
    else if(character.ctype == "ranger"){
        if(last_hunters_mark == null || new Date() - last_hunters_mark >= parent.G.skills.huntersmark.cooldown){
            var targeting_party = monsters.filter(c => c.target && my_characters.includes(c.target));
            for(let i in targeting_party){
                let targeter = targeting_party[i];
                three_shot.push(targeter.id);
                if(!targeter.s.marked){
                    if(character.mp >= parent.G.skills.huntersmark.mp){
                        if(targeter.hp >= hp_buffer){
                            if(can_use("huntersmark")){
                                use_skill("huntersmark", targeter);
                                last_hunters_mark = new Date();
                            }
                        }
                    }
                }
            }
        }
        if(last_supershot == null || new Date() - last_supershot >= parent.G.skills.supershot.cooldown){
            var targeting_party = monsters.filter(c => c.target && my_characters.includes(c.target));
            for(let i in targeting_party){
                let targeter = targeting_party[i];
                three_shot.push(targeter.id);
                let supershot_dmg = parent.G.skills.supershot.damage_multiplier * (character.attack * .9);
                if(targeter.hp >= supershot_dmg){
                    if(character.mp >= parent.G.skills.supershot.mp){
                        if(can_use("supershot")){
                            use_skill("supershot", targeter);
                            last_supershot = new Date();
                        }
                    }
                }
            }
        }
        if(lastAttack == null || new Date() - lastAttack >= 1000 / character.frequency){
            var targeting_party = monsters.filter(c => c.target && my_characters.includes(c.target));
            for(let i in targeting_party){
                let targeter = targeting_party[i];
                three_shot.push(targeter.id);
                if(three_shot.length >= 3){
                    if(character.mp >= parent.G.skills["3shot"].mp){
                        parent.use_skill("3shot", three_shot);
                        lastAttack = new Date();
                    }
                }
            }
        }
    }
	three_shot.length = 0;
}

function quick_attack_monster(){
    if(lastAttack == null || new Date() - lastAttack >= 1000 / character.frequency){
        var target = get_targeted_monster();
        parent.monster_attack.call(target);
        lastAttack = new Date();
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