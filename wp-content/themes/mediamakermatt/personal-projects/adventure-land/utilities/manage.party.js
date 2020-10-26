var load_characters = JSON.parse(localStorage.getItem("loadCharacters"));
var my_characters = JSON.parse(localStorage.getItem("myCharacters"));
var my_main_character = JSON.parse(localStorage.getItem("myMainCharacter"));
var party_leaders = JSON.parse(localStorage.getItem("partyLeaders"));

if(load_characters && character.name == my_main_character){
    setTimeout(function(){
        for(let i in my_characters){
            let player = my_characters[i];
            if(player){
                if(player !== character.name){
                    parent.start_character_runner(player, 1);
                }
            }
        }
    },1000);
}

setInterval(function(){
    if(!character.rip){
        party_controller();
    } else {
        respawn();
    }
}, 1000 * 10);

function party_controller(){ // usually ran only by a party leader
    if(party_leaders.includes(character.name)){
        // leave party if not ran by a leader
        if(character.party != null && !party_leaders.includes(character.party)){
            parent.socket.emit("party",{event:"leave"});
            game_log("Left the party.");
        }
        var missing_members = get_missing_party_member();
        if(character.party == null || (missing_members.length > 0)){
            var cm_data = {
                task: "join_party",
                leader: character.name,
                server: parent.server_region + "/" + parent.server_identifier
            };
            for(let i in missing_members){
                let player = missing_members[i];
                if(player){
                    if(player !== character.name){
                        send_cm(player,cm_data);
                        send_party_invite(player);
                        game_log("Inviting " + player + " to party...");
                    }
                }
            }
        }
    }
}

function on_cm(name, data){
    // join party if requester is on leader list
	if(data.task == "join_party"){
        let my_server = parent.server_region + "/" + parent.server_identifier
        let leader_server = data.server;
        if(character.party != null){
            if(!Object.keys(parent.party).includes(data.leader)){
                parent.socket.emit("party",{event:"leave"});
                game_log("Left the party.");
            }
        }
        if(my_server != leader_server){
            game_log("Server hopping...");
            parent.window.location.href = "http://adventure.land/character/"+character.name+"/in/"+leader_server;
            location.reload();
        }
    }
}

// accepts a party invite from sender
function on_party_invite(name){ 
	if(party_leaders.indexOf(name) != -1){ 
        accept_party_invite(name); 
        game_log("Accepted " + name + "'s party invite.");
	} 
}

function get_missing_party_member(){
    let missing = [];
    let missing_party_member = null;
    let my_characters_amt = my_characters.length;
    while(my_characters_amt){
        missing_party_member = (~Object.keys(parent.party).indexOf(my_characters[--my_characters_amt])) ? missing_party_member : my_characters[my_characters_amt];
        missing.push(missing_party_member);
    }
    let uniqueChars = [...new Set(missing)];
    return uniqueChars;
}