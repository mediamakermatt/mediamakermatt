function server_live_monster_information(){
    let skins = [];
    let details = [];
    let compiled = [];
    let sregion = server_region;
    let sname = server_identifier;
    let combined = sregion + "/" + sname;
    for(let i in Object.keys(parent.S)){
        let skin = Object.keys(parent.S)[i];
        if(skin){
            skins.push(skin);
        }
    }
    for(let i in parent.S){
        let exists = parent.S[i];
        if(exists){
            details.push(exists);
        }
    }
    for(let i in skins){
        let skin = skins[i];
        if(skin){
            let data = details[i];
            let object = {
                skin: skin,
                data: data,
                server: combined
            };
            if(object.data.live == true){
                compiled.push(object);
            }
        }
    }
    return compiled;
}

// add to console of each opened server
setInterval(function(){
    var name = server_region + "/" + server_identifier;
    localStorage.setItem(name, JSON.stringify(server_live_monster_information()));
}, 1000);

pause();