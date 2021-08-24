/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {

    var uname;
    var associations = [
                        ["Adaptative", "Badge", "Challenge", "DevelopmentTool", "EasterEgg", "Gift", "GiftOpener", "KnowledgeShare", "Level", "Lottery", "Point", "SocialNetwork", "SocialStatus", "Unlockable", "Leaderboard"],
                        ['adaptative_widgets','badge_widgets', 'challenge_widgets', 'development_tool_widgets', 'easter_egg_widgets', 'gift_widgets', 'gift_opener_widgets', 'knowledge_share_widgets', 'level_widgets', 'lottery_widgets', 'point_widgets', 'social_network_widgets', 'social_status_widgets', 'unlockable_widgets', 'leaderboard_widgets'],
                        ['adaptatives','badges', 'challenges', 'development_tools', 'easter_eggs', 'gifts', 'gift_openers', 'knowledge_shares', 'levels', 'lotteries', 'points', 'social_networks', 'social_statuses', 'unlockables', 'leaderboards']
                       ];

    function post_success(result){
      //console.log(element.dataset.usage);
      //console.log(result["mech_id"]);
      // console.log(element);
      // console.log(element.dataset);
      // console.log(element[0].dataset);
      // console.log(element["0"].dataset);
      
      //console.log(element.dataset.usage);
      uname = result["username"];
      var mech_id = result["mech_id"];
      var mech_type = result["mech_type"] ;
      var mech_size = result["mech_size"];
      var adaptative_mode = result["adaptative_mode"];
      var adaptative_mech_id = result["adaptative_mech_id"];
      var difficulty = result["difficulty"];
      var dashboard_url = result["dashboard_url"];
      var usage_id;
      try{ // OpenedX variable (Production)
        try{
          usage_id = element.dataset.usageId.replace(/[\s\.\&\:\+\@]/g, "");
        }catch{
           usage_id = element["0"].dataset.usageId.replace(/[\s\.\&\:\+\@]/g, "");
        }
      } catch { // XBLock SDK variable (Development)
        usage_id = element.dataset.usage.replace(/[\s\.\&\:\+\@]/g, "");
      } 

      setup_data_updater(adaptative_mech_id, uname);

      if(mech_id == 0){
        if(mech_type == "Adaptative" && mech_size == "Widget"){
          fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + adaptative_mech_id + "/?user=" + uname + "&dynamic_index=" + usage_id + "&dynamic_link_url=" + dashboard_url) //&dynamic_index={self.scope_ids.def_id} 
          .then(response => response.json())
          .then(gmJson => (element.innerHTML += gmJson.html, $(gmJson.html).appendTo(element)))
          .catch(error => console.log("Error: " + error))
        }else{ // No Adaptative widget = Plain Mechanic
          var gmech = "";
          for(var i = 0; i < associations[0].length; i++){
            if(mech_type == associations[0][i]){
              if(mech_size == "Widget"){ gmech = associations[1][i]; }
              else{ gmech = associations[2][i]; }
            }
          }
          fetch("https://agmodule.herokuapp.com/api/" + gmech + "/")
          .then(response => response.json())
          .then(gmJson => (gmJson.results))
          .then(mech_list => (ids_list = [],
                    mech_list.forEach((item,index) => ids_list.push(item.id)),
                    ids_list))
          .then(ids_list => ( fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + ids_list[Math.floor(Math.random() * ids_list.length)] + "/?user=" + uname + "&dynamic_index=" + usage_id + "&dynamic_link_url=" + dashboard_url) //&dynamic_index={self.scope_ids.def_id} 
                    .then(response => response.json())
                    .then(gmJson => (element.innerHTML += gmJson.html, $(gmJson.html).appendTo(element))) // first you can do $('#main-embedded-content', element)[0].innerHTML = gmJson.html, 
                    .catch(error => console.log("Error: " + error))))
          .catch(error => console.log("Error: " + error))    
        }
      }else{
        fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + mech_id + "/?user=" + uname + "&dynamic_index=" + usage_id) //&dynamic_index={self.scope_ids.def_id} 
        .then(response => response.json())
        .then(gmJson => (element.innerHTML += gmJson.html, $(gmJson.html).appendTo(element)))
        .catch(error => console.log("Error: " + error));
    }
    console.log("Success: GMechanic successfully loaded!");
  }

  var handlerUrl = runtime.handlerUrl(element, 'set_xblock_content');
  var handlerUrl2 = runtime.handlerUrl(element, 'init_xblock_content');


  function set_xblock_content(k){
   $.ajax({
        type: "POST",
        url: handlerUrl,
        data: JSON.stringify({ "adaptative_mech_id": k }),
        success: post_success
    });
  }

  function load_xblock_content(result){
    //read difficulty
    var diff = result["difficulty"];
    uname = result["username"];
    need_log = result["need_log"];
    var usage_id;
    try{ // OpenedX variable (Production)
      try{
        usage_id = element.dataset.usageId.replace(/[\s\.\&\:\+\@]/g, "");
      }catch{
         usage_id = element["0"].dataset.usageId.replace(/[\s\.\&\:\+\@]/g, "");
      }
    } catch { // XBLock SDK variable (Development)
      usage_id = element.dataset.usage.replace(/[\s\.\&\:\+\@]/g, "");
    } 
    fetch("https://agmodule.herokuapp.com/api/g_mechanics/retrieve_adaptative_widget_id?user=" + uname + "&difficulty=" + diff + "&widget_id=" + usage_id + "&need_log=" + need_log) // &difficulty=hard
    .then(response => response.json())
    .then(gmJson => (gmJson.gmechanic_id))
    .then(mech_id => (set_xblock_content(mech_id)))
    .catch(error => console.log("Error: " + error))
  }

  function init_xblock_content(){
    $.ajax({
        type: "POST",
        url: handlerUrl2,
        data: JSON.stringify({ "fake_data": 0 }),
        success: load_xblock_content
    });
  }

  $(function($) {
    init_xblock_content();
  });

  function setup_data_updater(mechanic_id, username){
    get_interaction_index(mechanic_id, username)
    .then((iidx) => (post_mechanic_data(mechanic_id, username, iidx, true), iidx))
    .then((iidx) => setInterval(function(){
      get_interaction_index(mechanic_id, username)
      .then((iidx) => (post_mechanic_data(mechanic_id, username, iidx, true), post_profile_data(username))).catch(error => console.log("Error: " + error))}, 15000))
    .then(function(dump){
      window.onbeforeunload = function (e) {
        get_interaction_index(mechanic_id, username)
        .then((iidx) => (post_mechanic_data(mechanic_id, username, iidx, false), post_profile_data(username))).catch(error => console.log("Error: " + error))
      };
    })
    .catch(error => console.log("Error: " + error))  
  }

  function post_mechanic_data(mechanic_id, username, interaction_index, interacting) {
    fetch("https://eqsriwyz93.execute-api.eu-west-1.amazonaws.com/dev/player", {
                method: "POST",
                body: JSON.stringify({
                    "id": username,
                    "interactions": [
                        {
                            "mechanic_id": mechanic_id,
                            "index": interaction_index,
                            "interacting": interacting
                        }
                    ]
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
          .then(response => response.json())
          .then(resJson => console.log(resJson))
          .catch(error => console.log("Error: " + error))
  }

  function post_profile_data(username) {
    get_player_profile(username)
    .then(gprofile => (
        fetch("https://eqsriwyz93.execute-api.eu-west-1.amazonaws.com/dev/player", {
              method: "POST",
              body: JSON.stringify({
                  "id": username,
                  "gamer_profile": {
                      "disruptor": gprofile.disruptor,
                      "free_spirit": gprofile.free_spirit,
                      "achiever": gprofile.achiever,
                      "player": gprofile.player,
                      "socializer": gprofile.socializer,
                      "philantropist": gprofile.philantropist,
                      "no_player": gprofile.no_player
                  }
              }),
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
          })
        .then(response => response.json())
        .then(resJson => console.log(resJson))        
      ))
    .catch(error => console.log("Error: " + error))
    
  }

  function get_interaction_index(mechanic_id, username) {
    console.log("get_interaction_index executed");
    console.log("Mechanic ID :: " + mechanic_id)
    return fetch("https://agmodule.herokuapp.com/api/statistics/get_interaction_index/" + username + "/" + mechanic_id)  // return this promise
          .then(response => response.json())
          .then(statJson => statJson.interaction_index)
  }

  function get_player_profile(username) {
    console.log("get_player_profile executed");
    return fetch("https://agmodule.herokuapp.com/api/gamers/" + username + "/" )  // return this promise
          .then(response => response.json())
          .then(statJson => statJson.gamer_profile)
  }


}
