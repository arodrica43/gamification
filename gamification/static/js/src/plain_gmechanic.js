/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {

    var associations = [
                ["Adaptative", "Badge", "Challenge", "DevelopmentTool", "EasterEgg", "Gift", "GiftOpener", "KnowledgeShare", "Level", "Lottery", "Point", "SocialNetwork", "SocialStatus", "Unlockable", "Leaderboard"],
                  ['adaptative_widgets','badge_widgets', 'challenge_widgets', 'development_tool_widgets', 'easter_egg_widgets', 'gift_widgets', 'gift_opener_widgets', 'knowledge_share_widgets', 'level_widgets', 'lottery_widgets', 'point_widgets', 'social_network_widgets', 'social_status_widgets', 'unlockable_widgets', 'leaderboard_widgets'],
                  ['adaptatives','badges', 'challenges', 'development_tools', 'easter_eggs', 'gifts', 'gift_openers', 'knowledge_shares', 'levels', 'lotteries', 'points', 'social_networks', 'social_statuses', 'unlockables', 'leaderboards']
                 ];

    var handlerUrl = runtime.handlerUrl(element, 'get_plain_gmechanic_data');

    function post_success(result){
      var gmech = "";
      for(var i = 0; i < associations[0].length; i++){
        if(result["mech_type"] == associations[0][i]){
          if(result["mech_size"] == "Widget"){
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

    function get_plain_gmechanic_data(){
       $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({ "data": 0 }),
            success: post_success
        });
    }

    $(function($) {
      get_plain_gmechanic_data();
    });
}
