// DISTANCE TO POINT
function distance_to_point(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
} // end distance_to_point

// ITEM QUANTITY
function item_quantity(name, level=null){
    let item_count = character.items.filter(item => item != null && item.name == name && (level !== null ? item.level == level : true)).reduce(function(a,b){
        return a + (b["q"] || 1);
    }, 0);
    return item_count;
} // end item_quantity

// ITEM LOCATION
function item_location(name, level=null){
    for(let i in character.items){
        let item = character.items[i];
        if(item && item.name == name && (level !== null ? item.level == level : true)){
            return i;
        }
    }
    return null;
} // end item_location

// GET NPC LOCATION BY ID
function get_npc_location_by_id(npc_id){
    for(i in parent.G.maps){
        let map = G.maps[i];
        let ref = map.ref;
        for(j in ref){
            let data = ref[j];
            let id = data.id;
            if(id == npc_id){
                return data;
            }
        }
    } return null;
} // end get_npc_location_by_id