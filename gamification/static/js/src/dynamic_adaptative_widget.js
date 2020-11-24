/* Javascript for GamificationXBlock. */
function GamificationXBlock(runtime, element) {

    $(function($) {
      fetch("https://agmodule.herokuapp.com/api/g_mechancis/retrieve_adaptative_widget_id?user=user2")
      .then(response => response.json())
      .then(gmJson => (gmJson.gmechanic_id))
      .then(mech_id => (fetch("https://agmodule.herokuapp.com/api/g_mechanics/" + mech_id + "/?user=user2&dynamic_index=" + $("#local-id-param", element)[0].value.replace(/[\s\.\&\:\+\@]/g, "")) //&dynamic_index={self.scope_ids.def_id} 
                        .then(response => response.json())
                        .then(gmJson => ($('#main-embedded-content', element)[0].innerHTML = gmJson.html, 
                                        $(gmJson.html).appendTo(element),
                                        console.log("GMechanic successfully loaded")))
                        .catch(error => console.log("Error: " + error)),
                        console.log("POST done successfully!")))
      .catch(error => console.log("Error: " + error))
    });
}
