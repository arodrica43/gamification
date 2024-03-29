/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {

    element.innerHTML += "<div id='waiting-back' style='text-align:center;'><img src='https://i.pinimg.com/originals/23/35/32/23353292cc60b2bcb3f015ee362eeb74.gif' width=250/></div>";
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
      protocol = window.location.protocol;
      hostname = window.location.hostname;
      course_id = result["course_id"];
      tab_id = result["tab_id"];
      var dashboard_url = protocol + "//" + hostname + "/courses/" + course_id + "/" + tab_id;
      var mean_score = result["mean_score"];
      var last_score = result["last_score"];
      //console.log(result["mean_score"]);
      var activity_progress = result["activity_progress"];
      //console.log("pipe :: " + result["pipe"]);
      //console.log(activity_progress);
      var unit_id = result["unit_id"];
      //console.log(unit_id);
      var last_activity_type = result["last_activity_type"];
      console.log("Last activity type");
      console.log(last_activity_type);

      user_id = result["user_id"];
      console.log("UID " + result["user_id"]);

      stage = result['stage'];
      endpoint = result['endpoint'];
      nmURL = endpoint + "/" + stage;

      var usage_id;
      var block_id;
      try{ // OpenedX variable (Production)
        try{
          block_id =element.dataset.usageId;
          usage_id = element.dataset.usageId.replace(/[\s\.\&\:\+\@]/g, "");
        }catch{
          block_id = element["0"].dataset.usageId;
          usage_id = element["0"].dataset.usageId.replace(/[\s\.\&\:\+\@]/g, "");
        }
      } catch { // XBLock SDK variable (Development)
        block_id = element.dataset.usage;
        usage_id = element.dataset.usage.replace(/[\s\.\&\:\+\@]/g, "");
      }


      // DEBUG :: ----------------------------
      console.log("Progress % : " + result['activity_progress']);
      progress = result['progress'];
      console.log("XBlock position: " + result['progress']);
      console.log("Last score: " + result['last_score']);
      console.log("Mean_score: " + result['mean_score']);
      console.log(result["pipe"]);

    
      //--------------------------------------
      if(mech_id == 0){
        if(mech_type == "Adaptative" && mech_size == "Widget"){
          console.log("https://agmodule.herokuapp.com/api/g_mechanics/" + adaptative_mech_id + "/?user=" + uname + "&dynamic_index=" + usage_id + "&course_id=" + course_id + "&dynamic_progress=" + progress + "&activity_progress=" + activity_progress + "&mean_score=" + mean_score + "&last_score=" + last_score + "&last_activity_type=" + last_activity_type + "&unit_id=" + unit_id  + "&dynamic_link_url=" + dashboard_url);
          fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + adaptative_mech_id + "/?user=" + uname + "&dynamic_index=" + usage_id + "&course_id=" + course_id + "&dynamic_progress=" + progress + "&activity_progress=" + activity_progress + "&mean_score=" + mean_score + "&last_score=" + last_score + "&last_activity_type=" + last_activity_type + "&unit_id=" + unit_id  + "&dynamic_link_url=" + dashboard_url) //&dynamic_index={self.scope_ids.def_id} 
          .then(response => response.json())
          .then(gmJson => (document.getElementById("waiting-back").innerHTML = "", element.innerHTML += gmJson.html, $(gmJson.html).appendTo(element)))
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
          .then(ids_list => ( fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + ids_list[Math.floor(Math.random() * ids_list.length)] + "/?user=" + uname + "&dynamic_index=" + usage_id + "&course_id=" + course_id + "&dynamic_progress=" + progress + "&activity_progress=" + activity_progress + "&mean_score=" + mean_score + "&last_score=" + last_score + "&last_activity_type=" + last_activity_type + "&unit_id=" + unit_id  + "&dynamic_link_url=" + dashboard_url) //&dynamic_index={self.scope_ids.def_id} 
                    .then(response => response.json())
                    .then(gmJson => (document.getElementById("waiting-back").innerHTML = "", element.innerHTML += gmJson.html, $(gmJson.html).appendTo(element))) // first you can do $('#main-embedded-content', element)[0].innerHTML = gmJson.html, 
                    .catch(error => console.log("Error: " + error))))
          .catch(error => console.log("Error: " + error))    
        }
      }else{
        fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + mech_id + "/?user=" + uname + "&dynamic_index=" + usage_id + "&course_id=" + course_id) //&dynamic_index={self.scope_ids.def_id} 
        .then(response => response.json())
        .then(gmJson => (document.getElementById("waiting-back").innerHTML = "", element.innerHTML += gmJson.html, $(gmJson.html).appendTo(element)))
        .catch(error => console.log("Error: " + error));
    }
    setup_data_updater(adaptative_mech_id, uname, user_id, nmURL);
    console.log("Success: GMechanic successfully loaded!");
    
      function setup_data_updater(mechanic_id, username, user_id, nmURL){
      get_interaction_index(mechanic_id, username)
      .then((iidx) => (post_mechanic_data(mechanic_id, username, user_id, iidx[0], iidx[1], true, nmURL), iidx))
      .then((iidx) => setInterval(function(){
        get_interaction_index(mechanic_id, username)
        .then((iidx) => (post_mechanic_data(mechanic_id, username, user_id, iidx[0], iidx[1], true, nmURL), post_profile_data(username, user_id, nmURL)))
        .catch(error => console.log("Error: " + error))}, 15000))
      .then(function(dump){
        window.onbeforeunload = function (e) {
          get_interaction_index(mechanic_id, username)
          .then((iidx) => (post_mechanic_data(mechanic_id, username, user_id, iidx[0], iidx[1], false, nmURL), post_profile_data(username, user_id, nmURL))).catch(error => console.log("Error: " + error))
        };
      })
      .catch(error => console.log("Error: " + error))  
    }

    function post_mechanic_data(mechanic_id, username, user_id,interaction_index, gmtype, interacting, nmURL) {

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      var raw = JSON.stringify({
            "id": username,
            "interactions": [
                {
                    "mechanic_id": mechanic_id,
                    "index": interaction_index,
                    "interacting": interacting
                }
            ],
            "next_mechanic_id" : mechanic_id
        });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      var raw_an = JSON.stringify({
            "user" : parseInt(user_id),
            "timestamp" : (new Date(Date.now())).toISOString(),
            "service" : "GAM_OUTCOME",
            "resource" : {
              "course" : course_id,
              "unit" : unit_id,
              "xblock" : block_id 
            },
            "result" : gmtype
        });

      var an_requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw_an,
        redirect: 'follow'
      };

      fetch(nmURL + "/player", requestOptions)
        .then(response => response.json())
        .then(resJson => console.log(resJson))
        .catch(error => console.log("Error: " + error))
      fetch(nmURL + "/analytics", an_requestOptions)
        .then(response => response.json())
        .then(resJson => console.log(resJson))
        .catch(error => console.log("Error: " + error))
    }

    function post_profile_data(username, user_id, nmURL) {
      get_player_profile(username)
      .then(function(gprofile){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify({
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
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        var raw_an = JSON.stringify({
            "user" : parseInt(user_id),
            "timestamp" : (new Date(Date.now())).toISOString(),
            "service" : "GAM_UPDATE_PROFILE",
            "resource" : {
              "course" : course_id,
              "unit" : unit_id,
              "xblock" : block_id 
            },
            "result" : [gprofile.disruptor,
                        gprofile.free_spirit,
                        gprofile.achiever,
                        gprofile.player,
                        gprofile.socializer,
                        gprofile.philantropist,
                        gprofile.no_player]
        });

        var an_requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw_an,
          redirect: 'follow'
        };

        fetch(nmURL + "/player", requestOptions)
          .then(response => response.json())
          .then(resJson => console.log(resJson)) 

        fetch(nmURL + "/analytics", an_requestOptions)
          .then(response => response.json())
          .then(resJson => console.log(resJson))

      })
      .catch(error => console.log("Error: " + error))
      
    }
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

    uname = result["username"];
    need_log = result["need_log"];
    current_course_id = result["course_id"];
    console.log(current_course_id);
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
    fetch("https://agmodule.herokuapp.com/api/g_mechanics/retrieve_adaptative_widget_id?user=" + uname + "&widget_id=" + usage_id + "&need_log=" + need_log + "&course_id=" + current_course_id)
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

  

  function get_interaction_index(mechanic_id, username) {
    console.log("get_interaction_index executed");
    console.log("Mechanic ID :: " + mechanic_id)
    return fetch("https://agmodule.herokuapp.com/api/statistics/get_interaction_index/" + username + "/" + mechanic_id)  // return this promise
          .then(response => response.json())
          .then(statJson => [statJson.interaction_index, statJson.gmtype])
  }

  function get_player_profile(username) {
    console.log("get_player_profile executed");
    return fetch("https://agmodule.herokuapp.com/api/gamers/" + username + "/" )  // return this promise
          .then(response => response.json())
          .then(statJson => statJson.gamer_profile)
  }


}
