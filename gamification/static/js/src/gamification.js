/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {

    var associations = [
                        ["Adaptative", "Badge", "Challenge", "DevelopmentTool", "EasterEgg", "Gift", "GiftOpener", "KnowledgeShare", "Level", "Lottery", "Point", "SocialNetwork", "SocialStatus", "Unlockable", "Leaderboard"],
                        ['adaptative_widgets','badge_widgets', 'challenge_widgets', 'development_tool_widgets', 'easter_egg_widgets', 'gift_widgets', 'gift_opener_widgets', 'knowledge_share_widgets', 'level_widgets', 'lottery_widgets', 'point_widgets', 'social_network_widgets', 'social_status_widgets', 'unlockable_widgets', 'leaderboard_widgets'],
                        ['adaptatives','badges', 'challenges', 'development_tools', 'easter_eggs', 'gifts', 'gift_openers', 'knowledge_shares', 'levels', 'lotteries', 'points', 'social_networks', 'social_statuses', 'unlockables', 'leaderboards']
                       ];

    var handlerUrl = runtime.handlerUrl(element, 'set_xblock_content');

    function post_success(result){
      console.log(result["mech_id"]);
      var mech_id = result["mech_id"];
      var mech_type = result["mech_type"] ;
      var mech_size = result["mech_size"];
      var adaptative_mode = result["adaptative_mode"];
      var adaptative_mech_id = result["adaptative_mech_id"];
      if(mech_id == 0){
        if(mech_type == "Adaptative" && mech_size == "Widget"){
          fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + adaptative_mech_id + "/?user=user2&dynamic_index=" + $("#local-id-param", element)[0].value.replace(/[\s\.\&\:\+\@]/g, "")) //&dynamic_index={self.scope_ids.def_id} 
          .then(response => response.json())
          .then(gmJson => ($(gmJson.html).appendTo(element),
                  console.log("GMechanic successfully loaded")))
          .catch(error => console.log("Error: " + error))
          console.log("POST done successfully!")
        }else{ // No Adaptative widget = Plain Mechanic
          var gmech = "";
          for(var i = 0; i < associations[0].length; i++){
            if(mech_type == associations[0][i]){
              if(mech_size == "Widget"){
                gmech = associations[1][i];
              }else{
                gmech = associations[2][i];
              }
            }
          }
          fetch("https://agmodule.herokuapp.com/api/" + gmech + "/")
          .then(response => response.json())
          .then(gmJson => (gmJson.results))
          .then(mech_list => (ids_list = [],
                    mech_list.forEach((item,index) => ids_list.push(item.id)),
                    ids_list))
          .then(ids_list => ( fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + ids_list[Math.floor(Math.random() * ids_list.length)] + "/?user=user2&dynamic_index=" +  $("#local-id-param", element)[0].value.replace(/[\s\.\&\:\+\@]/g, "")) //&dynamic_index={self.scope_ids.def_id} 
                    .then(response => response.json())
                    .then(gmJson => ($('#main-embedded-content', element)[0].innerHTML = gmJson.html, 
                            $(gmJson.html).appendTo(element),
                            console.log("GMechanic successfully loaded")))
                    .catch(error => console.log("Error: " + error))))
          .catch(error => console.log("Error: " + error))    
        }
      }else{
        fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + mech_id + "/?user=user2&dynamic_index=" + $("#local-id-param", element)[0].value.replace(/[\s\.\&\:\+\@]/g, "")) //&dynamic_index={self.scope_ids.def_id} 
        .then(response => response.json())
        .then(gmJson => ($('#main-embedded-content', element)[0].innerHTML = gmJson.html, 
                        $(gmJson.html).appendTo(element),
                        console.log("GMechanic successfully loaded")))
        .catch(error => console.log("Error: " + error));
        console.log("POST done successfully!");
    }
  }

  function set_xblock_content(k){
     $.ajax({
          type: "POST",
          url: handlerUrl,
          data: JSON.stringify({ "adaptative_mech_id": k }),
          success: post_success
      });
  }

  $(function($) {
    fetch("https://agmodule.herokuapp.com/api/g_mechancis/retrieve_adaptative_widget_id?user=user2")
    .then(response => response.json())
    .then(gmJson => (gmJson.gmechanic_id))
    .then(mech_id => (set_xblock_content(mech_id)))
    .catch(error => console.log("Error: " + error))
  });
}
