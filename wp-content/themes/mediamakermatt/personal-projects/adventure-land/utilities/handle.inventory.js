var sell_whitelist = JSON.parse(localStorage.getItem("sellWhitelist"));
var upgrade_whitelist = JSON.parse(localStorage.getItem("upgradeWhitelist"));

setInterval(function(){
    handle_items();
}, 1000);

function handle_items(){
    for(let i in character.items){
        let item = character.items[i];
        if(item && !item.p){
            sell_items(i, item);
        }
		if(item && (item.name == 'fireblade' || item.name == 'firestaff')){
			dismantle(i);
		}
    }
    upgrade_items();
}

function sell_items(slot, data){
    let item_name = data.name;
    if(Object.keys(sell_whitelist).includes(data.name)){
        if(data.level <= sell_whitelist[data.name]){
            sell(slot);
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

function upgrade_items(){
    for (let i = 0; i < character.items.length; i++){
        let c = character.items[i];
        if (c) {
            var level = upgrade_whitelist[c.name];
            if(level && c.level < level){
                let grades = get_grade(c);
                let scrollname;
                if (c.level < grades[0])
                    scrollname = 'scroll0';
                else if (c.level < grades[1])
                    scrollname = 'scroll1';
                else
                    scrollname = 'scroll2';
                let [scroll_slot, scroll] = find_item(i => i.name == scrollname);
                if (!scroll) {
                    parent.buy(scrollname);
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